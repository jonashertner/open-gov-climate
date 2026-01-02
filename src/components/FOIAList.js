import React from 'react';
import { useT } from '../i18n';
import FOIA_DATA from '../data/foia.json';
import '../styles/global.css';
import { Link } from 'react-router-dom';

export default function FOIAList({ lang }) {
  const t = useT();

  return (
    <section id="foia" className="section foia-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            {t.headings.foia}
          </div>
          <h2 className="section-title">{t.headings.disclosures}</h2>
          <p className="section-description">
            {t.foia?.description || 'Official requests and responses under Switzerland\'s Freedom of Information law (BGO/FOIA)'}
          </p>
        </div>

        {/* FOIA Cards Grid */}
        <div className="foia-grid">
          {FOIA_DATA.map((entry, index) => (
            <article key={entry.id} className="foia-card">
              <div className="foia-card-header">
                <div className="foia-card-status">
                  {t.foia?.responded || 'Response Received'}
                </div>
                <h3 className="foia-card-title">
                  <Link to={`/foia/${entry.id}`}>{entry.title[lang]}</Link>
                </h3>
              </div>

              <div className="foia-card-body">
                <p className="foia-card-summary">{entry.summary[lang]}</p>
              </div>

              <div className="foia-card-footer">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--mountain-400)', fontSize: 'var(--text-xs)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Swiss Alps
                </div>
                <Link to={`/foia/${entry.id}`} className="foia-card-link">
                  {t.headings.readMore}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
