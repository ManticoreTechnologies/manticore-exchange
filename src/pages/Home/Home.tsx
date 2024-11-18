import React from 'react';

import { FaSearch, FaExchangeAlt, FaBlog, FaRoad, FaUser, FaChartLine } from 'react-icons/fa'; 
import HomeHero from '../../components/Heros/HomeHero/HomeHero';
import InfoCard from '../../components/Cards/InfoCard';

import manticore_logo from '../../images/enhanced_logo.png'; 
import './Home.css'; 
import { FaFaucetDrip } from 'react-icons/fa6';

const Home: React.FC = () => {
  return (
    <div className="home">

      <HomeHero 
        title="Manticore"
        subtitle="EVRything EVRmore"
        logo = {manticore_logo}
        body="Your premier destination for trading digital assets on the Evrmore blockchain."
      />

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
      <InfoCard 
        FaIcon={FaChartLine} 
        to="/chart" 
        title="Chart" 
        action="View Chart" 
        body="Stay up-to-date with the latest market trends and insights on the Evrmore blockchain with our interactive chart."
      />
      <InfoCard 
        FaIcon={FaUser} 
        to="/profile" 
        title="Profile" 
        action="View Profile" 
        body="Manage your account, view your assets, and access exclusive features with your Manticore profile."
      />

      </div>
    </div>
  );
};

export default Home;
