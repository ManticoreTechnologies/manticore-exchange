import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ParticlesBg from 'particles-bg';
import { TypeAnimation } from 'react-type-animation';

//@ts-ignore
import { FaSearch, FaExchangeAlt, FaBlog, FaRoad, FaUser, FaChartLine, FaRocket, FaComments, FaFire, FaTrophy, FaChartArea } from 'react-icons/fa'; 
import HomeHero from '@/Application/components/heros/home-hero/home-hero';
import InfoCard from '@/Application/components/cards/info-cards/info-card';
import { FaFaucetDrip } from 'react-icons/fa6';
import './home.css';
//import LaunchPadBanner from '@/Application/components/LaunchPadBanner/LaunchPadBanner';

// Import the logo
import manticore_logo from '@/Application/logos/white-manticore.png'; 


//@ts-ignore
import Townhall from './Townhall/Townhall';

// Mock data for featured assets
const featuredAssets = [
  { id: 1, name: 'EVRSAFE', price: '1250 EVR', change: '+15.2%', volume: '25.5K EVR' },
  { id: 2, name: 'EVRART', price: '850 EVR', change: '+8.7%', volume: '12.3K EVR' },
  { id: 3, name: 'EVRGAME', price: '2100 EVR', change: '+22.1%', volume: '45.2K EVR' },
];

// Mock data for market stats
const marketStats = [
  { label: '24h Volume', value: '152.5K EVR', trend: 'up' },
  { label: 'Active Trades', value: '1,234', trend: 'up' },
  { label: 'Market Cap', value: '2.5M EVR', trend: 'up' },
];

const Home: React.FC = () => {
  const [tradeCount, setTradeCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);

  // Simulate increasing stats
  useEffect(() => {
    const interval = setInterval(() => {
      setTradeCount(prev => prev + Math.floor(Math.random() * 5));
      setUserCount(prev => prev + Math.floor(Math.random() * 2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate featured assets
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAssetIndex((prev) => (prev + 1) % featuredAssets.length);
    }, 5000);
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

      {/* Live Statistics */}
      <div className="stats-container">
        <motion.div 
          className="stat-box"
          whileHover={{ scale: 1.05 }}
        >
          <h3>Total Trades</h3>
          <p>{tradeCount.toLocaleString()}</p>
        </motion.div>
        <motion.div 
          className="stat-box"
          whileHover={{ scale: 1.05 }}
        >
          <h3>Active Users</h3>
          <p>{userCount.toLocaleString()}</p>
        </motion.div>
      </div>

      {/* Featured Assets Showcase */}
      <motion.div 
        className="featured-assets"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <h2><FaFire className="icon" /> Featured Assets</h2>
        <div className="assets-showcase">
          <AnimatePresence mode="wait">
            {featuredAssets.map((asset, index) => (
              <motion.div
                key={asset.id}
                className={`asset-card ${index === currentAssetIndex ? 'active' : ''}`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: index === currentAssetIndex ? 1 : 0, x: index === currentAssetIndex ? 0 : 100 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <div className="asset-info">
                  <h3>{asset.name}</h3>
                  <p className="price">{asset.price}</p>
                  <p className="change positive">{asset.change}</p>
                  <p className="volume">Vol: {asset.volume}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="asset-indicators">
            {featuredAssets.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentAssetIndex ? 'active' : ''}`}
                onClick={() => setCurrentAssetIndex(index)}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Market Pulse Section */}
      <motion.div 
        className="market-pulse"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <h2><FaChartArea className="icon" /> Market Pulse</h2>
        <div className="market-stats-grid">
          {marketStats.map((stat, index) => (
            <motion.div
              key={index}
              className="market-stat-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <h3>{stat.label}</h3>
              <p className="value">{stat.value}</p>
              <div className={`trend ${stat.trend}`}>
                {stat.trend === 'up' ? '↑' : '↓'}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Start Guide */}
      <motion.div 
        className="quick-start"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2>Get Started in 3 Easy Steps</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Connect Wallet</h3>
            <p>Link your Evrmore wallet to start trading</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Browse Assets</h3>
            <p>Explore our wide range of digital assets</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Start Trading</h3>
            <p>Buy, sell, and exchange with ease</p>
          </div>
        </div>
      </motion.div>

      {/* Info Cards */}
      <div className="infocards">
        <InfoCard 
          FaIcon={FaSearch} 
          to="/search" 
          title="Search" 
          action="Search Now" 
          body="Explore a wide range of assets created on the Evrmore blockchain. Use our advanced search features to find exactly what you're looking for."
        />
        <InfoCard 
          FaIcon={FaExchangeAlt}
          to="/trade"
          title="Trade"
          action="Trade Now"
          body="Buy, sell, and exchange assets easily with our secure trading platform. Start trading today and take advantage of our user-friendly interface."
        />
        <InfoCard 
          FaIcon={FaFaucetDrip}
          to="/faucet"
          title="Faucet"
          action="Claim Now"
          body="Need some assets to get started? Use our faucet to request free assets and kickstart your journey on the Evrmore blockchain."
        />
        <InfoCard 
          FaIcon={FaBlog}
          to="/blog"
          title="Blog"
          action="Read Now"
          body="Stay updated with the latest news, insights, and updates from the Manticore Asset Exchange. Learn more about the future of digital assets and our platform."
        />
        
        {/*<InfoCard 
         FaIcon={FaComments}
          to="/chat"
          title="Chat"
          action="Join Chat"
          body="Connect with other traders, discuss assets, and stay updated with real-time community conversations in our secure chat platform."
        />*/}
  
      <InfoCard 
        FaIcon={FaRoad} 
        to="/roadmap" 
        title="Roadmap" 
        action="View Roadmap" 
        body="Explore our roadmap to see what's in store for the future of Manticore and the Evrmore blockchain."
      />
      <InfoCard 
        FaIcon={FaRoad} 
        to="/ipfs" 
        title="IPFS" 
        action="Learn More" 
        body="Discover how we're utilizing InterPlanetary File System (IPFS) for decentralized data storage and sharing."
      />
      {/*<InfoCard 
        FaIcon={FaChartLine} 
        to="/chart" 
        title="Chart" 
        action="View Chart" 
        body="Stay up-to-date with the latest market trends and insights on the Evrmore blockchain with our interactive chart."
      />*/}
      <InfoCard 
        FaIcon={FaUser} 
        to="/profile" 
        title="Profile" 
        action="View Profile" 
        body="Manage your account, view your assets, and access exclusive features with your Manticore profile."
      />

       {/*
        <InfoCard 
         FaIcon={FaRocket}
         to="/launch"
         title="Launch Pad"
         action="Launch Now"
         body="Create and launch your own EVR Assets with customizable parameters including supply, price, and vesting schedules."
       /> 
       */}

      </div>

      {/* Latest Activity Ticker */}
      <div className="activity-ticker">
        <h3>Live Activity</h3>
        <div className="ticker-content">
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {/* Simulated activity items */}
            <span>🔄 Asset XYZ traded • </span>
            <span>💎 New listing added • </span>
            <span>📈 Market up 5% • </span>
            <span>👥 New user joined • </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
