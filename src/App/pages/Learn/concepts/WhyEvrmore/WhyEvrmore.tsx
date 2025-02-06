import React, { useState } from 'react';
import { FiBox, FiCpu, FiLock, FiTrendingUp, FiZap, FiAward } from 'react-icons/fi';
import './WhyEvrmore.css';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
}

const WhyEvrmore = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const features: Feature[] = [
    {
      id: 'asset-system',
      title: 'Native Asset System',
      description: 'A powerful and flexible asset system built directly into the blockchain',
      icon: <FiBox />,
      details: [
        'Create and manage digital assets without smart contracts',
        'Built-in asset scripting capabilities for advanced functionality',
        'Efficient and secure asset operations',
        'Native support for NFTs and fungible tokens',
        'Asset metadata with IPFS integration'
      ]
    },
    {
      id: 'specialized-scripting',
      title: 'Specialized Asset Scripts',
      description: 'Purpose-built scripting system for secure and efficient asset operations',
      icon: <FiLock />,
      details: [
        'Hardcoded, specialized scripts for maximum security',
        'No general-purpose smart contracts to reduce attack vectors',
        'Optimized for asset operations and management',
        'Predictable and reliable execution',
        'Lower resource requirements compared to general smart contracts'
      ]
    },
    {
      id: 'performance',
      title: 'High Performance',
      description: 'Optimized blockchain architecture for speed and efficiency',
      icon: <FiZap />,
      details: [
        'Fast block confirmation times',
        'Efficient transaction processing',
        'Optimized memory usage',
        'Scalable architecture',
        'Low transaction fees'
      ]
    },
    {
      id: 'decentralization',
      title: 'True Decentralization',
      description: 'Built for long-term sustainability and decentralization',
      icon: <FiCpu />,
      details: [
        'Fair launch with no pre-mine',
        'Community-driven development',
        'Resistant to centralization',
        'Open-source development',
        'Active community governance'
      ]
    },
    {
      id: 'future-proof',
      title: 'Future-Proof Design',
      description: 'Built to evolve and adapt to future needs',
      icon: <FiTrendingUp />,
      details: [
        'Regular protocol improvements',
        'Backward compatibility focus',
        'Sustainable development model',
        'Long-term vision',
        'Active development community'
      ]
    }
  ];

  const handleFeatureClick = (featureId: string) => {
    setSelectedFeature(featureId);
    // Update progress when a feature is explored
    const newProgress = Math.min(100, progress + 20);
    setProgress(newProgress);
  };

  return (
    <div className="concept-page">
      <div className="concept-header">
        <h1 className="concept-title">Why Evrmore?</h1>
        <p className="concept-description">
          Discover what makes Evrmore a unique and powerful blockchain platform for
          creating and managing digital assets.
        </p>

        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="features-grid">
        {features.map((feature) => (
          <div
            key={feature.id}
            className={`feature-card ${selectedFeature === feature.id ? 'active' : ''}`}
            onClick={() => handleFeatureClick(feature.id)}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>

      {selectedFeature && (
        <div className="feature-details">
          <h2 className="details-title">
            {features.find(f => f.id === selectedFeature)?.title}
          </h2>
          <ul className="details-list">
            {features
              .find(f => f.id === selectedFeature)
              ?.details.map((detail, index) => (
                <li key={index} className="detail-item">
                  {detail}
                </li>
              ))}
          </ul>
        </div>
      )}

      {progress >= 100 && (
        <div className="achievement-unlocked">
          <div className="achievement-icon">
            <FiAward />
          </div>
          <div className="achievement-content">
            <h3>Achievement Unlocked!</h3>
            <p>Evrmore Explorer</p>
            <span>+500 XP</span>
          </div>
        </div>
      )}

      <div className="next-steps">
        <h3>Ready to dive deeper?</h3>
        <p>
          Now that you understand what makes Evrmore special, let's explore how
          blockchain technology works and how Evrmore builds upon these foundations.
        </p>
        <button className="next-concept-button">
          Next: Blockchain Fundamentals
        </button>
      </div>
    </div>
  );
};

export default WhyEvrmore; 