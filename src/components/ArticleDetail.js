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
        <div className="container">
          <p style={{ color: 'var(--gray-500)' }}>{t.errors.notFound}</p>
          <Link to="/" className="detail-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            {t.buttons.backToHome}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <div className="container">
        <Link to="/" className="detail-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          {t.buttons.backToHome}
        </Link>

        <article>
          <h1 className="detail-title">{article.title[lang]}</h1>

          <div className="detail-content">
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: article.content[lang] }}
            />
          </div>
        </article>
      </div>
    </div>
  );
}
