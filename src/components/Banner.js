import React from 'react';
import { useT } from '../i18n';
import '../styles/global.css';

export default function Banner() {
  const t = useT();
  return (
    <section style={{ background: '#fafafa', padding: '32px 0' }}>
      <div className="container">
        <p>{t.banner}</p>
      </div>
    </section>
  );
}
