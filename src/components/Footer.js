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
            © {new Date().getFullYear()} {t.siteTitle}. {t.footer.rights}
          </p>
          <nav className="footer-links" aria-label="Footer navigation">
            <Link to="/" className="footer-link">{t.footer.home}</Link>
            <a href="#foia" className="footer-link">{t.headings.foia}</a>
            <a href="#articles" className="footer-link">{t.headings.articles}</a>
            <a href="#contact" className="footer-link">{t.headings.contact}</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
