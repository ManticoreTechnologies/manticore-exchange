import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NetworkStats {
    blockHeight: number;
    hashrate: string;
    difficulty: string;
    transactions: number;
    nodeCount: number;
    marketCap: string;
}

const NetworkStats: React.FC = () => {
    const [stats, setStats] = useState<NetworkStats>({
        blockHeight: 1000000,
        hashrate: '1.2 PH/s',
        difficulty: '123.45 T',
        transactions: 1234,
        nodeCount: 567,
        marketCap: '$10.5M'
    });

    useEffect(() => {
        // Simulate real-time updates
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                blockHeight: prev.blockHeight + 1,
                transactions: prev.transactions + Math.floor(Math.random() * 10),
                nodeCount: prev.nodeCount + (Math.random() > 0.5 ? 1 : -1)
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="network-stats">
            <div className="stats-grid">
                {Object.entries(stats).map(([key, value]) => (
                    <motion.div
                        key={key}
                        className="stat-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <h4>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</h4>
                        <motion.div 
                            className="stat-value"
                            key={value}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {value}
                        </motion.div>
                    </motion.div>
                ))}
            </div>

            <div className="network-health">
                <h4>Network Health</h4>
                <div className="health-indicators">
                    <motion.div 
                        className="health-indicator"
                        animate={{
                            backgroundColor: ['#4CAF50', '#81C784', '#4CAF50'],
                            scale: [1, 1.05, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Stable
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default NetworkStats; 