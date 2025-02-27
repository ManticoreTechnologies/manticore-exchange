import React, { useEffect, useRef, useState } from 'react';
import './home-hero.css';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import manticore_logo from '@/Application/logos/white-manticore.png';
import evrmore_logo from '@/Application/logos/evr.svg';
import HeroContent from './content';
import { useTheme } from './ThemeContext';
import ThemeToggle from './ThemeToggle';

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
  const heroRef = useRef<HTMLElement>(null);
  const { theme } = useTheme();
  const [nodes, setNodes] = useState<Array<{x: number, y: number, size: number, delay: number}>>([]);
  const [connections, setConnections] = useState<Array<{
    x1: number, y1: number, x2: number, y2: number, width: number, delay: number
  }>>([]);

  // Create blockchain nodes and connections
  useEffect(() => {
    const createBlockchainElements = () => {
      if (!heroRef.current) return;
      
      const { width, height } = heroRef.current.getBoundingClientRect();
      const nodeCount = Math.min(30, Math.floor((width * height) / 15000)); // Responsive node count
      
      // Create nodes
      const newNodes = [];
      for (let i = 0; i < nodeCount; i++) {
        newNodes.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1.5,
          delay: Math.random() * 5
        });
      }
      
      // Create connections between some nodes
      const newConnections = [];
      for (let i = 0; i < nodeCount - 1; i++) {
        if (Math.random() > 0.4) { // Only create connections for some nodes
          const startNode = newNodes[i];
          const endNode = newNodes[i + 1];
          
          newConnections.push({
            x1: startNode.x,
            y1: startNode.y,
            x2: endNode.x,
            y2: endNode.y,
            width: Math.random() * 80 + 40,
            delay: Math.random() * 3
          });
        }
      }
      
      setNodes(newNodes);
      setConnections(newConnections);
    };
    
    // Initialize blockchain elements
    createBlockchainElements();
    
    // Recreate on window resize
    const handleResize = () => {
      createBlockchainElements();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Interactive parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { width, height, left, top } = heroRef.current.getBoundingClientRect();
      
      // Calculate mouse position relative to the center of the hero
      const x = ((clientX - left) / width - 0.5) * 20; // Max movement 20px
      const y = ((clientY - top) / height - 0.5) * 20;
      
      // Apply parallax effect to elements
      const logoLeft = heroRef.current.querySelector('.hero-logo') as HTMLElement;
      const logoRight = heroRef.current.querySelector('.hero-logo-right') as HTMLElement;
      const heroCenter = heroRef.current.querySelector('.hero-center') as HTMLElement;
      const heroGrid = heroRef.current.querySelector('.hero-grid') as HTMLElement;
      
      if (logoLeft) {
        logoLeft.style.transform = `translate(${-x/2}px, ${-y/2}px)`;
      }
      
      if (logoRight) {
        logoRight.style.transform = `translate(${x/2}px, ${-y/2}px)`;
      }
      
      if (heroCenter) {
        heroCenter.style.transform = `perspective(1000px) rotateX(${y/40}deg) rotateY(${-x/40}deg)`;
      }
      
      if (heroGrid) {
        heroGrid.style.transform = `translate(${x/8}px, ${y/8}px)`;
      }
    };
    
    const handleMouseLeave = () => {
      if (!heroRef.current) return;
      
      const logoLeft = heroRef.current.querySelector('.hero-logo') as HTMLElement;
      const logoRight = heroRef.current.querySelector('.hero-logo-right') as HTMLElement;
      const heroCenter = heroRef.current.querySelector('.hero-center') as HTMLElement;
      const heroGrid = heroRef.current.querySelector('.hero-grid') as HTMLElement;
      
      if (logoLeft) {
        logoLeft.style.transform = 'translate(0, 0)';
      }
      
      if (logoRight) {
        logoRight.style.transform = 'translate(0, 0)';
      }
      
      if (heroCenter) {
        heroCenter.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      }
      
      if (heroGrid) {
        heroGrid.style.transform = 'translate(0, 0)';
      }
    };
    
    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener('mousemove', handleMouseMove);
      hero.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (hero) {
        hero.removeEventListener('mousemove', handleMouseMove);
        hero.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Define different animation settings based on theme
  const getAnimationSettings = () => {
    switch(theme) {
      case 'light':
        return {
          backgroundOpacity: 1, // Full opacity
          shadowIntensity: [10, 20],
          transition: { duration: 0.8, ease: "easeOut" }
        };
      case 'evrmore':
        return {
          backgroundOpacity: 1, // Full opacity
          shadowIntensity: [15, 30],
          transition: { duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }
        };
      default: // dark
        return {
          backgroundOpacity: 1, // Full opacity
          shadowIntensity: [20, 40],
          transition: { duration: 1, ease: "easeOut" }
        };
    }
  };

  const animSettings = getAnimationSettings();

  return (
    <motion.section 
      ref={heroRef} 
      className="hero" 
      data-theme={theme}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Add solid background layer to prevent transparency issues */}
      <div 
        style={{ 
          position: 'absolute', 
          width: '100%', 
          height: '100%', 
          backgroundColor: 'var(--hero-bg)',
          zIndex: 0 
        }}
      />
      
      {/* Increased z-index of orbs for better visibility */}
      <div className="hero-glow-orbs" style={{ zIndex: 1 }}>
        <div className="hero-glow-orb"></div>
        <div className="hero-glow-orb"></div>
        <div className="hero-glow-orb"></div>
      </div>
      
      <div className="hero-grid" style={{ zIndex: 2 }}></div>
      
      {/* Blockchain visualization with improved visibility */}
      <div className="hero-blockchain" style={{ zIndex: 3, opacity: 0.9 }}>
        {nodes.map((node, index) => (
          <div
            key={`node-${index}`}
            className="hero-node"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              width: `${node.size * 1.5}px`, // Increased size by 50%
              height: `${node.size * 1.5}px`, // Increased size by 50%
              animationDelay: `${node.delay}s`,
              backgroundColor: 'var(--hero-particle)',
              boxShadow: '0 0 8px var(--hero-accent-primary)' // Added glow
            }}
          />
        ))}
        
        {connections.map((connection, index) => (
          <div
            key={`connection-${index}`}
            className="hero-connection"
            style={{
              left: `${connection.x1}%`,
              top: `${connection.y1}%`,
              width: `${connection.width}px`,
              animationDelay: `${connection.delay}s`,
              opacity: 0.5, // Increased opacity
              transform: `rotate(${Math.atan2(
                (connection.y2 - connection.y1) * window.innerHeight / 100,
                (connection.x2 - connection.x1) * window.innerWidth / 100
              ) * (180 / Math.PI)}deg)`
            }}
          />
        ))}
      </div>
      
      <div className="hero-noise" style={{ zIndex: 4, opacity: 0.08 }}></div>
      
      <ThemeToggle />
      
      <motion.div 
        className="hero-section hero-left"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={animSettings.transition}
      >
        <motion.img 
          src={logo} 
          alt={title}
          className="hero-logo"
          whileHover={{ 
            scale: 1.1,
            rotate: 5,
            filter: `drop-shadow(0 0 50px var(--hero-accent-primary))`
          }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        />
      </motion.div>
      <motion.div 
        className="hero-section hero-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          boxShadow: `0 ${animSettings.shadowIntensity[0]}px ${animSettings.shadowIntensity[1]}px var(--hero-shadow-dark), 0 0 ${animSettings.shadowIntensity[0]}px var(--hero-shadow-light)`  
        }}
        whileHover={{
          y: -15,
          scale: 1.03,
          boxShadow: `0 ${animSettings.shadowIntensity[0] * 1.5}px ${animSettings.shadowIntensity[1] * 1.5}px var(--hero-shadow-dark), 0 0 ${animSettings.shadowIntensity[0] * 1.5}px var(--hero-shadow-light)`
        }}
        transition={{ ...animSettings.transition, delay: 0.3 }}
      >
        <HeroContent 
          title={title} 
          subtitle={
            <div className="type-animation-container">
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
                cursor={true}
                repeat={Infinity}
                className="type-animation"
                style={{ display: 'block', width: '100%' }}
                deletionSpeed={70}
                omitDeletionAnimation={false}
              />
            </div>
          } 
          body={body} 
        />
        {authButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            {authButton}
          </motion.div>
        )}
      </motion.div>
      <motion.div 
        className="hero-section hero-right"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={animSettings.transition}
      >
        <motion.img 
          src={evrmore_logo} 
          alt="Evrmore"
          className="hero-logo-right"
          whileHover={{ 
            scale: 1.1,
            rotate: -5,
            filter: `drop-shadow(0 0 50px var(--hero-accent-primary))`
          }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        />
      </motion.div>
    </motion.section>
  );
};

export default HomeHero;
