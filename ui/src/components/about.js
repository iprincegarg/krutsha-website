import React, { useState } from 'react';
import './about.css';

const About = () => {
  const [showVideo, setShowVideo] = useState(false);

  const handlePlayClick = () => {
    setShowVideo(true);
  };

  const handleClose = () => {
    setShowVideo(false);
  };

  return (
    <section id="about" className="about-section">
      <div className="left-line"></div>
      <div className="right-line"></div>

      <div className="about-top">
        <div className="about-text">
          <h2>What is Krutsha AI?</h2>
          <p>
            <strong>
              Krutsha Your 24x7 Smart Study Partner — Helping Student Learn Better, Score Higher, and Never Feel Stuck —
            </strong>
            because they’re never alone in their learning journey. We guide them, answer their questions, and help them succeed anytime, anywhere — with grade-specific, curriculum-aligned study content tailored to their academic needs.
          </p>
        </div>

        <div className="about-main-image">
          {!showVideo && (
            <>
              <img src={`${process.env.PUBLIC_URL}/assets/about1.png`} alt="Main Mobile App" />
              <div className="play-button" onClick={handlePlayClick}>▶</div>
            </>
          )}

          {showVideo && (
            <>
              <span className="close-button" onClick={handleClose}>×</span>
              <video controls autoPlay width="100%" height="100%">
                <source src={`${process.env.PUBLIC_URL}/assets/intro.mp4`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </>
          )}
        </div>
      </div>

      <div className="about-bottom">
        <div className="bottom-images">
          <img src={`${process.env.PUBLIC_URL}/assets/01.jpg`} alt="Chat 1" />
          <img src={`${process.env.PUBLIC_URL}/assets/02.jpg`} alt="Chat 2" />
          <img src={`${process.env.PUBLIC_URL}/assets/03.jpg`} alt="Chat 3" />
        </div>
        <div className="bottom-text">
          <p>
            Get instant notes, flashcards for any chapter. <br />
            Get immediate answers to your academic questions. <br />
            We aim to enhance learning and provide tailored support, allowing you to focus on understanding and retaining information.
          </p>
          <button className="start-button">Get Started Now ⟶</button>
        </div>
      </div>
    </section>
  );
};

export default About;
