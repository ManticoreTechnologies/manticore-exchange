import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useAnimationControls } from 'framer-motion';
import ParticlesBg from 'particles-bg';
import { TypeAnimation } from 'react-type-animation';
import manticore_logo from '@/Application/logos/white-manticore.png';
import HomeHero from '@/Application/components/heros/home-hero/home-hero';
import InfoCard from '@/Application/components/cards/info-cards/info-card';
import { 
  FaSearch, 
  FaExchangeAlt, 
  FaRoad, 
  FaDatabase, 
  FaFaucet, 
  FaSatelliteDish, 
  FaRocket, 
  FaAtom, 
  FaLayerGroup,
  FaUserAstronaut,
  FaCompass,
  FaCubes
} from 'react-icons/fa';
import './home.css';
import './space-tech-theme.css';
import './cosmic-purple-theme.css';
import { throttle } from 'lodash';

// Import components
import EvrmoreInfo from './components/EvrmoreInfo/EvrmoreInfo';
import WalletConnection from './components/WalletConnection/WalletConnection';
import FeaturedAssets from './components/FeaturedAssets/FeaturedAssets';
import ListingsScroll from './components/ListingsScroll/ListingsScroll';
import Footer from '@/Application/components/navigation/footer/footer';

// Mock data for featured assets
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

