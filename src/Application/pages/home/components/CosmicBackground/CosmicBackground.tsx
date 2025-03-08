import React, { useEffect, useRef } from 'react';
import './CosmicBackground.css';

interface CosmicBackgroundProps {
  starCount?: number;
  nebulaCount?: number;
}

const CosmicBackground: React.FC<CosmicBackgroundProps> = ({ 
  starCount = 200,
  nebulaCount = 5
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Clear any existing elements
    container.innerHTML = '';
    
    // Create star field
    const starField = document.createElement('div');
    starField.className = 'star-field';
    
    // Adjust star count for mobile
    const finalStarCount = window.innerWidth < 768 ? Math.min(100, starCount) : starCount;
    
    // Generate stars
    for (let i = 0; i < finalStarCount; i++) {
      const star = document.createElement('div');
      
      // Random size class
      const sizeClass = Math.random();
      if (sizeClass < 0.5) {
        star.className = 'star tiny';
      } else if (sizeClass < 0.8) {
        star.className = 'star small';
      } else if (sizeClass < 0.95) {
        star.className = 'star medium';
      } else {
        star.className = 'star large';
      }
      
      // Random position
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      
      // Random animation delay
      star.style.animationDelay = `${Math.random() * 4}s`;
      
      starField.appendChild(star);
    }
    
    container.appendChild(starField);
    
    // Generate nebulas
    const finalNebulaCount = window.innerWidth < 768 ? Math.min(3, nebulaCount) : nebulaCount;
    
    for (let i = 0; i < finalNebulaCount; i++) {
      const nebula = document.createElement('div');
      
      // Random nebula class
      const nebulaClass = Math.random();
      if (nebulaClass < 0.4) {
        nebula.className = 'nebula nebula-purple';
      } else if (nebulaClass < 0.7) {
        nebula.className = 'nebula nebula-blue';
      } else {
        nebula.className = 'nebula nebula-pink';
      }
      
      // Random size and position
      const size = Math.random() * 300 + 200;
      nebula.style.width = `${size}px`;
      nebula.style.height = `${size}px`;
      nebula.style.left = `${Math.random() * 100}%`;
      nebula.style.top = `${Math.random() * 100}%`;
      
      // Random animation delay
      nebula.style.animationDelay = `${Math.random() * 5}s`;
      
      container.appendChild(nebula);
    }
    
    // Clean up function
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [starCount, nebulaCount]);
  
  return (
    <div className="cosmic-background" ref={containerRef}></div>
  );
};

export default CosmicBackground; 