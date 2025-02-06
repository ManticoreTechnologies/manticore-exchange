import React, { useState } from 'react';
import { FiClock, FiBarChart, FiChevronRight, FiCheck, FiAward, FiCpu, FiHardDrive, FiWifi } from 'react-icons/fi';
import './NodeDeployment.css';

interface Step {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  xp: number;
  icon: React.ReactNode;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  xpReward: number;
}

const NodeDeployment = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [totalXP, setTotalXP] = useState<number>(0);
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-step',
      title: 'First Steps',
      description: 'Complete your first learning step',
      icon: <FiAward />,
      unlocked: false,
      xpReward: 50
    },
    {
      id: 'hardware-master',
      title: 'Hardware Master',
      description: 'Understand all system requirements',
      icon: <FiCpu />,
      unlocked: false,
      xpReward: 100
    },
    {
      id: 'node-operator',
      title: 'Node Operator',
      description: 'Successfully configure and start your node',
      icon: <FiHardDrive />,
      unlocked: false,
      xpReward: 200
    },
    {
      id: 'network-pioneer',
      title: 'Network Pioneer',
      description: 'Connect to the Evrmore network',
      icon: <FiWifi />,
      unlocked: false,
      xpReward: 150
    }
  ]);

  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: 'System Requirements',
      description: 'Ensure your system meets the minimum requirements for running an Evrmore node.',
      completed: false,
      xp: 100,
      icon: <FiCpu />
    },
    {
      id: 2,
      title: 'Installation',
      description: 'Download and install the Evrmore node software.',
      completed: false,
      xp: 150,
      icon: <FiHardDrive />
    },
    {
      id: 3,
      title: 'Configuration',
      description: 'Configure your node settings for optimal performance.',
      completed: false,
      xp: 200,
      icon: <FiWifi />
    },
    {
      id: 4,
      title: 'Network Connection',
      description: 'Connect your node to the Evrmore network.',
      completed: false,
      xp: 250,
      icon: <FiWifi />
    },
    {
      id: 5,
      title: 'Verification',
      description: 'Verify your node is running correctly and syncing with the network.',
      completed: false,
      xp: 300,
      icon: <FiCheck />
    },
  ]);

  const checkAchievements = (completedStepId: number) => {
    const newAchievements = [...achievements];
    
    // First Steps Achievement
    if (completedStepId === 1 && !achievements[0].unlocked) {
      newAchievements[0].unlocked = true;
      setTotalXP(prev => prev + newAchievements[0].xpReward);
    }

    // Hardware Master Achievement
    if (completedStepId === 1 && !achievements[1].unlocked) {
      newAchievements[1].unlocked = true;
      setTotalXP(prev => prev + newAchievements[1].xpReward);
    }

    // Node Operator Achievement
    if (completedStepId === 3 && !achievements[2].unlocked) {
      newAchievements[2].unlocked = true;
      setTotalXP(prev => prev + newAchievements[2].xpReward);
    }

    // Network Pioneer Achievement
    if (completedStepId === 4 && !achievements[3].unlocked) {
      newAchievements[3].unlocked = true;
      setTotalXP(prev => prev + newAchievements[3].xpReward);
    }

    setAchievements(newAchievements);
  };

  const handleStepComplete = (stepId: number) => {
    setSteps(steps.map(step => {
      if (step.id === stepId) {
        setTotalXP(prev => prev + step.xp);
        return { ...step, completed: true };
      }
      return step;
    }));
    
    checkAchievements(stepId);

    if (stepId < steps.length) {
      setActiveStep(stepId + 1);
    }
  };

  const progress = (steps.filter(step => step.completed).length / steps.length) * 100;
  const level = Math.floor(totalXP / 500) + 1;

  return (
    <div className="concept-page">
      <div className="concept-header">
        <h2 className="concept-title">Deploying an Evrmore Node</h2>
        <p className="concept-description">
          Learn how to set up and maintain your own Evrmore node, contributing to the network's
          decentralization and security while gaining direct access to the blockchain.
        </p>
        
        <div className="concept-meta">
          <div className="concept-difficulty">
            <FiBarChart />
            <span>Intermediate</span>
          </div>
          <div className="concept-time">
            <FiClock />
            <span>45 minutes</span>
          </div>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="learning-dashboard">
        <div className="stats-panel">
          <div className="xp-display">
            <span className="xp-label">Total XP</span>
            <span className="xp-value">{totalXP}</span>
          </div>
          <div className="level-display">
            <span className="level-label">Level</span>
            <span className="level-value">{level}</span>
          </div>
        </div>

        <div className="achievements-panel">
          <h3>Achievements</h3>
          <div className="achievements-grid">
            {achievements.map(achievement => (
              <div 
                key={achievement.id} 
                className={`achievement-card ${achievement.unlocked ? 'unlocked' : ''}`}
                title={achievement.unlocked ? `Unlocked! +${achievement.xpReward}XP` : 'Locked'}
              >
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-info">
                  <h4>{achievement.title}</h4>
                  <p>{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="interactive-steps">
          {steps.map((step) => (
            <div 
              key={step.id}
              className={`step-item ${step.id === activeStep ? 'active' : ''} ${step.completed ? 'completed' : ''}`}
              style={{
                opacity: step.id <= activeStep ? 1 : 0.5,
                cursor: step.id <= activeStep ? 'pointer' : 'default'
              }}
              onClick={() => step.id <= activeStep && setActiveStep(step.id)}
            >
              <div className="step-number">
                {step.completed ? <FiCheck /> : step.icon}
              </div>
              <div className="step-content">
                <div className="step-header">
                  <h3 className="step-title">{step.title}</h3>
                  <span className="step-xp">+{step.xp} XP</span>
                </div>
                <p className="step-description">{step.description}</p>
                {step.id === activeStep && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStepComplete(step.id);
                    }}
                    className="complete-step-button"
                  >
                    Complete Step <FiChevronRight />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NodeDeployment; 