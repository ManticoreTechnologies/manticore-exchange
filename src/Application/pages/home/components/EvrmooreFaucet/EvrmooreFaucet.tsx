import React, { useEffect, useRef } from 'react';
import './EvrmooreFaucet.css';
import { FaTint } from 'react-icons/fa';
import SectionTitle from '../SectionTitle';

interface EvrmooreFaucetProps {
  onAccessFaucetClick?: () => void;
}

/**
 * EvrmooreFaucet component showcasing the free EVR token faucet
 * to help new users get started on the platform.
 */
const EvrmooreFaucet: React.FC<EvrmooreFaucetProps> = ({ onAccessFaucetClick }) => {
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
  
  const handleAccessFaucetClick = () => {
    if (onAccessFaucetClick) {
      onAccessFaucetClick();
    } else {
      // Default behavior - navigate to faucet page
      window.location.href = '/faucet';
    }
  };
  
  return (
    <section className="evrmoore-faucet-section cosmic-section tech-border">
      <div className="cosmic-container fade-in-cosmic" ref={componentRef}>
        <SectionTitle icon={<FaTint />} title="Cosmic EVR Faucet" />
        
        <div className="evrmoore-faucet-content tech-panel">
          <div className="tech-corner top-left"></div>
          <div className="tech-corner top-right"></div>
          <div className="tech-corner bottom-left"></div>
          <div className="tech-corner bottom-right"></div>
          <div className="tech-glow"></div>
          
          <h3>Cosmic EVR Faucet</h3>
          
          <p className="faucet-description">
            Begin your journey with a small amount of EVR. Our faucet provides new explorers with the fuel 
            needed to start their cosmic voyage.
          </p>
          
          <div className="faucet-visualization">
            <div className="faucet-container">
              <div className="token-dispenser">
                <div className="dispenser-top"></div>
                <div className="dispenser-body">
                  <div className="dispenser-logo">EVR</div>
                </div>
                <div className="dispenser-tap"></div>
              </div>
              
              <div className="token-stream">
                {Array(5).fill(0).map((_, index) => (
                  <div key={index} className="token-drop" style={{ animationDelay: `${index * 0.3}s` }}></div>
                ))}
              </div>
              
              <div className="wallet-container">
                <div className="wallet-top">
                  <div className="wallet-indicator"></div>
                </div>
                <div className="wallet-body">
                  <div className="wallet-tokens">
                    <div className="token-counter">100</div>
                    <div className="token-label">EVR</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="faucet-steps">
              <div className="faucet-step">
                <div className="step-number">1</div>
                <div className="step-text">Connect Your Wallet</div>
              </div>
              <div className="faucet-step">
                <div className="step-number">2</div>
                <div className="step-text">Verify Human (No Bots)</div>
              </div>
              <div className="faucet-step">
                <div className="step-number">3</div>
                <div className="step-text">Receive Free EVR</div>
              </div>
            </div>
          </div>
          
          <ul className="feature-list cosmic-stagger">
            <li>Free EVR for newcomers</li>
            <li>Simple verification process</li>
            <li>Instant quantum delivery</li>
            <li>Educational resources</li>
          </ul>
          
          <button className="cosmic-button" onClick={handleAccessFaucetClick}>
            <span className="button-text">Access Faucet</span>
            <span className="button-glow"></span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default EvrmooreFaucet; 