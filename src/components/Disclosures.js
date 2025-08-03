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
      <h2 style={{ fontFamily: 'Aktiv Grotesk, Helvetica, Arial, sans-serif' }}>
        {t.headings.disclosures}
      </h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {FOIA_DATA.map(e => (
          <li key={e.id} style={{ marginBottom: '0.75rem' }}>
            <Link
              to={`/foia/${e.id}`}
              style={{ textDecoration: 'none', color: 'inherit', fontFamily: 'Aktiv Grotesk, Helvetica, Arial, sans-serif' }}
            >
              {e.title[lang]}
            </Link>
          </li>
        ))}
        {ARTICLES.map(a => (
          <li key={a.id} style={{ marginBottom: '0.75rem' }}>
            <Link
              to={`/articles/${a.id}`}
              style={{ textDecoration: 'none', color: 'inherit', fontFamily: 'Aktiv Grotesk, Helvetica, Arial, sans-serif' }}
            >
              {a.title[lang]}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
