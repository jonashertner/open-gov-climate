import { useState, useEffect, useRef, useCallback } from 'preact/hooks';

interface Props {
  placeholder: string;
  noResults: string;
  resultsLabel: string;
}

interface SearchResult {
  url: string;
  meta: { title?: string };
  excerpt: string;
}

export default function Search({ placeholder, noResults, resultsLabel }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const pagefindRef = useRef<any>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !open && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
        setQuery('');
        setResults([]);
        setActiveIndex(-1);
      }
    };
    const handleOpen = () => setOpen(true);

    document.addEventListener('keydown', handleKey);
    document.addEventListener('open-search', handleOpen);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('open-search', handleOpen);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      if (!pagefindRef.current) {
        const path = '/pagefind/pagefind.js';
        // @ts-ignore – dynamic path prevents Vite from bundling
        import(/* @vite-ignore */ path).then(pf => {
          pagefindRef.current = pf;
        }).catch(() => {});
      }
    }
  }, [open]);

  const handleInput = useCallback(async (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    setQuery(value);
    setActiveIndex(-1);
    if (pagefindRef.current && value.length > 1) {
      const search = await pagefindRef.current.search(value);
      const data = await Promise.all(
        search.results.slice(0, 10).map((r: any) => r.data())
      );
      setResults(data);
    } else {
      setResults([]);
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => {
        const next = prev < results.length - 1 ? prev + 1 : 0;
        scrollToResult(next);
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => {
        const next = prev > 0 ? prev - 1 : results.length - 1;
        scrollToResult(next);
        return next;
      });
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      const result = results[activeIndex];
      if (result) {
        window.location.href = result.url;
      }
    }
  }, [results, activeIndex]);

  function scrollToResult(index: number) {
    const container = resultsRef.current;
    if (!container) return;
    const items = container.querySelectorAll('.search-result');
    items[index]?.scrollIntoView({ block: 'nearest' });
  }

  if (!open) return null;

  return (
    <div class="search-overlay" onClick={() => { setOpen(false); setQuery(''); setResults([]); setActiveIndex(-1); }}>
      <div class="search-modal" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          class="search-input"
          aria-label="Search"
        />
        {query.length > 1 && results.length === 0 && (
          <p class="search-empty">{noResults}</p>
        )}
        {results.length > 0 && (
          <div class="search-results" ref={resultsRef}>
            <p class="search-count mono">{results.length} {resultsLabel}</p>
            {results.map((r, i) => (
              <a
                href={r.url}
                class={`search-result${i === activeIndex ? ' search-result--active' : ''}`}
                key={r.url}
              >
                <span class="search-result__title">{r.meta?.title || 'Untitled'}</span>
                <span class="search-result__excerpt">{stripHtml(r.excerpt)}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}
