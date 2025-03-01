import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useAuth } from '@/Application/contexts/AuthContext';
import { FaFingerprint, FaLock, FaRocket, FaShieldAlt, FaUserAstronaut } from 'react-icons/fa';
import './WalletConnection.css';

const WalletConnection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, speed: number}>>([]);
  
  // Handle auth button click based on authentication state
  const handleAuthClick = () => {
    if (isAuthenticated) {
      // Navigate to dashboard or wallet page
      window.location.href = '/dashboard';
    } else {
      // Navigate to auth page
      window.location.href = '/auth';
    }
  };

  // Create security particles
  useEffect(() => {
    const createParticles = () => {
      const newParticles = [];
      const particleCount = 30;
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 2 + 0.5
        });
      }
      
      setParticles(newParticles);
    };
    
    createParticles();
    
    return () => {
      setParticles([]);
    };
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  return (
    <div className="wallet-connection-container" ref={containerRef}>
      {/* Floating security particles */}
      <div className="security-particles">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="security-particle"
            initial={{ x: `${particle.x}%`, y: `${particle.y}%`, opacity: 0.3 }}
            animate={{
              y: [`${particle.y}%`, `${particle.y + 10}%`, `${particle.y}%`],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: particle.speed * 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ width: `${particle.size}px`, height: `${particle.size}px` }}
          />
        ))}
      </div>

      {/* Shield decoration */}
      <div className="shield-decoration">
        <div className="shield-glow"></div>
        <FaShieldAlt className="shield-icon" />
      </div>

      {/* Digital circuit background */}
      <div className="digital-circuit"></div>

      <motion.div
        className="wallet-content"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div className="wallet-header" variants={itemVariants}>
          <div className="icon-container">
            <FaUserAstronaut className="astronaut-icon" />
          </div>
          <h2>Secure Your Digital Assets</h2>
        </motion.div>

        <motion.p variants={itemVariants}>
          Connect your wallet to start trading on the Evrmore Exchange. Our platform offers
          state-of-the-art security features to keep your assets safe.
        </motion.p>

        <motion.div className="security-features" variants={containerVariants}>
          <motion.div className="security-feature" variants={itemVariants}>
            <FaLock />
            <span>Advanced Encryption</span>
          </motion.div>
          <motion.div className="security-feature" variants={itemVariants}>
            <FaFingerprint />
            <span>Biometric Authentication</span>
          </motion.div>
          <motion.div className="security-feature" variants={itemVariants}>
            <FaRocket />
            <span>Quick Transactions</span>
          </motion.div>
        </motion.div>

        <motion.button
          className="connect-button"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAuthClick}
        >
          {isAuthenticated ? 'Go to Dashboard' : 'Connect Wallet'}
          <span className="button-glow"></span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default WalletConnection; 