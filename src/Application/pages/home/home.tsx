import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import ParticlesBg from 'particles-bg';
import { TypeAnimation } from 'react-type-animation';
import manticore_logo from '@/Application/logos/white-manticore.png';
import HomeHero from '@/Application/components/heros/home-hero/home-hero';
import InfoCard from '@/Application/components/cards/info-cards/info-card';
import { FaSearch, FaExchangeAlt, FaBlog, FaRoad, FaChartArea, FaDatabase, FaFaucet } from 'react-icons/fa';
import './home.css';

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

  // Interactive effects for the entire page
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty('--mouse-x', `${x}%`);
      document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollY / height;
      document.documentElement.style.setProperty('--scroll-progress', `${progress}`);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('scroll', handleScroll);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Animation variants for scroll animations
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div className="home">
      <ParticlesBg 
        type="cobweb" 
        bg={true} 
        color="#ff6b6b"
        num={100}
      />
      
      {/* Hero Section */}
      <HomeHero 
        title="Manticore"
        body="Your premier destination for trading digital assets on the Evrmore blockchain."
        logo={manticore_logo}
      />

      {/* Evrmore Info Section */}
      <EvrmoreInfo />

      {/* Wallet Connection Section */}
      <WalletConnection />
      
      {/* Market Stats Section */}
      <MarketStats stats={marketStats} />

      {/* Featured Assets Section */}
      <FeaturedAssets isLoading={false} listings={dummyListings} />

      {/* Scrolling Listings Section */}
      <section className="listings-scroll">
        <div className="section-content">
          <motion.div 
            className="scroll-container glassmorphism"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
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
      </section>

      {/* Services Grid */}
      <section className="services-grid">
        <div className="section-content">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Platform Services
          </motion.h2>
          
          <motion.div 
            className="infocards"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
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
            ].map((card) => (
              <motion.div
                key={card.title}
                variants={sectionVariants}
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
      </section>
    </div>
  );
};

export default Home;
