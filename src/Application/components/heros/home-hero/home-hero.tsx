import React, { useEffect, useRef, useState } from 'react';
import './home-hero.css';
import { TypeAnimation } from 'react-type-animation';
import { motion, useAnimation } from 'framer-motion';
import manticore_logo from '@/Application/logos/white-manticore.png';
import evrmore_logo from '@/Application/logos/evr.svg';
import { FaChevronDown } from 'react-icons/fa';

interface HomeHeroProps {
  title?: string;
  body?: React.ReactNode;
  logo?: string;
  authButton?: React.ReactNode;
  subtitle?: React.ReactNode;
}

/**
 * Hero component for the home page with epic space theme
 */
const HomeHero: React.FC<HomeHeroProps> = ({
  title = "Manticore",
  logo = manticore_logo,
  body = "Your premier destination for trading digital assets on the Evrmore blockchain.",
  subtitle,
  authButton
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Smooth scroll to the next section
  const scrollToNextSection = () => {
    const heroHeight = heroRef.current?.clientHeight || 0;
    
    window.scrollTo({
      top: heroHeight,
      behavior: 'smooth'
    });
  };
  
  // Setup animations and visibility on mount
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Setup optimized space elements if animations are allowed
    if (!prefersReducedMotion) {
      // Fade in the hero content
      setIsVisible(true);
      
      // Create space elements
      createSpaceElements();
    } else {
      // Immediately set visible without animations for reduced motion
      setIsVisible(true);
    }
    
    return () => {
      // Clean up any animations or event listeners here
      const decorations = document.querySelectorAll('.space-decoration');
      decorations.forEach(el => el.remove());
    };
  }, []);
  
  // Create all space elements
  const createSpaceElements = () => {
    if (!heroRef.current) return;
    
    // Create fragment to minimize DOM operations
    const fragment = document.createDocumentFragment();
    
    // Add star field
    createStarField(fragment);
    
    // Add nebulas
    createNebulas(fragment);
    
    // Add shooting stars
    createShootingStars(fragment);
    
    // Add planets with rings
    createPlanets(fragment);
    
    // Add satellites
    createSatellites(fragment);
    
    // Add asteroid field
    createAsteroids(fragment);
    
    // Add rockets
    createRockets(fragment);
    
    // Append all elements at once
    heroRef.current.appendChild(fragment);
  };
  
  // Create star field with layers for parallax effect
  const createStarField = (parent: DocumentFragment) => {
    const starField = document.createElement('div');
    starField.className = 'star-field space-decoration';
    
    const starLayerCount = 3;
    for (let layerIndex = 1; layerIndex <= starLayerCount; layerIndex++) {
      const layer = document.createElement('div');
      layer.className = `star-layer-${layerIndex}`;
      
      // Generate stars - fewer on mobile for performance
      const starCount = window.innerWidth < 768 ? 15 : 40;
      
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        
        // Random size class
        const sizeClass = Math.random();
        if (sizeClass < 0.5) {
          star.className = 'star tiny';
        } else if (sizeClass < 0.8) {
          star.className = 'star small';
        } else if (sizeClass < 0.95) {
          star.className = 'star medium';
        } else {
          star.className = 'star large';
        }
        
        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Random animation delay
        star.style.animationDelay = `${Math.random() * 5}s`;
        
        layer.appendChild(star);
      }
      
      starField.appendChild(layer);
    }
    
    parent.appendChild(starField);
  };
  
  // Create nebulas - colorful cosmic clouds
  const createNebulas = (parent: DocumentFragment) => {
    const nebulas = [
      { className: 'nebula-purple', top: '10%', right: '20%', width: '400px', height: '400px' },
      { className: 'nebula-blue', bottom: '15%', left: '15%', width: '350px', height: '350px' },
      { className: 'nebula-pink', top: '40%', left: '25%', width: '250px', height: '250px' },
      { className: 'nebula-purple', bottom: '30%', right: '25%', width: '300px', height: '300px' }
    ];
    
    nebulas.forEach((nebula, index) => {
      const nebulaElement = document.createElement('div');
      nebulaElement.className = `space-nebula ${nebula.className} nebula-${index + 1} space-decoration`;
      
      // Apply positioning and size
      if (nebula.top) nebulaElement.style.top = nebula.top;
      if (nebula.bottom) nebulaElement.style.bottom = nebula.bottom;
      if (nebula.left) nebulaElement.style.left = nebula.left;
      if (nebula.right) nebulaElement.style.right = nebula.right;
      
      nebulaElement.style.width = nebula.width;
      nebulaElement.style.height = nebula.height;
      
      // Add animation delay
      nebulaElement.style.animationDelay = `${index * 2}s`;
      
      parent.appendChild(nebulaElement);
    });
  };
  
  // Create shooting stars
  const createShootingStars = (parent: DocumentFragment) => {
    // Create 6 shooting stars at different positions with different delays for better visibility
    const positions = [
      { top: '10%', left: '10%', delay: '0s', rotate: '35deg' },
      { top: '25%', left: '25%', delay: '3s', rotate: '45deg' },
      { top: '40%', left: '15%', delay: '6s', rotate: '55deg' },
      { top: '60%', left: '5%', delay: '9s', rotate: '40deg' },
      { top: '15%', left: '45%', delay: '12s', rotate: '60deg' },
      { top: '75%', left: '30%', delay: '15s', rotate: '30deg' }
    ];
    
    positions.forEach((pos, index) => {
      const shootingStar = document.createElement('div');
      shootingStar.className = `shooting-star space-decoration`;
      
      // Position
      shootingStar.style.top = pos.top;
      shootingStar.style.left = pos.left;
      
      // Rotation
      shootingStar.style.transform = `rotate(${pos.rotate})`;
      
      // Animation delay
      shootingStar.style.animationDelay = pos.delay;
      
      // Add afterglow effect
      const afterglow = document.createElement('div');
      afterglow.className = 'shooting-star-afterglow';
      shootingStar.appendChild(afterglow);
      
      parent.appendChild(shootingStar);
    });
  };
  
  // Create planets with rings
  const createPlanets = (parent: DocumentFragment) => {
    // Planet 1 - large purple
    const planet1 = document.createElement('div');
    planet1.className = 'planet planet-1 space-decoration';
    planet1.style.top = '15%';
    planet1.style.right = '12%';
    
    // Add ring to planet 1
    const ring1 = document.createElement('div');
    ring1.className = 'planet-ring';
    planet1.appendChild(ring1);
    
    parent.appendChild(planet1);
    
    // Planet 2 - medium blue
    const planet2 = document.createElement('div');
    planet2.className = 'planet planet-2 space-decoration';
    planet2.style.bottom = '20%';
    planet2.style.left = '15%';
    
    parent.appendChild(planet2);
    
    // Planet 3 - small pink
    const planet3 = document.createElement('div');
    planet3.className = 'planet planet-3 space-decoration';
    planet3.style.top = '60%';
    planet3.style.right = '20%';
    
    // Add ring to planet 3
    const ring3 = document.createElement('div');
    ring3.className = 'planet-ring';
    planet3.appendChild(ring3);
    
    parent.appendChild(planet3);
  };
  
  // Create satellites
  const createSatellites = (parent: DocumentFragment) => {
    // Satellite 1
    const satellite1 = document.createElement('div');
    satellite1.className = 'satellite satellite-1 space-decoration';
    satellite1.style.top = '25%';
    satellite1.style.left = '25%';
    
    const body1 = document.createElement('div');
    body1.className = 'satellite-body';
    
    const panelLeft1 = document.createElement('div');
    panelLeft1.className = 'satellite-panel-left';
    
    const panelRight1 = document.createElement('div');
    panelRight1.className = 'satellite-panel-right';
    
    satellite1.appendChild(body1);
    satellite1.appendChild(panelLeft1);
    satellite1.appendChild(panelRight1);
    
    parent.appendChild(satellite1);
    
    // Satellite 2
    const satellite2 = document.createElement('div');
    satellite2.className = 'satellite satellite-2 space-decoration';
    satellite2.style.bottom = '20%';
    satellite2.style.right = '15%';
    
    const body2 = document.createElement('div');
    body2.className = 'satellite-body';
    
    const panelLeft2 = document.createElement('div');
    panelLeft2.className = 'satellite-panel-left';
    
    const panelRight2 = document.createElement('div');
    panelRight2.className = 'satellite-panel-right';
    
    satellite2.appendChild(body2);
    satellite2.appendChild(panelLeft2);
    satellite2.appendChild(panelRight2);
    
    parent.appendChild(satellite2);
  };
  
  // Create asteroid field
  const createAsteroids = (parent: DocumentFragment) => {
    const positions = [
      { top: '30%', left: '80%', size: '10px', delay: '0s' },
      { top: '70%', left: '60%', size: '15px', delay: '5s' },
      { top: '40%', left: '10%', size: '12px', delay: '10s' },
      { top: '80%', left: '30%', size: '8px', delay: '15s' },
      { top: '20%', left: '40%', size: '14px', delay: '2s' }
    ];
    
    positions.forEach((pos, index) => {
      const asteroid = document.createElement('div');
      asteroid.className = `asteroid asteroid-${index + 1} space-decoration`;
      
      // Position
      asteroid.style.top = pos.top;
      asteroid.style.left = pos.left;
      
      // Size
      asteroid.style.width = pos.size;
      asteroid.style.height = `${parseInt(pos.size) * 0.8}px`;
      
      // Animation delay
      asteroid.style.animationDelay = pos.delay;
      
      parent.appendChild(asteroid);
    });
  };
  
  // Create rockets
  const createRockets = (parent: DocumentFragment) => {
    // Create multiple rockets for better visibility
    const positions = [
      { bottom: '-50px', left: '30%', delay: '0s' },
      { bottom: '-80px', left: '60%', delay: '8s' },
      { bottom: '-30px', left: '10%', delay: '16s' }
    ];
    
    positions.forEach((pos, index) => {
      const rocket = document.createElement('div');
      rocket.className = `rocket rocket-${index + 1} space-decoration`;
      
      // Position
      rocket.style.bottom = pos.bottom;
      rocket.style.left = pos.left;
      
      // Animation delay
      rocket.style.animationDelay = pos.delay;
      
      // Create rocket parts
      const rocketBody = document.createElement('div');
      rocketBody.className = 'rocket-body';
      
      const rocketHead = document.createElement('div');
      rocketHead.className = 'rocket-head';
      
      const rocketWindow = document.createElement('div');
      rocketWindow.className = 'rocket-window';
      
      const rocketFinLeft = document.createElement('div');
      rocketFinLeft.className = 'rocket-fin-left';
      
      const rocketFinRight = document.createElement('div');
      rocketFinRight.className = 'rocket-fin-right';
      
      const rocketExhaust = document.createElement('div');
      rocketExhaust.className = 'rocket-exhaust';
      
      // Assemble rocket - order matters for z-index
      rocket.appendChild(rocketExhaust); // Exhaust at the bottom layer
      rocket.appendChild(rocketFinLeft);
      rocket.appendChild(rocketFinRight);
      rocket.appendChild(rocketBody); // Body above fins but below window
      rocket.appendChild(rocketHead);
      rocket.appendChild(rocketWindow); // Window at the top layer
      
      parent.appendChild(rocket);
    });
  };
  
  // Check if subtitle is a DOM element with type animation
  const hasTypeAnimation = React.isValidElement(subtitle) && 
    subtitle.props.className && 
    subtitle.props.className.includes('type-animation');
  
  return (
    <div className="hero hero-section cosmic-purple" ref={heroRef}>
      <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
        <div className="hero-center">
          <img src={logo} alt="Logo" className="hero-logo" />
          <div className="hero-text">
            <h1 className="hero-title cosmic-purple">{title}</h1>
            {hasTypeAnimation ? (
              subtitle
            ) : (
              <div className="type-animation-wrapper">
                <TypeAnimation
                  sequence={[
                    'Discover Digital Assets',
                    2000,
                    'Trade on Evrmore',
                    2000,
                    'Collect Rare Items',
                    2000,
                    'Build Your Portfolio',
                    2000
                  ]}
                  wrapper="div"
                  cursor={true}
                  repeat={Infinity}
                  className="type-animation"
                />
              </div>
            )}
            <p className="hero-body cosmic-purple">{body}</p>
            {authButton && <div className="hero-auth">{authButton}</div>}
          </div>
        </div>
        <div className="scroll-down-arrow" onClick={scrollToNextSection}>
          <span><FaChevronDown /></span>
        </div>
      </div>
    </div>
  );
};

export default HomeHero; 