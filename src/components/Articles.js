import React from 'react';
import { useT } from '../i18n';
import ARTICLES from '../data/articles.json';
import '../styles/global.css';

export default function Articles() {
  const t = useT();
  return (
    <section className="container">
      <h2>{t.headings.articles}</h2>
      {ARTICLES.map(a => (
        <article id={`article-${a.id}`} key={a.id}>
          <h3>{a.title.en}</h3>
          <p>{a.summary.en}</p>
        </article>
      ))}
    </section>
  );
}