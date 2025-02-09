// Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';
import Ping from '@/App/pages/TradeX/Ping/Ping';
import ThemeSettings from '@/components/ThemeSettings/ThemeSettings';
import OrderToaster from '@/App/components/OrderToaster/OrderToaster';

const Footer: React.FC = () => {
  return (
    <div className="footer">
      <div className="left-section">
        <div className="ping-container">
          <Ping />
        </div>
        <div className="order-toaster-container">
          <OrderToaster />
        </div>
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

