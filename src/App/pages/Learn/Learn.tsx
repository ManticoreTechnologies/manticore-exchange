import React, { useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { 
  FiCpu, FiCode, FiDatabase, FiLayers, 
  FiAward, FiBox, FiFileText, FiGitBranch,
  FiArrowRight, FiStar, FiClock, FiTrendingUp
} from 'react-icons/fi';
import './Learn.css';

// Import concept components
import WhyEvrmore from './concepts/WhyEvrmore/WhyEvrmore';
import NodeCommands from './concepts/NodeCommands/NodeCommands';
import BlockchainBasics from './concepts/BlockchainBasics/BlockchainBasics';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  level: string;
  duration: string;
  progress: number;
  concepts: Concept[];
  totalXP: number;
}

interface Concept {
  id: string;
  title: string;
  description: string;
  duration: string;
  xp: number;
  difficulty: string;
  path: string;
  completed?: boolean;
}

const Learn = () => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  
  const learningPaths: LearningPath[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Begin your journey with Evrmore fundamentals',
      icon: <FiDatabase />,
      level: 'Beginner',
      duration: '2-3 hours',
      progress: 0,
      totalXP: 1500,
      concepts: [
        {
          id: 'why-evrmore',
          title: 'Why Evrmore?',
          description: 'Discover what makes Evrmore unique and powerful',
          duration: '20 min',
          xp: 500,
          difficulty: 'Beginner',
          path: '/learn/why-evrmore'
        },
        {
          id: 'blockchain-basics',
          title: 'Blockchain Fundamentals',
          description: 'Learn the core concepts of blockchain technology',
          duration: '30 min',
          xp: 500,
          difficulty: 'Beginner',
          path: '/learn/blockchain-basics'
        },
        {
          id: 'node-setup',
          title: 'Setting Up Your Node',
          description: 'Get started with your own Evrmore node',
          duration: '45 min',
          xp: 500,
          difficulty: 'Beginner',
          path: '/learn/node-setup'
        }
      ]
    },
    {
      id: 'node-mastery',
      title: 'Node Mastery',
      description: 'Master Evrmore node operations and commands',
      icon: <FiCpu />,
      level: 'Intermediate',
      duration: '4-5 hours',
      progress: 0,
      totalXP: 2000,
      concepts: [
        {
          id: 'node-commands',
          title: 'Essential Node Commands',
          description: 'Learn to interact with your node through RPC commands',
          duration: '60 min',
          xp: 750,
          difficulty: 'Intermediate',
          path: '/learn/node-commands'
        },
        {
          id: 'node-maintenance',
          title: 'Node Maintenance',
          description: 'Keep your node running smoothly',
          duration: '45 min',
          xp: 500,
          difficulty: 'Intermediate',
          path: '/learn/node-maintenance'
        },
        {
          id: 'node-security',
          title: 'Node Security',
          description: 'Best practices for securing your node',
          duration: '45 min',
          xp: 750,
          difficulty: 'Advanced',
          path: '/learn/node-security'
        }
      ]
    },
    {
      id: 'asset-system',
      title: 'Asset System',
      description: 'Create and manage Evrmore native assets',
      icon: <FiBox />,
      level: 'Intermediate',
      duration: '5-6 hours',
      progress: 0,
      totalXP: 2500,
      concepts: [
        {
          id: 'asset-basics',
          title: 'Asset Fundamentals',
          description: 'Understanding Evrmore\'s native asset system',
          duration: '45 min',
          xp: 750,
          difficulty: 'Intermediate',
          path: '/learn/asset-basics'
        },
        {
          id: 'asset-creation',
          title: 'Creating Assets',
          description: 'Learn to create and issue your own assets',
          duration: '60 min',
          xp: 1000,
          difficulty: 'Intermediate',
          path: '/learn/asset-creation'
        },
        {
          id: 'asset-management',
          title: 'Asset Management',
          description: 'Advanced asset operations and management',
          duration: '60 min',
          xp: 750,
          difficulty: 'Advanced',
          path: '/learn/asset-management'
        }
      ]
    },
    {
      id: 'development',
      title: 'Development',
      description: 'Build applications on Evrmore',
      icon: <FiCode />,
      level: 'Advanced',
      duration: '8-10 hours',
      progress: 0,
      totalXP: 3000,
      concepts: [
        {
          id: 'dev-setup',
          title: 'Development Environment',
          description: 'Set up your Evrmore development environment',
          duration: '45 min',
          xp: 750,
          difficulty: 'Intermediate',
          path: '/learn/dev-setup'
        },
        {
          id: 'api-integration',
          title: 'API Integration',
          description: 'Integrate Evrmore into your applications',
          duration: '90 min',
          xp: 1250,
          difficulty: 'Advanced',
          path: '/learn/api-integration'
        },
        {
          id: 'building-dapps',
          title: 'Building dApps',
          description: 'Create decentralized applications on Evrmore',
          duration: '120 min',
          xp: 1000,
          difficulty: 'Advanced',
          path: '/learn/building-dapps'
        }
      ]
    }
  ];

  return (
    <Routes>
      <Route path="/" element={
        <div className="learn-container">
          <div className="learn-header">
            <h1>Learn Evrmore</h1>
            <p>Master Evrmore through interactive lessons and hands-on exercises</p>
            
            <div className="learning-stats">
              <div className="stat-item">
                <FiAward className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-value">0 XP</span>
                  <span className="stat-label">Total Experience</span>
                </div>
              </div>
              <div className="stat-item">
                <FiStar className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-value">Level 1</span>
                  <span className="stat-label">Current Level</span>
                </div>
              </div>
              <div className="stat-item">
                <FiTrendingUp className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-value">0%</span>
                  <span className="stat-label">Overall Progress</span>
                </div>
              </div>
            </div>
          </div>

          <div className="learning-paths">
            {learningPaths.map((path) => (
              <div 
                key={path.id}
                className={`learning-path ${selectedPath === path.id ? 'selected' : ''}`}
                onClick={() => setSelectedPath(path.id)}
              >
                <div className="path-header">
                  <div className="path-icon">{path.icon}</div>
                  <div className="path-info">
                    <h2>{path.title}</h2>
                    <p>{path.description}</p>
                  </div>
                </div>

                <div className="path-meta">
                  <div className="meta-item">
                    <FiClock className="meta-icon" />
                    <span>{path.duration}</span>
                  </div>
                  <div className="meta-item">
                    <FiStar className="meta-icon" />
                    <span>{path.level}</span>
                  </div>
                  <div className="meta-item">
                    <FiAward className="meta-icon" />
                    <span>{path.totalXP} XP</span>
                  </div>
                </div>

                <div className="path-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${path.progress}%` }}
                    />
                  </div>
                  <span className="progress-text">{path.progress}% Complete</span>
                </div>

                <div className="path-concepts">
                  {path.concepts.map((concept) => (
                    <Link 
                      key={concept.id}
                      to={concept.path}
                      className="concept-card"
                    >
                      <div className="concept-content">
                        <h3>{concept.title}</h3>
                        <p>{concept.description}</p>
                      </div>
                      
                      <div className="concept-meta">
                        <span className="concept-duration">
                          <FiClock className="meta-icon" />
                          {concept.duration}
                        </span>
                        <span className="concept-xp">
                          <FiAward className="meta-icon" />
                          {concept.xp} XP
                        </span>
                        <span className="concept-difficulty">
                          <FiStar className="meta-icon" />
                          {concept.difficulty}
                        </span>
                      </div>

                      <div className="concept-arrow">
                        <FiArrowRight />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      } />
      
      {/* Concept Routes */}
      <Route path="why-evrmore" element={<WhyEvrmore />} />
      <Route path="node-commands" element={<NodeCommands />} />
      <Route path="blockchain-basics" element={<BlockchainBasics />} />
      {/* Add more concept routes as needed */}
    </Routes>
  );
};

export default Learn;
