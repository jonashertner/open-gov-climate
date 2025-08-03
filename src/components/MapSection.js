import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import FOIA_DATA from '../data/foia.json';
import '../styles/global.css';

export default function MapSection() {
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
          .setPopup(new maplibregl.Popup().setText(e.title.en))
          .addTo(mapRef.current);
      }
    });
    return () => mapRef.current.remove();
  }, []);
  return (
    <section className="container">
      <h2>Geographic Coverage</h2>
      <div ref={ref} className="map-container"></div>
    </section>
  );
}
