import React, { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import './Tooltip.css';

interface TooltipProps {
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

const Tooltip: React.FC<TooltipProps> = ({ content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span 
      className="tooltip-wrapper"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <FaInfoCircle className="info-icon" />
      {isVisible && (
        <div className={`tooltip-content ${position}`}>
          {content}
        </div>
      )}
    </span>
  );
};

export default Tooltip; 