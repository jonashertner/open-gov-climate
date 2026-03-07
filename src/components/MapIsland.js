import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export function initMap(container, evidenceData) {
  const map = new maplibregl.Map({
    container,
    style: 'https://vectortiles.geo.admin.ch/styles/ch.swisstopo.basemap.vt/style.json',
    center: [8.2, 46.8],
    zoom: 7,
  });

  map.addControl(new maplibregl.NavigationControl(), 'top-right');

  const geojson = {
    type: 'FeatureCollection',
    features: evidenceData.map(e => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [e.lng, e.lat] },
      properties: { title: e.title, domain: e.domain, sourceType: e.sourceType, url: e.url, slug: e.slug },
    })),
  };

  map.on('load', () => {
    map.addSource('evidence', {
      type: 'geojson',
      data: geojson,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'evidence',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': '#0a0a0a',
        'circle-radius': ['step', ['get', 'point_count'], 18, 5, 24, 10, 30],
      },
    });

    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'evidence',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-size': 12,
      },
      paint: { 'text-color': '#ffffff' },
    });

    map.addLayer({
      id: 'points',
      type: 'circle',
      source: 'evidence',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': [
          'match', ['get', 'domain'],
          'soil', '#8B6914',
          'air', '#4A90D9',
          'forest', '#2D7D46',
          'water', '#1B6B93',
          '#0a0a0a'
        ],
        'circle-radius': 7,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
      },
    });

    map.on('click', 'points', (e) => {
      const props = e.features[0].properties;
      const domainLabel = props.domain.charAt(0).toUpperCase() + props.domain.slice(1);
      new maplibregl.Popup({ offset: 12, closeButton: false })
        .setLngLat(e.lngLat)
        .setHTML(`<div style="font-family:Inter,sans-serif;font-size:14px;"><span style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#666;">${escapeHtml(domainLabel)}</span><br/><strong>${escapeHtml(props.title)}</strong><br/><a href="${escapeHtml(props.url)}" style="color:#0a0a0a;text-decoration:underline;">View details</a></div>`)
        .addTo(map);
    });

    map.on('click', 'clusters', (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
      const clusterId = features[0].properties.cluster_id;
      map.getSource('evidence').getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        map.easeTo({ center: features[0].geometry.coordinates, zoom });
      });
    });

    map.on('mouseenter', 'points', () => { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave', 'points', () => { map.getCanvas().style.cursor = ''; });
    map.on('mouseenter', 'clusters', () => { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave', 'clusters', () => { map.getCanvas().style.cursor = ''; });
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
