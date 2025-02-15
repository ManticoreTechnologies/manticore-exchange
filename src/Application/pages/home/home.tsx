import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ParticlesBg from 'particles-bg';
import { TypeAnimation } from 'react-type-animation';
import tradingService, { Listing, ListingsResponse } from '@/Application/services/TradingService';

//@ts-ignore
import { FaSearch, FaExchangeAlt, FaBlog, FaRoad, FaUser, FaChartLine, FaRocket, FaComments, FaFire, FaTrophy, FaChartArea, FaShieldAlt, FaBolt, FaUsersCog, FaDatabase, FaChartBar } from 'react-icons/fa'; 
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

const Home: React.FC = () => {
  const [tradeCount, setTradeCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch featured listings
  useEffect(() => {
    const fetchFeaturedListings = async () => {
      try {
        const response = await tradingService.getFeaturedListings(1, 50); // Get up to 50 featured listings
        setFeaturedListings(response.listings);
      } catch (error) {
        console.error('Error fetching featured listings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedListings();
  }, []);

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
            featuredListings.map((listing) => (
              <motion.div
                key={listing.id}
                className="asset-card glassmorphism"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="asset-info">
                  <h3>{listing.name}</h3>
                  <p className="price">
                    {listing.prices[0]?.price_evr ? `${listing.prices[0].price_evr} EVR` : 'Price not set'}
                  </p>
                  <p className="description">{listing.description || 'No description available'}</p>
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

      {/* Live Activity Feed */}
      <section className="activity-feed">
        <motion.div 
          className="activity-ticker glassmorphism"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h3>Live Activity</h3>
          <div className="ticker-content">
            <motion.div
              animate={{ x: [0, -1000] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <span>🔄 EVRSAFE/EVR: 1250 EVR • </span>
              <span>💎 New Asset Listed: EVRART • </span>
              <span>📈 EVRGAME up 22.1% • </span>
              <span>👥 Trading Volume: 152.5K EVR • </span>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
