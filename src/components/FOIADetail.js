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
        <p>{t.errors.notFound}</p>
        <Link to="/">{t.buttons.backToHome}</Link>
      </section>
    );
  }

  return (
    <section className="container">
      <h2>{entry.title[lang]}</h2>

      <h3>{t.headings.request}</h3>
      <p>{entry.request_text}</p>
      {entry.request_pdf && (
        <p>
          <a
            href={`${process.env.PUBLIC_URL}/data/${entry.request_pdf}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.buttons.downloadRequest}
          </a>
        </p>
      )}

      <h3>{t.headings.response}</h3>
      <p>{entry.response_text}</p>
      {entry.response_pdf && (
        <p>
          <a
            href={`${process.env.PUBLIC_URL}/data/${entry.response_pdf}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.buttons.downloadResponse}
          </a>
        </p>
      )}

      <p>
        <Link to="/">{t.buttons.backToHome}</Link>
      </p>
    </section>
  );
}
