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
                alt="learn"
                width="100%"
                height="100%"
              />
            </div>
            <div className="feature-title">
              <h2>Learn</h2>
              <p>Master your curriculum with comprehensive notes, skimcards, formulas, and Q&A.</p>
            </div>
          </div>

          <div className="feature-top">
            <div className="feature-text">
              <ul>
                <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark" />
                  <strong>
                    Comprehensive notes organized by class, subject, & chapter.
                  </strong></li>
                <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark" />
                  <strong>
                    Bite-sized skimcards for fast and effective active recall.
                  </strong></li>
                <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark" />
                  <strong>
                    Essential formulas highlighted for quick reference and memorization.
                  </strong></li>
                <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark" />
                  <strong>
                    Interactive Q&A for simple, easy-to-understand explanations.
                  </strong></li>
                <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark" />
                  <strong>
                    Accessible 24/7, designed for clear structure & formatting.
                  </strong></li>
                <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark" />
                  <strong>
                    Save hours of preparation with concise, focused materials.
                  </strong></li>
              </ul>
            </div>

            <div className="feature-main-image">
              <video
                src={`${process.env.PUBLIC_URL}/assets/Learn.mp4`}
                width="100%"
                height="100%"
                autoPlay
                loop
                muted
                playsInline
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
        <br />
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
              <p>Simple language, smart mnemonics, curriculum depth and exam-ready answers - all in one place.</p>
            </div>
          </div>

          <div className="feature-top">
            <div className="feature-text">
              <ul>
                <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark" />
                  <strong>
                    Simple, easy-to-understand explanations for every query.
                  </strong></li>
                <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark" />
                  <strong>
                    Smart mnemonics & memory tricks to retain key concepts effortlessly.
                  </strong></li>
                <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark" />
                  <strong>
                    Accessible 24/7, whenever you need them.
                  </strong></li>
                <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark" />
                  <strong>
                    Designed for effective learning with clear structure & formatting.
                  </strong></li>
                <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark" />
                  <strong>
                    Relatable everyday examples to make learning intuitive and fun.
                  </strong></li>
                <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark" />
                  <strong>
                    Trusted by students for fast revision before exams.
                  </strong></li>
              </ul>
            </div>

            <div className="feature-main-image">
              <video
                src={`${process.env.PUBLIC_URL}/assets/Ai chat.mp4`}
                width="100%"
                height="100%"
                autoPlay
                loop
                muted
                playsInline
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        <br />
        <div className="feature-card">
          <div className="feature-header" style={{ backgroundColor: '#AEECEF' }}>
            <div className="icon-wrapper">
              <img
                src={`${process.env.PUBLIC_URL}/assets/qna.png`}
                alt="practice"
                width="100%"
                height="100%"
              />
            </div>
            <div className="feature-title">
              <h2>Practice</h2>
              <p>Test your knowledge with interactive quiz and track your mastery.</p>
            </div>
          </div>

          <div className="feature-top">
            <div className="feature-text">
              <ul>
                <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark" />
                  <strong>
                    Chapter-wise practice sets tailored to your syllabus.
                  </strong></li>
                <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark" />
                  <strong>
                    Instant feedback to correct mistakes in real-time.
                  </strong></li>
                <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark" />
                  <strong>
                    AI-Powered Analysis to identify your weak areas to focus your efforts.
                  </strong></li>
                <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark" />
                  <strong>
                    Gamified experience to make practicing fun and engaging.
                  </strong></li>
                <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark" />
                  <strong>
                    Track your progress over time with detailed analytics.
                  </strong></li>
                <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark" />
                  <strong>
                    Always aligned with your latest curriculum requirements.
                  </strong></li>
              </ul>
            </div>

            <div className="feature-main-image">
              <video
                src={`${process.env.PUBLIC_URL}/assets/Practice.mp4`}
                width="100%"
                height="100%"
                autoPlay
                loop
                muted
                playsInline
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        <br />
        <div className="feature-card">
          <div className="feature-header" style={{ backgroundColor: '#E6C2FA' }}>
            <div className="icon-wrapper">
              <img
                src={`${process.env.PUBLIC_URL}/assets/notes.png`}
                alt="revise"
                width="100%"
                height="100%"
              />
            </div>
            <div className="feature-title">
              <h2>Revise</h2>
              <p>Consolidate your learning with smart revision before your exams.</p>
            </div>
          </div>

          <div className="feature-top">
            <div className="feature-text">
              <ul>
                <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark" />
                  <strong>
                    Automated revision schedules based on your personal progress.
                  </strong></li>
                <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark" />
                  <strong>
                    High-yield topics highlighted for quick and efficient review.
                  </strong></li>
                <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark" />
                  <strong>
                    Visual summaries and concept maps for better retention.
                  </strong></li>
                <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark" />
                  <strong>
                    Flashcard integration to actively test your memory.
                  </strong></li>
                <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark" />
                  <strong>
                    Confidence-building mock tests that simulate exam-ready questions.
                  </strong></li>
                <li><img src={`${process.env.PUBLIC_URL}/assets/checkmark.png`} alt="checkmark" className="checkmark" />
                  <strong>
                    Everything you need to walk into your exams fully prepared.
                  </strong></li>
              </ul>
            </div>

            <div className="feature-main-image">
              <video
                src={`${process.env.PUBLIC_URL}/assets/Revise.mp4`}
                width="100%"
                height="100%"
                autoPlay
                loop
                muted
                playsInline
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;