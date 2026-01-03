import React from 'react';
import { useT } from '../i18n';
import '../styles/global.css';

export default function Hero() {
  const t = useT();

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <p className="hero-eyebrow">{t.hero.badge}</p>
          <h1>
            {t.hero.titleStart}
            <br />
            {t.hero.titleAccent}
          </h1>
          <p className="hero-text">{t.intro.text}</p>
          <a href="#foia" className="hero-cta">
            {t.hero.cta}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
