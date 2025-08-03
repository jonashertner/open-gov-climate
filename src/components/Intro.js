import React from 'react';
import { useT } from '../i18n';
import '../styles/global.css';

export default function Intro() {
  const t = useT();
  return (
    <section className="container">
      <h2>{t.intro.title}</h2>
      <p>{t.intro.text}</p>
      <p>{t.about}</p>
    </section>
  );
}
