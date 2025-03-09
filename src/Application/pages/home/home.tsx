import React, { useEffect, useState, useRef } from 'react';
import './home-base.css';
import './cosmic-purple-theme.css';

// Import components
import HomeHero from '@/Application/components/heros/home-hero/home-hero';
import EvrmoreInfo from './components/EvrmoreInfo/EvrmoreInfo';
import WalletConnection from './components/WalletConnection/WalletConnection';
import FeaturedAssets from './components/FeaturedAssets/FeaturedAssets';
import ListingsScroll from './components/ListingsScroll/ListingsScroll';
import Footer from '@/Application/components/navigation/footer/footer';
import CosmicBackground from './components/CosmicBackground';
import SectionTitle from './components/SectionTitle';
import AssetDiscovery from './components/AssetDiscovery';
import AssetTrading from './components/AssetTrading';
import BlockchainSecurity from './components/BlockchainSecurity';
import DeveloperUniverse from './components/DeveloperUniverse';
import EvrmooreFaucet from './components/EvrmooreFaucet';
import InterstellarStorage from './components/InterstellarStorage';
import NetworkStatus from './components/NetworkStatus';
import LaunchPad from './components/LaunchPad';
import { 
  FaSearch, 
  FaExchangeAlt, 
  FaRoad, 
  FaDatabase, 
  FaTint, 
  FaNetworkWired, 
  FaRocket, 
  FaAtom, 
  FaGem,
  FaWallet,
  FaChartLine,
  FaShieldAlt,
  FaCode,
  FaCubes
} from 'react-icons/fa';

// Types
interface Listing {
  id: string;
  title: string;
  price: string;
  highlight?: string;
  tags?: string[];
}

interface ScrollListing {
  id: string;
  name: string;
  price: string;
  highlight?: string;
}

interface RoadmapEvent {
  id: number;
  phase: string;
  title: string;
  icon: string;
  items: string[];
}

// Define the hero typing sequences
const HERO_TYPE_SEQUENCES = [
  'Discover Digital Assets',
  2000,
  'Trade on Evrmore',
  2000, 
  'Collect Rare Items',
  2000,
  'Build Your Portfolio',
  2000
];

