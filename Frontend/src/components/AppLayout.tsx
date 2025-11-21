import React from 'react';
import Navigation from './Navigation';
import Hero from './Hero';
import Stats from './Stats';
import Features from './Features';
import Testimonials from './Testimonials';
import Pricing from './Pricing';    
import ContactForm from './ContactForm';
import Footer from './Footer';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      {/* <Stats /> */}
      <Features />
      {/* <Testimonials /> */}
      <Pricing />
      {/* <ContactForm /> */}
      <Footer />
    </div>
  );
};

export default AppLayout;

