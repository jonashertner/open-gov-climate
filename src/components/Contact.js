import React, { useState } from 'react';
import '../styles/global.css';

export default function Contact() {
  const [tip, setTip] = useState('');
  const [status, setStatus] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ 'form-name': 'contact', tip }).toString()
    }).then(() => {
      setStatus('success');
      setTip('');
    }).catch(() => setStatus('error'));
  };
  return (
    <section className="container contact" id="contact">
      <h2>Contact</h2>
      <form name="contact" method="POST" data-netlify="true" onSubmit={handleSubmit}>
        <input type="hidden" name="form-name" value="contact" />
        <label htmlFor="tipText" className="sr-only">Your tip</label>
        <textarea
          id="tipText"
          name="tip"
          placeholder="Submit an anonymous tip..."
          value={tip}
          required
          onChange={e => setTip(e.target.value)}
          style={{width:'100%',padding:'8px',marginBottom:'8px'}}
        />
        <button type="submit" disabled={!tip.trim()} style={{padding:'8px 16px'}}>
          {status === 'success' ? 'Submitted' : 'Submit'}
        </button>
        {status === 'success' && <p className="form-success">Thank you for your tip!</p>}
        {status === 'error' && <p className="form-error">Submission failed, please try again.</p>}
      </form>
    </section>
  );
}
