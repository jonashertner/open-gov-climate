import React from 'react';
import { useT } from '../i18n';
import ARTICLES from '../data/articles.json';
import '../styles/global.css';
import { Link } from 'react-router-dom';

export default function Articles({ lang }) {
  const t = useT();

  return (
    <section className="container">
      <h2>{t.headings.articles}</h2>
      <ul>
        {ARTICLES.map(a => (
          <li key={a.id} style={{ marginBottom: '1rem' }}>
            <h3>
              <Link to={`/articles/${a.id}`}>{a.title[lang]}</Link>
            </h3>
            <p>{a.summary[lang]}</p>
            <Link to={`/articles/${a.id}`}>{t.headings.readMore}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
