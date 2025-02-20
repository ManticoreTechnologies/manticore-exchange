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
  return (
    <section className="evrmore-intro">
      <motion.div
        className="intro-content"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {evrmoreInfo.title}
        </motion.h2>
        
        <motion.p 
          className="intro-description"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {evrmoreInfo.description}
        </motion.p>
        
        <div className="intro-grid">
          {evrmoreInfo.keyPoints.map((point, index) => (
            <motion.div
              key={index}
              className="intro-card glassmorphism"
              initial={{ 
                opacity: 0,
                x: index % 2 === 0 ? -100 : 100,
                scale: 0.8
              }}
              whileInView={{ 
                opacity: 1,
                x: 0,
                scale: 1
              }}
              viewport={{ 
                once: true, 
                margin: "-50px"
              }}
              transition={{ 
                duration: 1,
                delay: index * 0.3,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.05,
                y: -10,
                boxShadow: "0 20px 40px rgba(255, 107, 107, 0.2)",
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 10
                }
              }}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.3 + 0.3 }}
              >
                <point.icon className="intro-icon" />
              </motion.div>
              <h3>{point.title}</h3>
              <p>{point.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default EvrmoreInfo; 