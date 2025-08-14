
import './HeroSection.css';

function HeroSection() {
  return (
      
    <section id = "hero" className="hero">
      <div className="hero-left">
    <h1>
  Smart,<br />
  <span className="no-wrap">Personalized, And</span><br />
  Always-Available<br />
  Study Support.
</h1>

       <p>
  For students, our AI Study Partner <span className="highlight">Krutsha</span> is the ultimate learning companion that provides 24x7 smart study support – helping them score better and understand faster!!
</p>

        <button className="cta-button">
  <span>Get Started Now</span>
  <span style={{ fontSize: "22px" }}>⭧</span>
</button>

      </div>
     <div className="hero-right">
  <img src={`${process.env.PUBLIC_URL}/assets/Group 1.png`} alt="Hero" />
</div>

    </section>
  );
}

export default HeroSection;
