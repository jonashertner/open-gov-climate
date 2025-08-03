import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { useT } from '../i18n';
import FOIA_DATA from '../data/foia.json';
import '../styles/global.css';

export default function MapSection() {
  const ref = useRef();
  useEffect(() => {
    const map = new maplibregl.Map({
      container: ref.current,
      style: 'https://vectortiles.geo.admin.ch/styles/ch.swisstopo.basemap.vt/style.json',
      center: [8.2,46.8],
      zoom: 6
    });
    map.addControl(new maplibregl.NavigationControl());
    FOIA_DATA.forEach(e => {
      new maplibregl.Marker().setLngLat([e.longitude,e.latitude])
        .setPopup(new maplibregl.Popup().setHTML(`<a href="#foia-${e.id}">${e.title.en}</a>`))
        .addTo(map);
    });
    return () => map.remove();
  }, []);
  const t = useT();
  return (
    <section className="container">
      <h2>{t.headings.map}</h2>
      <div ref={ref} className="map-container"></div>
    </section>
  );
}