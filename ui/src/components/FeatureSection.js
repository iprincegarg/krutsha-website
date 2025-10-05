
import React from 'react';
import './FeatureSection.css';

function FeatureSection() {
  return (
    <section id="features" className="service-grid-section">
      <div className="safe-container">
        <div className="grid-container">
     
          <div className="grid-item text-block">
            <p className="hero-sub-text">
              To empower every student to learn independently, Turn weak areas into strengths.
            </p>

            <p className="figma-paragraph">
              <span className="highlight-green">Krutsha</span> AI Study Partner isn’t just another learning app — we’re building the future of personalized, safe, and smart learning for every student.
            </p>
          </div>

          
          <div className="grid-item image-block top-right-image">
            <img src={`${process.env.PUBLIC_URL}/assets/Rectangle 4.png`} alt="Top Right" />
          </div>

         
          <div className="grid-item image-block bottom-left-image">
            <img src={`${process.env.PUBLIC_URL}/assets/Rectangle 5.png`} alt="Bottom Left" />
          </div>

          
          <div className="grid-item image-block bottom-right-image">
            <img src={`${process.env.PUBLIC_URL}/assets/Rectangle 6.png`} alt="Bottom Right" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;
