import React from 'react';
import './HomeHero.css'; // Ensure the correct CSS path
import manticore_logo from '../../../images/enhanced_logo.png'; // Import the logo (adjust path as necessary)

interface homeheroprops{
    title?: string;
    body?: string;
    logo?: string;
}

const HomeHero: React.FC<homeheroprops> = ({title="Home Hero", logo=manticore_logo, body="This is a sample hero body. Update with info."}) => {
  return (
    <section className="hero">

        <img 
          src={logo} 
          alt={title}
          className="hero-logo" 
        />
        <h1>{title}</h1>
        <p>{body}</p>
    
    </section>

  );
};

export default HomeHero;
