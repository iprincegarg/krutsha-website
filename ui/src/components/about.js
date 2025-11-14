import React, { useState, useEffect } from "react";
import './about.css';

const About = () => {
const [showWebP, setShowWebP] = useState(false);

  useEffect(() => {
    setShowWebP(true);
  }, []);

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
            </strong> because they’re never alone in their learning journey. We guide them, answer their questions, and help them succeed anytime, anywhere — with grade-specific, curriculum-aligned study content tailored to their academic needs.
          </p>
        </div>

   <div className="about-main-image">
      {!showWebP && (
        <img
          src={`${process.env.PUBLIC_URL}/assets/intro.webp`}
          alt="Main Mobile App"
          width="100%"
          height="100%"
        />
      )}

      {showWebP && (
        <img
          src={`${process.env.PUBLIC_URL}/assets/intro.webp`}
          alt="Intro Animation"
          width="100%"
          height="100%"
        />
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
          <button className="start-button" onClick={()=> window.location.href = 'https://wa.me/919518075994?text=hello'}>Get Started Now ⟶</button>
        </div>
      </div>
    </section>
  );
};

export default About;
