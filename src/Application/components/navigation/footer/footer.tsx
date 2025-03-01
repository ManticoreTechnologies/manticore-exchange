// Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';
import Ping from '@/Application/components/ping/ping';
import ThemeSettings from '@/Application/components/theme-settings/theme-settings';

const Footer: React.FC = () => {
  return (
    <div className="footer">
      {/* Animated data flow line */}
      <div className="footer-data-flow"></div>
      
      <div className="left-section">
        <div className="ping-container">
          <Ping />
        </div>
      </div>
      
      {/* Center copyright text and links */}
      <p className="footer-text">
        © {new Date().getFullYear()} Manticore Technologies
        <Link to="/about">About</Link> | <Link to="/contact">Contact</Link>
      </p>
      
      <div className="theme-settings-container">
        <ThemeSettings />
      </div>
    </div>
  );
}

export default Footer;

