import React from "react";
import './about.css';

const About = () => {

  return (
    <section id="about" className="about-section">
      <div className="left-line"></div>
      <div className="right-line"></div>

      <div className="about-top">
        <div className="about-text">
          <h2>What is Krutsha AI?</h2>
          <p>
            <strong>
              Krutsha Your 24x7 Smart Study Partner - Helping Student Learn Better, Score Higher, and Never Feel Stuck.
            </strong> You are not judged by anyone and get full personalised support in your learning journey. We guide you, answer your questions, and help you succeed with grade-specific, curriculum-aligned study content specially curated to your academic needs.
          </p>
        </div>

        <div className="about-main-image">
          <video
            src={`${process.env.PUBLIC_URL}/assets/dashboard.mp4`}
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
    </section>
  );
};

export default About;
