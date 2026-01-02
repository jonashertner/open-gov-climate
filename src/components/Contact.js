import React from 'react';
import { useT } from '../i18n';
import '../styles/global.css';

export default function Contact() {
  const t = useT();

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <div className="contact-inner">
          {/* Title */}
          <h2 className="contact-title">{t.headings.contact}</h2>

          {/* Description */}
          <p className="contact-description">
            {t.contact?.description || 'Have questions about our FOIA requests or want to contribute? Reach out to us through secure channels.'}
          </p>

          {/* Email Button */}
          <a href="mailto:opengovclimate@pm.me" className="contact-email">
            <span className="contact-email-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
            opengovclimate@pm.me
          </a>

          {/* Security Note */}
          <div className="contact-secure">
            <span className="contact-secure-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </span>
            {t.contact?.secure || 'End-to-end encrypted communication via ProtonMail'}
          </div>
        </div>
      </div>
    </section>
  );
}
