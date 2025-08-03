import React from 'react';
import { useT } from '../i18n';
import '../styles/global.css';

export default function Disclosures() {
  const t = useT();
  return (
    <section className="container">
      <h2>Important Disclosures</h2>
      <ul>
        {t.disclosures.map((d,i)=> <li key={i}>{d}</li>)}
      </ul>
    </section>
  );
}