const Home: React.FC = () => {
  // Define state for dynamic content
  const [featuredAssets, setFeaturedAssets] = useState<Listing[]>([]);
  const [trendingAssets, setTrendingAssets] = useState<ScrollListing[]>([]);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [targetCursorPosition, setTargetCursorPosition] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(true);
  const cursorRef = useRef<HTMLDivElement>(null);
  
  // Cursor animation effect
  useEffect(() => {
    // Initialize cursor in the center of screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    setTargetCursorPosition({ x: centerX, y: centerY });
    setCursorPosition({ x: centerX, y: centerY });
    
    // Handle cursor effects
    const handleMouseMove = (e: MouseEvent) => {
      setTargetCursorPosition({ x: e.clientX, y: e.clientY });
    };
    
    // Handle visibility changes (pause animations when tab is not visible)
    const handleVisibilityChange = () => {
      setIsAnimating(!document.hidden);
    };
    
    // Handle window resize
    const handleResize = () => {
      // Ensure cursor is in visible area after resize
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      setTargetCursorPosition(prev => ({
        x: Math.min(Math.max(prev.x, 0), viewportWidth),
        y: Math.min(Math.max(prev.y, 0), viewportHeight)
      }));
    };
    
    // Set up event listeners
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('resize', handleResize);
    
    // Animation frame for cursor movement
    let animationFrame: number;
    
    const animateCursor = () => {
      if (!isAnimating) return;
      
      // Interpolate position for smoother movement
      setCursorPosition(prev => ({
        x: prev.x + (targetCursorPosition.x - prev.x) * 0.1,
        y: prev.y + (targetCursorPosition.y - prev.y) * 0.1
      }));
      
      if (cursorRef.current) {
        // Use translate3d for hardware acceleration and ensure cursor is on screen
        cursorRef.current.style.left = `${cursorPosition.x}px`;
        cursorRef.current.style.top = `${cursorPosition.y}px`;
      }
      
      animationFrame = requestAnimationFrame(animateCursor);
    };
    
    // Start animation
    animationFrame = requestAnimationFrame(animateCursor);
    
    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, [isAnimating]);
  
  // Initialize IntersectionObserver for animations with enhanced effects
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15 // Slightly increased threshold for better timing
    };
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add visible class for basic animations
          entry.target.classList.add('visible');
          
          // Add data-animated attribute to prevent re-animation
          if (!entry.target.hasAttribute('data-animated')) {
            entry.target.setAttribute('data-animated', 'true');
            
            // Add specific animation classes based on position
            const rect = entry.target.getBoundingClientRect();
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            const viewportCenter = viewportHeight / 2;
            
            if (rect.top > viewportCenter) {
              // Element is below center - animate up
              entry.target.classList.add('animate-from-bottom');
            } else if (rect.top + rect.height < viewportCenter) {
              // Element is above center - animate down
              entry.target.classList.add('animate-from-top');
            } else {
              // Element is near center - scale animation
              entry.target.classList.add('animate-scale');
            }
          }
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Get all animated elements
    const animatedElements = document.querySelectorAll('.fade-in-cosmic, .cosmic-stagger, .cosmic-section, .tech-glow, .evrmoore-faucet-content, .launch-pad-content');
    animatedElements.forEach(el => observer.observe(el));
    
    // Add scroll event listener for parallax effects
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      
      // Apply parallax effect to stars and nebulas
      const stars = document.querySelectorAll('.star');
      const nebulas = document.querySelectorAll('.nebula');
      
      stars.forEach((star, index) => {
        const speed = 0.05 + (index % 5) * 0.01;
        (star as HTMLElement).style.transform = `translateY(${scrollY * speed}px)`;
      });
      
      nebulas.forEach((nebula, index) => {
        const speed = 0.03 + (index % 3) * 0.01;
        (nebula as HTMLElement).style.transform = `translateY(${scrollY * speed}px)`;
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      animatedElements.forEach(el => observer.unobserve(el));
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Initialize sample data
  useEffect(() => {
    // Sample featured assets data
    const sampleFeaturedAssets: Listing[] = [
      {
        id: '1',
        title: 'Quantum Nexus #42',
        price: '1500 EVR',
        highlight: 'New Listing',
        tags: ['Art', 'Digital']
      },
      {
        id: '2',
        title: 'Virtual Dimension',
        price: '3200 EVR',
        highlight: 'Popular',
        tags: ['Real Estate', 'Virtual']
      },
      {
        id: '3',
        title: 'Stellar Artifact',
        price: '800 EVR',
        tags: ['Collectible', 'Gaming']
      },
      {
        id: '4',
        title: 'Digital Oasis',
        price: '1350 EVR',
        highlight: 'Limited',
        tags: ['Metaverse', 'Property']
      }
    ];
    
    // Sample trending assets data
    const sampleTrendingAssets: ScrollListing[] = [
      { id: '1', name: 'Cosmic Art Collection', price: '4500 EVR', highlight: 'Trending' },
      { id: '2', name: 'Virtual Reality Space', price: '2800 EVR' },
      { id: '3', name: 'Blockchain Domain', price: '1250 EVR', highlight: 'Hot' },
      { id: '4', name: 'Quantum Realm Access', price: '950 EVR' },
      { id: '5', name: 'Digital Land Parcel', price: '3400 EVR' },
      { id: '6', name: 'Crypto Artwork Series', price: '1800 EVR' }
    ];
    
    // Update state with sample data
    setFeaturedAssets(sampleFeaturedAssets);
    setTrendingAssets(sampleTrendingAssets);
  }, []);
  
  // Sample roadmap data
  const roadmapEvents: RoadmapEvent[] = [
    {
      id: 1,
      phase: 'Q1 2023',
      title: 'Genesis Launch',
      icon: '🚀',
      items: [
        'Platform initial release',
        'Core trading functionality',
        'Asset discovery system'
      ]
    },
    {
      id: 2,
      phase: 'Q2 2023',
      title: 'Quantum Enhancement',
      icon: '⚡',
      items: [
        'Advanced search algorithm',
        'User collections',
        'Multi-wallet integration'
      ]
    },
    {
      id: 3,
      phase: 'Q3 2023',
      title: 'Nexus Expansion',
      icon: '🌐',
      items: [
        'Marketplace analytics',
        'Auction system',
        'Mobile application'
      ]
    },
    {
      id: 4,
      phase: 'Q4 2023',
      title: 'Cosmic Growth',
      icon: '🌌',
      items: [
        'Developer API access',
        'Partnership ecosystem',
        'Cross-chain bridges'
      ]
    }
  ];
  
  // Feature card data for generic sections
  const featureCards = {
    developmentKit: {
      title: "Stellar Development Framework",
      description: "Build on the Evrmore blockchain with our comprehensive toolkit designed for developers of all experience levels.",
      features: [
        "Advanced API ecosystem",
        "Development sandboxes",
        "Asset creation templates",
        "Testing environments"
      ],
      buttonText: "Start Building"
    },
    evrmoreeFaucet: {
      title: "Cosmic EVR Faucet",
      description: "Begin your journey with a small amount of EVR. Our faucet provides new explorers with the fuel needed to start their cosmic voyage.",
      features: [
        "Free EVR for newcomers",
        "Simple verification process",
        "Instant quantum delivery",
        "Educational resources"
      ],
      buttonText: "Access Faucet"
    },
    ipfsStorage: {
      title: "Interstellar Storage Network",
      description: "Your digital assets are stored across the galaxy on the decentralized InterPlanetary File System, ensuring permanent availability.",
      features: [
        "Distributed galactic storage",
        "Content addressing algorithms",
        "Efficient data constellation",
        "Redundant backup matrices"
      ],
      buttonText: "Explore Storage"
    },
    networkStatus: {
      title: "Cosmic Network Observatory",
      description: "Monitor the pulse of the Evrmore blockchain network with real-time telemetry and system performance metrics.",
      features: [
        "Network health indicators",
        "Transaction flow visualization",
        "Block explorer integration",
        "System announcements"
      ],
      buttonText: "Check Status"
    },
    launchPad: {
      title: "Asset Launch Platform",
      description: "Deploy your digital assets into the Evrmore ecosystem with our comprehensive launch platform and reach orbiting collectors.",
      features: [
        "Asset creation matrix",
        "Distribution algorithms",
        "Project showcase portal",
        "Marketing amplification"
      ],
      buttonText: "Launch Assets"
    }
  };

  // Render a generic feature card section
  const renderFeatureCard = (
    title: string, 
    icon: React.ReactNode, 
    data: {
      title: string;
      description: string;
      features: string[];
      buttonText: string;
    }
  ) => (
    <section className="cosmic-section tech-border">
      <div className="cosmic-container fade-in-cosmic">
        <SectionTitle icon={icon} title={title} />
        <div className="cosmic-card tech-panel">
          <div className="tech-corner top-left"></div>
          <div className="tech-corner top-right"></div>
          <div className="tech-corner bottom-left"></div>
          <div className="tech-corner bottom-right"></div>
          <div className="tech-glow"></div>
          <h3>{data.title}</h3>
          <p>{data.description}</p>
          <ul className="feature-list cosmic-stagger">
            {data.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <button className="cosmic-button">
            <span className="button-text">{data.buttonText}</span>
            <span className="button-glow"></span>
          </button>
        </div>
      </div>
    </section>
  );
  
  // Navigation handlers for new components
  const handleDiscoveryNavigation = () => {
    window.location.href = '/discovery';
  };
  
  const handleTradingNavigation = () => {
    window.location.href = '/trading';
  };
  
  const handleSecurityNavigation = () => {
    window.location.href = '/security';
  };
  
  const handleStartBuildingClick = () => {
    window.location.href = '/developers';
  };
  
  const handleAccessFaucetClick = () => {
    window.location.href = '/faucet';
  };
  
  const handleExploreStorageClick = () => {
    window.location.href = '/storage';
  };
  
  const handleCheckStatusClick = () => {
    window.location.href = '/network';
  };
  
  const handleExploreProjectsClick = () => {
    window.location.href = '/launch-pad';
  };
  
  return (
    <div className="home cosmic-purple">
      {/* Cursor light effect */}
      <div className="cursor-light" ref={cursorRef}></div>
      
      {/* Cosmic Background */}
      <CosmicBackground starCount={200} nebulaCount={5} />
      
      {/* Hero Section */}
      <HomeHero 
        title="Manticore Exchange"
        body="Your premier destination for trading digital assets on the Evrmore blockchain."
      />
      
      {/* Evrmore Info Section */}
      <section className="cosmic-section tech-border">
        <div className="cosmic-container fade-in-cosmic">
          <SectionTitle icon={<FaAtom />} title="Welcome to the Digital Frontier" />
          <EvrmoreInfo />
        </div>
      </section>
      
      {/* Featured Assets */}
      <section className="cosmic-section tech-border">
        <div className="cosmic-container fade-in-cosmic">
          <SectionTitle icon={<FaGem />} title="Stellar Asset Collection" />
          <div className="featured-card-float">
            <FeaturedAssets 
              isLoading={false}
              listings={featuredAssets}
            />
          </div>
        </div>
      </section>
      
      {/* Asset Discovery - Using new modular component */}
      <AssetDiscovery onExploreClick={handleDiscoveryNavigation} />
      
      {/* Asset Trading - Using new modular component */}
      <AssetTrading onStartTradingClick={handleTradingNavigation} />
      
      {/* Blockchain Security - Using new modular component */}
      <BlockchainSecurity onLearnMoreClick={handleSecurityNavigation} />
      
      {/* Developer Universe - Using new modular component */}
      <DeveloperUniverse onStartBuildingClick={handleStartBuildingClick} />
      
      {/* Wallet Connection */}
      <section className="cosmic-section tech-border">
        <div className="cosmic-container fade-in-cosmic">
          <SectionTitle icon={<FaWallet />} title="Quantum Wallet Integration" />
          <WalletConnection />
        </div>
      </section>
      
      {/* Evrmoore Faucet - Using new modular component */}
      <EvrmooreFaucet onAccessFaucetClick={handleAccessFaucetClick} />
      
      {/* Interstellar Storage - Using new modular component */}
      <InterstellarStorage onExploreStorageClick={handleExploreStorageClick} />
      
      {/* Network Status - Using new modular component */}
      <NetworkStatus onCheckStatusClick={handleCheckStatusClick} />
      
      {/* Launch Pad - Using new modular component */}
      <LaunchPad onExploreProjectsClick={handleExploreProjectsClick} />
      
      {/* Roadmap */}
      <section className="cosmic-section tech-border">
        <div className="cosmic-container fade-in-cosmic">
          <SectionTitle icon={<FaRoad />} title="Stellar Roadmap" />
          <div className="timeline cosmic-timeline">
            {roadmapEvents.map(event => (
              <div className="timeline-item" key={event.id}>
                <div className="timeline-marker"></div>
                <div className="timeline-content tech-panel">
                  <div className="tech-corner top-left"></div>
                  <div className="tech-corner top-right"></div>
                  <div className="tech-corner bottom-left"></div>
                  <div className="tech-corner bottom-right"></div>
                  <h3>{event.title}</h3>
                  <p className="phase-label">{event.phase}</p>
                  <ul className="timeline-list">
                    {event.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Trending Assets */}
      <section className="cosmic-section tech-border">
        <div className="cosmic-container fade-in-cosmic">
          <SectionTitle icon={<FaChartLine />} title="Trending Across the Galaxy" />
          <ListingsScroll listings={trendingAssets} />
        </div>
      </section>
      
      {/* Blockchain Tech Section */}
      <section className="cosmic-section tech-border">
        <div className="cosmic-container fade-in-cosmic">
          <SectionTitle icon={<FaCubes />} title="Powered by Evrmore Blockchain" />
          <div className="blockchain-visualization">
            <div className="blockchain-node central-node">
              <div className="node-pulse"></div>
              <span className="node-label">Evrmore Core</span>
            </div>
            <div className="blockchain-connections">
              {[...Array(5)].map((_, i) => (
                <div className="connection-line" key={i}>
                  <div className="data-packet"></div>
                </div>
              ))}
            </div>
            <div className="blockchain-features">
              <div className="feature-item">
                <h4>Decentralized</h4>
                <p>Distributed network with no single point of failure</p>
              </div>
              <div className="feature-item">
                <h4>Secure</h4>
                <p>Advanced cryptography protects all transactions</p>
              </div>
              <div className="feature-item">
                <h4>Transparent</h4>
                <p>All transactions are publicly verifiable</p>
              </div>
              <div className="feature-item">
                <h4>Efficient</h4>
                <p>Fast transaction processing with low fees</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
