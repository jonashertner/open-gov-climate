import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Intro from './components/Intro';
import FOIAList from './components/FOIAList';
import FOIADetail from './components/FOIADetail';
import MapSection from './components/MapSection';
import Articles from './components/Articles';
import ArticleDetail from './components/ArticleDetail';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { I18nProvider } from './i18n';
import './styles/global.css';

function App() {
  const [lang, setLang] = useState('en');

  return (
    <I18nProvider lang={lang}>
      <Router>
        <div className="app-wrapper">
          <a href="#main-content" className="skip-link">Skip to content</a>
          <Header lang={lang} setLang={setLang} />

          <main id="main-content">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Intro />
                    <FOIAList lang={lang} />
                    <MapSection lang={lang} />
                    <Articles lang={lang} />
                    <Contact />
                  </>
                }
              />

              <Route path="/foia" element={<FOIAList lang={lang} />} />
              <Route path="/foia/:id" element={<FOIADetail lang={lang} />} />

              <Route path="/articles" element={<Articles lang={lang} />} />
              <Route path="/articles/:id" element={<ArticleDetail lang={lang} />} />

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
