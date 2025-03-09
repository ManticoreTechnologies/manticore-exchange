import React, { useEffect, useRef } from 'react';
import './InterstellarStorage.css';
import { FaDatabase } from 'react-icons/fa';
import SectionTitle from '../SectionTitle';

interface InterstellarStorageProps {
  onExploreStorageClick?: () => void;
}

/**
 * InterstellarStorage component showcasing the decentralized storage
 * capabilities using IPFS technology.
 */
const InterstellarStorage: React.FC<InterstellarStorageProps> = ({ onExploreStorageClick }) => {
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
  
  const handleExploreStorageClick = () => {
    if (onExploreStorageClick) {
      onExploreStorageClick();
    } else {
      // Default behavior - navigate to storage page
      window.location.href = '/storage';
    }
  };
  
  // Create array of 6 nodes
  const nodeData = [
    { id: 1, label: 'Node A' },
    { id: 2, label: 'Node B' },
    { id: 3, label: 'Node C' },
    { id: 4, label: 'Node D' },
    { id: 5, label: 'Node E' },
    { id: 6, label: 'Node F' }
  ];
  
  return (
    <section className="interstellar-storage-section cosmic-section tech-border">
      <div className="cosmic-container fade-in-cosmic" ref={componentRef}>
        <SectionTitle icon={<FaDatabase />} title="Interstellar Storage" />
        
        <div className="interstellar-storage-content tech-panel">
          <div className="tech-corner top-left"></div>
          <div className="tech-corner top-right"></div>
          <div className="tech-corner bottom-left"></div>
          <div className="tech-corner bottom-right"></div>
          <div className="tech-glow"></div>
          
          <h3>Interstellar Storage Network</h3>
          
          <p className="storage-description">
            Your digital assets are stored across the galaxy on the decentralized InterPlanetary File System, 
            ensuring permanent availability.
          </p>
          
          <div className="storage-visualization">
            <div className="ipfs-network">
              <div className="asset-container">
                <div className="asset-icon">
                  <div className="asset-glow"></div>
                </div>
                <div className="asset-name">Digital Asset</div>
              </div>
              
              <div className="network-nodes">
                {nodeData.map((node, index) => (
                  <div 
                    key={node.id} 
                    className="network-node" 
                    style={{ 
                      '--angle': `${index * 60}deg`,
                      '--delay': `${index * 0.3}s`
                    } as React.CSSProperties}
                  >
                    <div className="node-icon">
                      <div className="node-pulse"></div>
                    </div>
                    <div className="node-label">{node.label}</div>
                    <div className="connection-line">
                      <div className="data-packet"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="storage-benefits">
              <div className="benefit-item">
                <div className="benefit-icon redundancy"></div>
                <div className="benefit-text">Multiple Redundancy</div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon availability"></div>
                <div className="benefit-text">Global Availability</div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon immutable"></div>
                <div className="benefit-text">Immutable Records</div>
              </div>
            </div>
          </div>
          
          <ul className="feature-list cosmic-stagger">
            <li>Distributed galactic storage</li>
            <li>Content addressing algorithms</li>
            <li>Efficient data constellation</li>
            <li>Redundant backup matrices</li>
          </ul>
          
          <button className="cosmic-button" onClick={handleExploreStorageClick}>
            <span className="button-text">Explore Storage</span>
            <span className="button-glow"></span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default InterstellarStorage; 