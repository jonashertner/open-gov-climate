import React from 'react';
import { useT } from '../i18n';
import '../styles/global.css';

export default function Hero() {
  const t = useT();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero">
      {/* Decorative mountain shapes */}
      <div className="hero-shapes">
        <div className="hero-shape hero-shape-1"></div>
        <div className="hero-shape hero-shape-2"></div>
      </div>

      <div className="hero-content">
        {/* Badge */}
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          {t.hero?.badge || 'Swiss Transparency Initiative'}
        </div>

        {/* Title */}
        <h1 className="hero-title">
          {t.hero?.titleStart || 'Protecting the Alps Through '}
          <span className="hero-title-accent">
            {t.hero?.titleAccent || 'Transparency'}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          {t.intro.text}
        </p>

        {/* Call to action buttons */}
        <div className="hero-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => scrollToSection('foia')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            {t.hero?.cta || 'View FOIA Requests'}
          </button>
          <button
            className="btn btn-secondary btn-lg"
            onClick={() => scrollToSection('map')}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              color: 'white'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="22" />
            </svg>
            {t.hero?.ctaSecondary || 'Explore Map'}
          </button>
        </div>

        {/* Stats */}
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-value">2+</div>
            <div className="hero-stat-label">{t.hero?.statFoia || 'FOIA Requests'}</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">4</div>
            <div className="hero-stat-label">{t.hero?.statLang || 'Languages'}</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">100%</div>
            <div className="hero-stat-label">{t.hero?.statTransparent || 'Transparent'}</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'bounce 2s infinite'
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
          40% { transform: translateX(-50%) translateY(-10px); }
          60% { transform: translateX(-50%) translateY(-5px); }
        }
      `}</style>
    </section>
  );
}
