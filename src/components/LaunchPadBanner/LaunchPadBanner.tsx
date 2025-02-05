import React from 'react';
import { Link } from 'react-router-dom';
import { FaRocket } from 'react-icons/fa';
import './LaunchPadBanner.css';

const LaunchPadBanner: React.FC = () => {
  return (
    <div className="launch-pad-banner">
      <div className="banner-content">
        <div className="banner-text">
          <h2>
            <FaRocket className="rocket-icon" />
            Introducing Launch Pad
          </h2>
          <p>Create and launch your own EVR Assets with customizable parameters</p>
          <ul>
            <li>Define token supply & initial price</li>
            <li>Set vesting schedules</li>
            <li>Configure metadata</li>
          </ul>
          <Link to="/launch" className="launch-cta">
            Launch Your Asset Now
          </Link>
        </div>
        <div className="banner-graphic">
          {/* Using the SVG directly for better control */}
          <svg className="launch-graphic" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="90" className="orbit" />
            <path d="M100 40L130 140H70L100 40Z" className="rocket-body" />
            <circle cx="100" cy="100" r="20" className="center-circle" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LaunchPadBanner; 