import React, { useEffect, useRef } from 'react';
import './NetworkStatus.css';
import { FaNetworkWired } from 'react-icons/fa';
import SectionTitle from '../SectionTitle';

interface NetworkStatusProps {
  onCheckStatusClick?: () => void;
}

/**
 * NetworkStatus component showcasing the Evrmore blockchain network
 * status and monitoring capabilities.
 */
const NetworkStatus: React.FC<NetworkStatusProps> = ({ onCheckStatusClick }) => {
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
  
  const handleCheckStatusClick = () => {
    if (onCheckStatusClick) {
      onCheckStatusClick();
    } else {
      // Default behavior - navigate to network status page
      window.location.href = '/network-status';
    }
  };
  
  // Sample network metrics
  const networkMetrics = [
    { id: 'blocks', label: 'Blocks', value: '1,342,847', status: 'normal' },
    { id: 'transactions', label: 'Transactions', value: '36.4 TPS', status: 'normal' },
    { id: 'nodes', label: 'Active Nodes', value: '2,482', status: 'high' },
    { id: 'latency', label: 'Avg. Latency', value: '42ms', status: 'normal' },
    { id: 'hashrate', label: 'Hash Rate', value: '28.5 TH/s', status: 'high' },
    { id: 'memory', label: 'Mem. Usage', value: '68%', status: 'normal' }
  ];
  
  return (
    <section className="network-status-section cosmic-section tech-border">
      <div className="cosmic-container fade-in-cosmic" ref={componentRef}>
        <SectionTitle icon={<FaNetworkWired />} title="Cosmic Network" />
        
        <div className="network-status-content tech-panel">
          <div className="tech-corner top-left"></div>
          <div className="tech-corner top-right"></div>
          <div className="tech-corner bottom-left"></div>
          <div className="tech-corner bottom-right"></div>
          <div className="tech-glow"></div>
          
          <h3>Cosmic Network Observatory</h3>
          
          <p className="network-description">
            Monitor the pulse of the Evrmore blockchain network with real-time telemetry and system 
            performance metrics.
          </p>
          
          <div className="network-visualization">
            <div className="dashboard-container">
              <div className="dashboard-header">
                <div className="status-indicator active"></div>
                <div className="header-title">NETWORK TELEMETRY</div>
                <div className="refresh-button">
                  <div className="refresh-icon"></div>
                </div>
              </div>
              
              <div className="metrics-grid">
                {networkMetrics.map(metric => (
                  <div key={metric.id} className={`metric-card ${metric.status}`}>
                    <div className="metric-label">{metric.label}</div>
                    <div className="metric-value">{metric.value}</div>
                    <div className="status-bar">
                      <div className="status-indicator"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="network-graph">
                <div className="graph-legend">
                  <div className="legend-item">
                    <div className="legend-color transactions"></div>
                    <div className="legend-text">Transactions</div>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color blocks"></div>
                    <div className="legend-text">Blocks</div>
                  </div>
                </div>
                <div className="graph-container">
                  <div className="graph-y-axis">
                    <div className="axis-label">50</div>
                    <div className="axis-label">25</div>
                    <div className="axis-label">0</div>
                  </div>
                  <div className="graph-content">
                    <div className="graph-grid">
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                    </div>
                    <div className="transactions-line">
                      {Array(10).fill(0).map((_, i) => (
                        <div key={i} className="data-point" style={{ 
                          '--height': `${20 + Math.sin(i * 0.8) * 15 + Math.random() * 10}%`,
                          '--delay': `${i * 0.1}s`
                        } as React.CSSProperties}></div>
                      ))}
                    </div>
                    <div className="blocks-line">
                      {Array(10).fill(0).map((_, i) => (
                        <div key={i} className="data-point" style={{ 
                          '--height': `${30 + Math.cos(i * 0.8) * 10 + Math.random() * 5}%`,
                          '--delay': `${i * 0.1 + 0.05}s`
                        } as React.CSSProperties}></div>
                      ))}
                    </div>
                  </div>
                  <div className="graph-x-axis">
                    <div className="axis-label">10m</div>
                    <div className="axis-label">5m</div>
                    <div className="axis-label">now</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <ul className="feature-list cosmic-stagger">
            <li>Network health indicators</li>
            <li>Transaction flow visualization</li>
            <li>Block explorer integration</li>
            <li>System announcements</li>
          </ul>
          
          <button className="cosmic-button" onClick={handleCheckStatusClick}>
            <span className="button-text">Check Status</span>
            <span className="button-glow"></span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default NetworkStatus; 