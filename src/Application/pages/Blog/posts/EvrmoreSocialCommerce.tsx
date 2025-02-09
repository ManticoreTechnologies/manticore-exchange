import React, { useState } from 'react';
import '../BlogPost.css';
import './EvrmoreSocialCommerce.css';
import evrLogo from '@/images/evr_logo_blue_400.svg';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const EvrmoreSocialCommerce: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const sections = {
        intro: [
            {
                title: "Market Potential",
                value: "$2.9T",
                description: "Global social commerce market by 2026",
                content: "The global social commerce market is projected to reach a staggering $2.9 trillion by 2026, with the U.S. market alone expected to hit $80 billion by 2025."
            },
            {
                title: "Current Challenges",
                value: "40%",
                description: "Users concerned about privacy",
                content: "Nearly 40% of shoppers hesitate to make purchases on social media due to privacy and data security concerns with traditional platforms."
            },
            {
                title: "Growth Trajectory",
                value: "↗️",
                description: "Rapid market expansion",
                content: "As the merging of social media and ecommerce accelerates, social commerce is becoming the future of online shopping."
            }
        ],
        features: [
            {
                id: "privacy",
                title: "Privacy & Security",
                icon: "🔒",
                description: "Decentralized identity system protecting user data",
                content: "Evrmore Blockchain provides a solution through its decentralized identity system, where user data is not stored or controlled by any central authority. Instead, data is secured using cryptographic keys, ensuring that only the user has access.",
                benefits: [
                    "User-controlled data storage",
                    "Cryptographic security measures",
                    "No centralized data breaches",
                    "Complete data ownership"
                ]
            },
            {
                id: "p2p",
                title: "Peer-to-Peer Commerce",
                icon: "🤝",
                description: "Direct transactions without intermediaries",
                content: "Current social commerce platforms operate on a centralized model, creating friction and adding unnecessary fees. Evrmore's decentralized architecture removes middlemen, enabling direct peer-to-peer commerce where buyers and sellers interact directly.",
                benefits: [
                    "Lower transaction fees",
                    "Direct buyer-seller relationships",
                    "No platform interference",
                    "Greater transaction control"
                ]
            },
            {
                id: "nft",
                title: "NFT Integration",
                icon: "🎨",
                description: "Tokenization of digital assets and content",
                content: "Evrmore introduces NFT-based tokenization, allowing creators to offer exclusive digital assets, event tickets, subscriptions, and more. Unlike traditional models, these NFTs are tradeable, providing both creators and consumers with more flexibility.",
                benefits: [
                    "Exclusive digital assets",
                    "Event ticket tokenization",
                    "Subscription management",
                    "Secondary market creation"
                ]
            }
        ],
        implementation: [
            {
                id: "microtransactions",
                title: "Secure Payments",
                icon: "💳",
                description: "Frictionless commerce experience",
                content: "With Evrmore, transactions are conducted through secure microtransactions that allow users to make purchases directly within the app. Evrmore's multi-asset payment system lets users pay in various cryptocurrencies, enhancing flexibility and ease of use.",
                features: [
                    "Direct in-app purchases",
                    "Multi-currency support",
                    "Instant settlements",
                    "Secure payment processing"
                ]
            },
            {
                id: "social-proof",
                title: "Transparent Reviews",
                icon: "⭐",
                description: "Authentic user-generated content",
                content: "Social proof plays a crucial role in driving sales. Evrmore's blockchain technology guarantees that user-generated content such as reviews and ratings are authentic and immutable, building trust among consumers.",
                features: [
                    "Verified reviews",
                    "Immutable ratings",
                    "Transparent feedback",
                    "Trust building"
                ]
            },
            {
                id: "digital-assets",
                title: "Asset Control",
                icon: "🔑",
                description: "Full ownership of digital purchases",
                content: "Digital assets such as event tickets, subscriptions, and exclusive content are increasingly valuable. Evrmore's tokenization through NFTs enables users to truly own and trade their digital purchases.",
                features: [
                    "True asset ownership",
                    "Secondary market trading",
                    "Flexible transfers",
                    "Smart contract automation"
                ]
            }
        ]
    };

    return (
        <div className="blog-post-container">
            <header className="blog-post-header">
                <motion.h1 
                    className="blog-post-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    How Evrmore Blockchain Will Revolutionize the Future of Social Commerce
                    <img src={evrLogo} alt="Evrmore Logo" className="logo" />
                </motion.h1>
                <p className="blog-post-meta">By Manticore Technologies • August 24, 2024</p>
            </header>

            <motion.div className="blog-post-content">
                <section className="introduction">
                    <p>
                        In the rapidly evolving world of social commerce, where consumers are seamlessly purchasing products directly from social media platforms, the future holds immense potential. The global social commerce market is projected to reach a staggering <a className="blog-link" href="https://www.statista.com/statistics/1251145/social-commerce-share-worldwide/">$2.9 trillion by 2026</a>, with the U.S. market alone expected to hit <a className="blog-link" href="https://www.emarketer.com/content/us-retail-social-commerce-will-reach-nearly-80-billion-by-2025">$80 billion by 2025</a>.
                    </p>
                    <p>
                        However, the existing landscape of centralized social media platforms such as TikTok, Instagram, and Facebook, though leading the charge, is rife with issues of privacy, data security, and middleman interference. This is where Evrmore Blockchain emerges as the platform poised to take social commerce to the next level.
                    </p>

                    <div className="market-overview">
                        <h3>Market Snapshot</h3>
                        <div className="stats-grid">
                            {sections.intro.map((stat, index) => (
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
                                    <p>{stat.content}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="key-features">
                    <h2 className="section-header">Core Features</h2>
                    <div className="feature-grid">
                        {sections.features.map((feature, index) => (
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
                                <p>{feature.content}</p>
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
                        {sections.implementation.map((section, index) => (
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
                                <p>{section.content}</p>
                                <AnimatePresence>
                                    {activeSection === section.id && (
                                        <motion.ul
                                            className="content-list"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            {section.features.map((feature, i) => (
                                                <motion.li
                                                    key={feature}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                >
                                                    {feature}
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

                <section className="conclusion">
                    <h2 className="section-header">The Future of Social Commerce</h2>
                    <p>
                        The future of social commerce lies in decentralization, transparency, and security—and Evrmore Blockchain provides the perfect platform to drive this revolution. By addressing key challenges such as data privacy, high fees, and limited monetization options, Evrmore empowers both consumers and businesses to engage in secure, seamless, and scalable commerce.
                    </p>
                    <p>
                        As social commerce continues to grow and evolve, Evrmore Blockchain stands out as the platform of choice for the next generation of peer-to-peer transactions, creator monetization, and digital asset ownership.
                    </p>
                    <div className="start-options">
                        <motion.a 
                            href="/developers"
                            className="start-option"
                            whileHover={{ scale: 1.05 }}
                        >
                            <span className="option-icon">👨‍💻</span>
                            <h3>Start Building</h3>
                            <p>Access our comprehensive SDK</p>
                        </motion.a>
                        <motion.a 
                            href="/docs"
                            className="start-option"
                            whileHover={{ scale: 1.05 }}
                        >
                            <span className="option-icon">📚</span>
                            <h3>Learn More</h3>
                            <p>Explore our documentation</p>
                        </motion.a>
                    </div>
                </section>
            </motion.div>
        </div>
    );
};

export default EvrmoreSocialCommerce; 