import React from 'react';
import '../styles/global.css';

export default function Header({ lang, setLang }) {
  return (
    <header style={{ padding: '16px 0', textAlign: 'center' }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Open Gov Climate</div>
      <select
        value={lang}
        onChange={e => setLang(e.target.value)}
        aria-label="Select language"
        style={{ marginTop: '8px' }}
      >
        <option value="en">EN</option>
        <option value="de">DE</option>
        <option value="fr">FR</option>
        <option value="it">IT</option>
      </select>
    </header>
  );
}
