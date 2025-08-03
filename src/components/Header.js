import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useT } from '../i18n';
import '../styles/global.css';

export default function Header({ lang, setLang }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <header style={{ borderBottom: '1px solid #eee', padding: '16px 0' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Open Gov Climate</div>
        <button 
          aria-label="Toggle menu" 
          onClick={() => setOpen(!open)} 
          style={{ display: 'none', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }} 
          id="hamburger"
        >☰</button>
        <nav style={{ display: open ? 'block' : 'flex', gap: '16px' }}>
          <NavLink to="/" end onClick={()=>setOpen(false)}>{t.headings.foia}</NavLink>
          <NavLink to="/articles" onClick={()=>setOpen(false)}>{t.headings.articles}</NavLink>
          <NavLink to="/#contact" onClick={()=>setOpen(false)}>{t.headings.contact}</NavLink>
        </nav>
        <select value={lang} onChange={e => setLang(e.target.value)} aria-label="Select language" style={{ marginLeft: '16px' }}>
          <option value="en">EN</option>
          <option value="de">DE</option>
          <option value="fr">FR</option>
          <option value="it">IT</option>
        </select>
      </div>
    </header>
);
}
