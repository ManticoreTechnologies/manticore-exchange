import React, { useState, useEffect } from 'react';
import {
  FiDatabase, FiLayers, FiLink, FiLock,
  FiCpu, FiServer, FiUsers, FiShield,
  FiCheck, FiAward, FiClock, FiGitBranch,
  FiHash, FiBox, FiKey, FiRefreshCw,
  FiArrowRight, FiArrowLeft
} from 'react-icons/fi';
import './BlockchainBasics.css';

const BlockchainBasics = () => {
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; style: React.CSSProperties }>>([]);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());

  // Generate floating particles effect
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 20}s`,
        animationDuration: `${15 + Math.random() * 10}s`
      }
    }));
    setParticles(newParticles);
  }, []);

  const sections = [
    {
      id: 'intro',
      title: 'Introduction to Blockchain',
      content: [
        {
          type: 'text',
          content: 'A blockchain is a distributed digital ledger that records transactions across a network of computers. Each record is linked to the previous one, creating an immutable chain of information.'
        },
        {
          type: 'keyPoints',
          points: [
            'Decentralized: No single point of control',
            'Immutable: Records cannot be altered',
            'Transparent: All transactions are visible',
            'Secure: Cryptographically protected'
          ]
        }
      ]
    },
    {
      id: 'blocks',
      title: 'Understanding Blocks',
      content: [
        {
          type: 'text',
          content: 'Blocks are the fundamental units of a blockchain. Each block contains transaction data, a timestamp, and a reference to the previous block.'
        },
        {
          type: 'visualization',
          component: 'BlockStructure'
        },
        {
          type: 'keyPoints',
          points: [
            'Block Header: Contains metadata',
            'Transaction Data: List of transactions',
            'Previous Block Hash: Links to previous block',
            'Timestamp: When block was created'
          ]
        }
      ]
    },
    {
      id: 'consensus',
      title: 'Consensus Mechanisms',
      content: [
        {
          type: 'text',
          content: 'Consensus mechanisms ensure all network participants agree on the state of the blockchain. Evrmore uses EvrProgPow, a specialized Proof of Work algorithm.'
        },
        {
          type: 'keyPoints',
          points: [
            'Network Validation: Nodes verify transactions',
            'Mining Process: Creating new blocks',
            'Block Rewards: Incentivizing miners',
            'Network Security: Protecting against attacks'
          ]
        }
      ]
    },
    {
      id: 'cryptography',
      title: 'Cryptography in Blockchain',
      content: [
        {
          type: 'text',
          content: 'Cryptography is essential for blockchain security. It ensures data integrity, user authentication, and transaction privacy.'
        },
        {
          type: 'keyPoints',
          points: [
            'Public Key Cryptography: Digital signatures',
            'Hash Functions: Data integrity',
            'Merkle Trees: Efficient verification',
            'Encryption: Transaction privacy'
          ]
        }
      ]
    },
    {
      id: 'evrmore',
      title: 'Evrmore Implementation',
      content: [
        {
          type: 'text',
          content: 'Evrmore enhances traditional blockchain technology with specialized features for asset management and improved scalability.'
        },
        {
          type: 'keyPoints',
          points: [
            'UTXO Model: Enhanced transaction processing',
            'Native Assets: Built-in asset support',
            'EvrProgPow: Efficient mining algorithm',
            'Scalability: Optimized performance'
          ]
        }
      ]
    }
  ];

  const handleSectionComplete = () => {
    const newCompleted = new Set(completedSections);
    newCompleted.add(currentSection);
    setCompletedSections(newCompleted);
    setProgress((newCompleted.size / sections.length) * 100);
  };

  const navigateSection = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentSection < sections.length - 1) {
      handleSectionComplete();
      setCurrentSection(prev => prev + 1);
    } else if (direction === 'prev' && currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const renderContent = (content: any) => {
    switch (content.type) {
      case 'text':
        return <p className="section-text">{content.content}</p>;
      case 'keyPoints':
        return (
          <ul className="key-points">
            {content.points.map((point: string, index: number) => (
              <li key={index}>
                <FiCheck className="check-icon" />
                {point}
              </li>
            ))}
          </ul>
        );
      case 'visualization':
        return <div className="visualization">{/* Add visualization components */}</div>;
      default:
        return null;
    }
  };

  return (
    <div className="concept-page blockchain-basics">
      <div className="particles">
        {particles.map((particle) => (
          <div key={particle.id} className="particle" style={particle.style} />
        ))}
      </div>

      <div className="concept-header">
        <h1 className="concept-title">Blockchain Fundamentals</h1>
        <p className="concept-description">
          Master the core concepts of blockchain technology and understand how Evrmore
          builds upon these foundations to create a secure, efficient, and scalable platform.
        </p>
        <div className="progress-container">
          <div className="progress-label">{Math.round(progress)}% Complete</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="learning-section">
        <div className="section-progress">
          {sections.map((section, index) => (
            <div 
              key={section.id}
              className={`progress-step ${index === currentSection ? 'active' : ''} ${completedSections.has(index) ? 'completed' : ''}`}
              onClick={() => index <= Math.max(...Array.from(completedSections)) + 1 && setCurrentSection(index)}
            >
              {completedSections.has(index) ? <FiCheck /> : index + 1}
            </div>
          ))}
        </div>

        <div className="section-content">
          <h2 className="section-title">{sections[currentSection].title}</h2>
          {sections[currentSection].content.map((content, index) => (
            <div key={index} className="content-block">
              {renderContent(content)}
            </div>
          ))}
        </div>

        <div className="section-navigation">
          <button 
            className="nav-button prev"
            disabled={currentSection === 0}
            onClick={() => navigateSection('prev')}
          >
            <FiArrowLeft /> Previous
          </button>
          <button 
            className="nav-button next"
            disabled={currentSection === sections.length - 1}
            onClick={() => navigateSection('next')}
          >
            Next <FiArrowRight />
          </button>
        </div>
      </div>

      {progress >= 100 && (
        <div className="achievement-unlocked">
          <div className="achievement-icon">
            <FiAward />
          </div>
          <div className="achievement-content">
            <h3>Achievement Unlocked!</h3>
            <p>Blockchain Fundamentals Master</p>
            <span>+500 XP</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockchainBasics; 