import React from 'react';
import './HomeHero.css'; // Ensure the correct CSS path
import manticore_logo from '../../../images/enhanced_logo.png'; // Import the logo (adjust path as necessary)
import evrmore_logo from '../../../images/evr_logo.svg';
interface homeheroprops{
    title?: string;
    body?: React.ReactNode;
    logo?: string;
    subtitle?: string;
}

const HomeHero: React.FC<homeheroprops> = ({title="Home Hero", logo=manticore_logo, body="This is a sample hero body. Update with info.", subtitle="Asset Exchange"}) => {
  return (
    <section className="hero">
      <div className="hero-section hero-left">
        <img 
            src={logo} 
            alt={title}
            className="hero-logo" 
          />
      </div>
      <div className="hero-section hero-center">
        <div className="hero-text">
          <h1>{title}</h1>
          <h1>{subtitle}</h1>
          <p>{body}</p>
        </div>
      </div>
      <div className="hero-section hero-right">
          <img 
            src={evrmore_logo} 
            alt={title}
            className="hero-logo-right" 
          />
      </div>
    </section>
  );
};

export default HomeHero;
