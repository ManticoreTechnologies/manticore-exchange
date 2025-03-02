import React, { useEffect } from 'react';
import { HomeHero } from '@/Application/components/heros/home-hero';
import FeaturedAssets from './components/FeaturedAssets/FeaturedAssets';
import MarketStats from './components/MarketStats/MarketStats';
import WalletConnection from './components/WalletConnection/WalletConnection';
import EvrmoreInfo from './components/EvrmoreInfo/EvrmoreInfo';
import ServicesGrid from './components/ServicesGrid/ServicesGrid';
import ProjectHighlights from './components/ProjectHighlights/ProjectHighlights';
import ListingsScroll from './components/ListingsScroll/ListingsScroll';
import './home.css';
import './space-tech-theme.css';

// Mock data for listings
const mockListings = [
  {
    id: '1',
    title: 'Digital Asset Token',
    price: '2,500 EVR',
    highlight: 'Featured',
    tags: ['Token', 'NFT']
  },
  {
    id: '2',
    title: 'Space Collection #42',
    price: '1,200 EVR',
    highlight: 'Limited',
    tags: ['Collectible', 'Art']
  },
  {
    id: '3',
    title: 'Interstellar Domain',
    price: '5,000 EVR',
    highlight: 'Popular',
    tags: ['Domain', 'Digital']
  }
];

// Mock data for scrolling listings
const scrollListings = [
  { id: 'a1', name: 'Quantum Token', price: '3,200 EVR', highlight: 'New' },
  { id: 'a2', name: 'Neural Link #7', price: '1,850 EVR' },
  { id: 'a3', name: 'Stellar Domain', price: '4,500 EVR', highlight: 'Hot' },
  { id: 'a4', name: 'Crypto Art #42', price: '2,100 EVR' },
  { id: 'a5', name: 'EVR Collectible', price: '950 EVR', highlight: 'Limited' },
  { id: 'a6', name: 'Space Station', price: '6,300 EVR' }
];

// Mock data for market stats
const marketStats = [
  { label: '24h Volume', value: '152.5K EVR', trend: 'up' as const },
  { label: 'Active Trades', value: '1,234', trend: 'up' as const },
  { label: 'Listed Assets', value: '8,721', trend: 'up' as const },
  { label: 'Market Cap', value: '45.2M EVR', trend: 'down' as const }
];

const Home: React.FC = () => {
  useEffect(() => {
    document.title = 'Evrmore Exchange - Home';
    
    // Create mousemove effect for spotlight hover
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll('.glass-card');
      cards.forEach(card => {
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        (card as HTMLElement).style.setProperty('--x', `${x}px`);
        (card as HTMLElement).style.setProperty('--y', `${y}px`);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="home-container home space-tech">
      {/* Space background elements */}
      <div className="space-background"></div>
      <div className="nebula nebula-1"></div>
      <div className="nebula nebula-2"></div>
      
      {/* Grid patterns */}
      <div className="grid-pattern top"></div>
      <div className="grid-pattern bottom"></div>
      
      {/* Hero section */}
      <HomeHero 
        title="Evrmore Exchange"
        subtitle="Trade Digital Assets Securely"
        body="Welcome to the future of digital asset trading with Evrmore Exchange. Experience secure, transparent, and efficient transactions with our cutting-edge blockchain platform."
      />
      
      {/* Main content sections */}
      <div className="home-content">
        {/* Market Stats */}
        <div className="home-section">
          <div className="section-wrapper">
            <MarketStats stats={marketStats} />
          </div>
        </div>
        
        {/* Featured Assets */}
        <div className="home-section">
          <div className="section-wrapper">
            <FeaturedAssets isLoading={false} listings={mockListings} />
          </div>
        </div>
        
        {/* Evrmore Info */}
        <div className="home-section">
          <div className="section-wrapper">
            <EvrmoreInfo />
          </div>
        </div>
        
        {/* Available Assets Scroll */}
        <div className="home-section">
          <div className="section-wrapper">
            <ListingsScroll listings={scrollListings} />
          </div>
        </div>
        
        {/* Wallet Connection */}
        <div className="home-section">
          <div className="section-wrapper">
            <WalletConnection />
          </div>
        </div>
        
        {/* Services Grid */}
        <div className="home-section">
          <div className="section-wrapper">
            <ServicesGrid />
          </div>
        </div>
        
        {/* Project Highlights */}
        <div className="home-section">
          <div className="section-wrapper">
            <ProjectHighlights />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 