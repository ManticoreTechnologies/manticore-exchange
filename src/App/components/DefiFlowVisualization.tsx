import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Transaction {
    id: string;
    type: 'swap' | 'liquidity' | 'order';
    from: {
        asset: string;
        amount: string;
        icon: string;
    };
    to: {
        asset: string;
        amount: string;
        icon: string;
    };
    status: 'pending' | 'processing' | 'completed' | 'failed';
    timestamp: Date;
}

const DefiFlowVisualization: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [poolStats, setPoolStats] = useState({
        totalLiquidity: '$1.2M',
        volume24h: '$250K',
        activePairs: 12
    });

    // Simulate new transactions coming in
    useEffect(() => {
        const sampleTransactions: Transaction[] = [
            {
                id: 'tx1',
                type: 'swap',
                from: { asset: 'EVR', amount: '100', icon: '💎' },
                to: { asset: 'USD', amount: '150', icon: '💵' },
                status: 'completed',
                timestamp: new Date()
            },
            {
                id: 'tx2',
                type: 'liquidity',
                from: { asset: 'EVR', amount: '1000', icon: '💎' },
                to: { asset: 'BTC', amount: '0.05', icon: '₿' },
                status: 'processing',
                timestamp: new Date()
            }
        ];

        setTransactions(sampleTransactions);

        const interval = setInterval(() => {
            const newTx: Transaction = {
                id: `tx${Date.now()}`,
                type: Math.random() > 0.5 ? 'swap' : 'liquidity',
                from: {
                    asset: 'EVR',
                    amount: (Math.random() * 1000).toFixed(2),
                    icon: '💎'
                },
                to: {
                    asset: Math.random() > 0.5 ? 'USD' : 'BTC',
                    amount: (Math.random() * 100).toFixed(2),
                    icon: Math.random() > 0.5 ? '💵' : '₿'
                },
                status: 'pending',
                timestamp: new Date()
            };

            setTransactions(prev => [newTx, ...prev].slice(0, 5));

            // Simulate transaction processing
            setTimeout(() => {
                setTransactions(prev => 
                    prev.map(tx => 
                        tx.id === newTx.id 
                            ? { ...tx, status: 'processing' }
                            : tx
                    )
                );
            }, 1000);

            setTimeout(() => {
                setTransactions(prev => 
                    prev.map(tx => 
                        tx.id === newTx.id 
                            ? { ...tx, status: Math.random() > 0.1 ? 'completed' : 'failed' }
                            : tx
                    )
                );
            }, 3000);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="defi-flow">
            <div className="defi-stats">
                <motion.div 
                    className="stat-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h4>Total Liquidity</h4>
                    <span className="stat-value">{poolStats.totalLiquidity}</span>
                </motion.div>
                <motion.div 
                    className="stat-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h4>24h Volume</h4>
                    <span className="stat-value">{poolStats.volume24h}</span>
                </motion.div>
                <motion.div 
                    className="stat-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h4>Active Pairs</h4>
                    <span className="stat-value">{poolStats.activePairs}</span>
                </motion.div>
            </div>

            <div className="transaction-flow">
                <h3>Live Transactions</h3>
                <AnimatePresence mode="popLayout">
                    {transactions.map((tx) => (
                        <motion.div
                            key={tx.id}
                            className={`transaction-card ${tx.status}`}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            layout
                        >
                            <div className="transaction-type">
                                {tx.type === 'swap' ? '↔️' : '🏦'}
                            </div>
                            <div className="transaction-details">
                                <div className="asset-from">
                                    <span className="asset-icon">{tx.from.icon}</span>
                                    <span className="asset-amount">{tx.from.amount}</span>
                                    <span className="asset-symbol">{tx.from.asset}</span>
                                </div>
                                <motion.div 
                                    className="flow-arrow"
                                    animate={{ x: [0, 10, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                >
                                    →
                                </motion.div>
                                <div className="asset-to">
                                    <span className="asset-icon">{tx.to.icon}</span>
                                    <span className="asset-amount">{tx.to.amount}</span>
                                    <span className="asset-symbol">{tx.to.asset}</span>
                                </div>
                            </div>
                            <motion.div 
                                className="status-indicator"
                                animate={{
                                    scale: tx.status === 'processing' ? [1, 1.2, 1] : 1
                                }}
                                transition={{ repeat: Infinity, duration: 1 }}
                            />
                            <div className="transaction-time">
                                {tx.timestamp.toLocaleTimeString()}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="defi-explanation">
                <h4>What's Happening Here?</h4>
                <ul>
                    <li>
                        <span className="highlight">Swaps:</span> People trading one asset 
                        for another instantly
                    </li>
                    <li>
                        <span className="highlight">Liquidity:</span> Users providing assets 
                        to help others trade
                    </li>
                    <li>
                        <span className="highlight">Processing:</span> The network confirming 
                        all trades are valid
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default DefiFlowVisualization; 