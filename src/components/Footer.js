import React from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n';
import '../styles/global.css';

export default function Footer() {
  const t = useT();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          {/* Logo */}
          <div className="footer-logo">
            <div className="footer-logo-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span>{t.siteTitle}</span>
          </div>

          {/* Copyright */}
          <p className="footer-text">
            {currentYear} {t.siteTitle}. {t.footer?.rights || 'All rights reserved.'}
          </p>

          {/* Footer Links */}
          <div className="footer-links">
            <Link to="/" className="footer-link">
              {t.footer?.home || 'Home'}
            </Link>
            <a href="#foia" className="footer-link">
              {t.headings.foia}
            </a>
            <a href="#contact" className="footer-link">
              {t.headings.contact}
            </a>
          </div>

          {/* Attribution */}
          <p className="footer-text" style={{ fontSize: 'var(--text-xs)', opacity: 0.7, marginTop: 'var(--space-4)' }}>
            {t.footer?.madeWith || 'Made with transparency in mind'} | Switzerland
          </p>
        </div>
      </div>
    </footer>
  );
}
