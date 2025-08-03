import React, { useState, useEffect } from 'react';
import lunr from 'lunr';
import { useT } from '../i18n';
import FOIA_DATA from '../data/foia.json';
import '../styles/global.css';

export default function FOIAList() {
  const t = useT();
  const [q, setQ] = useState('');
  const [res, setRes] = useState(FOIA_DATA);
  useEffect(() => {
    const idx = lunr(function() {
      this.ref('id'); this.field('title'); this.field('summary');
      FOIA_DATA.forEach(d => this.add({ id: d.id, title: d.title.en, summary: d.summary.en }));
    });
    if (!q) return setRes(FOIA_DATA);
    try {
      setRes(idx.search(q).map(r => FOIA_DATA.find(d => d.id === r.ref)));
    } catch {
      setRes(FOIA_DATA);
    }
  }, [q]);
  return (
    <section className="container">
      <h2>{t.headings.foia}</h2>
      <input className="input-search" type="search" placeholder="Search…" value={q} onChange={e => setQ(e.target.value)} />
      {res.map(e => (
        <article id={`foia-${e.id}`} key={e.id}>
          <h3>{e.title.en}</h3>
          <p>{e.request_text}</p>
        </article>
      ))}
    </section>
  );
}
