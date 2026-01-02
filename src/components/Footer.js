import React from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n';
import '../styles/global.css';

export default function Footer() {
  const t = useT();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <p className="footer-text">
            {new Date().getFullYear()} {t.siteTitle}
          </p>
          <div className="footer-links">
            <Link to="/" className="footer-link">Home</Link>
            <a href="#foia" className="footer-link">{t.headings.foia}</a>
            <a href="#contact" className="footer-link">{t.headings.contact}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
