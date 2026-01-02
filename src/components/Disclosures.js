import React from 'react';
import { useT } from '../i18n';
import FOIA_DATA from '../data/foia.json';
import ARTICLES from '../data/articles.json';
import '../styles/global.css';
import { Link } from 'react-router-dom';

export default function Disclosures({ lang }) {
  const t = useT();

  return (
    <section className="section disclosures-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            {t.headings.disclosures}
          </div>
          <h2 className="section-title">{t.disclosures?.title || 'Quick Access'}</h2>
          <p className="section-description">
            {t.disclosures?.description || 'Browse all available documents and articles'}
          </p>
        </div>

        {/* Disclosures Grid */}
        <div className="disclosures-grid">
          {FOIA_DATA.map(entry => (
            <Link
              key={`foia-${entry.id}`}
              to={`/foia/${entry.id}`}
              className="disclosure-item"
            >
              <div className="disclosure-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <div className="disclosure-content">
                <h4>{entry.title[lang]}</h4>
                <span>FOIA Request</span>
              </div>
            </Link>
          ))}

          {ARTICLES.map(article => (
            <Link
              key={`article-${article.id}`}
              to={`/articles/${article.id}`}
              className="disclosure-item"
            >
              <div className="disclosure-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <div className="disclosure-content">
                <h4>{article.title[lang]}</h4>
                <span>{t.headings.articles}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
