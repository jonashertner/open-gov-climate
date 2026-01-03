import React from 'react';
import { useT } from '../i18n';
import ARTICLES from '../data/articles.json';
import '../styles/global.css';
import { Link } from 'react-router-dom';

export default function Articles({ lang }) {
  const t = useT();

  return (
    <section id="articles" className="articles-section">
      <div className="container">
        <header className="section-header">
          <p className="section-eyebrow">{t.headings.articles}</p>
          <h2>{t.articles.sectionTitle}</h2>
          <p className="section-description">{t.articles.description}</p>
        </header>

        <div className="articles-grid">
          {ARTICLES.map(article => (
            <article key={article.id} className="article-item">
              <p className="article-meta">{t.articles.category}</p>
              <h3 className="article-title">
                <Link to={`/articles/${article.id}`}>{article.title[lang]}</Link>
              </h3>
              <p className="article-summary">{article.summary[lang]}</p>
              <Link to={`/articles/${article.id}`} className="article-link">
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