// Roadmap events for display
const roadmapEvents = [
  {
    title: "Q2 2024",
    events: [
      "Advanced Security Features",
      "Mobile App Beta Launch",
      "Multi-Chain Support"
    ]
  },
  {
    title: "Q3 2024",
    events: [
      "Market Analytics Dashboard",
      "NFT Creator Studio",
      "Enhanced Developer Tools"
    ]
  },
  {
    title: "Q4 2024",
    events: [
      "Decentralized Governance",
      "Staking & Yield Features",
      "Cross-Platform Integration"
    ]
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
    
    // Add animation for cosmic sections
    const cosmicSections = document.querySelectorAll('.cosmic-section');
    cosmicSections.forEach(el => observer.observe(el));
    
    // Add floating animation to section icons
    const sectionIcons = document.querySelectorAll('.section-icon');
    sectionIcons.forEach(icon => {
      icon.classList.add('cosmic-float');
    });

    // Clean up event listeners and animations
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Clean up all observers
      animatedElements.forEach(el => observer.unobserve(el));
      cosmicSections.forEach(el => observer.unobserve(el));
      sectionIcons.forEach(el => observer.unobserve(el));
      observer.disconnect();
      
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
  
  return (
    <div className="home cosmic-purple">
      {/* Cursor light effect */}
      <div className="cursor-light"></div>
      
      {/* Hero Section */}
      <HomeHero
        title="MANTICORE EXCHANGE"
        subtitle={
          <div className="hero-subtitle cosmic-purple">
            The premier platform for digital assets on the Evrmore blockchain
          </div>
        }
        body={
          <div className="hero-description cosmic-purple">
            Trade, collect, and explore cosmic assets in the expanding Evrmore universe
          </div>
        }
      />
      
      {/* Evrmore Info Section - Moved to the top */}
      <section className="cosmic-section">
        <div className="cosmic-container fade-in-cosmic">
          <h2 className="cosmic-title">
            <FaAtom className="section-icon" />
            Welcome to the Future of Digital Assets
          </h2>
          <EvrmoreInfo />
        </div>
      </section>
      
      {/* Featured Assets Section */}
      <section className="cosmic-section">
        <div className="cosmic-container fade-in-cosmic">
          <h2 className="cosmic-title">
            <FaCubes className="section-icon" />
            Featured Galactic Assets
          </h2>
          <div className="featured-card-float">
            <FeaturedAssets isLoading={false} listings={featuredAssets} />
          </div>
        </div>
      </section>

      {/* Asset Discovery Section */}
      <section className="cosmic-section">
        <div className="cosmic-container fade-in-cosmic">
          <h2 className="cosmic-title">
            <FaSearch className="section-icon" />
            Asset Discovery
          </h2>
          <div className="cosmic-card">
            <div className="cosmic-content">
              <p>Explore the vast universe of digital assets on the Evrmore blockchain. Our advanced search tools help you discover rare, valuable, and trending assets with ease.</p>
              <ul className="feature-list">
                <li>Filter by categories, attributes, and rarity</li>
                <li>Real-time market data for informed decisions</li>
                <li>Save favorite searches and receive alerts</li>
                <li>Discover newly minted assets instantly</li>
              </ul>
              <a href="/search" className="cosmic-button">Explore Assets</a>
            </div>
          </div>
        </div>
      </section>

      {/* Asset Trading Section */}
      <section className="cosmic-section">
        <div className="cosmic-container fade-in-cosmic">
          <h2 className="cosmic-title">
            <FaExchangeAlt className="section-icon" />
            Asset Trading
          </h2>
          <div className="cosmic-card">
            <div className="cosmic-content">
              <p>Our seamless trading platform enables secure, fast, and transparent transactions for all Evrmore-based digital assets.</p>
              <ul className="feature-list">
                <li>Peer-to-peer secure transactions</li>
                <li>Low fees with transparent pricing</li>
                <li>Escrow protection for buyers and sellers</li>
                <li>Comprehensive transaction history</li>
              </ul>
              <a href="/trade" className="cosmic-button">Start Trading</a>
            </div>
          </div>
        </div>
      </section>

      {/* Wallet Connection Section */}
      <section className="cosmic-section">
        <div className="cosmic-container fade-in-cosmic">
          <WalletConnection />
        </div>
      </section>

      {/* Evrmore Faucet Section */}
      <section className="cosmic-section">
        <div className="cosmic-container fade-in-cosmic">
          <h2 className="cosmic-title">
            <FaFaucet className="section-icon" />
            Evrmore Faucet
          </h2>
          <div className="cosmic-card">
            <div className="cosmic-content">
              <p>New to the Evrmore ecosystem? Get started with free EVR tokens from our community faucet and begin your journey in the Evrmore universe.</p>
              <ul className="feature-list">
                <li>Receive free EVR tokens to start exploring</li>
                <li>Simple verification process</li>
                <li>Learn about Evrmore blockchain basics</li>
                <li>Community-funded resource</li>
              </ul>
              <a href="/faucet" className="cosmic-button">Visit Faucet</a>
            </div>
          </div>
        </div>
      </section>

      {/* IPFS Storage Section */}
      <section className="cosmic-section">
        <div className="cosmic-container fade-in-cosmic">
          <h2 className="cosmic-title">
            <FaDatabase className="section-icon" />
            IPFS Storage
          </h2>
          <div className="cosmic-card">
            <div className="cosmic-content">
              <p>Store your digital assets' metadata on the InterPlanetary File System for permanent decentralized access and enhanced security.</p>
              <ul className="feature-list">
                <li>Decentralized and permanent storage</li>
                <li>Content-addressed data structure</li>
                <li>Built-in versioning and deduplication</li>
                <li>Seamless integration with Evrmore assets</li>
              </ul>
              <a href="/ipfs" className="cosmic-button">Explore IPFS</a>
            </div>
          </div>
        </div>
      </section>

      {/* Network Status Section */}
      <section className="cosmic-section">
        <div className="cosmic-container fade-in-cosmic">
          <h2 className="cosmic-title">
            <FaSatelliteDish className="section-icon" />
            Network Status
          </h2>
          <div className="cosmic-card">
            <div className="cosmic-content">
              <p>Monitor the health and performance of the Evrmore network with our real-time status dashboard and analytics tools.</p>
              <ul className="feature-list">
                <li>Real-time network metrics and statistics</li>
                <li>Block explorer with detailed information</li>
                <li>Node status and distribution map</li>
                <li>Historical performance data</li>
              </ul>
              <a href="/network" className="cosmic-button">Check Status</a>
            </div>
          </div>
        </div>
      </section>

      {/* Launch Pad Section */}
      <section className="cosmic-section">
        <div className="cosmic-container fade-in-cosmic">
          <h2 className="cosmic-title">
            <FaRocket className="section-icon" />
            Asset Launch Pad
          </h2>
          <div className="cosmic-card">
            <div className="cosmic-content">
              <p>Launch your digital assets into the Evrmore ecosystem with our comprehensive suite of creation, minting, and distribution tools.</p>
              <ul className="feature-list">
                <li>Guided asset creation workflow</li>
                <li>Metadata management and IPFS integration</li>
                <li>Marketing and promotion features</li>
                <li>Distribution and sales tools</li>
              </ul>
              <a href="/launch" className="cosmic-button">Launch Assets</a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Roadmap Section */}
      <section className="cosmic-section">
        <div className="cosmic-container fade-in-cosmic">
          <h2 className="cosmic-title">
            <FaRoad className="section-icon" />
            Cosmic Roadmap
          </h2>
          <div className="cosmic-card roadmap-container">
            <div className="timeline">
              {roadmapEvents.map((period, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h3>{period.title}</h3>
                    <ul>
                      {period.events.map((event, eventIndex) => (
                        <li key={eventIndex}>{event}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <a href="/roadmap" className="cosmic-button">View Full Roadmap</a>
          </div>
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
