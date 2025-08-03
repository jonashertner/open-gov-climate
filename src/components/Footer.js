import React from 'react';
import { useT } from '../i18n';
import '../styles/global.css';

export default function Footer() {
  const t = useT();
  return (
    <footer style={{ textAlign: 'center', padding: '16px 0' }}>
      <p>{t.headings.footer}</p>
    </footer>
  );
}