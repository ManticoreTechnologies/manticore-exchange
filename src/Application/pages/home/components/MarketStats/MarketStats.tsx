import React from 'react';
import { motion } from 'framer-motion';
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
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3>{stat.label}</h3>
            <p className="value">{stat.value}</p>
            <div className={`trend ${stat.trend}`}>
              {stat.trend === 'up' ? '↑' : '↓'}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default MarketStats; 