import React from 'react';
import { useT } from '../i18n';
import '../styles/global.css';

export default function About() {
  const t = useT();
  return (
    <section className="container">
      <h2>About</h2>
      <p>{t.about}</p>
    </section>
  );
}
