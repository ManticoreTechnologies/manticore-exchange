import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useAnimationControls } from 'framer-motion';
import ParticlesBg from 'particles-bg';
import { TypeAnimation } from 'react-type-animation';
import manticore_logo from '@/Application/logos/white-manticore.png';
import HomeHero from '@/Application/components/heros/home-hero/home-hero';
import InfoCard from '@/Application/components/cards/info-cards/info-card';
import { FaSearch, FaExchangeAlt, FaBlog, FaRoad, FaChartArea, FaDatabase, FaFaucet, FaChartLine, FaStar, FaRocket, FaAtom, FaLayerGroup } from 'react-icons/fa';
import './home.css';
import './space-tech-theme.css';
import './cosmic-purple-theme.css';
import { throttle } from 'lodash';

// Import new components
import MarketStats from './components/MarketStats/MarketStats';
import EvrmoreInfo from './components/EvrmoreInfo/EvrmoreInfo';
import WalletConnection from './components/WalletConnection/WalletConnection';
import FeaturedAssets from './components/FeaturedAssets/FeaturedAssets';
import ProjectHighlights from './components/ProjectHighlights/ProjectHighlights';
import ServicesGrid from './components/ServicesGrid/ServicesGrid';
import ListingsScroll from './components/ListingsScroll/ListingsScroll';
import Footer from '@/Application/components/navigation/footer/footer';

// Mock data for market stats
const marketStats = [
  {
    label: 'Total Volume',
    value: '₭ 14.2M',
    trend: 'up' as const
  },
  {
    label: 'Assets Listed',
    value: '3,458',
    trend: 'up' as const
  },
  {
    label: 'Active Users',
    value: '12,872',
    trend: 'up' as const
  },
  {
    label: 'Market Cap',
    value: '₭ 127.5M',
    trend: 'up' as const
  }
];

// Mock data for featured listings
const featuredAssets = [
  {
    id: '1',
    title: 'Nebula Collection #42',
    price: '1500',
    highlight: 'Popular',
    tags: ['Art', 'NFT', 'Limited']
  },
  {
    id: '2',
    title: 'Cosmic Voyager Pass',
    price: '850',
    highlight: 'Trending',
    tags: ['Access', 'Utility']
  },
  {
    id: '3',
    title: 'Quantum Domain',
    price: '1200',
    highlight: 'New',
    tags: ['Virtual Land', 'Metaverse']
  },
  {
    id: '4',
    title: 'Astral Artifacts',
    price: '300',
    highlight: 'Unique',
    tags: ['Collectible', 'Rare']
  }
];

// Mock data for scrolling listings
const scrollingListings = [
  {
    id: '1',
    name: 'Quantum Realm Domain',
    price: '2500',
    highlight: 'New'
  },
  {
    id: '2',
    name: 'Nebula Shard Alpha',
    price: '1800',
    highlight: 'Trending'
  },
  {
    id: '3',
    name: 'Cosmic Arsenal Pack',
    price: '500',
    highlight: 'New'
  },
  {
    id: '4',
    name: 'Galactic Pioneers Bundle',
    price: '3500',
    highlight: 'Trending'
  },
  {
    id: '5',
    name: 'Stardust Collection',
    price: '150',
    highlight: 'New'
  },
  {
    id: '6',
    name: 'Virtual Space Station',
    price: '800',
    highlight: 'Trending'
  },
  {
    id: '7',
    name: 'Interstellar Travel Pass',
    price: '1200',
    highlight: 'New'
  },
  {
    id: '8',
    name: 'Cosmic Relic Series',
    price: '950',
    highlight: 'Trending'
  }
];

