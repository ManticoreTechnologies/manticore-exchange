import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Block {
    id: number;
    hash: string;
    transactions: string[];
    nonce: number;
    status: 'mining' | 'found' | 'confirmed';
}

const MiningAnimation: React.FC = () => {
    const [currentBlock, setCurrentBlock] = useState<Block>({
        id: 1234567,
        hash: '0x1a2b3c...',
        transactions: [
            'Alice sends 5 EVR to Bob',
            'Charlie buys NFT',
            'Shop receives payment'
        ],
        nonce: 0,
        status: 'mining'
    });

    const [hashRate, setHashRate] = useState('1.2 MH/s');
    const [difficulty, setDifficulty] = useState('Medium');

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBlock(prev => ({
                ...prev,
                nonce: prev.nonce + 1,
                status: prev.nonce > 50 ? 'found' : 'mining'
            }));
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mining-animation">
            <div className="mining-stats">
                <motion.div 
                    className="stat-item"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <span className="stat-label">Hash Rate:</span>
                    <span className="stat-value">{hashRate}</span>
                </motion.div>
                <motion.div 
                    className="stat-item"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <span className="stat-label">Difficulty:</span>
                    <span className="stat-value">{difficulty}</span>
                </motion.div>
            </div>

            <motion.div 
                className={`mining-block ${currentBlock.status}`}
                animate={{
                    scale: currentBlock.status === 'found' ? [1, 1.1, 1] : 1,
                    rotateY: [0, 360],
                    boxShadow: [
                        "0 0 0 rgba(var(--accent-color-rgb), 0)",
                        "0 0 20px rgba(var(--accent-color-rgb), 0.5)",
                        "0 0 0 rgba(var(--accent-color-rgb), 0)"
                    ]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <div className="block-content">
                    <div className="block-header">
                        <span className="block-number">Block #{currentBlock.id}</span>
                        <span className="block-status">{currentBlock.status}</span>
                    </div>
                    <div className="block-transactions">
                        {currentBlock.transactions.map((tx, i) => (
                            <motion.div 
                                key={i}
                                className="transaction-item"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.2 }}
                            >
                                {tx}
                            </motion.div>
                        ))}
                    </div>
                    <div className="block-hash">{currentBlock.hash}</div>
                    <motion.div 
                        className="nonce-display"
                        animate={{ opacity: [0.5, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    >
                        Nonce: {currentBlock.nonce}
                    </motion.div>
                </div>
            </motion.div>
            
            <div className="mining-particles">
                <AnimatePresence>
                    {Array.from({ length: 20 }).map((_, i) => (
                        <motion.div
                            key={`particle-${i}`}
                            className="particle"
                            initial={{ 
                                scale: 0, 
                                x: 0, 
                                y: 0,
                                opacity: 1 
                            }}
                            animate={{
                                scale: [0, 1, 0],
                                x: Math.random() * 200 - 100,
                                y: Math.random() * 200 - 100,
                                opacity: [1, 0.5, 0]
                            }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.1,
                                ease: "easeOut"
                            }}
                        />
                    ))}
                </AnimatePresence>
            </div>

            <div className="mining-explanation">
                <h4>What's Happening?</h4>
                <ul>
                    <li>
                        <span className="highlight">Mining:</span> Finding the right number (nonce) 
                        to create a valid block
                    </li>
                    <li>
                        <span className="highlight">Transactions:</span> Real user activities being 
                        processed
                    </li>
                    <li>
                        <span className="highlight">Block Hash:</span> Unique fingerprint of all 
                        the block's data
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default MiningAnimation; 