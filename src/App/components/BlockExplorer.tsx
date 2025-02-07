import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { evrmoreService } from '@/services/EvrmoreService';

interface Transaction {
    hash: string;
    from: string;
    to: string;
    amount: string;
    type: 'transfer' | 'swap' | 'asset' | 'mining';
}

interface Block {
    height: number;
    hash: string;
    transactions: Transaction[];
    timestamp: number;
    size: number;
    miner: string;
    reward: string;
    difficulty: string;
}

const BlockExplorer: React.FC = () => {
    const [blocks, setBlocks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [networkInfo, setNetworkInfo] = useState<any>(null);
    const [selectedBlock, setSelectedBlock] = useState<any>(null);
    const [stats, setStats] = useState({
        latestBlock: 0,
        avgBlockTime: '15 seconds',
        avgTxPerBlock: 0,
        totalTx24h: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [latestBlocks, network] = await Promise.all([
                    evrmoreService.getLatestBlocks(10),
                    evrmoreService.getNetworkInfo()
                ]);
                
                setBlocks(latestBlocks);
                setNetworkInfo(network);
            } catch (error) {
                console.error('Error fetching blockchain data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const formatTime = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        return `${Math.floor(seconds / 3600)}h ago`;
    };

    const formatAddress = (address: string) => 
        `${address.slice(0, 6)}...${address.slice(-4)}`;

    return (
        <div className="block-explorer">
            {isLoading ? (
                <div className="loading-state">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="loading-spinner"
                    />
                    <p>Loading blockchain data...</p>
                </div>
            ) : (
                <div className="explorer-stats">
                    {[
                        { label: 'Latest Block', value: `#${stats.latestBlock}` },
                        { label: 'Avg Block Time', value: stats.avgBlockTime },
                        { label: 'Avg Tx per Block', value: stats.avgTxPerBlock },
                        { label: '24h Transactions', value: stats.totalTx24h.toLocaleString() }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className="stat-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <h4>{stat.label}</h4>
                            <span className="stat-value">{stat.value}</span>
                        </motion.div>
                    ))}
                </div>
            )}

            <div className="blocks-container">
                <h3>Latest Blocks</h3>
                <div className="blocks-list">
                    <AnimatePresence mode="popLayout">
                        {blocks.map((block) => (
                            <motion.div
                                key={block.hash}
                                className={`block-item ${selectedBlock?.hash === block.hash ? 'selected' : ''}`}
                                layout
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                onClick={() => setSelectedBlock(block)}
                            >
                                <div className="block-header">
                                    <span className="block-number">#{block.height}</span>
                                    <span className="block-time">{formatTime(block.timestamp)}</span>
                                </div>
                                <div className="block-info">
                                    <div className="block-miner">
                                        <span className="label">Miner:</span>
                                        <span className="value">{block.miner}</span>
                                    </div>
                                    <div className="block-txs">
                                        <span className="label">Txs:</span>
                                        <span className="value">{block.transactions.length}</span>
                                    </div>
                                    <div className="block-size">
                                        <span className="label">Size:</span>
                                        <span className="value">{(block.size / 1000).toFixed(1)} KB</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <AnimatePresence>
                {selectedBlock && (
                    <motion.div
                        className="block-details"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <div className="details-header">
                            <h3>Block Details</h3>
                            <button 
                                className="close-button"
                                onClick={() => setSelectedBlock(null)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="details-grid">
                            <div className="detail-item">
                                <span className="label">Height</span>
                                <span className="value">#{selectedBlock.height}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Hash</span>
                                <span className="value hash">{selectedBlock.hash}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Timestamp</span>
                                <span className="value">
                                    {new Date(selectedBlock.timestamp).toLocaleString()}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Miner</span>
                                <span className="value">{selectedBlock.miner}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Reward</span>
                                <span className="value">{selectedBlock.reward}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Difficulty</span>
                                <span className="value">{selectedBlock.difficulty}</span>
                            </div>
                        </div>

                        <div className="transactions-list">
                            <h4>Transactions</h4>
                            {selectedBlock.transactions.map((tx, index) => (
                                <motion.div
                                    key={tx.hash}
                                    className="transaction-item"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="tx-type">{tx.type}</div>
                                    <div className="tx-details">
                                        <div className="tx-addresses">
                                            <span className="from">{formatAddress(tx.from)}</span>
                                            <span className="arrow">→</span>
                                            <span className="to">{formatAddress(tx.to)}</span>
                                        </div>
                                        <div className="tx-amount">{tx.amount}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BlockExplorer; 