
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleNavClick = (e, id) => {
    // If we are already on the home page, smoothly scroll to the section
    if (location.pathname === '/') {
      e.preventDefault();
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // Otherwise, the browser will naturally follow the href="/#id" and navigate back to the home page!
    closeMenu();
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
        <a href="/#hero" onClick={(e) => handleNavClick(e, 'hero')}>Home</a>
        <a href="/#about" onClick={(e) => handleNavClick(e, 'about')}>About</a>
        <a href="/#features" onClick={(e) => handleNavClick(e, 'features')}>Features</a>
        <a href="/#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a>
        <a href="https://wa.me/919518075994?text=hello" target="_blank" rel="noreferrer" className="start-now-btn not-hover-link">
          Start now <span className="arrow"><img src={`${process.env.PUBLIC_URL}/assets/arrow.png`} alt="arrow" className='img-arrow'/></span>
        </a>
      </div>
    </div>
  );
}

export default Navbar;
