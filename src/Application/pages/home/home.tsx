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
        cursorRef.current.style.transform = `translate(${cursorPosition.x}px, ${cursorPosition.y}px) translateZ(0)`;
      }
      
      animationFrame = requestAnimationFrame(animateCursor);
    };
    
    // Start the animation
    animationFrame = requestAnimationFrame(animateCursor);
    
    // Clean up event listeners and animations
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrame);
    };
  }, [isAnimating, targetCursorPosition, cursorPosition]);
  
  // Initialize IntersectionObserver for animations
  useEffect(() => {
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
    const animatedElements = document.querySelectorAll('.fade-in-cosmic, .cosmic-stagger, .cosmic-section, .tech-glow');
    animatedElements.forEach(el => observer.observe(el));
    
    return () => {
      animatedElements.forEach(el => observer.unobserve(el));
      observer.disconnect();
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
    assetDiscovery: {
      title: "Quantum Asset Discovery",
      description: "Navigate the digital cosmos with our advanced discovery system. Find exactly what you're looking for in the vast universe of Evrmore assets.",
      features: [
        "Neural network filtering",
        "Categorical quantum indexing",
        "Trend analysis algorithms",
        "Personalized discovery matrix"
      ],
      buttonText: "Explore Assets"
    },
    assetTrading: {
      title: "Secure Stellar Trading",
      description: "Exchange digital assets with the security of a neutron star. Our advanced trading system ensures safe, fast, and reliable transactions.",
      features: [
        "Quantum-encrypted escrow",
        "Light-speed transfers",
        "Minimal transaction fees",
        "Immutable ledger history"
      ],
      buttonText: "Start Trading"
    },
    blockchainSecurity: {
      title: "Supernova Security Protocol",
      description: "Your assets are protected by state-of-the-art blockchain security measures, ensuring maximum protection across the digital universe.",
      features: [
        "Quantum-resistant encryption",
        "Distributed security matrix",
        "Real-time threat analysis",
        "Multi-layer authentication"
      ],
      buttonText: "Learn More"
    },
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
      
      {/* Asset Discovery */}
      {renderFeatureCard("Quantum Asset Discovery", <FaSearch />, featureCards.assetDiscovery)}
      
      {/* Asset Trading */}
      {renderFeatureCard("Stellar Trading System", <FaExchangeAlt />, featureCards.assetTrading)}
      
      {/* Blockchain Security */}
      {renderFeatureCard("Supernova Security", <FaShieldAlt />, featureCards.blockchainSecurity)}
      
      {/* Developer Toolkit */}
      {renderFeatureCard("Developer Universe", <FaCode />, featureCards.developmentKit)}
      
      {/* Wallet Connection */}
      <section className="cosmic-section tech-border">
        <div className="cosmic-container fade-in-cosmic">
          <SectionTitle icon={<FaWallet />} title="Quantum Wallet Integration" />
          <WalletConnection />
        </div>
      </section>
      
      {/* Evrmore Faucet */}
      {renderFeatureCard("Cosmic EVR Faucet", <FaTint />, featureCards.evrmoreeFaucet)}
      
      {/* IPFS Storage */}
      {renderFeatureCard("Interstellar Storage", <FaDatabase />, featureCards.ipfsStorage)}
      
      {/* Network Status */}
      {renderFeatureCard("Cosmic Network", <FaNetworkWired />, featureCards.networkStatus)}
      
      {/* Launch Pad */}
      {renderFeatureCard("Asset Launch Platform", <FaRocket />, featureCards.launchPad)}
      
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
