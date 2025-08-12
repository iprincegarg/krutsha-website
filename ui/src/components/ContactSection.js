import React, { useEffect, useState } from 'react';
import './ContactSection.css';
import { Link } from 'react-router-dom';

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
        <img src="/assets/union.png" alt="Join Us" className="contact-top-image" />

        <div className="social-icons">
          <img src="/assets/link.png" alt="LinkedIn" />
          <img src="/assets/face.png" alt="Facebook" />
          <img src="/assets/insta.png" alt="Instagram" />
          <img src="/assets/youtube.png" alt="YouTube" />
          <img src="/assets/twitter.png" alt="Tumblr" />
          <img src="/assets/print.png" alt="Pinterest" />
        </div>

        {/* Scroll to top button */}
        {isVisible && (
          <button className="scroll-to-top" onClick={scrollToTop}>
            <span className="arrow-up">ᐱ</span>
          </button>
        )}
      </section>

      <footer className="footer-wrapper">
        <div className="footer">
          <div className="footer-left">
            <h2>Krutsha</h2>
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
