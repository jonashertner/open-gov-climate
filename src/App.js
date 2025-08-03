import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Intro from './components/Intro';
import Disclosures from './components/Disclosures';
import FOIAList from './components/FOIAList';
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
        {/* Site header with language switcher */}
        <Header lang={lang} setLang={setLang} />

        {/* Background wrapper (optional)—remove if handled in CSS */}
        <div
          style={{
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            minHeight: '100vh'
          }}
        >
          {/* Main routing */}
          <Routes>
            {/* Home page: FOIA, map, article summaries, etc */}
            <Route
              path="/"
              element={
                <main>
                  <Intro />
                  <Disclosures />
                  <FOIAList />
                  <MapSection />
                  <Articles lang={lang} />
                  <Contact />
                </main>
              }
            />

            {/* Articles list (if you want a dedicated /articles page) */}
            <Route
              path="/articles"
              element={<Articles lang={lang} />}
            />

            {/* Single article detail */}
            <Route
              path="/articles/:id"
              element={<ArticleDetail lang={lang} />}
            />
          </Routes>

          {/* Global footer */}
          <Footer />
        </div>
      </Router>
    </I18nProvider>
  );
}

export default App;
