import React, { useRef, useEffect } from 'react';
import './LaunchPad.css';
import { FaRocket, FaCalendarAlt, FaUsers, FaCheckCircle } from 'react-icons/fa';
import SectionTitle from '../SectionTitle';

interface LaunchPadProps {
  onExploreProjectsClick?: () => void;
}

/**
 * LaunchPad component showcasing upcoming project launches on the platform
 */
const LaunchPad: React.FC<LaunchPadProps> = ({ onExploreProjectsClick }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  const handleExploreProjectsClick = () => {
    if (onExploreProjectsClick) {
      onExploreProjectsClick();
    } else {
      // Default navigation
      window.location.href = '/launch-pad';
    }
  };
  
  // Sample projects data
  const projects = [
    {
      id: 1,
      name: 'Cosmic NFT Collection',
      creator: 'AstralStudios',
      description: 'A collection of 10,000 unique space-themed NFTs with utility across the Evrmore ecosystem.',
      launchDate: '2023-12-15',
      status: 'upcoming',
      progress: 75
    },
    {
      id: 2,
      name: 'DecentraVerse',
      creator: 'BlockTech Labs',
      description: 'Decentralized metaverse built on Evrmore with integrated marketplace and social features.',
      launchDate: '2024-01-20',
      status: 'upcoming',
      progress: 45
    },
    {
      id: 3,
      name: 'EvrmoorPay',
      creator: 'FinBlock',
      description: 'Payment solution for merchants to accept EVR tokens with minimal transaction fees.',
      launchDate: '2023-11-30',
      status: 'upcoming',
      progress: 90
    }
  ];
  
  return (
    <div className="launch-pad-section cosmic-section fade-in-cosmic" ref={sectionRef}>
      <div className="launch-pad-content cosmic-container">
        <SectionTitle icon={<FaRocket />} title="Launch Pad" />
        
        <h3>Discover and Support Upcoming Projects</h3>
        
        <div className="launch-description">
          <p>Explore innovative projects launching on the Evrmore blockchain. Be the first to participate in token sales, NFT launches, and more.</p>
        </div>
        
        <div className="launch-visualization">
          <div className="rocket-platform">
            <div className="launch-base">
              <div className="base-light"></div>
              <div className="base-light"></div>
              <div className="base-light"></div>
            </div>
            <div className="rocket-container">
              <div className="rocket-model">
                <div className="rocket-body">
                  <div className="window"></div>
                  <div className="fin fin-left"></div>
                  <div className="fin fin-right"></div>
                </div>
                <div className="rocket-head"></div>
                <div className="exhaust">
                  <div className="flame"></div>
                  <div className="smoke"></div>
                </div>
              </div>
              <div className="launch-pad-light"></div>
            </div>
          </div>
          
          <div className="launch-projects">
            {projects.map((project) => (
              <div className="project-card" key={project.id}>
                <div className="project-header">
                  <h4>{project.name}</h4>
                  <div className="project-creator">{project.creator}</div>
                </div>
                <div className="project-description">{project.description}</div>
                <div className="project-meta">
                  <div className="launch-date">
                    <FaCalendarAlt />
                    <span>{project.launchDate}</span>
                  </div>
                  <div className="project-community">
                    <FaUsers />
                    <span>Community Backed</span>
                  </div>
                </div>
                <div className="progress-container">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
                  </div>
                  <div className="progress-text">{project.progress}% Complete</div>
                </div>
                <div className="project-status">
                  <FaCheckCircle />
                  <span>Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <ul className="feature-list">
          <li>Crowdfunding and token sales for new projects</li>
          <li>Vetted and verified projects by the Evrmore team</li>
          <li>Early access to innovative applications</li>
          <li>Community participation in project governance</li>
          <li>Transparent launch roadmaps and milestones</li>
        </ul>
        
        <button className="cosmic-button" onClick={handleExploreProjectsClick}>
          <span className="button-text">Explore Projects</span>
          <div className="button-glow"></div>
        </button>
      </div>
    </div>
  );
};

export default LaunchPad; 