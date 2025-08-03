import React, { useState, useEffect } from 'react';
import lunr from 'lunr';
import FOIA_DATA from '../data/foia.json';
import '../styles/global.css';

export default function FOIAList() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(FOIA_DATA);
  let idx;
  useEffect(() => {
    idx = lunr(function() {
      this.ref('id');
      this.field('title');
      this.field('summary');
      FOIA_DATA.forEach(doc => this.add({
        id: doc.id,
        title: doc.title.en,
        summary: doc.summary.en
      }));
    });
  }, []);
  useEffect(() => {
    if (!query) return setResults(FOIA_DATA);
    try {
      const m = idx.search(query).map(r=>FOIA_DATA.find(d=>d.id===r.ref));
      setResults(m);
    } catch {
      setResults(FOIA_DATA);
    }
  }, [query]);
  return (
    <section className="container">
      <h2>FOIA Requests</h2>
      <input type="search" placeholder="Search…" value={query} onChange={e=>setQuery(e.target.value)} />
      {results.map(entry=> {
        const req = entry.request_text? entry.request_text.slice(0,150):''; 
        const res = entry.response_text? entry.response_text.slice(0,150):'';
        return (
          <article key={entry.id} style={{marginBottom:'24px'}}>
            <h3>{entry.title.en}</h3>
            <p><strong>Request:</strong> {req}{entry.request_text.length>150?'…':''}</p>
            {entry.request_pdf && <a href={`/data/${entry.request_pdf}`} target="_blank" rel="noopener">Download PDF</a>}
            <p><strong>Response:</strong> {res}{entry.response_text.length>150?'…':''}</p>
            {entry.response_pdf && <a href={`/data/${entry.response_pdf}`} target="_blank" rel="noopener">Download PDF</a>}
          </article>
        );
      })}
    </section>
  );
}
