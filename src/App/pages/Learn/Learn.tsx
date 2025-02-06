import React from 'react';
import { Link } from 'react-router-dom';
import { FiCpu, FiCode, FiDatabase, FiLayers, FiAward, FiBox, FiFileText, FiGitBranch } from 'react-icons/fi';
import './Learn.css';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  concepts: Concept[];
  icon: React.ReactNode;
  level: string;
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
  const learningPaths: LearningPath[] = [
    {
      id: 'evrmore-fundamentals',
      title: 'Evrmore Fundamentals',
      description: 'Discover what makes Evrmore unique and powerful',
      icon: <FiDatabase />,
      level: 'Beginner',
      concepts: [
        {
          id: 'why-evrmore',
          title: 'Why Evrmore?',
          description: 'Understand Evrmore\'s unique features and advantages',
          duration: '20 minutes',
          xp: 500,
          difficulty: 'Beginner',
          path: '/learn/why-evrmore',
        },
        {
          id: 'blockchain-basics',
          title: 'Blockchain Fundamentals',
          description: 'Learn the core concepts of blockchain technology',
          duration: '30 minutes',
          xp: 800,
          difficulty: 'Beginner',
          path: '/learn/blockchain-basics',
        },
        {
          id: 'consensus-mechanism',
          title: 'Consensus & Mining',
          description: 'Understanding how Evrmore achieves consensus and secures the network',
          duration: '45 minutes',
          xp: 1000,
          difficulty: 'Intermediate',
          path: '/learn/consensus-mechanism',
        }
      ],
    },
    {
      id: 'node-operations',
      title: 'Node Setup & Operations',
      description: 'Get started with running your own Evrmore node',
      icon: <FiCpu />,
      level: 'Beginner to Intermediate',
      concepts: [
        {
          id: 'node-preparation',
          title: 'Preparing for Node Setup',
          description: 'Understanding system requirements and preliminary setup',
          duration: '20 minutes',
          xp: 500,
          difficulty: 'Beginner',
          path: '/learn/node-preparation',
        },
        {
          id: 'node-deployment',
          title: 'Deploying Your Node',
          description: 'Step-by-step guide to setting up your Evrmore node',
          duration: '45 minutes',
          xp: 1000,
          difficulty: 'Intermediate',
          path: '/learn/node-deployment',
        },
        {
          id: 'node-commands',
          title: 'Essential Node Commands',
          description: 'Master the core commands for interacting with your node',
          duration: '60 minutes',
          xp: 1200,
          difficulty: 'Intermediate',
          path: '/learn/node-commands',
        },
        {
          id: 'node-maintenance',
          title: 'Node Maintenance',
          description: 'Best practices for maintaining and securing your node',
          duration: '30 minutes',
          xp: 800,
          difficulty: 'Intermediate',
          path: '/learn/node-maintenance',
        }
      ],
    },
    {
      id: 'asset-system',
      title: 'Asset System',
      description: 'Master Evrmore\'s native asset system',
      icon: <FiBox />,
      level: 'Intermediate',
      concepts: [
        {
          id: 'asset-basics',
          title: 'Asset Fundamentals',
          description: 'Understanding Evrmore\'s native asset system and capabilities',
          duration: '45 minutes',
          xp: 900,
          difficulty: 'Intermediate',
          path: '/learn/asset-basics',
        },
        {
          id: 'asset-operations',
          title: 'Basic Asset Operations',
          description: 'Learn how to create, manage, and transfer assets',
          duration: '60 minutes',
          xp: 1000,
          difficulty: 'Intermediate',
          path: '/learn/asset-operations',
        },
        {
          id: 'asset-metadata',
          title: 'Asset Metadata & IPFS',
          description: 'Working with asset metadata and IPFS integration',
          duration: '45 minutes',
          xp: 1100,
          difficulty: 'Intermediate',
          path: '/learn/asset-metadata',
        }
      ],
    },
    {
      id: 'asset-scripting',
      title: 'Asset Scripting',
      description: 'Master Evrmore\'s specialized asset scripting system',
      icon: <FiCode />,
      level: 'Advanced',
      concepts: [
        {
          id: 'script-fundamentals',
          title: 'Script Fundamentals',
          description: 'Introduction to Evrmore\'s asset script system',
          duration: '60 minutes',
          xp: 1200,
          difficulty: 'Advanced',
          path: '/learn/script-fundamentals',
        },
        {
          id: 'script-types',
          title: 'Asset Script Types',
          description: 'Understanding different types of asset scripts and their uses',
          duration: '75 minutes',
          xp: 1300,
          difficulty: 'Advanced',
          path: '/learn/script-types',
        },
        {
          id: 'advanced-scripting',
          title: 'Advanced Scripting',
          description: 'Master complex asset scripts and combinations',
          duration: '90 minutes',
          xp: 1500,
          difficulty: 'Advanced',
          path: '/learn/advanced-scripting',
        }
      ],
    },
    {
      id: 'development',
      title: 'Application Development',
      description: 'Build applications on top of Evrmore',
      icon: <FiGitBranch />,
      level: 'Advanced',
      concepts: [
        {
          id: 'rpc-basics',
          title: 'RPC Interface',
          description: 'Learn to interact with Evrmore nodes via RPC',
          duration: '60 minutes',
          xp: 1100,
          difficulty: 'Advanced',
          path: '/learn/rpc-basics',
        },
        {
          id: 'asset-integration',
          title: 'Asset Integration',
          description: 'Integrate Evrmore assets into your applications',
          duration: '75 minutes',
          xp: 1300,
          difficulty: 'Advanced',
          path: '/learn/asset-integration',
        },
        {
          id: 'building-dapps',
          title: 'Building dApps',
          description: 'Create decentralized applications using Evrmore',
          duration: '90 minutes',
          xp: 1500,
          difficulty: 'Advanced',
          path: '/learn/building-dapps',
        }
      ],
    }
  ];

  return (
    <div className="learn-page">
      <div className="learn-header">
        <h1 className="learn-title">Learn Evrmore</h1>
        <p className="learn-subtitle">
          Master the fundamentals of Evrmore through interactive lessons and hands-on exercises.
        </p>
      </div>

      <div className="learning-paths">
        {learningPaths.map((path) => (
          <div key={path.id} className="learning-path-card">
            <div className="path-icon">{path.icon}</div>
            <div className="path-content">
              <h2 className="path-title">{path.title}</h2>
              <p className="path-description">{path.description}</p>
              <div className="path-meta">
                <span className="path-level">{path.level}</span>
                <span className="path-concepts">{path.concepts.length} concepts</span>
              </div>
            </div>

            <div className="path-concepts">
              {path.concepts.map((concept) => (
                <Link 
                  key={concept.id}
                  to={concept.path}
                  className="concept-link"
                >
                  <div className="concept-card">
                    <div className="concept-header">
                      <h3 className="concept-title">{concept.title}</h3>
                      {concept.completed && (
                        <div className="completion-badge">
                          <FiAward />
                        </div>
                      )}
                    </div>
                    <p className="concept-description">{concept.description}</p>
                    <div className="concept-meta">
                      <span className="concept-duration">{concept.duration}</span>
                      <span className="concept-xp">+{concept.xp} XP</span>
                      <span className="concept-difficulty">{concept.difficulty}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="learning-stats">
        <div className="stats-card">
          <div className="stats-icon">
            <FiLayers />
          </div>
          <div className="stats-content">
            <h3>Your Progress</h3>
            <div className="stats-numbers">
              <div className="stat-item">
                <span className="stat-value">0</span>
                <span className="stat-label">Completed</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">0 XP</span>
                <span className="stat-label">Total XP</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">Level 1</span>
                <span className="stat-label">Current Level</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
