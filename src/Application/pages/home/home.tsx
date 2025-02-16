import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ParticlesBg from 'particles-bg';
import { TypeAnimation } from 'react-type-animation';
import tradingService, { Listing, ListingsResponse } from '@/Application/services/TradingService';
import { Link, useNavigate } from 'react-router-dom';

//@ts-ignore
import { FaSearch, FaExchangeAlt, FaBlog, FaRoad, FaUser, FaChartLine, FaRocket, FaComments, FaFire, FaTrophy, FaChartArea, FaShieldAlt, FaBolt, FaUsersCog, FaDatabase, FaChartBar, FaCubes } from 'react-icons/fa'; 
import HomeHero from '@/Application/components/heros/home-hero/home-hero';
import InfoCard from '@/Application/components/cards/info-cards/info-card';
import { FaFaucetDrip } from 'react-icons/fa6';
import './home.css';
//import LaunchPadBanner from '@/Application/components/LaunchPadBanner/LaunchPadBanner';

// Import the logo
import manticore_logo from '@/Application/logos/white-manticore.png'; 


//@ts-ignore
import Townhall from './Townhall/Townhall';

// Mock data for market stats
const marketStats = [
  { label: '24h Volume', value: '152.5K EVR', trend: 'up' },
  { label: 'Active Trades', value: '1,234', trend: 'up' },
  { label: 'Market Cap', value: '2.5M EVR', trend: 'up' },
];

const evrmoreInfo = {
  title: "Welcome to the Future of Digital Assets",
  description: "Evrmore is a revolutionary blockchain platform that enables the creation, management, and trading of digital assets with unprecedented flexibility and security.",
  keyPoints: [
    {
      icon: FaShieldAlt,
      title: "What is Evrmore?",
      description: "Evrmore is a secure, decentralized blockchain platform designed for creating and managing digital assets. Built with advanced technology, it offers fast transactions and low fees."
    },
    {
      icon: FaCubes,
      title: "Evrmore Assets",
      description: "Create and trade digital assets representing anything from art and collectibles to real estate and securities. Each asset is unique, secure, and easily transferable."
    },
    {
      icon: FaRocket,
      title: "Why Choose Evrmore?",
      description: "Experience the power of true digital ownership with our battle-tested blockchain, advanced security features, and vibrant community-driven ecosystem."
    }
  ]
};

