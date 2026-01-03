import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`header ${menuOpen ? 'menu-open' : ''}`}>
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="4" y1="8" x2="20" y2="8"></line>
              <line x1="4" y1="16" x2="20" y2="16"></line>
            </svg>
          )}
        </button>

        <nav className={`nav ${menuOpen ? 'open' : ''}`} role="navigation">
          <a href="#foia" className="nav-link" onClick={closeMenu}>{t.headings.foia}</a>
          <a href="#map" className="nav-link" onClick={closeMenu}>{t.headings.map}</a>
          <a href="#articles" className="nav-link" onClick={closeMenu}>{t.headings.articles}</a>
          <a href="#contact" className="nav-link" onClick={closeMenu}>{t.headings.contact}</a>

          <div className="lang-switcher" role="group" aria-label="Language selection">
            {languages.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => {
                  setLang(code);
                  closeMenu();
                }}
                className={`lang-btn ${code === lang ? 'active' : ''}`}
                aria-pressed={code === lang}
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
