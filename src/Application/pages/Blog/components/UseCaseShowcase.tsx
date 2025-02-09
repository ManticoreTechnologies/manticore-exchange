import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UseCase {
    id: string;
    title: string;
    icon: string;
    description: string;
    examples: {
        title: string;
        description: string;
        icon: string;
    }[];
    benefits: string[];
    difficulty: 'Easy' | 'Medium' | 'Advanced';
}

const UseCaseShowcase: React.FC = () => {
    const [activeCase, setActiveCase] = useState<string | null>(null);

    const useCases: UseCase[] = [
        {
            id: 'personal',
            title: "Personal Finance",
            icon: "👤",
            description: "Manage your digital money and assets easily",
            examples: [
                {
                    title: "Send Money Globally",
                    description: "Send funds to anyone, anywhere, instantly with low fees",
                    icon: "🌍"
                },
                {
                    title: "Digital Savings",
                    description: "Store and grow your digital assets securely",
                    icon: "💰"
                },
                {
                    title: "Split Bills",
                    description: "Easily share expenses with friends and family",
                    icon: "🧾"
                }
            ],
            benefits: [
                "No bank account needed",
                "Lower fees than traditional services",
                "Full control of your money",
                "Instant transfers 24/7"
            ],
            difficulty: "Easy"
        },
        {
            id: 'business',
            title: "Business Solutions",
            icon: "💼",
            description: "Transform your business with digital assets",
            examples: [
                {
                    title: "Accept Payments",
                    description: "Take payments from customers worldwide",
                    icon: "💳"
                },
                {
                    title: "Loyalty Programs",
                    description: "Create digital tokens for customer rewards",
                    icon: "⭐"
                },
                {
                    title: "Supply Chain",
                    description: "Track products and payments transparently",
                    icon: "📦"
                }
            ],
            benefits: [
                "Lower processing fees",
                "Instant settlement",
                "Global reach",
                "Automated compliance"
            ],
            difficulty: "Medium"
        },
        {
            id: 'creative',
            title: "Digital Creativity",
            icon: "🎨",
            description: "Create and trade unique digital items",
            examples: [
                {
                    title: "Digital Art",
                    description: "Create and sell unique artwork as NFTs",
                    icon: "🖼️"
                },
                {
                    title: "Gaming Items",
                    description: "Trade in-game assets securely",
                    icon: "🎮"
                },
                {
                    title: "Collectibles",
                    description: "Build your digital collection",
                    icon: "✨"
                }
            ],
            benefits: [
                "Prove authenticity",
                "Earn from your creativity",
                "Connect with fans",
                "Trade instantly"
            ],
            difficulty: "Easy"
        },
        {
            id: 'defi',
            title: "DeFi Activities",
            icon: "🏦",
            description: "Access advanced financial services",
            examples: [
                {
                    title: "Trading",
                    description: "Swap different digital assets instantly",
                    icon: "📈"
                },
                {
                    title: "Lending",
                    description: "Earn interest on your digital assets",
                    icon: "💵"
                },
                {
                    title: "Liquidity",
                    description: "Provide assets to earn rewards",
                    icon: "🌊"
                }
            ],
            benefits: [
                "Higher potential returns",
                "No intermediaries",
                "Full transparency",
                "24/7 market access"
            ],
            difficulty: "Advanced"
        }
    ];

    return (
        <div className="use-case-showcase">
            <div className="use-cases-grid">
                {useCases.map((useCase) => (
                    <motion.div
                        key={useCase.id}
                        className={`use-case-card ${activeCase === useCase.id ? 'active' : ''}`}
                        onClick={() => setActiveCase(useCase.id)}
                        whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="card-header">
                            <span className="case-icon">{useCase.icon}</span>
                            <h3>{useCase.title}</h3>
                            <span className={`difficulty-badge ${useCase.difficulty.toLowerCase()}`}>
                                {useCase.difficulty}
                            </span>
                        </div>
                        <p className="case-description">{useCase.description}</p>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeCase && (
                    <motion.div
                        className="use-case-details"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <div className="details-content">
                            <h3>Examples</h3>
                            <div className="examples-grid">
                                {useCases.find(c => c.id === activeCase)?.examples.map((example, index) => (
                                    <motion.div
                                        key={example.title}
                                        className="example-card"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <span className="example-icon">{example.icon}</span>
                                        <h4>{example.title}</h4>
                                        <p>{example.description}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="benefits-section">
                                <h3>Benefits</h3>
                                <ul className="benefits-list">
                                    {useCases.find(c => c.id === activeCase)?.benefits.map((benefit, index) => (
                                        <motion.li
                                            key={benefit}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            {benefit}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>

                            <motion.button
                                className="get-started-button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.location.href = '/docs/getting-started'}
                            >
                                Learn How to Get Started
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UseCaseShowcase; 