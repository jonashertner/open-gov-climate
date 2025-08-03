import React from 'react';
import FOIA_DATA from '../data/foia.json';
import ARTICLES from '../data/articles.json';
import { useT } from '../i18n';
import '../styles/global.css';

export default function Disclosures() {
  const t = useT();
  return (
    <section className="container">
      <h2>{t.headings.disclosures}</h2>
      <ul>
        {FOIA_DATA.map(e => (
          <li key={e.id}>
            <a href={`#foia-${e.id}`}>{e.title.en} (#{e.id})</a>
          </li>
        ))}
        {ARTICLES.map(a => (
          <li key={a.id}>
            <a href={`#/articles#article-${a.id}`}>{a.title.en} (#{a.id})</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
