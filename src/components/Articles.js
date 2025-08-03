import React from 'react';
import ARTICLES from '../data/articles.json';
import { useT } from '../i18n';
import '../styles/global.css';

export default function Articles() {
  const t = useT();
  return (
    <section className="container">
      <h2>{t.headings.articles}</h2>
      {ARTICLES.map(a => (
        <article id={`article-${a.id}`} key={a.id} style={{ marginBottom: '24px' }}>
          <h3>{a.title.en}</h3>
          <p>{a.summary.en}</p>
          {a.url && <a href={a.url} target="_blank" rel="noopener">Read more</a>}
        </article>
      ))}
    </section>
  );
}
