import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Banner from './components/Banner';
import Intro from './components/Intro';
import Disclosures from './components/Disclosures';
import FOIAList from './components/FOIAList';
import MapSection from './components/MapSection';
import Articles from './components/Articles';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { I18nProvider } from './i18n';

function App() {
  const [lang, setLang] = useState('en');
  return (
    <I18nProvider lang={lang}>
      <Router>
        <Header lang={lang} setLang={setLang} />
        <Routes>
          <Route path="/" element={
            <>
              <Banner />
              <Intro />
              <Disclosures />
              <FOIAList />
              <MapSection />
              <About />
              <Contact />
            </>
          }/>
          <Route path="/articles" element={<Articles />} />
        </Routes>
        <Footer />
      </Router>
    </I18nProvider>
  );
}

export default App;
