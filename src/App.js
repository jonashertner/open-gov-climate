import React, { useState } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import Intro from './components/Intro';
import Disclosures from './components/Disclosures';
import FOIAList from './components/FOIAList';
import MapSection from './components/MapSection';
import Articles from './components/Articles';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { I18nProvider } from './i18n';

function App() {
  const [lang, setLang] = useState('en');
  const bgUrl = process.env.PUBLIC_URL + '/relief_switzerland_minimalist.png';

  return (
    <div
      style={{
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <I18nProvider lang={lang}>
        <Router>
          <Header lang={lang} setLang={setLang} />
          <main>
            <Intro />
            <Disclosures />
            <FOIAList />
            <MapSection />
            <Articles />
            <Contact />
          </main>
          <Footer />
        </Router>
      </I18nProvider>
    </div>
  );
}

export default App;
