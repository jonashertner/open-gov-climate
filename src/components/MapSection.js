import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import FOIA_DATA from '../data/foia.json';
import { useT } from '../i18n';
import '../styles/global.css';

export default function MapSection() {
  const t = useT();
  const ref = useRef();
  const mapRef = useRef();
  useEffect(() => {
    mapRef.current = new maplibregl.Map({
      container: ref.current,
      style: 'https://vectortiles.geo.admin.ch/styles/ch.swisstopo.basemap.vt/style.json',
      center: [8.2, 46.8],
      zoom: 6
    });
    mapRef.current.addControl(new maplibregl.NavigationControl());
    FOIA_DATA.forEach(e => {
      if (e.latitude && e.longitude) {
        new maplibregl.Marker()
          .setLngLat([e.longitude, e.latitude])
          .setPopup(new maplibregl.Popup().setHTML(
            `<a href="#foia-${e.id}">${e.title.en}</a>`
          ))
          .addTo(mapRef.current);
      }
    });
    return () => mapRef.current.remove();
  }, []);
  return (
    <section className="container">
      <h2>{t.headings.map}</h2>
      <div ref={ref} className="map-container"></div>
    </section>
  );
}
