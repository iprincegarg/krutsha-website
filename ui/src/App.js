import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import ContactSection from './components/ContactSection';
import HeroSection from './components/HeroSection';
import FeatureSection from './components/FeatureSection';
import About from './components/about';
import FAQSection from './components/FAQSection';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/header';
import TermsOfService from './pages/TermsOfService';
import RefundPolicy from './pages/RefundPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import UserRegistration from './pages/UserRegistration';

function App() {
  return (
    <Router>
      <ScrollToTop />



      <Routes>

        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Header />
              <HeroSection />
              <About />
              <FeatureSection />
              <FAQSection />
              <ContactSection />
            </>
          }
        />

        {/* Separate Full Page Routes */}
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path='/user-registration' element={<UserRegistration />} />
      </Routes>
    </Router>
  );
}

export default App;
