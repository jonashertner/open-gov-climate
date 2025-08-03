import React from 'react';
import { useT } from '../i18n';
import '../styles/global.css';

export default function Contact() {
  const t = useT();
  return (
    <section className="container">
      <h2>Contact</h2>
      <form name="contact" method="POST" data-netlify="true">
        <textarea 
          name="tip" 
          placeholder={t.contact.placeholder} 
          required 
          style={{width:'100%', padding:'8px', marginBottom:'8px'}} 
        />
        <button type="submit" style={{padding:'8px 16px'}}>Submit</button>
      </form>
    </section>
  );
}
