import React from 'react';
import { useT } from '../i18n';
import '../styles/global.css';

export default function Contact() {
  const t = useT();

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="contact-inner">
          <p className="section-eyebrow">{t.headings.contact}</p>
          <h2>{t.headings.contact}</h2>
          <p className="contact-text">{t.contact.description}</p>
          <a href="mailto:opengovclimate@pm.me" className="contact-email">
            opengovclimate@pm.me
          </a>
          <p className="contact-note">{t.contact.secure}</p>
        </div>
      </div>
    </section>
  );
}