const Home: React.FC = () => {
  const handleListingClick = (listing: any) => {
    window.location.href = `/trade/listings/by-id/${listing.id}`;
  };

  // Store cursor position in state to avoid DOM manipulation on every mouse move
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  // Track if animations are active to pause when page is not visible
  const [isAnimating, setIsAnimating] = useState(true);
  // Store the target position separately for interpolation
  const [targetCursorPosition, setTargetCursorPosition] = useState({ x: 0, y: 0 });
  
  // References for scroll reveal animations
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Variable to track if scroll is locked
  let scrollTimeout: NodeJS.Timeout | null = null; // Initialize as null to fix linter error

  // Interactive effects for the entire page
  useEffect(() => {
    // Create dynamic star background
    createCosmicBackground();
    
    // Handle cursor effects
    const handleMouseMove = (e: MouseEvent) => {
      setTargetCursorPosition({ x: e.clientX, y: e.clientY });
    };
    
    // Handle visibility changes (pause animations when tab is not visible)
    const handleVisibilityChange = () => {
      setIsAnimating(!document.hidden);
    };
    
    // Set up event listeners
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Create smooth animation for cursor
    const animateCursor = () => {
      if (!isAnimating) return;
      
      // Interpolate position for smoother movement
      setCursorPosition(prev => ({
        x: prev.x + (targetCursorPosition.x - prev.x) * 0.1,
        y: prev.y + (targetCursorPosition.y - prev.y) * 0.1
      }));
      
      const cursorLight = document.querySelector('.cursor-light') as HTMLElement;
      if (cursorLight) {
        cursorLight.style.transform = `translate(${cursorPosition.x}px, ${cursorPosition.y}px) translateZ(0)`;
      }
      
      requestAnimationFrame(animateCursor);
    };
    
    // Start the animation
    animateCursor();
    
    // Scroll reveal effect
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Get all animated elements
    const animatedElements = document.querySelectorAll('.fade-in-cosmic, .cosmic-stagger');
    animatedElements.forEach(el => observer.observe(el));
    
    // Clean up event listeners and animations
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      animatedElements.forEach(el => observer.unobserve(el));
      
      // Remove cosmic background elements
      const cosmicBackground = document.querySelector('.cosmic-background');
      if (cosmicBackground && cosmicBackground.parentNode) {
        cosmicBackground.parentNode.removeChild(cosmicBackground);
      }
    };
  }, [isAnimating, targetCursorPosition]);
  
  // Function to create the cosmic background with stars and nebulas
  const createCosmicBackground = () => {
    const cosmicBg = document.createElement('div');
    cosmicBg.className = 'cosmic-background';
    
    // Create star field
    const starField = document.createElement('div');
    starField.className = 'star-field';
    
    // Generate stars
    const starCount = window.innerWidth < 768 ? 100 : 200;
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
      star.style.animationDelay = `${Math.random() * 4}s`;
      
      starField.appendChild(star);
    }
    
    cosmicBg.appendChild(starField);
    
    // Create nebulas
    const nebulaCount = window.innerWidth < 768 ? 3 : 5;
    for (let i = 0; i < nebulaCount; i++) {
      const nebula = document.createElement('div');
      
      // Random nebula class
      const nebulaClass = Math.random();
      if (nebulaClass < 0.4) {
        nebula.className = 'nebula nebula-purple';
      } else if (nebulaClass < 0.7) {
        nebula.className = 'nebula nebula-blue';
      } else {
        nebula.className = 'nebula nebula-pink';
      }
      
      // Random size and position
      const size = Math.random() * 300 + 200;
      nebula.style.width = `${size}px`;
      nebula.style.height = `${size}px`;
      nebula.style.left = `${Math.random() * 100}%`;
      nebula.style.top = `${Math.random() * 100}%`;
      
      // Random animation delay
      nebula.style.animationDelay = `${Math.random() * 5}s`;
      
      cosmicBg.appendChild(nebula);
    }
    
    // Create cosmic grid
    const cosmicGrid = document.createElement('div');
    cosmicGrid.className = 'cosmic-grid';
    cosmicBg.appendChild(cosmicGrid);
    
    // Add to the DOM
    document.body.appendChild(cosmicBg);
  };
  
  // Animation variants for scroll animations
  const fadeInUpVariant = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 50, // Reduced from 70 for smoother animation
        damping: 20,   // Increased from 15 for less bouncing
        duration: 1.2, // Increased from 0.8 for smoother effect
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const fadeInStaggerVariant = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2, // Increased from 0.15 for smoother effect
        delayChildren: 0.3    // Increased from 0.2
      }
    }
  };

  const itemVariant = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 60, // Reduced from 80
        damping: 18    // Increased from 15
      }
    }
  };

  const { scrollYProgress } = useScroll();
  // Make the scale transition smoother
  const scaleBackground = useTransform(scrollYProgress, 
    [0, 0.1, 0.5], // Added middle keyframe for smoother transition
    [1, 1.05, 1.2]
  );
  
  // Make the opacity transition smoother
  const backgroundOpacity = useTransform(scrollYProgress, 
    [0, 0.2, 0.5], // Added middle keyframe for smoother transition
    [1, 0.95, 0.9]
  );

  return (
    <div className="home cosmic-purple">
      {/* Cursor light element that follows the mouse */}
      <div className="cursor-light"></div>
      
      <ParticlesBg 
        type="cobweb" 
        bg={true} 
        color="#ff6b6b"
        num={40}
      />
      
      {/* Hero Section */}
      <motion.div
        style={{ opacity: backgroundOpacity }}
        className="hero-background-wrapper"
      >
        <HomeHero 
          title="Manticore"
          body="Your premier destination for trading digital assets on the Evrmore blockchain."
          logo={manticore_logo}
        />
      </motion.div>

      {/* Market Stats Section */}
      <section className="cosmic-section">
        <div className="cosmic-container fade-in-cosmic">
          <h2 className="cosmic-title">
            <FaChartLine className="section-icon" />
            Cosmic Market Metrics
          </h2>
          <MarketStats stats={marketStats} />
        </div>
      </section>

      {/* Featured Assets Section */}
      <section className="cosmic-section">
        <div className="cosmic-container fade-in-cosmic">
          <h2 className="cosmic-title">
            <FaStar className="section-icon" />
            Featured Galactic Assets
          </h2>
          <FeaturedAssets isLoading={false} listings={featuredAssets} />
        </div>
      </section>

      {/* Wallet Connection Section */}
      <section className="cosmic-section">
        <div className="cosmic-container fade-in-cosmic">
          <WalletConnection />
        </div>
      </section>

      {/* Evrmore Info Section */}
      <section className="cosmic-section">
        <div className="cosmic-container fade-in-cosmic">
          <h2 className="cosmic-title">
            <FaAtom className="section-icon" />
            Evrmore Universe
          </h2>
          <EvrmoreInfo />
        </div>
      </section>

      {/* Project Highlights Section */}
      <section className="cosmic-section">
        <div className="cosmic-container fade-in-cosmic">
          <h2 className="cosmic-title">
            <FaRocket className="section-icon" />
            Cosmic Achievements
          </h2>
          <ProjectHighlights />
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="cosmic-section">
        <div className="cosmic-container fade-in-cosmic">
          <h2 className="cosmic-title">
            <FaLayerGroup className="section-icon" />
            Galactic Ecosystem
          </h2>
          <ServicesGrid />
        </div>
      </section>

      {/* Listings Scroll Section */}
      <section className="cosmic-section">
        <div className="cosmic-container fade-in-cosmic">
          <h2 className="cosmic-title">
            <FaExchangeAlt className="section-icon" />
            Trending Interstellar Assets
          </h2>
          <ListingsScroll listings={scrollingListings} />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
