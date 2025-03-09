import React, { useEffect, useRef } from 'react';
import './AssetDiscovery.css';
import { FaSearch } from 'react-icons/fa';
import SectionTitle from '../SectionTitle';

interface AssetDiscoveryProps {
  onExploreClick?: () => void;
}

/**
 * Asset Discovery component that showcases the quantum search capabilities
 * for finding digital assets on the Evrmore blockchain.
 */
const AssetDiscovery: React.FC<AssetDiscoveryProps> = ({ onExploreClick }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  
  // Set up intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      },
      { threshold: 0.1 }
    );
    
    if (componentRef.current) {
      observer.observe(componentRef.current);
    }
    
    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, []);
  
  const handleExploreClick = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      // Default behavior - navigate to discovery page
      window.location.href = '/discovery';
    }
  };
  
  return (
    <section className="asset-discovery-section cosmic-section tech-border">
      <div className="cosmic-container fade-in-cosmic" ref={componentRef}>
        <SectionTitle icon={<FaSearch />} title="Quantum Asset Discovery" />
        
        <div className="asset-discovery-content tech-panel">
          <div className="tech-corner top-left"></div>
          <div className="tech-corner top-right"></div>
          <div className="tech-corner bottom-left"></div>
          <div className="tech-corner bottom-right"></div>
          <div className="tech-glow"></div>
          
          <h3>Quantum Asset Discovery</h3>
          
          <p className="discovery-description">
            Navigate the digital cosmos with our advanced discovery system. Find exactly what you're 
            looking for in the vast universe of Evrmore assets.
          </p>
          
          <div className="search-visualization">
            <div className="search-beam"></div>
            <div className="search-results">
              <div className="result-item"></div>
              <div className="result-item"></div>
              <div className="result-item"></div>
            </div>
          </div>
          
          <ul className="feature-list cosmic-stagger">
            <li>Neural network filtering</li>
            <li>Categorical quantum indexing</li>
            <li>Trend analysis algorithms</li>
            <li>Personalized discovery matrix</li>
          </ul>
          
          <button className="cosmic-button" onClick={handleExploreClick}>
            <span className="button-text">Explore Assets</span>
            <span className="button-glow"></span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default AssetDiscovery; 