// src/components/MapSection.js
import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { useT } from '../i18n';
import FOIA_DATA from '../data/foia.json';
import '../styles/global.css';

export default function MapSection({ lang }) {
  const ref = useRef();
  const t = useT();

  useEffect(() => {
    const map = new maplibregl.Map({
      container: ref.current,
      style: 'https://vectortiles.geo.admin.ch/styles/ch.swisstopo.basemap.vt/style.json',
      center: [8.2, 46.8],
      zoom: 6
    });
    map.addControl(new maplibregl.NavigationControl());

    FOIA_DATA.forEach(entry => {
      const popup = new maplibregl.Popup({ offset: 25 })
        .setHTML(
          `<a href="#/foia/${entry.id}" style="color:#000;text-decoration:underline;">${entry.title[lang]}</a>`
        );

      new maplibregl.Marker()
        .setLngLat([entry.longitude, entry.latitude])
        .setPopup(popup)
        .addTo(map);
    });

    return () => map.remove();
  }, [lang]);

  return (
    <section className="container">
      <h2>{t.headings.map}</h2>
      <div ref={ref} className="map-container"></div>
    </section>
  );
}
