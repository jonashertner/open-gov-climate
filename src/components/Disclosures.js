import React from 'react';
import { useT } from '../i18n';
import FOIA_DATA from '../data/foia.json';
import ARTICLES from '../data/articles.json';
import '../styles/global.css';
import { Link } from 'react-router-dom';

export default function Disclosures({ lang }) {
  const t = useT();

  return (
    <section id="disclosures" className="disclosures-section">
      <div className="container">
        <div className="section-header">
          <p className="section-label">{t.headings.disclosures}</p>
          <h2>All Documents</h2>
        </div>

        <div className="disclosure-list">
          {FOIA_DATA.map(entry => (
            <Link
              key={`foia-${entry.id}`}
              to={`/foia/${entry.id}`}
              className="disclosure-item"
            >
              <div className="disclosure-title">{entry.title[lang]}</div>
              <div className="disclosure-type">FOIA Request</div>
            </Link>
          ))}

          {ARTICLES.map(article => (
            <Link
              key={`article-${article.id}`}
              to={`/articles/${article.id}`}
              className="disclosure-item"
            >
              <div className="disclosure-title">{article.title[lang]}</div>
              <div className="disclosure-type">Article</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
