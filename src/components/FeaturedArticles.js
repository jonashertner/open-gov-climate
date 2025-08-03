import React from 'react';
import { useT } from '../i18n';
import ARTICLES from '../data/articles.json';
import '../styles/global.css';

export default function FeaturedArticles() {
  const t = useT();
  return (
    <section className="container">
      <h2>{t.headings.articles}</h2>
      <ul>
        {ARTICLES.map(a => (
          <li key={a.id}>
            <a href={`#/articles#article-${a.id}`}>{a.title[t.lang]}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
