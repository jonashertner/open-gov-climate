import React from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n';
import '../styles/global.css';

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
  { code: 'fr', label: 'FR' },
  { code: 'it', label: 'IT' }
];

export default function Header({ lang, setLang }) {
  const t = useT();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          {t.siteTitle}
        </Link>

        <nav className="nav">
          <a href="#disclosures" className="nav-link">Disclosures</a>
          <a href="#foia" className="nav-link">{t.headings.foia}</a>
          <a href="#map" className="nav-link">{t.headings.map}</a>
          <a href="#contact" className="nav-link">{t.headings.contact}</a>

          <div className="lang-switcher">
            {languages.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`lang-btn ${code === lang ? 'active' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
