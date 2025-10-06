
import './HeroSection.css';

function HeroSection() {
  return (

    <section id="hero" className="hero">
      <div className="hero-left">
        <h1>
          Smart,<br />
          <span className="no-wrap">Personalized, &</span><br />
          Always-Available<br />
          Study Partner.
        </h1>

        <p>
          I'm <span className="highlight">Krutsha AI</span>. Your 24x7 academic study partner. I make learning fun, engaged, & way more effective.
        </p>

        <button className="cta-button" onClick={() => window.open('https://wa.me/919518075994?text=hello', '_blank')}>
          <span>Get Started Now</span>
          <span><img src={`${process.env.PUBLIC_URL}/assets/arrow.png`} alt="arrow" className='img-arrow'/></span>
        </button>

      </div>
      <div className="hero-right">
        <img src={`${process.env.PUBLIC_URL}/assets/Group 1.png`} alt="Hero" />
      </div>

    </section>
  );
}

export default HeroSection;
