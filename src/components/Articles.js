import React from 'react';
import { useT } from '../i18n';
import ARTICLES from '../data/articles.json';
import '../styles/global.css';

export default function Articles({ lang }) {
  const t = useT();

  return (
    <section className="container">
      <h2>{t.headings.articles}</h2>

      {/* Summaries with “Read more” anchors */}
      <div style={{ marginBottom: '2rem' }}>
        {ARTICLES.map(a => (
          <div key={a.id} style={{ marginBottom: '1.5rem' }}>
            <h3>{a.title[lang]}</h3>
            <p>{a.summary[lang]}</p>
            <a href={`#article-${a.id}`}>{t.headings.readMore || 'Read more'}</a>
          </div>
        ))}
      </div>

      <hr />

      {/* Full-text versions, anchored */}
      <div>
        {ARTICLES.map(a => (
          <article
            id={`article-${a.id}`}
            key={a.id}
            style={{ marginBottom: '3rem' }}
          >
            <h3>{a.title[lang]}</h3>
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: a.content[lang] }}
            />
          </article>
        ))}
      </div>
    </section>
  );
}
