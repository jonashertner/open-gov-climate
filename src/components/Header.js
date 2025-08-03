import React from 'react';
import '../styles/global.css';

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
  { code: 'fr', label: 'FR' },
  { code: 'it', label: 'IT' },
];

export default function Header({ lang, setLang }) {
  return (
    <header style={{ padding: '16px 0', textAlign: 'center' }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Open Gov Climate</div>
      <div style={{ marginTop: '8px', display: 'inline-flex', gap: '8px' }}>
        {languages.map(({code, label}) => (
          <button
            key={code}
            onClick={() => setLang(code)}
            style={{
              border: '1px solid var(--color-text)',
              background: code === lang ? 'var(--color-text)' : 'transparent',
              color: code === lang ? '#fff' : 'var(--color-text)',
              padding: '4px 8px',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
            aria-label={`Switch to ${label}`}
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  );
}
