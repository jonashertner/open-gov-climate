import React from 'react';
import { useT } from '../i18n';
import '../styles/global.css';

export default function Contact() {
  const t = useT();
  return (
    <section className="container" id="contact">
      <h2>{t.headings.contact}</h2>
      <p>Secure communication: <a href="mailto:opengovclimate@pm.me">opengovclimate@pm.me</a></p>
    </section>
  );
}
