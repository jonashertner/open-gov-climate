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
        <div
          style={{
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            minHeight: '100vh'
          }}
        >
          <Header lang={lang} setLang={setLang} />

          <main>
            <Intro />
            <Disclosures lang={lang} />
            <FOIAList lang={lang} />
            <MapSection />
            <Articles lang={lang} />
            <Contact />
          </main>

          <Footer />
        </div>
      </Router>
    </I18nProvider>
  );
}

export default App;
