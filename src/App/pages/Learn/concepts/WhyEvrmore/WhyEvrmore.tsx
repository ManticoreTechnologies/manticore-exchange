import React, { useState } from 'react';
import { FiCheck, FiAward } from 'react-icons/fi';
import {
  FaNetworkWired, FaShieldAlt, FaChartLine,
  FaCoins, FaCubes, FaExchangeAlt
} from 'react-icons/fa';
import {
  ParallelProcessing,
  SecurityVisualization,
  DeFiOperations
} from './components';
import './WhyEvrmore.css';

// Types
interface Feature {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  details: string[];
  animation?: string;
}

interface ComparisonItem {
  id: string;
  title: string;
  weaknesses: string[];
  advantages: string[];
}

interface VisualizationStep {
  id: string;
  title: string;
  description: string;
  animation: string;
  content: React.ReactNode;
}

// Data
const utxoFeatures: Feature[] = [
  {
    id: 'parallel-processing',
    title: 'Parallel Transaction Processing',
    icon: <FaNetworkWired />,
    description: 'Process multiple transactions simultaneously',
    details: [
      'Independent UTXO processing',
      'Higher throughput',
      'Better scalability',
      'Reduced bottlenecks'
    ],
    animation: 'slideParallel'
  },
  {
    id: 'asset-security',
    title: 'Native Asset Security',
    icon: <FaShieldAlt />,
    description: 'Built-in asset protocol with specialized scripts',
    details: [
      'Hardcoded asset logic',
      'No smart contract vulnerabilities',
      'Predictable behavior',
      'Enhanced security'
    ],
    animation: 'pulseShield'
  },
  {
    id: 'defi-optimization',
    title: 'DeFi Optimization',
    icon: <FaChartLine />,
    description: 'Purpose-built for financial operations',
    details: [
      'Efficient atomic swaps',
      'Native asset management',
      'Predictable fees',
      'Simplified state tracking'
    ],
    animation: 'floatChart'
  }
];

const utxoVisualizations: VisualizationStep[] = [
  {
    id: 'parallel-processing',
    title: 'Parallel Processing Power',
    description: 'Multiple transactions processed simultaneously',
    animation: 'parallelFlow',
    content: (
      <div className="parallel-lanes">
        {Array.from({ length: 3 }).map((_, laneIndex) => (
          <div key={laneIndex} className="processing-lane">
            <div className="lane-transactions">
              {Array.from({ length: 4 }).map((_, txIndex) => (
                <div 
                  key={txIndex} 
                  className="transaction-block"
                  style={{ animationDelay: `${laneIndex * 0.5 + txIndex * 1.5}s` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  },
  {
    id: 'asset-security',
    title: 'Built-in Asset Security',
    description: 'Specialized scripts protect asset operations',
    animation: 'securityShield',
    content: (
      <div className="security-visualization">
        <div className="security-layers">
          {['Asset Protocol', 'UTXO Model', 'Network Security'].map((layer, index) => (
            <div key={index} className="security-layer">
              <div className="layer-icon">
                {index === 0 ? <FaCoins /> : index === 1 ? <FaCubes /> : <FaShieldAlt />}
              </div>
              <span>{layer}</span>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 'defi-operations',
    title: 'DeFi Operations',
    description: 'Efficient and secure financial transactions',
    animation: 'defiFlow',
    content: (
      <div className="defi-visualization">
        <div className="atomic-swap">
          <div className="swap-assets">
            <div className="asset asset-a">Asset A</div>
            <div className="swap-arrows">
              <FaExchangeAlt />
            </div>
            <div className="asset asset-b">Asset B</div>
          </div>
        </div>
      </div>
    )
  }
];

const WhyEvrmore: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<string>('parallel-processing');
  const [progress, setProgress] = useState(0);

  const handleFeatureSelect = (featureId: string) => {
    setActiveFeature(featureId);
    setProgress(prev => Math.min(100, prev + 20));
  };

  const renderVisualization = () => {
    switch (activeFeature) {
      case 'parallel-processing':
        return <ParallelProcessing />;
      case 'asset-security':
        return <SecurityVisualization />;
      case 'defi-optimization':
        return <DeFiOperations />;
      default:
        return null;
    }
  };

  return (
    <div className="concept-container">
      <header className="concept-header">
        <h1>Why Choose Evrmore?</h1>
        <p>Experience the power of UTXO-based DeFi with built-in security</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <section className="features-section">
        <div className="features-grid">
          {utxoFeatures.map(feature => (
            <div
              key={feature.id}
              className={`feature-card ${activeFeature === feature.id ? 'active' : ''}`}
              onClick={() => handleFeatureSelect(feature.id)}
            >
              <div className={`feature-icon ${feature.animation}`}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <ul className="feature-details">
                {feature.details.map((detail, index) => (
                  <li key={index}>
                    <FiCheck className="check-icon" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="visualization-section">
        {renderVisualization()}
      </section>

      {progress >= 100 && (
        <div className="achievement-popup">
          <div className="achievement-icon">
            <FiAward />
          </div>
          <div className="achievement-content">
            <h3>UTXO Master</h3>
            <p>You've mastered the Evrmore advantage!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhyEvrmore; 