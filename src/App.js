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
  // PUBLIC_URL resolves to your GitHub Pages base path
  const bgUrl = process.env.PUBLIC_URL + '/relief_switzerland_minimalist.png';

  return (
    <I18nProvider lang={lang}>
      <Router>
        <div
          style={{
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            width: '100%',
          }}
        >
          {/* Header with translated title and language buttons */}
          <Header lang={lang} setLang={setLang} />

          {/* Main content area with routing */}
          <main>
            <Routes>
              {/* Home overview */}
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

              {/* FOIA listing & detail */}
              <Route path="/foia" element={<FOIAList lang={lang} />} />
              <Route path="/foia/:id" element={<FOIADetail lang={lang} />} />

              {/* Article listing & detail */}
              <Route path="/articles" element={<Articles lang={lang} />} />
              <Route path="/articles/:id" element={<ArticleDetail lang={lang} />} />

              {/* Fallback to home for any unknown route */}
              <Route path="*" element={<Intro />} />
            </Routes>
          </main>

          {/* Global footer */}
          <Footer />
        </div>
      </Router>
    </I18nProvider>
  );
}

export default App;
