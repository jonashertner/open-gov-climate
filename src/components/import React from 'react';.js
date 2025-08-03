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
      <section className="container">
        <p>{t.errors?.notFound || 'Request not found.'}</p>
        <Link to="/">{t.buttons?.backToHome || '← Back home'}</Link>
      </section>
    );
  }

  return (
    <section className="container">
      <h2>{entry.title[lang]}</h2>

      <h3>{t.headings?.request || 'Request'}</h3>
      <p>{entry.request_text}</p>
      {entry.request_pdf && (
        <p>
          <a
            href={`${process.env.PUBLIC_URL}/data/${entry.request_pdf}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.headings?.downloadRequest || 'Download Request PDF'}
          </a>
        </p>
      )}

      <h3>{t.headings?.response || 'Response'}</h3>
      <p>{entry.response_text}</p>
      {entry.response_pdf && (
        <p>
          <a
            href={`${process.env.PUBLIC_URL}/data/${entry.response_pdf}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.headings?.downloadResponse || 'Download Response PDF'}
          </a>
        </p>
      )}

      <p>
        <Link to="/">{t.buttons?.backToList || '← Back to Requests'}</Link>
      </p>
    </section>
  );
}
