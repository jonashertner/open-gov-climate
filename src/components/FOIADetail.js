import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useT } from '../i18n';
import FOIA_DATA from '../data/foia.json';
import '../styles/global.css';

export default function FOIADetail({ lang }) {
  const { id } = useParams();
  const t = useT();
  const entry = FOIA_DATA.find(e => e.id === id);

  if (!entry) {
    return (
      <div className="detail-page">
        <div className="container">
          <p style={{ color: 'var(--gray-500)' }}>{t.errors.notFound}</p>
          <Link to="/" className="detail-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            {t.buttons.backToHome}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <div className="container">
        <Link to="/" className="detail-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          {t.buttons.backToHome}
        </Link>

        <h1 className="detail-title">{entry.title[lang]}</h1>

        <div className="detail-content">
          <section className="detail-section">
            <h2 className="detail-section-title">{t.headings.request}</h2>
            <p className="detail-text">{entry.request_text}</p>
            {entry.request_pdf && (
              <div className="detail-download">
                <a
                  href={`${process.env.PUBLIC_URL}/data/${entry.request_pdf}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                >
                  {t.buttons.downloadRequest}
                </a>
              </div>
            )}
          </section>

          <section className="detail-section">
            <h2 className="detail-section-title">{t.headings.response}</h2>
            <p className="detail-text">{entry.response_text}</p>
            {entry.response_pdf && (
              <div className="detail-download">
                <a
                  href={`${process.env.PUBLIC_URL}/data/${entry.response_pdf}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                >
                  {t.buttons.downloadResponse}
                </a>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
