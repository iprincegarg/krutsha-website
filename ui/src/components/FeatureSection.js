import React, { useState, useEffect } from "react";
import './FeatureSection.css';

function FeatureSection() {
  const [showWebP, setShowWebP] = useState(false);

  useEffect(() => {
    setShowWebP(true);
  }, []);
  return (
    <section id="features" className="service-grid-section">
      <div className="safe-container">
        <div className="header">
          <h1>Powerful Features for Smarter Learning</h1>
          <p className="header-subtitle">Everything you need to excel in your studies, powered by AI and designed for your success</p>
        </div>

        <div className="feature-card">
          <div className="feature-header" style={{ backgroundColor: '#BACDEC' }}>
            <div className="icon-wrapper">
        <img
          src={`${process.env.PUBLIC_URL}/assets/notes.png`}
          alt="notes"
          width="100%"
          height="100%"
        />
            </div>
            <div className="feature-title">
              <h2>Notes</h2>
              <p>Get instant access to comprehensive, well-organized study notes for any chapter or topic.</p>
            </div>
          </div>

  <div className="feature-top">
        <div className="feature-text">
          <ul>  
            <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark"/>
            <strong>
              Well organized by class, subject, & chapter.
            </strong></li>
              <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark"/>
            <strong>
              Comprehensive coverage of the entire curriculum for quick revision.
            </strong></li>
            <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark"/>
            <strong>
              Accessible 24/7, whenever you need them.
            </strong></li>
              <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark"/>
            <strong>
              Designed for effective learning with clear structure & formatting.
            </strong></li>
              <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark"/>
            <strong>
              Save hours of preparation with concise and focused notes.
            </strong></li>
              <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark"/>
            <strong>
              Trusted by students for fast revision before exams.
            </strong></li>
          </ul>
        </div>

   <div className="feature-main-image">
      {!showWebP && (
        <img
          src={`${process.env.PUBLIC_URL}/assets/intro.webp`}
          alt="notes"
          width="100%"
          height="100%"
        />
      )}

      {showWebP && (
        <img
          src={`${process.env.PUBLIC_URL}/assets/intro.webp`}
          alt="notes"
          width="100%"
          height="100%"
        />
      )}
    </div>
      </div>
        </div>
<br/>
     <div className="feature-card">
          <div className="feature-header" style={{ backgroundColor: '#FED05C' }}>
            <div className="icon-wrapper">
        <img
          src={`${process.env.PUBLIC_URL}/assets/skimcard.png`}
          alt="skimcards"
          width="100%"
          height="100%"
        />
            </div>
            <div className="feature-title">
              <h2>Skimcards</h2>
              <p>Master concepts faster with skimcards designed for active recall and effective learning.</p>
            </div>
          </div>

  <div className="feature-top">
        <div className="feature-text">
          <ul>  
            <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark"/>
            <strong>
              Bite-sized cards, big learning impact.
            </strong></li>
              <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark"/>
            <strong>
              Easy to learn, easy to remember.
            </strong></li>
            <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark"/>
            <strong>
              Accessible 24/7, whenever you need them.
            </strong></li>
              <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark"/>
            <strong>
              Designed for effective learning with clear structure & formatting.
            </strong></li>
              <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark"/>
            <strong>
              Perfect for power-packed study breaks.
            </strong></li>
              <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark"/>
            <strong>
              Trusted by students for fast revision before exams.
            </strong></li>
          </ul>
        </div>

   <div className="feature-main-image">
      {!showWebP && (
        <img
          src={`${process.env.PUBLIC_URL}/assets/intro.webp`}
          alt="notes"
          width="100%"
          height="100%"
        />
      )}

      {showWebP && (
        <img
          src={`${process.env.PUBLIC_URL}/assets/intro.webp`}
          alt="notes"
          width="100%"
          height="100%"
        />
      )}
    </div>
      </div>
        </div>
        <br/>
         <div className="feature-card">
          <div className="feature-header" style={{ backgroundColor: '#FBBCCE' }}>
            <div className="icon-wrapper">
        <img
          src={`${process.env.PUBLIC_URL}/assets/qna.png`}
          alt="questions and answers"
          width="100%"
          height="100%"
        />
            </div>
            <div className="feature-title">
              <h2>Ask Questions & Get Answers</h2>
              <p>Simple language, smart mnemonics, curriculum depth and exam-ready answers — all in one place.</p>
            </div>
          </div>

  <div className="feature-top">
        <div className="feature-text">
          <ul>  
            <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark"/>
            <strong>
             Simple, easy-to-understand explanations for every query.
            </strong></li>
              <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark"/>
            <strong>
              Smart mnemonics & memory tricks to retain key concepts effortlessly.
            </strong></li>
            <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark"/>
            <strong>
              Accessible 24/7, whenever you need them.
            </strong></li>
              <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark"/>
            <strong>
              Designed for effective learning with clear structure & formatting.
            </strong></li>
              <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark"/>
            <strong>
              Relatable everyday examples to make learning intuitive and fun.
            </strong></li>
              <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark"/>
            <strong>
              Trusted by students for fast revision before exams.
            </strong></li>
          </ul>
        </div>

   <div className="feature-main-image">
      {!showWebP && (
        <img
          src={`${process.env.PUBLIC_URL}/assets/intro.webp`}
          alt="notes"
          width="100%"
          height="100%"
        />
      )}

      {showWebP && (
        <img
          src={`${process.env.PUBLIC_URL}/assets/intro.webp`}
          alt="notes"
          width="100%"
          height="100%"
        />
      )}
    </div>
      </div>
        </div>
      </div>
    
    </section>
  );
}

export default FeatureSection;