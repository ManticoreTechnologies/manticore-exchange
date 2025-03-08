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

const HomeHero: React.FC<HomeHeroProps> = ({
  title = "Manticore",
  logo = manticore_logo,
  body = "Your premier destination for trading digital assets on the Evrmore blockchain.",
  subtitle,
  authButton
}) => {
  const heroRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollArrowControls = useAnimation();
  
  // Function to scroll down to the next section
  const scrollToNextSection = () => {
    if (heroRef.current) {
      const heroHeight = heroRef.current.offsetHeight;
      window.scrollTo({
        top: heroHeight,
        behavior: 'smooth'
      });
    }
  };

  // Track scroll position to hide arrow when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Animate arrow when hero is visible
  useEffect(() => {
    if (!isScrolled) {
      scrollArrowControls.start({
        y: [0, 10, 0],
        transition: {
          duration: 2,
          repeat: Infinity,
          repeatType: 'loop'
        }
      });
    } else {
      scrollArrowControls.stop();
    }
  }, [isScrolled, scrollArrowControls]);

  // Create cosmic decorations when component mounts
  useEffect(() => {
    createCosmicDecorations();
    
    // Clean up function to remove elements when component unmounts
    return () => {
      if (heroRef.current) {
        const cosmicGrid = heroRef.current.querySelector('.hero-cosmic-grid');
        const cosmicObjects = heroRef.current.querySelectorAll('.cosmic-object');
        const circuits = heroRef.current.querySelectorAll('.hero-circuit');
        const dataLines = heroRef.current.querySelectorAll('.data-flow-line');
        
        if (cosmicGrid && heroRef.current) heroRef.current.removeChild(cosmicGrid);
        cosmicObjects.forEach(obj => {
          if (obj.parentNode === heroRef.current && heroRef.current) {
            heroRef.current.removeChild(obj);
          }
        });
        circuits.forEach(circuit => {
          if (circuit.parentNode === heroRef.current && heroRef.current) {
            heroRef.current.removeChild(circuit);
          }
        });
        dataLines.forEach(line => {
          if (line.parentNode === heroRef.current && heroRef.current) {
            heroRef.current.removeChild(line);
          }
        });
      }
    };
  }, []);

  // Function to create all cosmic decorations
  const createCosmicDecorations = () => {
    if (!heroRef.current) return;
    
    // Add cosmic grid
    const cosmicGrid = document.createElement('div');
    cosmicGrid.className = 'hero-cosmic-grid';
    heroRef.current.appendChild(cosmicGrid);
    
    // Add cosmic objects
    const objects = [
      { className: 'cosmic-object purple' },
      { className: 'cosmic-object blue' },
      { className: 'cosmic-object pink' }
    ];
    
    objects.forEach(obj => {
      const element = document.createElement('div');
      element.className = obj.className;
      heroRef.current?.appendChild(element);
    });
    
    // Add circuit decorations
    const leftCircuit = document.createElement('div');
    leftCircuit.className = 'hero-circuit left';
    heroRef.current.appendChild(leftCircuit);
    
    const rightCircuit = document.createElement('div');
    rightCircuit.className = 'hero-circuit right';
    heroRef.current.appendChild(rightCircuit);
    
    // Add data flow lines
    for (let i = 0; i < 3; i++) {
      const dataLine = document.createElement('div');
      dataLine.className = `data-flow-line`;
      heroRef.current.appendChild(dataLine);
    }
  };

  return (
    <section ref={heroRef} className="hero cosmic-purple">
      <div className="hero-content cosmic-purple">
        <h1 className="hero-title cosmic-purple">{title}</h1>
        
        {/* Animated typing effect */}
        <div className="type-animation-container">
          <TypeAnimation
            sequence={[
              'Trade Digital Assets',
              2000,
              'Collect Rare NFTs',
              2000,
              'Build Your Portfolio',
              2000,
              'Explore The Evrmore Universe',
              2000
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            className="type-animation cosmic-purple"
          />
        </div>
        
        {/* Subtitle if provided */}
        {subtitle && <div className="hero-subtitle">{subtitle}</div>}
        
        {/* Main description */}
        <div className="hero-body cosmic-purple">{body}</div>
        
        {/* Auth button if provided */}
        {authButton && (
          <div className="hero-cta">
            {React.cloneElement(authButton as React.ReactElement, {
              className: 'hero-button cosmic-purple'
            })}
          </div>
        )}
        
        {/* Scroll down indicator */}
        <motion.div 
          className="scroll-down-arrow"
          animate={scrollArrowControls}
          onClick={scrollToNextSection}
          style={{ opacity: isScrolled ? 0 : 1 }}
        >
          <span>Explore</span>
          <FaChevronDown />
        </motion.div>
      </div>
    </section>
  );
};

export default HomeHero; 