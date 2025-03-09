import React, { useEffect, useRef } from 'react';
import './BlockchainSecurity.css';
import { FaShieldAlt } from 'react-icons/fa';
import SectionTitle from '../SectionTitle';

interface BlockchainSecurityProps {
  onLearnMoreClick?: () => void;
}

/**
 * BlockchainSecurity component showcasing the security features
 * of the platform.
 */
const BlockchainSecurity: React.FC<BlockchainSecurityProps> = ({ onLearnMoreClick }) => {
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
  
  const handleLearnMoreClick = () => {
    if (onLearnMoreClick) {
      onLearnMoreClick();
    } else {
      // Default behavior - navigate to security page
      window.location.href = '/security';
    }
  };
  
  return (
    <section className="blockchain-security-section cosmic-section tech-border">
      <div className="cosmic-container fade-in-cosmic" ref={componentRef}>
        <SectionTitle icon={<FaShieldAlt />} title="Supernova Security" />
        
        <div className="blockchain-security-content tech-panel">
          <div className="tech-corner top-left"></div>
          <div className="tech-corner top-right"></div>
          <div className="tech-corner bottom-left"></div>
          <div className="tech-corner bottom-right"></div>
          <div className="tech-glow"></div>
          
          <h3>Supernova Security Protocol</h3>
          
          <p className="security-description">
            Your assets are protected by state-of-the-art blockchain security measures, ensuring maximum 
            protection across the digital universe.
          </p>
          
          <div className="security-visualization">
            <div className="security-shield">
              <div className="shield-core"></div>
              <div className="shield-layer shield-layer-1"></div>
              <div className="shield-layer shield-layer-2"></div>
              <div className="shield-layer shield-layer-3"></div>
              <div className="shield-pulse"></div>
            </div>
            
            <div className="security-threads">
              {[...Array(8)].map((_, index) => (
                <div key={index} className={`security-thread security-thread-${index + 1}`}>
                  <div className="thread-node"></div>
                </div>
              ))}
            </div>
          </div>
          
          <ul className="feature-list cosmic-stagger">
            <li>Quantum-resistant encryption</li>
            <li>Distributed security matrix</li>
            <li>Real-time threat analysis</li>
            <li>Multi-layer authentication</li>
          </ul>
          
          <button className="cosmic-button" onClick={handleLearnMoreClick}>
            <span className="button-text">Learn More</span>
            <span className="button-glow"></span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlockchainSecurity; 