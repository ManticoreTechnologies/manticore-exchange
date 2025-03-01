import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './MarketStats.css';

interface MarketStat {
  label: string;
  value: string;
  trend: 'up' | 'down';
}

interface MarketStatsProps {
  stats: MarketStat[];
}

const MarketStats: React.FC<MarketStatsProps> = ({ stats }) => {
  return (
    <section className="market-stats">
      <motion.h2 
        className="section-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <FaChartLine className="icon" /> Market Statistics
      </motion.h2>
      
      {/* Network nodes effect */}
      <div className="network-nodes-container">
        {[...Array(15)].map((_, index) => (
          <motion.div
            key={`node-${index}`}
            className="network-node"
            style={{
              left: `${Math.random() * 90 + 5}%`,
              top: `${Math.random() * 80 + 10}%`,
              scale: Math.random() * 0.5 + 0.5
            }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.7, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
      
      <motion.div 
        className="stats-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="stat-card glassmorphism"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              delay: index * 0.15 + 0.5 
            }}
            whileHover={{ 
              y: -10, 
              boxShadow: "0 25px 50px rgba(0,0,0,0.2), 0 0 30px rgba(85, 169, 254, 0.3)" 
            }}
          >
            {/* Animated tech lines */}
            <div className="tech-decoration">
              <div className="tech-line horizontal"></div>
              <div className="tech-line vertical"></div>
              <div className="tech-dot top-left"></div>
              <div className="tech-dot top-right"></div>
              <div className="tech-dot bottom-left"></div>
              <div className="tech-dot bottom-right"></div>
            </div>
            
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.15 + 0.7 }}
            >
              {stat.label}
            </motion.h3>
            
            <motion.p 
              className="value"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: index * 0.15 + 0.9,
                type: "spring",
                stiffness: 400
              }}
            >
              {stat.value}
            </motion.p>
            
            <motion.div 
              className={`trend ${stat.trend}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.15 + 1.1 }}
            >
              {stat.trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
              <span className="trend-label">{stat.trend === 'up' ? '+5.2%' : '-1.8%'}</span>
            </motion.div>
            
            {/* Pulse effect */}
            <motion.div
              className="pulse-effect"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0, 0.2, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut"
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default MarketStats; 