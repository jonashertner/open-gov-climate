import React from 'react';
import { useT } from '../i18n';
import '../styles/global.css';

export default function Banner() {
  const t = useT();
  return (
    <section className="banner container">
      <p>{t.banner}</p>
    </section>
  );
}
