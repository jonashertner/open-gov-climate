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
        <div className="detail-content">
          <div className="detail-card">
            <p style={{ textAlign: 'center', color: 'var(--mountain-500)' }}>{t.errors.notFound}</p>
            <div className="detail-back">
              <Link to="/" className="btn btn-primary">{t.buttons.backToHome}</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      {/* Header */}
      <div className="detail-header">
        <div className="detail-header-inner">
          <nav className="detail-breadcrumb">
            <Link to="/">{t.buttons.backToHome?.replace('← ', '') || 'Home'}</Link>
            <span>/</span>
            <Link to="/#foia">{t.headings.foia}</Link>
            <span>/</span>
            <span>{entry.title[lang]}</span>
          </nav>
          <h1 className="detail-title">{entry.title[lang]}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="detail-content">
        <div className="detail-card">
          {/* Request Section */}
          <div className="detail-section">
            <h3 className="detail-section-title">
              <span className="detail-section-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </span>
              {t.headings.request}
            </h3>
            <p className="detail-text">{entry.request_text}</p>
            {entry.request_pdf && (
              <div className="detail-download">
                <a
                  href={`${process.env.PUBLIC_URL}/data/${entry.request_pdf}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  {t.buttons.downloadRequest}
                </a>
              </div>
            )}
          </div>

          {/* Response Section */}
          <div className="detail-section">
            <h3 className="detail-section-title">
              <span className="detail-section-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </span>
              {t.headings.response}
            </h3>
            <p className="detail-text">{entry.response_text}</p>
            {entry.response_pdf && (
              <div className="detail-download">
                <a
                  href={`${process.env.PUBLIC_URL}/data/${entry.response_pdf}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  {t.buttons.downloadResponse}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="detail-back">
          <Link to="/" className="btn btn-ghost">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            {t.buttons.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
