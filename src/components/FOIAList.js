import React from 'react';
import { useT } from '../i18n';
import FOIA_DATA from '../data/foia.json';
import '../styles/global.css';
import { Link } from 'react-router-dom';

export default function FOIAList({ lang }) {
  const t = useT();

  return (
    <section className="container">
      <h2>{t.headings.foia}</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {FOIA_DATA.map(e => (
          <li key={e.id} style={{ marginBottom: '1.5rem' }}>
            <h3>
              <Link to={`/foia/${e.id}`}>{e.title[lang]}</Link>
            </h3>
            <p>{e.summary[lang]}</p>
            <Link to={`/foia/${e.id}`}>
              {t.headings.readMore}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
