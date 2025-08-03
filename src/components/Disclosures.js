import React from 'react';
import { useT } from '../i18n';
import FOIA_DATA from '../data/foia.json';
import ARTICLES from '../data/articles.json';
import '../styles/global.css';
import { Link } from 'react-router-dom';

export default function Disclosures({ lang }) {
  const t = useT();

  return (
    <section className="container">
      <h2 className="heading">{t.headings.disclosures}</h2>
      <ul className="disclosures-list">
        {FOIA_DATA.map(e => (
          <li key={`foia-${e.id}`}>
            <Link to={`/foia/${e.id}`}>{e.title[lang]}</Link>
          </li>
        ))}
        {ARTICLES.map(a => (
          <li key={`article-${a.id}`}>
            <Link to={`/articles/${a.id}`}>{a.title[lang]}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
