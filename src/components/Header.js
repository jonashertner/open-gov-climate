import React, { useState } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo" onClick={closeMenu}>
          {t.siteTitle}
        </Link>

        <button
          className="menu-btn"
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>

        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <a href="#foia" className="nav-link" onClick={closeMenu}>{t.headings.foia}</a>
          <a href="#map" className="nav-link" onClick={closeMenu}>{t.headings.map}</a>
          <a href="#articles" className="nav-link" onClick={closeMenu}>{t.headings.articles}</a>
          <a href="#contact" className="nav-link" onClick={closeMenu}>{t.headings.contact}</a>

          <div className="lang-switcher">
            {languages.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => {
                  setLang(code);
                  closeMenu();
                }}
                className={`lang-btn ${code === lang ? 'active' : ''}`}
                aria-label={`Switch to ${label}`}
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
