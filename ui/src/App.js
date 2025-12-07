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
import RefundPolicy from './pages/RefundPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import UserRegistration from './pages/UserRegistration';
import TermsAndConditions  from "./pages/TermsAndConditions";
import AnswerPreview from './pages/AnswerPreview.js';
import Notes from './pages/notes/index.jsx';
import Skimcards from './pages/skimcards/index.jsx';

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
        <Route path='/user-registration' element={<UserRegistration />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path='/answer-preview' element={<AnswerPreview />} />
        <Route path='/notes' element={<Notes />} />
        <Route path='/skimcards' element={<Skimcards />} />
      </Routes>
    </Router>
  );
}

export default App;
