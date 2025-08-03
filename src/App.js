import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
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
  return (
    <I18nProvider>
      <Router>
        <Header />
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
  );
}

export default App;
