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
      <section className="container">
        <p>{t.errors.notFound || 'Article not found.'}</p>
        <Link to="/articles">{t.buttons.backToList || 'Back to Articles'}</Link>
      </section>
    );
  }

  return (
    <section className="container">
      <h2>{article.title[lang]}</h2>
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: article.content[lang] }}
      />
      <p>
        <Link to="/articles">{t.buttons.backToList || '← Back to Articles'}</Link>
      </p>
    </section>
  );
}
