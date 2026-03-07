interface Props {
  src: string;
  label: string;
  downloadLabel: string;
}

export default function PDFViewer({ src, label, downloadLabel }: Props) {
  return (
    <div class="pdf-viewer">
      <div class="pdf-viewer__header">
        <span class="label">{label}</span>
        <a href={src} download class="pdf-viewer__download">
          {downloadLabel}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </a>
      </div>
      <iframe
        src={src}
        title={label}
        class="pdf-viewer__frame"
        style="width: 100%; height: 600px; border: 1px solid var(--border); background: var(--surface);"
      />
    </div>
  );
}
