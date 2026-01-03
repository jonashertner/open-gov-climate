import React from 'react';
import { useT } from '../i18n';
import FOIA_DATA from '../data/foia.json';
import '../styles/global.css';
import { Link } from 'react-router-dom';

export default function FOIAList({ lang }) {
  const t = useT();

  return (
    <section id="foia" className="foia-section">
      <div className="container">
        <header className="section-header">
          <p className="section-eyebrow">{t.headings.foia}</p>
          <h2>{t.foia.description}</h2>
        </header>

        <div className="foia-grid">
          {FOIA_DATA.map(entry => (
            <article key={entry.id} className="foia-item">
              <p className="foia-meta">{t.foia.responded}</p>
              <h3 className="foia-title">
                <Link to={`/foia/${entry.id}`}>{entry.title[lang]}</Link>
              </h3>
              <p className="foia-summary">{entry.summary[lang]}</p>
              <Link to={`/foia/${entry.id}`} className="foia-link">
                {t.headings.readMore}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
