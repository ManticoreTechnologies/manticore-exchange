import React from 'react';

import { FaSearch, FaExchangeAlt, FaFaucet, FaBlog } from 'react-icons/fa'; 
import HomeHero from '../../components/Heros/HomeHero/HomeHero';
import InfoCard from '../../components/Cards/InfoCard';

import manticore_logo from '../../images/enhanced_logo.png'; 
import './Home.css'; 
import { FaFaucetDrip } from 'react-icons/fa6';

const Home: React.FC = () => {
  return (
    <div className="home">

      <HomeHero 
        title="Manticore Asset Exchange"
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

      </div>
    </div>
  );
};

export default Home;
