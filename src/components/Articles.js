import React from 'react';
import ARTICLES from '../data/articles.json';
import '../styles/global.css';

export default function Articles() {
  return (
    <section className="container">
      <h2>Articles</h2>
      {ARTICLES.map(a => (
        <article key={a.id} style={{marginBottom:'24px'}}>
          <h3>{a.title.en}</h3>
          <p>{a.summary.en}</p>
          {a.url && <a href={a.url} target="_blank" rel="noopener">Read more</a>}
        </article>
      ))}
    </section>
  );
}
