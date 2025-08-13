// src/components/ServiceSection.js
import React from 'react';
import './ServiceSection.css';

function ServiceSection() {
  return (
    <section id="services" className="service-grid-section">
      <div className="safe-container">
        <div className="grid-container">
          {/* Block 1 - Top Left - Text */}
          <div className="grid-item text-block">
            <p className="hero-sub-text">
              To empower every student to learn independently, Turn weak areas into strengths.
            </p>

            <p className="figma-paragraph">
              <span className="highlight-green">Krutsha</span> AI Study Partner isn’t just another learning app — we’re building the future of personalized, safe, and smart learning for every student.
            </p>
          </div>

          {/* Block 2 - Top Right - Image */}
          <div className="grid-item image-block top-right-image">
            <img src={`${process.env.PUBLIC_URL}/assets/Rectangle 4.png`} alt="Top Right" />
          </div>

          {/* Block 3 - Bottom Left - Image */}
          <div className="grid-item image-block bottom-left-image">
            <img src={`${process.env.PUBLIC_URL}/assets/Rectangle 5.png`} alt="Bottom Left" />
          </div>

          {/* Block 4 - Bottom Right - Image */}
          <div className="grid-item image-block bottom-right-image">
            <img src={`${process.env.PUBLIC_URL}/assets/Rectangle 6.png`} alt="Bottom Right" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServiceSection;
