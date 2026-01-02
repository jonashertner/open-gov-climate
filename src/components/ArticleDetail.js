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
          <Link to="/" className="detail-back">← Back</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <div className="container">
        <Link to="/" className="detail-back">← Back</Link>

        <h1 className="detail-title">{article.title[lang]}</h1>

        <div className="detail-content">
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content[lang] }}
          />
        </div>
      </div>
    </div>
  );
}
