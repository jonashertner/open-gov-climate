import React from 'react';
import { useT } from '../i18n';
import '../styles/global.css';

export default function Contact() {
  const t = useT();

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <h2>{t.headings.contact}</h2>
        <p>Questions or contributions welcome.</p>
        <a href="mailto:opengovclimate@pm.me" className="contact-email">
          opengovclimate@pm.me
        </a>
        <p className="contact-note">Encrypted via ProtonMail</p>
      </div>
    </section>
  );
}
