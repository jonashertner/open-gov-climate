import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useT } from '../i18n';
import ARTICLES from '../data/articles.json';
import '../styles/global.css';

export default function ArticleDetail({ lang }) {
  const { id } = useParams();
  const t = useT();
  const article = ARTICLES.find(a => a.id === id);

  if (!article) {
    return (
      <div className="detail-page">
        <div className="detail-content">
          <div className="detail-card">
            <p style={{ textAlign: 'center', color: 'var(--mountain-500)' }}>{t.errors.notFound}</p>
            <div className="detail-back">
              <Link to="/" className="btn btn-primary">{t.buttons.backToHome}</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      {/* Header */}
      <div className="detail-header">
        <div className="detail-header-inner">
          <nav className="detail-breadcrumb">
            <Link to="/">{t.buttons.backToHome?.replace('← ', '') || 'Home'}</Link>
            <span>/</span>
            <Link to="/#articles">{t.headings.articles}</Link>
            <span>/</span>
            <span>{article.title[lang]}</span>
          </nav>
          <h1 className="detail-title">{article.title[lang]}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="detail-content">
        <div className="detail-card">
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content[lang] }}
          />
        </div>

        {/* Back Button */}
        <div className="detail-back">
          <Link to="/" className="btn btn-ghost">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            {t.buttons.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
