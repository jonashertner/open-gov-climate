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
      zoom: 7
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    FOIA_DATA.forEach(entry => {
      const popup = new maplibregl.Popup({ offset: 25 })
        .setHTML(`
          <div>
            <strong>${entry.title[lang]}</strong>
            <p style="margin: 0.5rem 0 0; font-size: 0.875rem; color: #666;">
              <a href="#/foia/${entry.id}">View details →</a>
            </p>
          </div>
        `);

      new maplibregl.Marker({ color: '#111111' })
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
    <section id="map" className="map-section">
      <div className="container">
        <div className="map-header">
          <p className="section-label">{t.headings.map}</p>
          <h2>Project Locations</h2>
        </div>
      </div>
      <div ref={mapContainerRef} className="map-container"></div>
    </section>
  );
}
