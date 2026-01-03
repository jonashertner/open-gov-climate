import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { useT } from '../i18n';
import FOIA_DATA from '../data/foia.json';
import '../styles/global.css';

export default function MapSection({ lang }) {
  const mapContainerRef = useRef();
  const mapRef = useRef();
  const t = useT();

  useEffect(() => {
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://vectortiles.geo.admin.ch/styles/ch.swisstopo.basemap.vt/style.json',
      center: [8.2, 46.8],
      zoom: 7,
      attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    FOIA_DATA.forEach(entry => {
      const popup = new maplibregl.Popup({ offset: 25, closeButton: true })
        .setHTML(`
          <div style="max-width: 240px;">
            <strong style="display: block; margin-bottom: 0.5rem; color: #0a0a0a;">${entry.title[lang]}</strong>
            <a href="#/foia/${entry.id}" style="font-size: 0.8125rem; color: #0a0a0a; font-weight: 500;">${t.headings.readMore} →</a>
          </div>
        `);

      new maplibregl.Marker({ color: '#0a0a0a' })
        .setLngLat([entry.longitude, entry.latitude])
        .setPopup(popup)
        .addTo(map);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [lang, t.headings.readMore]);

  return (
    <section id="map" className="map-section">
      <div className="container">
        <header className="map-header">
          <p className="section-eyebrow">{t.headings.map}</p>
          <h2>{t.map.title}</h2>
        </header>
      </div>
      <div ref={mapContainerRef} className="map-container" role="application" aria-label={t.map.description}></div>
    </section>
  );
}
