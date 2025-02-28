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

  // Create star field
  useEffect(() => {
    if (!heroRef.current) return;
    
    const starField = document.createElement('div');
    starField.className = 'star-field';
    
    // Create small stars
    const starCount = 200;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = `star ${Math.random() > 0.8 ? 'medium' : Math.random() > 0.95 ? 'large' : ''}`;
      
      // Random position
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      
      // Random size
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      // Random twinkle animation
      star.style.setProperty('--twinkle-duration', `${Math.random() * 3 + 2}s`);
      star.style.setProperty('--twinkle-delay', `${Math.random() * 5}s`);
      star.style.setProperty('--star-opacity', `${Math.random() * 0.5 + 0.5}`);
      
      starField.appendChild(star);
    }
    
    // Create shooting stars
    const shootingStarCount = 5;
    for (let i = 0; i < shootingStarCount; i++) {
      const shootingStar = document.createElement('div');
      shootingStar.className = 'shooting-star';
      
      // Random position and angle
      shootingStar.style.left = `${Math.random() * 80}%`;
      shootingStar.style.top = `${Math.random() * 80}%`;
      shootingStar.style.setProperty('--rotation-angle', `${Math.random() * 60 - 30}deg`);
      shootingStar.style.setProperty('--shooting-delay', `${Math.random() * 15}s`);
      
      starField.appendChild(shootingStar);
    }
    
    // Create nebula clouds
    const nebulaCount = 3;
    for (let i = 0; i < nebulaCount; i++) {
      const nebula = document.createElement('div');
      nebula.className = 'nebula';
      
      // Random size and position
      const size = Math.random() * 300 + 200;
      nebula.style.width = `${size}px`;
      nebula.style.height = `${size}px`;
      nebula.style.left = `${Math.random() * 100}%`;
      nebula.style.top = `${Math.random() * 100}%`;
      
      // Random colors and animation
      const hue1 = Math.random() > 0.5 ? '260, 100%, 70%' : '340, 80%, 70%';
      const hue2 = Math.random() > 0.5 ? '180, 100%, 50%' : '300, 80%, 60%';
      nebula.style.setProperty('--nebula-color-1', `hsla(${hue1}, 0.1)`);
      nebula.style.setProperty('--nebula-color-2', `hsla(${hue2}, 0.05)`);
      nebula.style.setProperty('--nebula-delay', `${Math.random() * 10}s`);
      nebula.style.setProperty('--nebula-x', `${Math.random() * 40 - 20}px`);
      nebula.style.setProperty('--nebula-y', `${Math.random() * 40 - 20}px`);
      
      starField.appendChild(nebula);
    }
    
    // Add the star field to the hero section
    heroRef.current.appendChild(starField);
    
    // Create planets
    const createPlanets = () => {
      // Large blue gas giant
      const gasPlanet = document.createElement('div');
      gasPlanet.className = 'planet gas-giant';
      gasPlanet.style.width = '130px';
      gasPlanet.style.height = '130px';
      gasPlanet.style.right = '15%';
      gasPlanet.style.bottom = '60%';
      gasPlanet.style.opacity = '0.7';
      gasPlanet.style.setProperty('--planet-gradient', 
        'radial-gradient(circle at 30% 30%, #429fff 0%, #2a6bc1 40%, #1a4580 80%, #0c2b57 100%)');
      
      // Planet rings
      const planetRing = document.createElement('div');
      planetRing.className = 'planet-ring';
      planetRing.style.width = '180px';
      planetRing.style.height = '180px';
      planetRing.style.top = '-25px';
      planetRing.style.left = '-25px';
      planetRing.style.borderWidth = '6px';
      planetRing.style.borderColor = 'rgba(124, 214, 255, 0.6)';
      planetRing.style.setProperty('--ring-glow-color', 'rgba(124, 214, 255, 0.3)');
      
      gasPlanet.appendChild(planetRing);
      starField.appendChild(gasPlanet);
      
      // Small red rocky planet
      const rockyPlanet = document.createElement('div');
      rockyPlanet.className = 'planet rocky';
      rockyPlanet.style.width = '70px';
      rockyPlanet.style.height = '70px';
      rockyPlanet.style.left = '15%';
      rockyPlanet.style.top = '15%';
      rockyPlanet.style.opacity = '0.8';
      rockyPlanet.style.setProperty('--planet-gradient', 
        'radial-gradient(circle at 40% 40%, #ff7c7c 0%, #e24c4c 30%, #a13030 70%, #6d1a1a 100%)');
      
      starField.appendChild(rockyPlanet);
    };
    
    createPlanets();
    
    // Create blockchain network
    const createBlockchainNetwork = () => {
      const network = document.createElement('div');
      network.className = 'blockchain-network';
      
      // Create nodes
      const nodeCount = 20;
      const nodes = [];
      
      for (let i = 0; i < nodeCount; i++) {
        const node = document.createElement('div');
        node.className = 'network-node';
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        node.style.left = `${x}%`;
        node.style.top = `${y}%`;
        
        // Random animation delay
        node.style.setProperty('--node-delay', `${Math.random() * 3}s`);
        
        network.appendChild(node);
        nodes.push({ x, y, element: node });
      }
      
      // Create connections between nodes
      for (let i = 0; i < nodeCount; i++) {
        // Connect to 1-3 other random nodes
        const connectionCount = Math.floor(Math.random() * 3) + 1;
        
        for (let j = 0; j < connectionCount; j++) {
          const targetIndex = Math.floor(Math.random() * nodeCount);
          if (targetIndex !== i) {
            const sourceNode = nodes[i];
            const targetNode = nodes[targetIndex];
            
            const connection = document.createElement('div');
            connection.className = 'network-connection';
            
            // Position and angle
            const dx = targetNode.x - sourceNode.x;
            const dy = targetNode.y - sourceNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            
            connection.style.left = `${sourceNode.x}%`;
            connection.style.top = `${sourceNode.y}%`;
            connection.style.width = `${distance}%`;
            connection.style.transform = `rotate(${angle}deg)`;
            connection.style.setProperty('--connection-delay', `${Math.random() * 4}s`);
            
            network.appendChild(connection);
          }
        }
      }
      
      heroRef.current?.appendChild(network);
    };
    
    createBlockchainNetwork();
    
    // Create security shield elements
    const createSecurityShield = () => {
      const shield = document.createElement('div');
      shield.className = 'security-shield';
      
      // Add grid pattern
      const grid = document.createElement('div');
      grid.className = 'shield-grid';
      shield.appendChild(grid);
      
      // Add scanning effect
      const scanCount = 3;
      for (let i = 0; i < scanCount; i++) {
        const scan = document.createElement('div');
        scan.className = 'shield-scan';
        scan.style.top = `${Math.random() * 100}%`;
        scan.style.animationDelay = `${i * 3}s`;
        shield.appendChild(scan);
      }
      
      heroRef.current?.appendChild(shield);
    };
    
    createSecurityShield();
    
    // Cleanup function
    return () => {
      if (heroRef.current) {
        const starFieldElement = heroRef.current.querySelector('.star-field');
        const networkElement = heroRef.current.querySelector('.blockchain-network');
        const shieldElement = heroRef.current.querySelector('.security-shield');
        
        if (starFieldElement) heroRef.current.removeChild(starFieldElement);
        if (networkElement) heroRef.current.removeChild(networkElement);
        if (shieldElement) heroRef.current.removeChild(shieldElement);
      }
    };
  }, []);

  // Animate scroll arrow
  useEffect(() => {
    const sequence = async () => {
      while (true) {
        await scrollArrowControls.start({
          y: [0, 10, 0],
          opacity: [0.7, 1, 0.7],
          transition: { duration: 2, ease: "easeInOut" }
        });
      }
    };
    
    sequence();
  }, [scrollArrowControls]);
  
  // Content animation variants
  const contentVariants = {
    hidden: { 
      opacity: 0, 
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 1,
        ease: [0.25, 0.1, 0.25, 1],
        staggerChildren: 0.2
      }
    }
  };

  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: -20 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 1.2,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  };

  const subtitleVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9 
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.8, 
        delay: 0.4,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  };

  const bodyVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8, 
        delay: 0.6,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.section 
      ref={heroRef} 
      className="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="hero-content">
        <motion.div 
          className="hero-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: 1, 
            y: 0
          }}
          whileHover={{
            y: -5,
          }}
          transition={{ duration: 1.0, delay: 0.3 }}
        >
          <motion.img 
            src={logo} 
            alt={title}
            className="hero-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ 
              scale: 1.1,
              rotate: 5,
            }}
          />
          
          <motion.div 
            className="hero-text"
            initial="hidden"
            animate="visible"
            variants={contentVariants}
          >
            <motion.h1 
              variants={titleVariants}
            >
              {title}
            </motion.h1>
            
            <motion.div 
              variants={subtitleVariants}
            >
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
                  style={{ 
                    display: 'inline-block',
                    minWidth: '250px',
                    textAlign: 'left'
                  }}
                  deletionSpeed={60}
                  omitDeletionAnimation={false}
                  preRenderFirstString={true}
                />
              </div>
            </motion.div>
            
            <motion.p 
              variants={bodyVariants}
            >
              {body}
            </motion.p>
            
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
        </motion.div>
        
        <motion.img 
          src={evrmore_logo} 
          alt="Evrmore"
          className="hero-logo-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 1, delay: 1 }}
          whileHover={{ 
            scale: 1.1,
            rotate: -5,
          }}
        />
      </div>
      
      {/* Animated Scroll Down Arrow */}
      {!isScrolled && (
        <motion.div 
          className="scroll-down-arrow"
          onClick={scrollToNextSection}
          animate={scrollArrowControls}
          initial={{ opacity: 0, y: 0 }}
          whileHover={{ scale: 1.2 }}
        >
          <div className="mechanical-parts">
            <div className="gear gear-left"></div>
            <div className="gear gear-right"></div>
            <div className="circuit-line"></div>
            <div className="circuit-dot"></div>
          </div>
          <FaChevronDown size={24} />
          <span>Scroll</span>
        </motion.div>
      )}
    </motion.section>
  );
};

export default HomeHero; 