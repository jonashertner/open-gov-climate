// src/App.js
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Intro from './components/Intro';
import Disclosures from './components/Disclosures';
import FOIAList from './components/FOIAList';
import FOIADetail from './components/FOIADetail';
import MapSection from './components/MapSection';
import Articles from './components/Articles';
import ArticleDetail from './components/ArticleDetail';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { I18nProvider } from './i18n';

function App() {
  const [lang, setLang] = useState('en');
  const bgUrl = process.env.PUBLIC_URL + '/relief_switzerland_minimalist.png';

  return (
    <I18nProvider lang={lang}>
      <Router>
        {/* Background image as an <img> with low opacity, fixed behind everything */}
        <img
          src={bgUrl}
          alt=""
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.08,
            zIndex: -1
          }}
        />

        {/* All your content lives on top */}
        <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
          <Header lang={lang} setLang={setLang} />

          <main>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Intro />
                    <Disclosures lang={lang} />
                    <FOIAList lang={lang} />
                    <MapSection />
                    <Articles lang={lang} />
                    <Contact />
                  </>
                }
              />

              <Route path="/foia" element={<FOIAList lang={lang} />} />
              <Route path="/foia/:id" element={<FOIADetail lang={lang} />} />

              <Route path="/articles" element={<Articles lang={lang} />} />
              <Route path="/articles/:id" element={<ArticleDetail lang={lang} />} />

              {/* fallback to home */}
              <Route path="*" element={<Intro />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </I18nProvider>
  );
}

export default App;
