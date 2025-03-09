import React, { useEffect, useRef } from 'react';
import './AssetTrading.css';
import { FaExchangeAlt } from 'react-icons/fa';
import SectionTitle from '../SectionTitle';

interface AssetTradingProps {
  onStartTradingClick?: () => void;
}

/**
 * Asset Trading component that showcases the secure trading capabilities
 * for Evrmore blockchain assets.
 */
const AssetTrading: React.FC<AssetTradingProps> = ({ onStartTradingClick }) => {
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
  
  const handleStartTradingClick = () => {
    if (onStartTradingClick) {
      onStartTradingClick();
    } else {
      // Default behavior - navigate to trading page
      window.location.href = '/trading';
    }
  };
  
  return (
    <section className="asset-trading-section cosmic-section tech-border">
      <div className="cosmic-container fade-in-cosmic" ref={componentRef}>
        <SectionTitle icon={<FaExchangeAlt />} title="Stellar Trading System" />
        
        <div className="asset-trading-content tech-panel">
          <div className="tech-corner top-left"></div>
          <div className="tech-corner top-right"></div>
          <div className="tech-corner bottom-left"></div>
          <div className="tech-corner bottom-right"></div>
          <div className="tech-glow"></div>
          
          <h3>Secure Stellar Trading</h3>
          
          <p className="trading-description">
            Exchange digital assets with the security of a neutron star. Our advanced trading system 
            ensures safe, fast, and reliable transactions.
          </p>
          
          <div className="trading-visualization">
            <div className="sender-wallet">
              <div className="wallet-header">Wallet A</div>
              <div className="wallet-body">
                <div className="asset-icon"></div>
              </div>
            </div>
            
            <div className="transaction-path">
              <div className="transaction-particle"></div>
              <div className="transaction-particle"></div>
              <div className="transaction-particle"></div>
            </div>
            
            <div className="receiver-wallet">
              <div className="wallet-header">Wallet B</div>
              <div className="wallet-body">
                <div className="asset-icon delayed"></div>
              </div>
            </div>
          </div>
          
          <ul className="feature-list cosmic-stagger">
            <li>Quantum-encrypted escrow</li>
            <li>Light-speed transfers</li>
            <li>Minimal transaction fees</li>
            <li>Immutable ledger history</li>
          </ul>
          
          <button className="cosmic-button" onClick={handleStartTradingClick}>
            <span className="button-text">Start Trading</span>
            <span className="button-glow"></span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default AssetTrading; 