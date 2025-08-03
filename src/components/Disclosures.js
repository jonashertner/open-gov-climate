import React from 'react';
import { useT } from '../i18n';
import FOIA_DATA from '../data/foia.json';
import '../styles/global.css';

export default function Disclosures() {
  const t = useT();
  return (
    <section className="container">
      <h2>{t.headings.disclosures}</h2>
      <ul>
        {FOIA_DATA.map(e => <li key={e.id}><a href={`#foia-${e.id}`}>{e.title.en}</a></li>)}
      </ul>
    </section>
  );
}