import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export function initMap(container, foiaData) {
  const map = new maplibregl.Map({
    container,
    style: 'https://vectortiles.geo.admin.ch/styles/ch.swisstopo.basemap.vt/style.json',
    center: [8.2, 46.8],
    zoom: 7,
  });

  map.addControl(new maplibregl.NavigationControl(), 'top-right');

  const geojson = {
    type: 'FeatureCollection',
    features: foiaData.map(f => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [f.lng, f.lat] },
      properties: { title: f.title, status: f.status, category: f.category, url: f.url, slug: f.slug },
    })),
  };

  map.on('load', () => {
    map.addSource('foia', {
      type: 'geojson',
      data: geojson,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'foia',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': '#0a0a0a',
        'circle-radius': ['step', ['get', 'point_count'], 18, 5, 24, 10, 30],
      },
    });

    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'foia',
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
      source: 'foia',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#0a0a0a',
        'circle-radius': 7,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
      },
    });

    map.on('click', 'points', (e) => {
      const props = e.features[0].properties;
      new maplibregl.Popup({ offset: 12, closeButton: false })
        .setLngLat(e.lngLat)
        .setHTML(`<div style="font-family:Inter,sans-serif;font-size:14px;"><strong>${escapeHtml(props.title)}</strong><br/><a href="${escapeHtml(props.url)}" style="color:#0a0a0a;text-decoration:underline;">View details</a></div>`)
        .addTo(map);
    });

    map.on('click', 'clusters', (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
      const clusterId = features[0].properties.cluster_id;
      map.getSource('foia').getClusterExpansionZoom(clusterId, (err, zoom) => {
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
