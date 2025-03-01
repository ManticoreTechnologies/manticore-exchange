import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaCubes, FaRocket } from 'react-icons/fa';
import './EvrmoreInfo.css';

const evrmoreInfo = {
  title: "Welcome to the Future of Digital Assets",
  description: "Evrmore is a revolutionary blockchain platform that enables the creation, management, and trading of digital assets with unprecedented flexibility and security.",
  keyPoints: [
    {
      icon: FaShieldAlt,
      title: "What is Evrmore?",
      description: "Evrmore is a secure, decentralized blockchain platform designed for creating and managing digital assets. Built with advanced technology, it offers fast transactions and low fees."
    },
    {
      icon: FaCubes,
      title: "Evrmore Assets",
      description: "Create and trade digital assets representing anything from art and collectibles to real estate and securities. Each asset is unique, secure, and easily transferable."
    },
    {
      icon: FaRocket,
      title: "Why Choose Evrmore?",
      description: "Experience the power of true digital ownership with our battle-tested blockchain, advanced security features, and vibrant community-driven ecosystem."
    }
  ]
};

const EvrmoreInfo: React.FC = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  return (
    <section className="evrmore-intro">
      {/* Circuit decorations */}
      <div className="circuit-board top-left"></div>
      <div className="circuit-board bottom-right"></div>
      
      {/* Data flow animation lines */}
      <div className="data-flow-line line-1"></div>
      <div className="data-flow-line line-2"></div>
      <div className="data-flow-line line-3"></div>

      <motion.div
        className="intro-content"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.h2
          variants={itemVariants}
        >
          {evrmoreInfo.title}
        </motion.h2>
        
        <motion.p 
          className="intro-description"
          variants={itemVariants}
        >
          {evrmoreInfo.description}
        </motion.p>
        
        <motion.div 
          className="key-points"
          variants={containerVariants}
        >
          {evrmoreInfo.keyPoints.map((point, index) => (
            <motion.div 
              key={index} 
              className="key-point"
              variants={itemVariants}
              whileHover={{ 
                y: -10, 
                transition: { type: "spring", stiffness: 300 } 
              }}
            >
              <div className="key-point-icon">
                <point.icon />
              </div>
              <h3>{point.title}</h3>
              <p>{point.description}</p>
              
              {/* Tech decorative pulse element */}
              <motion.div 
                className="tech-pulse"
                animate={{ 
                  scale: [1, 1.2, 1], 
                  opacity: [0, 0.2, 0] 
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity,
                  delay: index * 0.7
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default EvrmoreInfo; 