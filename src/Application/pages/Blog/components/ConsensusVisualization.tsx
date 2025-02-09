import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Node {
    id: number;
    type: 'validator' | 'proposer';
    status: 'voting' | 'validating' | 'proposing' | 'confirmed';
    vote: boolean | null;
    health: number;
    lastActive: Date;
}

interface ConsensusRound {
    id: number;
    block: number;
    status: 'collecting' | 'validating' | 'confirmed';
    requiredVotes: number;
    currentVotes: number;
    startTime: Date;
}

const ConsensusVisualization: React.FC = () => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [currentRound, setCurrentRound] = useState<ConsensusRound>({
        id: 1,
        block: 1234567,
        status: 'collecting',
        requiredVotes: 0,
        currentVotes: 0,
        startTime: new Date()
    });
    const [networkHealth, setNetworkHealth] = useState({
        consensusRate: '99.9%',
        avgRoundTime: '2.5s',
        activeValidators: 0
    });

    useEffect(() => {
        // Initialize network nodes
        const initialNodes = Array.from({ length: 9 }, (_, i) => ({
            id: i + 1,
            type: i === 0 ? 'proposer' : 'validator',
            status: i === 0 ? 'proposing' : 'validating',
            vote: null,
            health: 100,
            lastActive: new Date()
        }));

        setNodes(initialNodes);
        setCurrentRound(prev => ({
            ...prev,
            requiredVotes: Math.ceil(initialNodes.length * 0.66)
        }));

        // Simulate consensus process
        const consensusInterval = setInterval(() => {
            setNodes(prevNodes => {
                const updatedNodes = [...prevNodes];
                const proposer = updatedNodes.find(n => n.type === 'proposer');
                
                // Update node votes randomly but weighted towards consensus
                updatedNodes.forEach(node => {
                    if (node.type === 'validator' && node.vote === null) {
                        node.vote = Math.random() > 0.2; // 80% chance of voting yes
                        node.status = 'voting';
                        node.lastActive = new Date();
                    }
                });

                // Update health based on activity
                updatedNodes.forEach(node => {
                    const timeSinceActive = Date.now() - node.lastActive.getTime();
                    node.health = Math.max(0, 100 - (timeSinceActive / 1000));
                });

                return updatedNodes;
            });

            // Update consensus round status
            setCurrentRound(prev => {
                const positiveVotes = nodes.filter(n => n.vote === true).length;
                const newStatus = positiveVotes >= prev.requiredVotes ? 'confirmed' : 'validating';
                
                if (newStatus === 'confirmed' && prev.status !== 'confirmed') {
                    // Start new round after confirmation
                    setTimeout(() => {
                        setCurrentRound({
                            id: prev.id + 1,
                            block: prev.block + 1,
                            status: 'collecting',
                            requiredVotes: prev.requiredVotes,
                            currentVotes: 0,
                            startTime: new Date()
                        });
                        setNodes(prevNodes => 
                            prevNodes.map(node => ({
                                ...node,
                                vote: null,
                                status: node.type === 'proposer' ? 'proposing' : 'validating'
                            }))
                        );
                    }, 2000);
                }

                return {
                    ...prev,
                    status: newStatus,
                    currentVotes: positiveVotes
                };
            });

            // Update network health metrics
            setNetworkHealth(prev => ({
                ...prev,
                activeValidators: nodes.filter(n => n.health > 80).length,
                avgRoundTime: `${(2 + Math.random()).toFixed(1)}s`
            }));
        }, 1000);

        return () => clearInterval(consensusInterval);
    }, []);

    return (
        <div className="consensus-visualization">
            <div className="consensus-stats">
                <motion.div 
                    className="stat-card"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <h4>Network Health</h4>
                    <div className="stat-value">{networkHealth.consensusRate}</div>
                </motion.div>
                <motion.div 
                    className="stat-card"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <h4>Active Validators</h4>
                    <div className="stat-value">{networkHealth.activeValidators}/9</div>
                </motion.div>
                <motion.div 
                    className="stat-card"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <h4>Avg Round Time</h4>
                    <div className="stat-value">{networkHealth.avgRoundTime}</div>
                </motion.div>
            </div>

            <div className="consensus-round">
                <div className="round-header">
                    <h3>Block #{currentRound.block}</h3>
                    <div className={`round-status ${currentRound.status}`}>
                        {currentRound.status.charAt(0).toUpperCase() + currentRound.status.slice(1)}
                    </div>
                </div>

                <div className="nodes-grid">
                    {nodes.map((node) => (
                        <motion.div
                            key={node.id}
                            className={`consensus-node ${node.type} ${node.status}`}
                            animate={{
                                scale: node.status === 'voting' ? [1, 1.1, 1] : 1,
                                borderColor: getNodeBorderColor(node)
                            }}
                            transition={{ duration: 1, repeat: node.status === 'voting' ? Infinity : 0 }}
                        >
                            <div className="node-header">
                                <span className="node-type">
                                    {node.type === 'proposer' ? '👑' : '🖥️'}
                                </span>
                                <span className="node-id">Node {node.id}</span>
                            </div>
                            <motion.div 
                                className="node-health"
                                style={{
                                    width: `${node.health}%`,
                                    background: getHealthColor(node.health)
                                }}
                            />
                            {node.vote !== null && (
                                <motion.div 
                                    className={`node-vote ${node.vote ? 'positive' : 'negative'}`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                >
                                    {node.vote ? '✓' : '✗'}
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>

                <div className="consensus-progress">
                    <div className="progress-label">
                        Consensus Progress: {currentRound.currentVotes}/{currentRound.requiredVotes}
                    </div>
                    <motion.div 
                        className="progress-bar"
                        initial={{ width: '0%' }}
                        animate={{ 
                            width: `${(currentRound.currentVotes / currentRound.requiredVotes) * 100}%`
                        }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            <div className="consensus-explanation">
                <h4>What's Happening?</h4>
                <ul>
                    <li>
                        <span className="highlight">Proposer (👑):</span> Suggests the next block 
                        to add to the chain
                    </li>
                    <li>
                        <span className="highlight">Validators (🖥️):</span> Check and vote on the 
                        proposed block
                    </li>
                    <li>
                        <span className="highlight">Consensus:</span> Achieved when enough validators 
                        agree (green checkmarks)
                    </li>
                </ul>
            </div>
        </div>
    );
};

// Helper functions
const getNodeBorderColor = (node: Node) => {
    if (node.type === 'proposer') return '#FFD700';
    if (node.vote === true) return '#4CAF50';
    if (node.vote === false) return '#FF5252';
    return 'var(--border-color)';
};

const getHealthColor = (health: number) => {
    if (health > 80) return '#4CAF50';
    if (health > 50) return '#FFC107';
    return '#FF5252';
};

export default ConsensusVisualization; 