import React, { useState } from 'react';
import '../BlogPost.css';
import './EvrmoreSocialCommerce.css';
import evrLogo from '@/images/evr_logo_blue_400.svg';
import { motion, AnimatePresence } from 'framer-motion';

const EvrmoreSocialCommerce: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    return (
        <div className="blog-post-container">
            <header className="blog-post-header">
                <motion.h1 
                    className="blog-post-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    The Future of Social Commerce
                    <img src={evrLogo} alt="EVRmore Logo" className="logo" />
                </motion.h1>
                <p className="blog-post-meta">By Manticore Technologies • August 24, 2024</p>
            </header>

            <motion.div className="blog-post-content">
                <section className="introduction">
                    <h2>Revolutionizing Online Commerce</h2>
                    <div className="learning-path">
                        <h3>Key Takeaways</h3>
                        <ul>
                            <li>Understanding the future of social commerce</li>
                            <li>How EVRmore transforms online transactions</li>
                            <li>Benefits of decentralized commerce</li>
                            <li>Getting started with EVRmore commerce</li>
                        </ul>
                    </div>

                    <div className="market-overview">
                        <h3>Market Snapshot</h3>
                        <div className="stats-grid">
                            {[
                                {
                                    title: 'Market Potential',
                                    value: '$2.9T',
                                    description: 'Global social commerce market by 2026'
                                },
                                {
                                    title: 'U.S. Market',
                                    value: '$80B',
                                    description: 'Expected U.S. market size by 2025'
                                },
                                {
                                    title: 'Consumer Adoption',
                                    value: '40%',
                                    description: 'Of shoppers already use social commerce'
                                }
                            ].map((stat, index) => (
                                <motion.div
                                    key={stat.title}
                                    className="stats-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <h3>{stat.title}</h3>
                                    <div className="stat">{stat.value}</div>
                                    <p>{stat.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="key-features">
                    <h2>Core Features</h2>
                    <div className="feature-grid">
                        {[
                            {
                                id: 'privacy',
                                title: 'Privacy & Security',
                                icon: '🔒',
                                description: 'Decentralized identity system protecting user data',
                                benefits: [
                                    'User-controlled data',
                                    'Cryptographic security',
                                    'No central data storage',
                                    'Transparent operations'
                                ]
                            },
                            {
                                id: 'p2p',
                                title: 'Peer-to-Peer Commerce',
                                icon: '🤝',
                                description: 'Direct transactions without intermediaries',
                                benefits: [
                                    'Lower fees',
                                    'Direct relationships',
                                    'Faster transactions',
                                    'Greater control'
                                ]
                            },
                            {
                                id: 'nft',
                                title: 'NFT Integration',
                                icon: '🎨',
                                description: 'Tokenization of digital assets and content',
                                benefits: [
                                    'Creator monetization',
                                    'Asset ownership',
                                    'Secondary markets',
                                    'Exclusive content'
                                ]
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={feature.id}
                                className="feature-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => setActiveSection(feature.id === activeSection ? null : feature.id)}
                            >
                                <span className="feature-icon">{feature.icon}</span>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                                <AnimatePresence>
                                    {activeSection === feature.id && (
                                        <motion.ul
                                            className="benefits-list"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            {feature.benefits.map((benefit, i) => (
                                                <motion.li
                                                    key={benefit}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                >
                                                    {benefit}
                                                </motion.li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="implementation">
                    <h2>Technical Implementation</h2>
                    <div className="tech-grid">
                        {[
                            {
                                id: 'tokenization',
                                title: 'Tokenization & NFTs',
                                icon: '🎨',
                                description: 'The creator economy is revolutionized through NFT-based tokenization',
                                content: [
                                    'Create exclusive digital assets',
                                    'Sell event tickets and subscriptions',
                                    'Enable secondary markets',
                                    'Generate predictable revenue streams'
                                ]
                            },
                            {
                                id: 'microtransactions',
                                title: 'Secure Payments',
                                icon: '💳',
                                description: 'Frictionless commerce through secure microtransactions',
                                content: [
                                    'Direct in-app purchases',
                                    'Multi-asset payment support',
                                    'Instant settlements',
                                    'Zero payment delays'
                                ]
                            },
                            {
                                id: 'social-proof',
                                title: 'Transparent Reviews',
                                icon: '⭐',
                                description: 'Authentic and immutable user-generated content',
                                content: [
                                    'Verified reviews',
                                    'Immutable ratings',
                                    'Transparent feedback',
                                    'Build trust naturally'
                                ]
                            },
                            {
                                id: 'digital-assets',
                                title: 'Digital Asset Control',
                                icon: '🔑',
                                description: 'Full ownership and control of digital purchases',
                                content: [
                                    'Resellable assets',
                                    'Transferable ownership',
                                    'Fraud prevention',
                                    'Smart contract automation'
                                ]
                            }
                        ].map((section, index) => (
                            <motion.div
                                key={section.id}
                                className="tech-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => setActiveSection(section.id === activeSection ? null : section.id)}
                            >
                                <div className="card-header">
                                    <span className="section-icon">{section.icon}</span>
                                    <h3>{section.title}</h3>
                                </div>
                                <p className="section-description">{section.description}</p>
                                <AnimatePresence>
                                    {activeSection === section.id && (
                                        <motion.ul
                                            className="content-list"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            {section.content.map((item, i) => (
                                                <motion.li
                                                    key={item}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                >
                                                    {item}
                                                </motion.li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="getting-started">
                    <h2>Start Building Today</h2>
                    <div className="start-options">
                        <motion.a 
                            href="/developers"
                            className="start-option develop"
                            whileHover={{ scale: 1.05 }}
                        >
                            <span className="option-icon">👨‍💻</span>
                            <h3>Developer Tools</h3>
                            <p>Access our comprehensive SDK</p>
                        </motion.a>
                        <motion.a 
                            href="/docs"
                            className="start-option docs"
                            whileHover={{ scale: 1.05 }}
                        >
                            <span className="option-icon">📚</span>
                            <h3>Documentation</h3>
                            <p>Explore our technical guides</p>
                        </motion.a>
                        <motion.a 
                            href="/community"
                            className="start-option community"
                            whileHover={{ scale: 1.05 }}
                        >
                            <span className="option-icon">👥</span>
                            <h3>Join Community</h3>
                            <p>Connect with other builders</p>
                        </motion.a>
                    </div>
                </section>
            </motion.div>
        </div>
    );
};

export default EvrmoreSocialCommerce; 