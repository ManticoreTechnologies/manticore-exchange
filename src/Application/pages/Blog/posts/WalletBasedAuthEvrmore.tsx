import React, { useState } from 'react';
import '../BlogPost.css';
import './WalletBasedAuthEvrmore.css';
import evrLogo from '@/images/evr_logo_blue_400.svg';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const WalletBasedAuthEvrmore: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const sections = {
        intro: [
            {
                title: "What is Wallet Auth?",
                content: "Wallet-based authentication uses cryptographic signatures to verify a user\u2019s identity. Instead of traditional username/password combinations, users prove their identity by signing messages with their wallet\u2019s private key.",
                icon: "🔐"
            },
            {
                title: "Why Use It?",
                content: "This method is ideal for decentralized platforms, providing security without central control. It eliminates the risks associated with storing sensitive user credentials while maintaining a seamless user experience.",
                icon: "🤔"
            },
            {
                title: "How it Works",
                content: "Authentication is done through a two-step process: the user signs messages with their private key, and the server verifies these signatures using the user\u2019s public key (wallet address).",
                icon: "⚙️"
            }
        ],
        implementation: [
            {
                number: "01",
                title: "Client-Side Signing",
                content: "The dApp asks the user\u2019s EVRmore wallet to sign a message using their private key. The message typically includes the action the user wants to take and additional metadata like timestamps or nonce values to prevent replay attacks.",
                code: "signmessage \"address\" \"private_key\" \"message\"",
                details: [
                    "Generate unique message with action and timestamp",
                    "Request wallet signature",
                    "Receive base58-encoded signature",
                    "Send signature to server"
                ]
            },
            {
                number: "02",
                title: "Server-Side Verification",
                content: "On the server side, the goal is to verify that the message and signature were signed by the user\u2019s wallet. The server uses the wallet address (public key) to validate the signature against the message.",
                code: "verifymessage \"address\" \"signature\" \"message\"",
                details: [
                    "Receive signature and message",
                    "Extract wallet address",
                    "Verify signature authenticity",
                    "Process authenticated request"
                ]
            }
        ],
        workflow: [
            {
                title: "Message Creation",
                content: "Generate a unique message containing the action (\"signup\"), timestamp, and any additional metadata needed for verification.",
                icon: "📝",
                example: "signup:1629384756:nonce123"
            },
            {
                title: "Signature Generation",
                content: "The wallet signs the message using the private key, producing a cryptographic signature that proves ownership of the wallet.",
                icon: "✍️",
                example: "base58EncodedSignature..."
            },
            {
                title: "Server Verification",
                content: "Server validates the signature against the public key and processes the signup request if verification succeeds.",
                icon: "✅",
                example: "verification_result: true"
            }
        ],
        practices: [
            {
                title: "Include Timestamps",
                content: "Always include a timestamp or nonce in your messages to prevent replay attacks. This ensures that signed messages can\u2019t be reused by malicious actors.",
                icon: "⏰",
                tips: [
                    "Use UTC timestamps",
                    "Implement expiration times",
                    "Validate timestamp freshness"
                ]
            },
            {
                title: "Clear Messages",
                content: "Use descriptive, action-specific messages that clearly indicate what the user is authorizing. This helps users understand what they\u2019re signing and prevents confusion.",
                icon: "📢",
                tips: [
                    "Include action type",
                    "Add relevant metadata",
                    "Use consistent formatting"
                ]
            },
            {
                title: "Error Handling",
                content: "Implement comprehensive error handling to provide clear feedback when authentication fails. This improves user experience and helps with troubleshooting.",
                icon: "⚠️",
                tips: [
                    "Provide clear error messages",
                    "Handle timeout scenarios",
                    "Log verification failures"
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
                    Implementing Wallet-Based Authentication on EVRmore
                    <img src={evrLogo} alt="EVRmore Logo" className="logo" />
                </motion.h1>
                <p className="blog-post-meta">By Manticore Technologies • August 24, 2024</p>
            </header>

            <motion.div className="blog-post-content">
                <section className="introduction">
                    <p>
                        Welcome to this comprehensive guide where we'll explore how to implement wallet-based authentication in a decentralized environment using the EVRmore blockchain.
                    </p>
                    <p>
                        If you're building a decentralized application (dApp) on EVRmore, using wallet-based authentication is an efficient and secure way to ensure that users can sign actions with their private keys without the risks that come with centralized credentials.
                    </p>

                    <div className="step-grid">
                        {sections.intro.map((item, index) => (
                            <motion.div
                                key={item.title}
                                className="step-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <span className="step-icon">{item.icon}</span>
                                <h3>{item.title}</h3>
                                <p>{item.content}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="implementation">
                    <h2 className="section-header">Implementation Steps</h2>
                    <p>
                        Wallet-based authentication consists of two primary steps: the user (client-side) signs a message using their wallet, and the server verifies the signed message to confirm that the signature matches the wallet address and message.
                    </p>
                    <div className="step-grid">
                        {sections.implementation.map((step, index) => (
                            <motion.div
                                key={step.number}
                                className="step-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="step-number">{step.number}</div>
                                <h3>{step.title}</h3>
                                <p>{step.content}</p>
                                <code className="code-block">{step.code}</code>
                                <ul className="details-list">
                                    {step.details.map((detail, i) => (
                                        <li key={i}>{detail}</li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="workflow">
                    <h2 className="section-header">Authentication Workflow</h2>
                    <p>
                        Let's examine a practical example of how wallet-based authentication works in a real-world scenario. Here's how the flow would look when a user signs up for your dApp:
                    </p>
                    <div className="step-grid">
                        {sections.workflow.map((step, index) => (
                            <motion.div
                                key={step.title}
                                className="step-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <span className="step-icon">{step.icon}</span>
                                <h3>{step.title}</h3>
                                <p>{step.content}</p>
                                <code className="code-block">{step.example}</code>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="best-practices">
                    <h2 className="section-header">Best Practices</h2>
                    <p>
                        To ensure secure and reliable wallet-based authentication, follow these essential best practices:
                    </p>
                    <div className="practice-grid">
                        {sections.practices.map((practice, index) => (
                            <motion.div
                                key={practice.title}
                                className="practice-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => setActiveSection(practice.title === activeSection ? null : practice.title)}
                            >
                                <span className="practice-icon">{practice.icon}</span>
                                <h3>{practice.title}</h3>
                                <p>{practice.content}</p>
                                <AnimatePresence>
                                    {activeSection === practice.title && (
                                        <motion.ul
                                            className="tips-list"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            {practice.tips.map((tip, i) => (
                                                <motion.li
                                                    key={tip}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                >
                                                    {tip}
                                                </motion.li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="conclusion">
                    <h2 className="section-header">Ready to Implement?</h2>
                    <p>
                        By implementing wallet-based authentication, you can create a secure, decentralized, and user-friendly experience for your dApp users. EVRmore blockchain provides all the tools you need to verify ownership and identity through cryptographic signatures.
                    </p>
                    <div className="start-options">
                        <motion.a 
                            href="/developers"
                            className="start-option"
                            whileHover={{ scale: 1.05 }}
                        >
                            <span className="option-icon">👨‍💻</span>
                            <h3>Start Building</h3>
                            <p>Access our developer tools</p>
                        </motion.a>
                        <motion.a 
                            href="/docs/auth"
                            className="start-option"
                            whileHover={{ scale: 1.05 }}
                        >
                            <span className="option-icon">📚</span>
                            <h3>Documentation</h3>
                            <p>Read the detailed docs</p>
                        </motion.a>
                    </div>
                </section>
            </motion.div>

            <ReactTooltip id="tooltip" place="top" />
        </div>
    );
};

export default WalletBasedAuthEvrmore;