const Home: React.FC = () => {
  const [tradeCount, setTradeCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [featuredListings, setFeaturedListings] = useState<any[]>([]);
  const [scrollingListings, setScrollingListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [homeListings, setHomeListings] = useState<any>(null);
  const navigate = useNavigate();

  const fetchHomeListings = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await tradingService.getHomeListings({
        featured_count: 5,
        trending_count: 10,
        new_count: 10,
        trending_timeframe: '24h',
        new_hours: 24
      });
      
      if (response) {
        // Featured listings for the grid
        const featured = response.featured?.listings.map((listing: Listing) => ({
          id: listing.id,
          title: listing.name,
          store_name: listing.name,
          asset_name: listing.balances[0]?.asset_name || '',
          price: listing.prices[0]?.price_evr || '0',
          image_hash: listing.image_ipfs_hash || listing.prices[0]?.ipfs_hash || null
        })) || [];

        // Scrolling listings combining new and trending
        const scrolling = [
          ...(response.new?.listings || []).map((listing: Listing) => ({
            id: listing.id,
            title: listing.name,
            store_name: listing.name,
            asset_name: listing.balances[0]?.asset_name || '',
            price: listing.prices[0]?.price_evr || '0',
            highlight: 'New',
            image_hash: listing.image_ipfs_hash || listing.prices[0]?.ipfs_hash || null
          })),
          ...(response.trending?.listings || []).map((listing: Listing) => ({
            id: listing.id,
            title: listing.name,
            store_name: listing.name,
            asset_name: listing.balances[0]?.asset_name || '',
            price: listing.prices[0]?.price_evr || '0',
            highlight: 'Trending',
            image_hash: listing.image_ipfs_hash || listing.prices[0]?.ipfs_hash || null
          }))
        ];
        
        setFeaturedListings(featured);
        setScrollingListings(scrolling);
        setHomeListings(response);
      }
    } catch (error) {
      console.error('Error fetching home listings:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeListings();
  }, [fetchHomeListings]);

  const handleListingClick = (listing: any) => {
    navigate(`/trade/listings/by-id/${listing.id}`);
  };

  // Simulate increasing stats
  useEffect(() => {
    const interval = setInterval(() => {
      setTradeCount(prev => prev + Math.floor(Math.random() * 5));
      setUserCount(prev => prev + Math.floor(Math.random() * 2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home">
      <ParticlesBg type="cobweb" bg={true} />
      
     

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <HomeHero 
          title="Manticore"
          subtitle={
            <TypeAnimation
              sequence={[
                'EVRything EVRmore',
                2000,
                'Trade with Confidence',
                2000,
                'Secure. Fast. Reliable.',
                2000
              ]}
              wrapper="span"
              repeat={Infinity}
            />
          }
          logo={manticore_logo}
          body="Your premier destination for trading digital assets on the Evrmore blockchain."
        />
      </motion.div>

      <section className="evrmore-intro">
        <motion.div
          className="intro-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2>{evrmoreInfo.title}</h2>
          <p className="intro-description">{evrmoreInfo.description}</p>
          
          <div className="intro-grid">
            {evrmoreInfo.keyPoints.map((point, index) => (
              <motion.div
                key={index}
                className="intro-card glassmorphism"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 8px 32px rgba(255, 107, 107, 0.1)"
                }}
              >
                <point.icon className="intro-icon" />
                <h3>{point.title}</h3>
                <p>{point.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="intro-cta glassmorphism"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3>Ready to Get Started?</h3>
            <p>Join the Evrmore community and start exploring the possibilities of digital assets today.</p>
            <div className="cta-buttons">
              <a href="https://docs.evrmore.org" target="_blank" rel="noopener noreferrer" className="cta-button primary">
                Learn More
              </a>
              <a href="https://discord.gg/evrmore" target="_blank" rel="noopener noreferrer" className="cta-button secondary">
                Join Community
              </a>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Live Market Stats */}
      <section className="market-stats">
        <motion.div 
          className="stats-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {marketStats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card glassmorphism"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3>{stat.label}</h3>
              <p className="value">{stat.value}</p>
              <div className={`trend ${stat.trend}`}>
                {stat.trend === 'up' ? '↑' : '↓'}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Assets Section */}
      <section className="featured-assets">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <FaFire className="icon" /> Featured Assets
        </motion.h2>
        <div className="assets-grid">
          {isLoading ? (
            <div className="loading">Loading featured assets...</div>
          ) : featuredListings.length > 0 ? (
            featuredListings.map((listing, index) => (
              <motion.div
                key={`featured-${listing.id}-${index}`}
                className="asset-card glassmorphism"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleListingClick(listing)}
              >
                <div className="asset-info">
                  <h3>{listing.title}</h3>
                  <p className="price">
                    {listing.price ? `${listing.price} EVR` : 'Price not set'}
                  </p>
                  <p className="description">{listing.highlight ? `(${listing.highlight})` : 'No description available'}</p>
                  {listing.tags && listing.tags.length > 0 && (
                    <div className="tags">
                      {listing.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="no-listings">No featured assets available</div>
          )}
        </div>
      </section>

      {/* Interactive Services Grid */}
      <section className="services-grid">
        <motion.div 
          className="infocards"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <InfoCard 
            FaIcon={FaSearch} 
            to="/search" 
            title="Search Assets" 
            action="Explore Now" 
            body="Find the perfect assets for your portfolio with our advanced search features."
          />
          <InfoCard 
            FaIcon={FaExchangeAlt}
            to="/trade"
            title="Trade"
            action="Start Trading"
            body="Execute trades instantly with our high-performance trading engine."
          />
          <InfoCard 
            FaIcon={FaFaucetDrip}
            to="/faucet"
            title="Faucet"
            action="Get Started"
            body="New to Evrmore? Get your first assets free from our community faucet."
          />
          <InfoCard 
            FaIcon={FaRoad} 
            to="/roadmap" 
            title="Roadmap" 
            action="View Future" 
            body="Discover our vision and upcoming features that will revolutionize asset trading."
          />
          <InfoCard 
            FaIcon={FaBlog} 
            to="/blog" 
            title="Blog" 
            action="Read More" 
            body="Stay updated with the latest news, updates, and insights from the Manticore team."
          />
          <InfoCard 
            FaIcon={FaDatabase} 
            to="/ipfs" 
            title="IPFS Storage" 
            action="Store Now" 
            body="Securely store and manage your asset metadata using decentralized IPFS storage."
          />
          <InfoCard 
            FaIcon={FaChartArea} 
            to="/chart" 
            title="EVR Chart" 
            action="View Chart" 
            body="Track EVR price movements and market trends with our interactive chart."
          />
        </motion.div>
      </section>

      {/* Project Highlights */}
      <section className="project-highlights">
        <motion.div 
          className="highlights-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="highlight-card glassmorphism">
            <FaShieldAlt className="icon" />
            <h3>Secure by Design</h3>
            <p>Built on Evrmore's battle-tested blockchain with state-of-the-art security measures.</p>
          </div>
          <div className="highlight-card glassmorphism">
            <FaBolt className="icon" />
            <h3>Lightning Fast</h3>
            <p>Experience instant trades and real-time updates with our optimized platform.</p>
          </div>
          <div className="highlight-card glassmorphism">
            <FaUsersCog className="icon" />
            <h3>Community Driven</h3>
            <p>Shaped by traders, for traders. Your success is our top priority.</p>
          </div>
        </motion.div>
      </section>

      {/* Scrolling Listings Section */}
      <section className="listings-scroll">
        <motion.div 
          className="scroll-container glassmorphism"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h3>Available Assets</h3>
          <div className="scroll-content">
            {isLoading ? (
              <div className="loading">Loading assets...</div>
            ) : scrollingListings.length > 0 ? (
              <motion.div
                animate={{ x: scrollingListings.length > 4 ? [0, -1000] : 0 }}
                transition={{ 
                  duration: 30, 
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
            ) : (
              <div className="no-listings">No assets available</div>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
