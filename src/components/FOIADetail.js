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
          <Link to="/" className="detail-back">← {t.buttons.backToHome?.replace('← ', '') || 'Back'}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <div className="container">
        <Link to="/" className="detail-back">← Back</Link>

        <h1 className="detail-title">{entry.title[lang]}</h1>

        <div className="detail-content">
          <div className="detail-section">
            <h3 className="detail-section-title">{t.headings.request}</h3>
            <p className="detail-text">{entry.request_text}</p>
            {entry.request_pdf && (
              <div className="detail-download">
                <a
                  href={`${process.env.PUBLIC_URL}/data/${entry.request_pdf}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                >
                  Download Request PDF
                </a>
              </div>
            )}
          </div>

          <div className="detail-section">
            <h3 className="detail-section-title">{t.headings.response}</h3>
            <p className="detail-text">{entry.response_text}</p>
            {entry.response_pdf && (
              <div className="detail-download">
                <a
                  href={`${process.env.PUBLIC_URL}/data/${entry.response_pdf}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                >
                  Download Response PDF
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
