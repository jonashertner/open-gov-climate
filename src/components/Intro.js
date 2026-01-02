import React from 'react';
import { useT } from '../i18n';
import '../styles/global.css';

export default function Hero() {
  const t = useT();

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <p className="hero-label">Swiss Transparency Initiative</p>
          <h1>{t.intro.title}</h1>
          <p className="hero-text">{t.intro.text}</p>
          <a href="#disclosures" className="hero-scroll">
            View disclosures
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
