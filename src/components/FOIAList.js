import React from 'react';
import { useT } from '../i18n';
import FOIA_DATA from '../data/foia.json';
import '../styles/global.css';
import { Link } from 'react-router-dom';

export default function FOIAList({ lang }) {
  const t = useT();

  return (
    <section id="foia" className="foia-section">
      <div className="container">
        <div className="section-header">
          <p className="section-label">{t.headings.foia}</p>
          <h2>Public Records Requests</h2>
        </div>

        <div className="foia-list">
          {FOIA_DATA.map(entry => (
            <article key={entry.id} className="foia-item">
              <p className="foia-meta">Response Received</p>
              <h3 className="foia-title">
                <Link to={`/foia/${entry.id}`}>{entry.title[lang]}</Link>
              </h3>
              <p className="foia-summary">{entry.summary[lang]}</p>
              <Link to={`/foia/${entry.id}`} className="foia-link">
                {t.headings.readMore} →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
