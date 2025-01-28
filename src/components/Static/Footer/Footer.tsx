// Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import Ping from '@/App/pages/TradeX/Ping/Ping';
import ThemeSettings from '@/components/ThemeSettings/ThemeSettings';

const Footer: React.FC = () => {
  return (
    <div className="footer">
      <div className="ping-container">
        <Ping />
      </div>
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

