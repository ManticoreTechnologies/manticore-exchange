import React, { useState, useEffect } from 'react';
import '../BlogPost.css';
import './WelcomeToEvrmore.css';
import evrLogo from '@/images/evr_logo_blue_400.svg';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import NetworkVisualization from '@/App/components/NetworkVisualization';
import DefiFlowVisualization from '@/App/components/DefiFlowVisualization';
import BlockExplorer from '@/App/components/BlockExplorer';
import MiningAnimation from '@/App/components/MiningAnimation';
import ConsensusVisualization from '@/App/components/ConsensusVisualization';
import NetworkStats from '@/App/components/NetworkStats';
import BlockchainEvolutionTimeline from '@/App/components/BlockchainEvolutionTimeline';
import UseCaseShowcase from '@/App/components/UseCaseShowcase';
import Glossary from '@/App/components/Glossary';

const WelcomeToEvrmore: React.FC = () => {
    const [activeFeature, setActiveFeature] = useState<string | null>(null);

    const features = [
        {
            id: 'security',
            title: 'Built-in Security',
            description: 'Native security features that eliminate smart contract vulnerabilities',
            details: 'EVRmore integrates security directly into the protocol layer, avoiding the risks associated with complex smart contracts while maintaining the flexibility of DeFi operations.'
        },
        {
            id: 'defi',
            title: 'Protocol-Level DeFi',
            description: 'DeFi capabilities built into the core protocol',
            details: 'Instead of relying on smart contracts, EVRmore implements DeFi primitives at the protocol level, enabling secure and efficient financial operations.'
        },
        {
            id: 'mining',
            title: 'Fair Mining',
            description: 'ASIC-resistant mining algorithm for true decentralization',
            details: 'EvrProgPow ensures mining remains accessible to general-purpose hardware, preventing centralization of mining power.'
        }
    ];

    return (
        <div className="blog-post-container">
            <header className="blog-post-header">
                <motion.h1 
                    className="blog-post-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Welcome to EVRmore!
                    <img src={evrLogo} alt="EVRmore Logo" className="logo" />
                </motion.h1>
                <p className="blog-post-meta">By Manticore Technologies • August 24, 2024</p>
            </header>

            <motion.div className="blog-post-content">
                <section className="introduction">
                    <h2>Welcome to the Future of Digital Money</h2>
                    <div className="learning-path">
                        <h3>What You'll Learn</h3>
                        <ul>
                            <li>What blockchain technology is and why it matters</li>
                            <li>How EVRmore makes digital money easy to use</li>
                            <li>Ways you can use EVRmore in your daily life</li>
                            <li>How to get started with your first wallet</li>
                        </ul>
                    </div>
                    
                    <div className="prerequisites">
                        <h3>Before We Start</h3>
                        <p>
                            Don't worry if you're new to blockchain or cryptocurrency! 
                            We'll explain everything in simple terms. If you see any 
                            unfamiliar terms, check our glossary below.
                        </p>
                    </div>
                </section>

                <Glossary />

                <section className="blockchain-basics">
                    <h2>Understanding Blockchain: The Basics</h2>
                    <div className="basics-grid">
                        <motion.div 
                            className="basics-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h3>What is Blockchain?</h3>
                            <p>
                                Think of a blockchain as a digital record book that everyone can see 
                                but no one can change without everyone agreeing. It's like a shared 
                                Google Doc, but with special rules that make it super secure.
                            </p>
                            <div className="learn-more">
                                <a href="/learn/blockchain-basics">Learn more about blockchain →</a>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="basics-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h3>Why is it Important?</h3>
                            <p>
                                Blockchain technology lets you send money and assets directly to 
                                anyone, anywhere in the world, without needing banks or other 
                                middlemen. It's faster, cheaper, and more secure than traditional 
                                methods.
                            </p>
                            <div className="learn-more">
                                <a href="/learn/blockchain-importance">Why blockchain matters →</a>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="basics-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h3>How Does it Work?</h3>
                            <p>
                                When you make a transaction, it gets grouped with others into a 
                                "block". Special computers called miners verify these blocks and add 
                                them to the chain. Once added, the transaction can't be changed or 
                                deleted.
                            </p>
                            <div className="learn-more">
                                <a href="/learn/blockchain-technology">Explore the technology →</a>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <section className="common-questions">
                    <h2>Common Questions About EVRmore</h2>
                    <div className="questions-grid">
                        {[
                            {
                                question: "Is EVRmore Safe to Use?",
                                answer: "Yes! EVRmore uses advanced security features built right into its core. Unlike other systems that rely on complex smart contracts, our security is part of the basic design."
                            },
                            {
                                question: "Do I Need Technical Knowledge?",
                                answer: "Not at all! We've designed EVRmore to be as easy to use as your regular banking app. Our wallet guides you through everything step by step."
                            },
                            {
                                question: "What Can I Do with EVRmore?",
                                answer: "You can send money globally, trade digital assets, earn rewards, and much more. Think of it as your all-in-one digital finance platform."
                            },
                            {
                                question: "How Do I Get Started?",
                                answer: "Start by getting an EVRmore wallet - it's free and takes just a few minutes. Then you can buy EVR or receive it from others."
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={item.question}
                                className="question-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <h3>{item.question}</h3>
                                <p>{item.answer}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="evolution-section">
                    <h2>The Journey of Blockchain Technology</h2>
                    <p>
                        Let's see how blockchain technology has evolved and where EVRmore fits in:
                    </p>
                    <BlockchainEvolutionTimeline />
                </section>

                <section className="use-cases-section">
                    <h2>What Can You Do with EVRmore?</h2>
                    <p>
                        EVRmore opens up a world of possibilities. Here are some ways you can use it:
                    </p>
                    <UseCaseShowcase />
                </section>

                <section className="technical-overview">
                    <h2>How EVRmore Works</h2>
                    <p>
                        Let's take a peek under the hood! Don't worry if you're not technical - 
                        we'll explain everything in simple terms:
                    </p>
                    <div className="visualization-container">
                        <NetworkVisualization />
                    </div>
                </section>

                <section className="network-overview">
                    <h2>Network Health Check</h2>
                    <p>
                        See how EVRmore is performing right now:
                    </p>
                    <div className="stats-container">
                        <NetworkStats />
                    </div>
                </section>

                <section className="consensus-section">
                    <h2>Working Together</h2>
                    <p>
                        Watch how EVRmore keeps everyone's records accurate and in sync:
                    </p>
                    <div className="consensus-container">
                        <ConsensusVisualization />
                    </div>
                </section>

                <section className="mining-section">
                    <h2>Creating New Blocks</h2>
                    <p>
                        See how new transactions are processed and added to the blockchain:
                    </p>
                    <div className="mining-container">
                        <MiningAnimation />
                    </div>
                </section>

                <section className="defi-section">
                    <h2>Digital Money Made Easy</h2>
                    <p>
                        Watch how EVRmore handles financial transactions instantly and safely:
                    </p>
                    <div className="defi-container">
                        <DefiFlowVisualization />
                    </div>
                </section>

                <section className="block-explorer-section">
                    <h2>Watch EVRmore in Action</h2>
                    <p>
                        See real-time activity on the EVRmore network:
                    </p>
                    <div className="explorer-container">
                        <BlockExplorer />
                    </div>
                </section>

                <section className="getting-started">
                    <h2>Ready to Start?</h2>
                    <p>
                        Join thousands of others who are already using EVRmore to take control 
                        of their digital future.
                    </p>
                    <div className="start-options">
                        <motion.a 
                            href="/wallet"
                            className="start-option wallet"
                            whileHover={{ scale: 1.05 }}
                        >
                            <span className="option-icon">👛</span>
                            <h3>Get a Wallet</h3>
                            <p>Create your digital wallet in minutes</p>
                        </motion.a>
                        <motion.a 
                            href="/learn"
                            className="start-option learn"
                            whileHover={{ scale: 1.05 }}
                        >
                            <span className="option-icon">📚</span>
                            <h3>Learn More</h3>
                            <p>Explore our beginner guides</p>
                        </motion.a>
                        <motion.a 
                            href="/community"
                            className="start-option community"
                            whileHover={{ scale: 1.05 }}
                        >
                            <span className="option-icon">👥</span>
                            <h3>Join Community</h3>
                            <p>Connect with other users</p>
                        </motion.a>
                    </div>
                </section>
            </motion.div>
        </div>
    );
};

export default WelcomeToEvrmore;





