import React, { useEffect, useRef } from 'react';
import './DeveloperUniverse.css';
import { FaCode } from 'react-icons/fa';
import SectionTitle from '../SectionTitle';

interface DeveloperUniverseProps {
  onStartBuildingClick?: () => void;
}

/**
 * DeveloperUniverse component showcasing the development tools
 * and resources available for the Evrmore blockchain.
 */
const DeveloperUniverse: React.FC<DeveloperUniverseProps> = ({ onStartBuildingClick }) => {
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
  
  const handleStartBuildingClick = () => {
    if (onStartBuildingClick) {
      onStartBuildingClick();
    } else {
      // Default behavior - navigate to developers page
      window.location.href = '/developers';
    }
  };
  
  return (
    <section className="developer-universe-section cosmic-section tech-border">
      <div className="cosmic-container fade-in-cosmic" ref={componentRef}>
        <SectionTitle icon={<FaCode />} title="Developer Universe" />
        
        <div className="developer-universe-content tech-panel">
          <div className="tech-corner top-left"></div>
          <div className="tech-corner top-right"></div>
          <div className="tech-corner bottom-left"></div>
          <div className="tech-corner bottom-right"></div>
          <div className="tech-glow"></div>
          
          <h3>Stellar Development Framework</h3>
          
          <p className="developer-description">
            Build on the Evrmore blockchain with our comprehensive toolkit designed for developers of all 
            experience levels.
          </p>
          
          <div className="developer-visualization">
            <div className="code-editor">
              <div className="editor-header">
                <div className="header-dots">
                  <div className="dot dot-red"></div>
                  <div className="dot dot-yellow"></div>
                  <div className="dot dot-green"></div>
                </div>
                <div className="file-name">manticore-api.js</div>
              </div>
              <div className="code-content">
                <div className="code-line"><span className="code-comment">// Connect to the Manticore API</span></div>
                <div className="code-line"><span className="code-keyword">const</span> <span className="code-variable">manticore</span> = <span className="code-keyword">new</span> <span className="code-function">ManticoreClient</span>();</div>
                <div className="code-line"></div>
                <div className="code-line"><span className="code-comment">// Create a new digital asset</span></div>
                <div className="code-line"><span className="code-keyword">async function</span> <span className="code-function">createAsset</span>() {'{'}</div>
                <div className="code-line typing-line">  <span className="code-keyword">const</span> <span className="code-variable">asset</span> = <span className="code-keyword">await</span> manticore.assets.create({'{'}<span className="code-cursor">|</span></div>
                <div className="code-line">    name: <span className="code-string">"Quantum Token"</span>,</div>
                <div className="code-line">    description: <span className="code-string">"Next-gen digital asset"</span>,</div>
                <div className="code-line">    supply: <span className="code-number">1000</span></div>
                <div className="code-line">  {'}'});</div>
                <div className="code-line"></div>
                <div className="code-line">  <span className="code-keyword">return</span> asset;</div>
                <div className="code-line">{'}'}</div>
              </div>
            </div>
            
            <div className="api-docs">
              <div className="docs-header">API Reference</div>
              <div className="docs-content">
                <div className="docs-method">
                  <span className="method-name">assets.create()</span>
                  <span className="method-type">Creates new asset</span>
                </div>
                <div className="docs-method">
                  <span className="method-name">assets.transfer()</span>
                  <span className="method-type">Transfers assets</span>
                </div>
                <div className="docs-method">
                  <span className="method-name">wallet.connect()</span>
                  <span className="method-type">Connect wallet</span>
                </div>
              </div>
            </div>
          </div>
          
          <ul className="feature-list cosmic-stagger">
            <li>Advanced API ecosystem</li>
            <li>Development sandboxes</li>
            <li>Asset creation templates</li>
            <li>Testing environments</li>
          </ul>
          
          <button className="cosmic-button" onClick={handleStartBuildingClick}>
            <span className="button-text">Start Building</span>
            <span className="button-glow"></span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default DeveloperUniverse; 