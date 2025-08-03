import React, { useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import maplibregl from 'maplibre-gl';
import { useI18n } from '../i18n';
import { theme } from '../theme';

const Section = styled.section`
  padding:${props=>props.theme.spacing(4)} 16px;
`;
const Title = styled.h2`
  font-size:1.5rem; margin-bottom:${props=>props.theme.spacing(2)};
`;
const MapContainer = styled.div`
  width:100%; height:400px; border:1px solid #e5e5e5;
`;

export default function MapSection(){
  const { t } = useI18n();
  useEffect(()=>{
    const map = new maplibregl.Map({
      container: 'mapContainer',
      style: 'https://vectortiles.geo.admin.ch/styles/ch.swisstopo.basemap.vt/style.json',
      center: [8.2,46.8], zoom:6
    });
    map.addControl(new maplibregl.NavigationControl());
    fetch('/data/foia.json')
      .then(r=>r.json())
      .then(data=>{
        data.forEach(entry=>{
          if(entry.longitude && entry.latitude){
            new maplibregl.Marker({color:'#E63946'})
              .setLngLat([entry.longitude, entry.latitude])
              .setPopup(new maplibregl.Popup({offset:25})
                .setHTML(`<strong>${entry.title.en}</strong><br>${entry.summary.en}`))
              .addTo(map);
          }
        })
      });
  },[]);

  return (
    <ThemeProvider theme={theme}>
      <Section id="map">
        <Title>{t.map.title}</Title>
        <MapContainer id="mapContainer" />
      </Section>
    </ThemeProvider>
  );
}
