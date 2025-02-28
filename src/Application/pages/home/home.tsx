import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useAnimationControls } from 'framer-motion';
import ParticlesBg from 'particles-bg';
import { TypeAnimation } from 'react-type-animation';
import manticore_logo from '@/Application/logos/white-manticore.png';
import HomeHero from '@/Application/components/heros/home-hero/home-hero';
import InfoCard from '@/Application/components/cards/info-cards/info-card';
import { FaSearch, FaExchangeAlt, FaBlog, FaRoad, FaChartArea, FaDatabase, FaFaucet } from 'react-icons/fa';
import './home.css';
import { throttle } from 'lodash';

// Import new components
import MarketStats from './components/MarketStats/MarketStats';
import EvrmoreInfo from './components/EvrmoreInfo/EvrmoreInfo';
import WalletConnection from './components/WalletConnection/WalletConnection';
import FeaturedAssets from './components/FeaturedAssets/FeaturedAssets';

// Mock data for market stats
const marketStats = [
  { label: '24h Volume', value: '152.5K EVR', trend: 'up' as const },
  { label: 'Active Trades', value: '1,234', trend: 'up' as const },
  { label: 'Market Cap', value: '2.5M EVR', trend: 'up' as const },
];

// Mock data for featured listings
const dummyListings = [
  {
    id: '1',
    title: 'Digital Art Collection #1',
    price: '1000',
    highlight: 'Limited Edition',
    tags: ['Art', 'NFT', 'Rare']
  },
  {
    id: '2',
    title: 'Virtual Real Estate',
    price: '5000',
    highlight: 'Prime Location',
    tags: ['Real Estate', 'Virtual World']
  },
  {
    id: '3',
    title: 'Gaming Asset Bundle',
    price: '750',
    highlight: 'Special Items',
    tags: ['Gaming', 'Bundle', 'Limited']
  },
  {
    id: '4',
    title: 'Crypto Collectible',
    price: '300',
    highlight: 'Unique Item',
    tags: ['Collectible', 'Rare']
  }
];

