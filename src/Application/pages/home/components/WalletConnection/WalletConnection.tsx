import React from 'react';
import { motion } from 'framer-motion';
import { FaUsersCog, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/Application/contexts/AuthContext';
import './WalletConnection.css';

const WalletConnection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/signin');
    }
  };

  return (
    <motion.section 
      className="wallet-connection-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <h1 className="section-title">Connect & Trade</h1>
      <div className="wallet-content">
        <div className="wallet-icon-wrapper">
          <motion.div 
            className="wallet-icon"
            animate={{ 
              y: [-2, 2, -2],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={{ 
              scale: 1.1,
              filter: "brightness(1.2)",
              transition: { duration: 0.2 }
            }}
          >
            <FaUsersCog />
          </motion.div>
        </div>
        <div className="wallet-text">
          <h2>Connect Your Wallet</h2>
          <p>Start your journey in the Evrmore ecosystem by connecting your wallet. Trade, collect, and manage digital assets with ease.</p>
          <motion.button
            className="auth-button-centered"
            onClick={handleAuthClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaUser className="auth-icon" />
            {isAuthenticated ? 'Profile' : 'Connect Wallet'}
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};

export default WalletConnection; 