// Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import Ping from '../../../pages/TradeX/Ping/Ping';

const Footer: React.FC = () => {
  return (
    <div className="footer">
      <Ping wsUrl="wss://ws.manticore.exchange"/>
      <p>© 2024 Manticore Trade</p>
      <Link to="/about">About</Link> | 
      <Link to="/contact">Contact</Link>
    </div>
  );
}

export default Footer;
