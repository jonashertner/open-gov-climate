// src/components/MapSection.js
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
      pitch: 45,
      bearing: -10,
      antialias: true
    });

    map.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true
      }),
      'top-right'
    );

    map.addControl(new maplibregl.ScaleControl(), 'bottom-right');

    FOIA_DATA.forEach(entry => {
      // Create custom marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker';
      markerEl.innerHTML = `
        <div style="
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%);
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 15px rgba(14, 165, 233, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
      `;

      markerEl.addEventListener('mouseenter', () => {
        markerEl.firstElementChild.style.transform = 'scale(1.15)';
        markerEl.firstElementChild.style.boxShadow = '0 6px 20px rgba(14, 165, 233, 0.6)';
      });

      markerEl.addEventListener('mouseleave', () => {
        markerEl.firstElementChild.style.transform = 'scale(1)';
        markerEl.firstElementChild.style.boxShadow = '0 4px 15px rgba(14, 165, 233, 0.4)';
      });

      const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
        className: 'custom-popup'
      }).setHTML(`
        <div style="padding: 8px; min-width: 200px;">
          <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #1e293b;">
            ${entry.title[lang]}
          </h4>
          <p style="margin: 0 0 12px 0; font-size: 12px; color: #64748b; line-height: 1.5;">
            ${entry.summary[lang].substring(0, 100)}...
          </p>
          <a href="#/foia/${entry.id}" style="
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            font-weight: 600;
            color: #0284c7;
            text-decoration: none;
          ">
            View Details
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      `);

      new maplibregl.Marker({ element: markerEl })
        .setLngLat([entry.longitude, entry.latitude])
        .setPopup(popup)
        .addTo(map);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [lang]);

  return (
    <section id="map" className="section map-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="22" />
            </svg>
            {t.headings.map}
          </div>
          <h2 className="section-title">{t.map?.title || 'Project Locations'}</h2>
          <p className="section-description">
            {t.map?.description || 'Interactive map showing all documented climate intervention projects across the Swiss Alps'}
          </p>
        </div>

        {/* Map Container */}
        <div className="map-wrapper">
          <div ref={mapContainerRef} className="map-container"></div>

          {/* Map Legend */}
          <div className="map-overlay">
            <div className="map-legend">
              <div className="map-legend-title">Legend</div>
              <div className="map-legend-item">
                <span className="map-legend-dot"></span>
                FOIA Request Location
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
