import React from 'react';
import { useT } from '../i18n';
import ARTICLES from '../data/articles.json';
import '../styles/global.css';
import { Link } from 'react-router-dom';

export default function Articles({ lang }) {
  const t = useT();

  return (
    <section id="articles" className="section articles-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            {t.headings.articles}
          </div>
          <h2 className="section-title">{t.articles?.sectionTitle || 'Latest Insights'}</h2>
          <p className="section-description">
            {t.articles?.description || 'In-depth analysis and coverage of Alpine climate initiatives'}
          </p>
        </div>

        {/* Articles Grid */}
        <div className="articles-grid">
          {ARTICLES.map((article) => (
            <article key={article.id} className="article-card">
              {/* Article Image/Icon */}
              <div className="article-card-image">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ position: 'relative', zIndex: 1 }}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>
              </div>

              {/* Article Content */}
              <div className="article-card-content">
                <span className="article-card-category">
                  {t.articles?.category || 'Climate Research'}
                </span>
                <h3 className="article-card-title">
                  <Link to={`/articles/${article.id}`}>{article.title[lang]}</Link>
                </h3>
                <p className="article-card-summary">{article.summary[lang]}</p>
                <Link to={`/articles/${article.id}`} className="article-card-link">
                  {t.headings.readMore}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
