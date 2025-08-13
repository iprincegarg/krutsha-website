// src/components/Navbar.js
import React, { useState } from 'react';
import './Navbar.css';

function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => setMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="navbar-container">
      {/* Logo block */}
      <div className="logo-block">
        <div className="logo">
          <span style={{ color: '#5fd7a3ff' }}>K</span>
          <span style={{ color: '#ff2a00ff' }}>r</span>
          <span style={{ color: '#fee774ff' }}>u</span>
          <span style={{ color: '#3a53b9ff' }}>t</span>
          <span style={{ color: '#000000ff' }}>s</span>
          <span style={{ color: '#d70000ff' }}>h</span>
          <span style={{ color: '#5fd7a3ff' }}>a</span>
        </div>
      </div>

      {/* Lines */}
      <div className="top-line" />
      <div className="left-line" />
      <div className="right-line" />

      {/* Hamburger icon */}
      <div className={`hamburger-icon ${isMobileMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Nav links */}
      <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <a href="#hero" onClick={closeMenu}>Home</a>
        <a href="#about" onClick={closeMenu}>About</a>
<a href="#services" onClick={closeMenu}>Services</a>  
        <a href="#faq" onClick={closeMenu}>Contact</a>
        <a href="#start" className="start-now-btn not-hover-link" onClick={closeMenu}>
          Start now <span className="arrow">↗</span>
        </a>
      </div>
    </div>
  );
}

export default Navbar;
