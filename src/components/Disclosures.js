import React from 'react';
import FOIA_DATA from '../data/foia.json';
import ARTICLES from '../data/articles.json';
import '../styles/global.css';

export default function Disclosures() {
  return (
    <section className="container">
      <h2>Important Disclosures</h2>
      <ul>
        {FOIA_DATA.map(e => (
          <li key={e.id}>
            <a href={`#foia-${e.id}`}>{e.title.en} (request #{e.id})</a>
          </li>
        ))}
        {ARTICLES.map(a => (
          <li key={a.id}>
            <a href={`#/articles#article-${a.id}`}>{a.title.en} (article #{a.id})</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
