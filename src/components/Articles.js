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
        <div className="section-header">
          <p className="section-label">{t.headings.articles}</p>
          <h2>Research & Analysis</h2>
        </div>

        <div className="articles-list">
          {ARTICLES.map(article => (
            <article key={article.id} className="article-item">
              <p className="article-category">Climate Research</p>
              <h3 className="article-title">
                <Link to={`/articles/${article.id}`}>{article.title[lang]}</Link>
              </h3>
              <p className="article-summary">{article.summary[lang]}</p>
              <Link to={`/articles/${article.id}`} className="article-link">
                {t.headings.readMore} →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
