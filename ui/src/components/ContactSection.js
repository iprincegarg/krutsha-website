import React, { useEffect, useState } from 'react';
import './ContactSection.css';
import { Link } from 'react-router-dom';
import { FaChevronUp } from "react-icons/fa";

const ContactSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <section className="join-section">
        <h1>Want To Join Us?</h1>
       <img src={`${process.env.PUBLIC_URL}/assets/Union.png`} alt="Join Us" className="contact-top-image" />


        <div className="social-icons">
    <img src={`${process.env.PUBLIC_URL}/assets/link.png`} alt="LinkedIn" />
  <img src={`${process.env.PUBLIC_URL}/assets/face.png`} alt="Facebook" />
  <img src={`${process.env.PUBLIC_URL}/assets/insta.png`} alt="Instagram" />
  <img src={`${process.env.PUBLIC_URL}/assets/youtube.png`} alt="YouTube" />
  <img src={`${process.env.PUBLIC_URL}/assets/twitter.png`} alt="Tumblr" />
  <img src={`${process.env.PUBLIC_URL}/assets/print.png`} alt="Pinterest" />
        </div>

{isVisible && (
  <button className="scroll-to-top" onClick={scrollToTop}>
    <FaChevronUp className="arrow-up" />
  </button>
)}

      </section>

     <footer className="footer-wrapper">
  <div className="footer">
    <div className="footer-left">
      {/* This will work in React AND after deploy on GitHub Pages */}
      <img 
        src={`${process.env.PUBLIC_URL}/assets/logo.png`} 
        alt="Krutsha Logo" 
        className="footer-logo" 
      />
      <p>
        Copyright © 2027 by<br />
        Krutsha, Inc. All<br />
        rights reserved.
      </p>
    </div>

          <div className="footer-right">
            <div className="footer-column">
              <h3>Contact us</h3>
              <div className="address-block">
                <p>895 palm st., 1st floor<br />San Francisco, CA15986.</p>
              </div>
              <div className="contact-block">
                <p>415-895-458<br />Mymail@gmail.com</p>
              </div>
            </div>

            <div className="footer-column">
              <h3>Account</h3>
              <p>Create account</p>
              <p>Sign in</p>
              <p>Android app</p>
            </div>

            <div className="footer-column">
              <h3>Company</h3>
              <p>About Krutsha</p>
              <p>For Business</p>
            </div>

<div className="footer-column">
  <h3>About us</h3>
  <p><Link to="/terms-of-service" className="footer-link">Terms of Service</Link></p>
  <p><Link to="/refund-policy" className="footer-link">Refund Policy</Link></p>
  <p><Link to="/privacy-policy" className="footer-link">Privacy Policy</Link></p>
</div>          </div>
        </div>
      </footer>
    </>
  );
};

export default ContactSection;
