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
  const [scrolled, setScrolled] = useState(false);
  const isHome = location.pathname === '/' || location.pathname === '';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showSolid = scrolled || !isHome;
  const textColor = showSolid ? 'var(--mountain-900)' : 'var(--snow-white)';

  return (
    <header
      className={`header ${scrolled ? 'scrolled' : ''}`}
      style={{
        background: showSolid
          ? 'rgba(255, 255, 255, 0.95)'
          : 'transparent',
        backdropFilter: showSolid ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: showSolid ? 'blur(20px)' : 'none',
        boxShadow: showSolid ? 'var(--shadow-md)' : 'none'
      }}
    >
      <div className="header-inner">
        {/* Logo */}
        <Link to="/" className="logo" style={{ color: textColor }}>
          <div
            className="logo-icon"
            style={{
              background: showSolid
                ? 'var(--gradient-alpine)'
                : 'rgba(255, 255, 255, 0.2)',
              backdropFilter: !showSolid ? 'blur(10px)' : 'none'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span style={{ letterSpacing: '-0.02em' }}>
            {t.siteTitle}
          </span>
        </Link>

        {/* Navigation */}
        <nav className="nav-links">
          <a href="#foia" className="nav-link" style={{ color: textColor }}>
            {t.headings.foia}
          </a>
          <a href="#map" className="nav-link" style={{ color: textColor }}>
            {t.headings.map}
          </a>
          <a href="#articles" className="nav-link" style={{ color: textColor }}>
            {t.headings.articles}
          </a>
          <a href="#contact" className="nav-link" style={{ color: textColor }}>
            {t.headings.contact}
          </a>
        </nav>

        {/* Language Switcher */}
        <div
          className="lang-switcher"
          style={{
            background: showSolid
              ? 'var(--mountain-100)'
              : 'rgba(255, 255, 255, 0.15)',
            backdropFilter: !showSolid ? 'blur(10px)' : 'none'
          }}
        >
          {languages.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              className={`lang-btn ${code === lang ? 'active' : ''}`}
              style={{
                background: code === lang
                  ? (showSolid ? 'var(--snow-white)' : 'rgba(255, 255, 255, 0.9)')
                  : 'transparent',
                color: code === lang
                  ? 'var(--glacier-700)'
                  : (showSolid ? 'var(--mountain-500)' : 'rgba(255, 255, 255, 0.8)')
              }}
              aria-label={`Switch to ${label}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
