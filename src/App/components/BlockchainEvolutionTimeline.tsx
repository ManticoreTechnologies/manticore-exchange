import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimelineEvent {
    year: number;
    title: string;
    description: string;
    icon: string;
    innovations: string[];
    impact: string;
    category: 'bitcoin' | 'ethereum' | 'evrmore' | 'milestone';
}

const BlockchainEvolutionTimeline: React.FC = () => {
    const [activeEvent, setActiveEvent] = useState<TimelineEvent | null>(null);

    const events: TimelineEvent[] = [
        {
            year: 2009,
            title: "Bitcoin Genesis",
            description: "The first blockchain is born, introducing digital scarcity",
            icon: "₿",
            innovations: [
                "Proof of Work consensus",
                "Decentralized ledger",
                "Digital scarcity",
                "UTXO model"
            ],
            impact: "Created the foundation for all cryptocurrencies",
            category: "bitcoin"
        },
        {
            year: 2013,
            title: "Multi-Asset Era",
            description: "Blockchain expands beyond simple transactions",
            icon: "🏦",
            innovations: [
                "Colored coins",
                "Asset tracking",
                "Metadata storage"
            ],
            impact: "Showed blockchain could handle more than just currency",
            category: "milestone"
        },
        {
            year: 2015,
            title: "Smart Contract Revolution",
            description: "Ethereum introduces programmable blockchain",
            icon: "Ξ",
            innovations: [
                "Smart contracts",
                "ERC-20 tokens",
                "Decentralized applications"
            ],
            impact: "Enabled complex programmable transactions",
            category: "ethereum"
        },
        {
            year: 2020,
            title: "DeFi Explosion",
            description: "Decentralized finance becomes mainstream",
            icon: "💹",
            innovations: [
                "Automated market makers",
                "Yield farming",
                "Lending protocols"
            ],
            impact: "Revolutionized financial services",
            category: "milestone"
        },
        {
            year: 2024,
            title: "EVRmore Launch",
            description: "Next evolution in blockchain technology",
            icon: "💎",
            innovations: [
                "Native DeFi capabilities",
                "Protocol-level security",
                "Enhanced UTXO model",
                "Built-in asset management"
            ],
            impact: "Combines security with advanced functionality",
            category: "evrmore"
        }
    ];

    return (
        <div className="blockchain-evolution">
            <div className="timeline-container">
                <div className="timeline-line" />
                
                {events.map((event, index) => (
                    <motion.div
                        key={event.year}
                        className={`timeline-event ${event.category} ${activeEvent?.year === event.year ? 'active' : ''}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        onClick={() => setActiveEvent(event)}
                        style={{ left: `${(index / (events.length - 1)) * 100}%` }}
                    >
                        <motion.div 
                            className="event-icon"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {event.icon}
                        </motion.div>
                        <div className="event-year">{event.year}</div>
                        <motion.div 
                            className="event-title"
                            animate={{ opacity: activeEvent?.year === event.year ? 1 : 0.7 }}
                        >
                            {event.title}
                        </motion.div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeEvent && (
                    <motion.div
                        className="event-details"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        key={activeEvent.year}
                    >
                        <div className="details-header">
                            <span className="details-icon">{activeEvent.icon}</span>
                            <h3>{activeEvent.title}</h3>
                            <span className="details-year">{activeEvent.year}</span>
                        </div>
                        
                        <p className="details-description">{activeEvent.description}</p>
                        
                        <div className="innovations-list">
                            <h4>Key Innovations:</h4>
                            <ul>
                                {activeEvent.innovations.map((innovation, index) => (
                                    <motion.li
                                        key={innovation}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        {innovation}
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        <div className="impact-section">
                            <h4>Impact:</h4>
                            <p>{activeEvent.impact}</p>
                        </div>

                        {activeEvent.category === 'evrmore' && (
                            <motion.div 
                                className="evrmore-highlight"
                                animate={{ 
                                    scale: [1, 1.02, 1],
                                    borderColor: ['#4CAF50', '#81C784', '#4CAF50']
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <h4>The Future is Here</h4>
                                <p>
                                    EVRmore represents the next step in blockchain evolution, 
                                    combining the best of previous innovations with new capabilities.
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BlockchainEvolutionTimeline; 