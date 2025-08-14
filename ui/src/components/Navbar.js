
import React, { useState } from 'react';
import './Navbar.css';

function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => setMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="navbar-container">
  
      <div className="logo-block">
      </div>

 
      <div className="left-line" />
      <div className="right-line" />

      <div className={`hamburger-icon ${isMobileMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

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
