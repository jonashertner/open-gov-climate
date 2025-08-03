import React from 'react';
import { NavLink } from 'react-router-dom';
import { useT } from '../i18n';
import '../styles/global.css';

export default function Header({ lang, setLang }) {
  const t = useT();
  return (
    <header style={{ borderBottom: '1px solid #eee', padding: '16px 0', background: '#fff' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Open Gov Climate</div>
        <nav>
          <NavLink to="/" end style={{ marginRight: '16px' }}>{t.nav.foia}</NavLink>
          <NavLink to="/articles" style={{ marginRight: '16px' }}>{t.nav.articles}</NavLink>
          <NavLink to="/#contact">{t.nav.contact}</NavLink>
        </nav>
        <select value={lang} onChange={e => setLang(e.target.value)} aria-label="Select language">
          <option value="en">EN</option>
          <option value="de">DE</option>
          <option value="fr">FR</option>
          <option value="it">IT</option>
        </select>
      </div>
    </header>
  );
}
