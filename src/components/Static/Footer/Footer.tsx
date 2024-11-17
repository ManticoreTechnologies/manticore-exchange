// Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import Ping from '../../../pages/TradeX/Ping/Ping';

const wsUrl = `${process.env.VITE_TRADING_WS_HOST}:${process.env.VITE_TRADING_WS_PORT}`;
console.log(wsUrl);
const Footer: React.FC = () => {
  return (
    <div className="footer">
      <Ping />
      <p>© 2024 Manticore Trade
        <Link to="/about">About</Link> | 
        <Link to="/contact">Contact</Link>
      </p>
      
    </div>
  );
}

export default Footer;