// Mock data for scrolling listings
const scrollingListings = [
  {
    id: '1',
    title: 'Rare Digital Artwork',
    price: '2500',
    highlight: 'New'
  },
  {
    id: '2',
    title: 'Virtual Land Plot',
    price: '1800',
    highlight: 'Trending'
  },
  {
    id: '3',
    title: 'Exclusive Game Items',
    price: '500',
    highlight: 'New'
  },
  {
    id: '4',
    title: 'NFT Collection Bundle',
    price: '3500',
    highlight: 'Trending'
  },
  {
    id: '5',
    title: 'Digital Trading Cards',
    price: '150',
    highlight: 'New'
  },
  {
    id: '6',
    title: 'Virtual Fashion Items',
    price: '800',
    highlight: 'Trending'
  },
  {
    id: '7',
    title: 'Metaverse Assets',
    price: '1200',
    highlight: 'New'
  },
  {
    id: '8',
    title: 'Digital Collectibles',
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

  // Variable to track if scroll is locked
  let scrollTimeout: NodeJS.Timeout | null = null; // Initialize as null to fix linter error

  // Interactive effects for the entire page
  useEffect(() => {
    // Create lens flare dots dynamically - but with fewer elements for better performance
    const createFlareDots = () => {
      const cursorLight = document.querySelector('.cursor-light') as HTMLElement;
      if (!cursorLight) return;
      
      // Remove existing flare dots container if any
      const existingContainer = cursorLight.querySelector('.flare-dots');
      if (existingContainer) {
        cursorLight.removeChild(existingContainer);
      }
      
      // Create new flare dots container
      const flareDots = document.createElement('div');
      flareDots.className = 'flare-dots';
      
      // Create random flare dots - reduced count for better performance
      const dotCount = 4; // Reduced from 6 to 4
      
      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'flare-dot';
        
        // Random position within the cursor light
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 30 + 20; // Reduced range
        
        const x = Math.cos(angle) * distance + 50; // Center at 50%
        const y = Math.sin(angle) * distance + 50; // Center at 50%
        
        // Apply styles
        dot.style.left = `${x}%`;
        dot.style.top = `${y}%`;
        dot.style.width = `${Math.random() * 4 + 3}px`; // Smaller size range
        dot.style.height = dot.style.width;
        dot.style.opacity = `${Math.random() * 0.4 + 0.3}`; // Slightly reduced opacity
        
        // Add animation with random delay - but longer duration for smoother effect
        dot.style.animation = `flare-pulse-small ${Math.random() * 2 + 1.5}s infinite alternate ease-in-out`;
        dot.style.animationDelay = `${Math.random() * 1}s`;
        
        flareDots.appendChild(dot);
      }
      
      cursorLight.appendChild(flareDots);
    };
    
    createFlareDots();
    
    // Use a reference to store the cursor light element to avoid querying the DOM on every mouse move
    const cursorLightRef = document.querySelector('.cursor-light') as HTMLElement;
    
    // Animation frame ID for cursor movement
    let cursorAnimationFrame: number;
    
    // Animation function for smooth cursor movement with interpolation
    const animateCursor = () => {
      if (!isAnimating || !cursorLightRef) {
        if (cursorAnimationFrame) {
          cancelAnimationFrame(cursorAnimationFrame);
        }
        return;
      }
      
      // Improved interpolation factor for smoother movement
      // Different factors for different device performance levels
      const interpolationFactor = 0.12; // Slightly reduced for even smoother movement
      
      const nextX = cursorPosition.x + (targetCursorPosition.x - cursorPosition.x) * interpolationFactor;
      const nextY = cursorPosition.y + (targetCursorPosition.y - cursorPosition.y) * interpolationFactor;
      
      // Only update state if there's a significant change to avoid unnecessary renders
      if (Math.abs(nextX - cursorPosition.x) > 0.05 || Math.abs(nextY - cursorPosition.y) > 0.05) {
        setCursorPosition({ x: nextX, y: nextY });
      }
      
      // Apply position to cursor light element - using transform3d for better performance
      cursorLightRef.style.transform = `translate3d(${nextX}px, ${nextY}px, 0) translate(-50%, -50%)`;
      
      // Calculate normalized position for CSS variables (as percentage)
      const normalizedX = (nextX / window.innerWidth) * 100;
      const normalizedY = (nextY / window.innerHeight) * 100;
      
      // Update CSS variables less frequently to reduce style recalculations (only once every 4-5 frames)
      if (Math.random() > 0.8) {
        document.documentElement.style.setProperty('--mouse-x', `${normalizedX}%`);
        document.documentElement.style.setProperty('--mouse-y', `${normalizedY}%`);
      }
      
      // Schedule next animation frame
      cursorAnimationFrame = requestAnimationFrame(animateCursor);
    };
    
    // Start the animation loop
    cursorAnimationFrame = requestAnimationFrame(animateCursor);
    
    // Throttle mouse movements to improve performance - increased throttle time for better performance
    const handleMouseMove = throttle((e: MouseEvent) => {
      if (!isAnimating) return;
      
      // Update target position directly from the mouse event
      setTargetCursorPosition({ x: e.clientX, y: e.clientY });
      
      // Handle flare rotation only when there's significant movement
      if (cursorLightRef && (Math.abs(e.movementX) > 5 || Math.abs(e.movementY) > 5)) {
        const flareRotation = Math.atan2(e.movementY, e.movementX) * (180 / Math.PI);
        cursorLightRef.style.setProperty('--flare-rotation', `${flareRotation}deg`);
        
        // Trigger active state only for significant movements - increased threshold
        if (Math.abs(e.movementX) > 15 || Math.abs(e.movementY) > 15) {
          cursorLightRef.classList.add('active');
          setTimeout(() => {
            if (cursorLightRef) cursorLightRef.classList.remove('active');
          }, 180); // Slightly increased duration for smoother transition
        }
      }
    }, 20); // Slightly increased throttle time for better performance
    
    // Optimize mouse click handler
    const handleMouseDown = throttle(() => {
      if (!isAnimating || !cursorLightRef) return;
      
      cursorLightRef.classList.add('active');
      setTimeout(() => {
        if (cursorLightRef) cursorLightRef.classList.remove('active');
      }, 300);
    }, 100);
    
    // Throttle scroll handler for better performance
    const handleScroll = throttle(() => {
      if (!isAnimating) return;
      
      // Clear any existing timeout to prevent rapid scroll lock/unlock
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
        scrollTimeout = null;
      }
      
      // Use requestAnimationFrame to handle scroll progress update off the main thread
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(Math.max(scrollY / height, 0), 1); // Ensure value is between 0 and 1
        document.documentElement.style.setProperty('--scroll-progress', `${progress}`);
      });
    }, 200); // Increased from 100ms to 200ms for much better performance
    
    // Handle visibility changes to pause animations when tab is not visible
    const handleVisibilityChange = () => {
      setIsAnimating(!document.hidden);
      
      if (!document.hidden && cursorLightRef) {
        // Reset animation when becoming visible again
        cursorAnimationFrame = requestAnimationFrame(animateCursor);
      } else if (document.hidden && cursorAnimationFrame) {
        cancelAnimationFrame(cursorAnimationFrame);
      }
    };
    
    // Use passive event listeners for better performance
    const passiveOpts = { passive: true } as AddEventListenerOptions;
    
    document.addEventListener('mousemove', handleMouseMove, passiveOpts);
    document.addEventListener('scroll', handleScroll, passiveOpts);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Recreate flare dots on window resize - but add throttling
    const throttledResize = throttle(() => {
      createFlareDots();
      
      // Also update cursor position on resize
      if (targetCursorPosition.x > 0 && targetCursorPosition.y > 0) {
        setCursorPosition(targetCursorPosition);
      }
    }, 500);
    
    window.addEventListener('resize', throttledResize, passiveOpts);
    
    return () => {
      if (cursorAnimationFrame) {
        cancelAnimationFrame(cursorAnimationFrame);
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', throttledResize);
      
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
        scrollTimeout = null;
      }
    };
  }, [isAnimating]); // Depend on isAnimating to restart handlers when visibility changes
  
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
    <div className="home">
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

      {/* Evrmore Info Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={fadeInUpVariant}
        className="section-wrapper"
      >
        <EvrmoreInfo />
      </motion.section>

      {/* Wallet Connection Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={fadeInUpVariant}
        className="section-wrapper"
      >
        <WalletConnection />
      </motion.section>
      
      {/* Market Stats Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={fadeInUpVariant}
        className="section-wrapper"
      >
        <MarketStats stats={marketStats} />
      </motion.section>

      {/* Featured Assets Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={fadeInUpVariant}
        className="section-wrapper"
      >
        <FeaturedAssets isLoading={false} listings={dummyListings} />
      </motion.section>

      {/* Scrolling Listings Section */}
      <motion.section 
        className="listings-scroll"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={fadeInUpVariant}
      >
        <div className="section-content">
          <motion.div 
            className="scroll-container glassmorphism"
            variants={itemVariant}
          >
            <h3 className="section-title">Available Assets</h3>
            <div className="scroll-content">
              <motion.div
                animate={{ x: [-1000, 1000] }}
                transition={{ 
                  duration: 40, 
                  repeat: Infinity, 
                  ease: "linear",
                  repeatType: "loop"
                }}
              >
                {scrollingListings.map((listing, index) => (
                  <div 
                    key={`scroll-${listing.id}-${index}`}
                    className="listing-item"
                    onClick={() => handleListingClick(listing)}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="listing-name">{listing.title}</span>
                    <span className="listing-price">
                      {listing.price ? `${listing.price} EVR` : 'Price not set'}
                    </span>
                    {listing.highlight && (
                      <span className="listing-highlight">{listing.highlight}</span>
                    )}
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Services Grid */}
      <motion.section 
        className="services-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={fadeInUpVariant}
      >
        <div className="section-content">
          <motion.h2
            className="section-title"
            variants={itemVariant}
          >
            Platform Services
          </motion.h2>
          
          <motion.div 
            className="infocards"
            variants={fadeInStaggerVariant}
          >
            {[
              {
                icon: FaSearch,
                to: "/search",
                title: "Search Assets",
                action: "Explore Now",
                body: "Find the perfect assets for your portfolio with our advanced search features."
              },
              {
                icon: FaExchangeAlt,
                to: "/trade",
                title: "Trade",
                action: "Start Trading",
                body: "Execute trades instantly with our high-performance trading engine."
              },
              {
                icon: FaFaucet,
                to: "/faucet",
                title: "Faucet",
                action: "Get Started",
                body: "New to Evrmore? Get your first assets free from our community faucet."
              },
              {
                icon: FaRoad,
                to: "/roadmap",
                title: "Roadmap",
                action: "View Future",
                body: "Discover our vision and upcoming features that will revolutionize asset trading."
              },
              {
                icon: FaBlog,
                to: "/blog",
                title: "Blog",
                action: "Read More",
                body: "Stay updated with the latest news, updates, and insights from the Manticore team."
              },
              {
                icon: FaDatabase,
                to: "/ipfs",
                title: "IPFS Storage",
                action: "Store Now",
                body: "Securely store and manage your asset metadata using decentralized IPFS storage."
              },
              {
                icon: FaChartArea,
                to: "/chart",
                title: "EVR Chart",
                action: "View Chart",
                body: "Track EVR price movements and market trends with our interactive chart."
              }
            ].map((card, index) => (
              <motion.div
                key={card.title}
                variants={itemVariant}
                custom={index}
              >
                <InfoCard 
                  FaIcon={card.icon}
                  to={card.to}
                  title={card.title}
                  action={card.action}
                  body={card.body}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
