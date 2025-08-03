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
  // This resolves to: /open-gov-climate/relief_switzerland_minimalist.png
  const bgUrl = process.env.PUBLIC_URL + '/relief_switzerland_minimalist.png';

  return (
    <I18nProvider lang={lang}>
      <Router>
        <div
          style={{
            // Relief map behind, fixed
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',

            // White overlay to mute the image
            backgroundColor: 'rgba(255,255,255,0.85)',

            // Ensure full-screen coverage
            minHeight: '100vh',
            width: '100%',
          }}
        >
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
