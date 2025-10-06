
import React, { useState } from 'react';
import './Navbar.css';

function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollToSection = (id) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
    closeMenu(); // closes mobile menu
  }
};
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
<a href="#hero" onClick={(e) => {e.preventDefault(); scrollToSection('hero');}}>Home</a>
        <a href="#about" onClick={(e) => {e.preventDefault(); scrollToSection('about');}}>About</a>
        <a href="#features" onClick={(e) => {e.preventDefault(); scrollToSection('features');}}>Features</a>
        <a href="#contact" onClick={(e) => {e.preventDefault(); scrollToSection('contact');}}>Contact</a>
        <a href="https://wa.me/919518075994?text=hello" target="_blank" className="start-now-btn not-hover-link">
          Start now <span className="arrow"><img src={`${process.env.PUBLIC_URL}/assets/arrow.png`} alt="arrow" className='img-arrow'/></span>
        </a>
      </div>
    </div>
  );
}

export default Navbar;
