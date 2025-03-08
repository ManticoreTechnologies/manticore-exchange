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
 * Hero component for the home page with performance optimizations
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
    
    // Setup optimized decorations if animations are allowed
    if (!prefersReducedMotion) {
      // Fade in the hero content
      setIsVisible(true);
      
      // Simple and performant decorations
      createCosmicDecorations();
    } else {
      // Immediately set visible without animations for reduced motion
      setIsVisible(true);
    }
    
    return () => {
      // Clean up any animations or event listeners here
      const decorations = document.querySelectorAll('.hero-cosmic-decoration');
      decorations.forEach(el => el.remove());
    };
  }, []);
  
  // Create minimal decorative elements
  const createCosmicDecorations = () => {
    if (!heroRef.current) return;
    
    // Create a limited number of stars for the hero section
    const starCount = window.innerWidth < 768 ? 15 : 25;
    const fragment = document.createDocumentFragment();
    
    // Add stars with hardware-accelerated animations
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'hero-star hero-cosmic-decoration';
      
      // Use transform instead of position for better performance
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      star.style.transform = `translate3d(${x}vw, ${y}vh, 0)`;
      
      // Add hardware acceleration hints
      star.style.willChange = 'opacity';
      
      // Vary star size and timing
      const size = 1 + Math.random() * 2;
      const delay = Math.random() * 3;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.animationDelay = `${delay}s`;
      
      fragment.appendChild(star);
    }
    
    // Add a small number of animated elements for visual interest
    const decorationCount = window.innerWidth < 768 ? 1 : 2;
    for (let i = 0; i < decorationCount; i++) {
      const decoration = document.createElement('div');
      decoration.className = 'hero-cosmic-object hero-cosmic-decoration';
      
      // Position the decoration
      const x = 20 + Math.random() * 60;
      const y = 20 + Math.random() * 60;
      decoration.style.transform = `translate3d(${x}vw, ${y}vh, 0)`;
      
      // Make it semi-transparent
      decoration.style.opacity = '0.1';
      
      fragment.appendChild(decoration);
    }
    
    // Add decorations to hero
    heroRef.current.appendChild(fragment);
  };
  
  // Check if subtitle is a DOM element with type animation
  const hasTypeAnimation = React.isValidElement(subtitle) && 
    subtitle.props.className && 
    subtitle.props.className.includes('type-animation-wrapper');
  
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