import React from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import Intro from './components/Intro';
import Disclosures from './components/Disclosures';
import FOIAList from './components/FOIAList';
import MapSection from './components/MapSection';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Header />
      <Banner />
      <Intro />
      <Disclosures />
      <FOIAList />
      <MapSection />
      <About />
      <Contact />
      <Footer />
    </>
  );
}

export default App;
