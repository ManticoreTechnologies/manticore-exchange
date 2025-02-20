import React from 'react';
import './home-hero.css';
import { TypeAnimation } from 'react-type-animation';
import manticore_logo from '@/Application/logos/white-manticore.png';
import evrmore_logo from '@/Application/logos/evr.svg';
import HeroContent from './content';

interface homeheroprops {
  title?: string;
  body?: React.ReactNode;
  logo?: string;
  authButton?: React.ReactNode;
  subtitle?: React.ReactNode;
}

const HomeHero: React.FC<homeheroprops> = ({
  title = "Home Hero",
  logo = manticore_logo,
  body = "This is a sample hero body. Update with info.",
  subtitle,
  authButton
}) => {
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
        <HeroContent 
          title={title} 
          subtitle={
            <TypeAnimation
              sequence={[
                'EVRything Decentralized',
                2000,
                'EVRmore Secure',
                2000,
                'Trade EVRything',
                2000,
                'Create EVRything',
                2000,
                'Own EVRything',
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="type-animation"
            />
          } 
          body={body} 
        />
        {authButton}
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
