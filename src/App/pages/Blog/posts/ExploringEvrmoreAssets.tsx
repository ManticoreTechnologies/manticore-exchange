import React, { useState } from 'react';
import '../BlogPost.css';
import './ExploringEvrmoreAssets.css';
import evrLogo from '@/images/evr_logo_blue_400.svg';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const ExploringEvrmoreAssets: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const sections = {
        intro: [
            {
                title: "Asset Creation",
                value: "Simple",
                description: "Create assets in minutes",
                content: "Anyone can create digital assets on Evrmore with just a few commands. No complex programming or smart contracts required - just simple, straightforward asset creation."
            },
            {
                title: "Asset Types",
                value: "12+",
                description: "Diverse asset categories",
                content: "From fungible tokens to NFTs, qualifiers to channels, Evrmore supports a comprehensive range of digital asset types to suit any use case."
            },
            {
                title: "Network Security",
                value: "PoW",
                description: "Bitcoin-based security",
                content: "Built on Bitcoin's proven Proof-of-Work model with merge-mining capabilities, ensuring maximum security and network stability for your digital assets."
            }
        ],
        assetTypes: [
            {
                id: "main",
                title: "Main Assets",
                icon: "💎",
                description: "Primary asset class with full features",
                content: "Main assets are the foundation of Evrmore's asset system. They offer the most flexibility and features, perfect for creating primary tokens for your project.",
                details: {
                    features: [
                        "Can be reissued to increase supply",
                        "Configurable divisibility (up to 8 decimal places)",
                        "Support rich metadata and IPFS integration",
                        "Can have associated sub-assets",
                        "Transferable between addresses",
                        "Can be used in atomic swaps"
                    ],
                    commands: {
                        create: `issue "MYASSET" 1000 true true "{'name':'My Asset','description':'Description'}"`,
                        reissue: `reissue "MYASSET" 500 "{'updated':true}"`,
                        transfer: `transfer "MYASSET" 100 "address"`,
                        metadata: `updateasset "MYASSET" "{'website':'https://example.com'}"`
                    },
                    fees: {
                        creation: "100 EVR for creation",
                        reissuance: "50 EVR for reissuance",
                        transfer: "0.01 EVR per transaction"
                    }
                }
            },
            {
                id: "sub",
                title: "Sub-Assets",
                icon: "🔗",
                description: "Assets linked to main assets",
                content: "Sub-assets enable hierarchical token structures, perfect for creating series, collections, or product variants under a main asset.",
                details: {
                    features: [
                        "Inherits properties from parent asset",
                        "Separate supply management",
                        "Great for product variants",
                        "Perfect for collection series",
                        "Can have unique metadata",
                        "Maintains brand consistency"
                    ],
                    commands: {
                        create: `issue "MYASSET/SERIES1" 100 true true "{'series':'Series 1'}"`,
                        transfer: `transfer "MYASSET/SERIES1" 10 "address"`,
                        list: `listassets "MYASSET/*"`
                    },
                    requirements: [
                        "Parent asset must exist",
                        "Creator must own parent asset",
                        "Uses parent's divisibility setting",
                        "Name format: PARENT/SUBASSET"
                    ]
                }
            },
            {
                id: "unique",
                title: "Unique Assets (NFTs)",
                icon: "🎨",
                description: "Non-fungible tokens for unique items",
                content: "Create truly unique tokens perfect for digital art, collectibles, certificates, or any one-of-a-kind digital asset.",
                details: {
                    features: [
                        "Always non-divisible (quantity of 1)",
                        "Cannot be reissued",
                        "Supports rich media metadata",
                        "Perfect for unique items",
                        "IPFS integration for media",
                        "Verifiable authenticity"
                    ],
                    commands: {
                        create: `issue "#ART" 1 false false "{'title':'Unique Artwork','artist':'Name','media':'ipfs://...','attributes':[...]}"`,
                        transfer: `transfer "#ART" 1 "address"`,
                        view: `getassetdata "#ART"`
                    },
                    metadata: [
                        "IPFS support for media files",
                        "Rich attribute system",
                        "Provenance tracking",
                        "External links and references",
                        "Custom properties",
                        "Collection metadata"
                    ]
                }
            },
            {
                id: "qualifier",
                title: "Qualifier Assets",
                icon: "🔑",
                description: "Access control tokens",
                content: "Qualifier assets act as permission tokens, controlling who can hold or transfer certain restricted assets.",
                details: {
                    features: [
                        "Controls restricted assets",
                        "Acts as permission token",
                        "Can be hierarchical",
                        "Enables KYC/AML compliance"
                    ],
                    commands: {
                        create: `issue "#QUALIFIER" 1 false false "{'type':'access_token'}"`,
                        assign: `transfer "#QUALIFIER" 1 "verified_address"`
                    },
                    usage: [
                        "Required for restricted assets",
                        "Can create sub-qualifiers",
                        "Manages asset permissions",
                        "Controls token transfers"
                    ]
                }
            },
            {
                id: "restricted",
                title: "Restricted Assets",
                icon: "🔒",
                description: "Regulated asset class",
                content: "Assets that require holders to possess specific qualifier tokens, perfect for regulatory compliance.",
                examples: [
                    "Security tokens",
                    "Regulated assets",
                    "Private offerings",
                    "Compliance tokens"
                ]
            },
            {
                id: "channel",
                title: "Channel Assets",
                icon: "📢",
                description: "Communication tokens",
                content: "Special assets that enable secure messaging and data transfer between holders.",
                examples: [
                    "Messaging channels",
                    "Private groups",
                    "Broadcast tokens",
                    "Community channels"
                ]
            }
        ],
        creation: [
            {
                id: "basics",
                title: "Asset Creation Basics",
                icon: "📝",
                description: "Step-by-step guide to creating assets",
                content: "Creating an asset requires EVR for fees and following proper naming conventions:",
                steps: [
                    "Install Evrmore Core wallet",
                    "Fund wallet with EVR (fee varies by asset type)",
                    "Choose unique asset name (follows rules)",
                    "Decide on asset properties",
                    "Prepare metadata JSON",
                    "Issue asset command"
                ],
                code: `issue "ASSET_NAME" QTY "{'name':'Asset Name','description':'Description'}"`,
                rules: [
                    "Names must be 3-30 characters",
                    "Use A-Z, 0-9, _, .",
                    "Cannot start with _",
                    "Must be unique on network"
                ]
            },
            {
                id: "properties",
                title: "Asset Properties",
                icon: "⚙️",
                description: "Configure asset settings",
                content: "Each asset type has configurable properties that determine its behavior:",
                properties: [
                    "Reissuable: Can supply be increased later",
                    "Divisible: Supports fractional amounts",
                    "Transferable: Can be sent between addresses",
                    "Associated Data: IPFS or JSON metadata",
                    "Qualifiers: Required for holding/transfer"
                ],
                code: `issue "MYTOKEN" 1000 true true "metadata" # Reissuable & divisible`
            },
            {
                id: "metadata",
                title: "Metadata Structure",
                icon: "📊",
                description: "Add rich data to assets",
                content: "Metadata adds context and functionality to assets. Can use IPFS for larger data:",
                fields: [
                    "name: Asset display name",
                    "description: Detailed info",
                    "image: IPFS/URL to media",
                    "properties: Custom attributes",
                    "external_url: Related website",
                    "background_color: UI display"
                ],
                code: `issue "ART" 1 false false "{'name':'Artwork #1','artist':'Name','image':'ipfs://...'}"`
            }
        ],
        management: [
            {
                id: "transfer",
                title: "Asset Transfer",
                icon: "↔️",
                description: "Send and receive assets",
                content: "Transfer assets securely between wallets",
                features: [
                    "Instant transfers",
                    "Low fees",
                    "Batch transfers",
                    "Transfer history"
                ]
            },
            {
                id: "reissue",
                title: "Asset Management",
                icon: "📈",
                description: "Manage your assets post-creation",
                content: "Update and manage your assets over time",
                features: [
                    "Supply management",
                    "Metadata updates",
                    "Owner controls",
                    "Asset freezing"
                ]
            }
        ]
    };

    const handleCardClick = (id: string) => {
        setActiveSection(currentActive => currentActive === id ? null : id);
    };

    return (
        <div className="blog-post-container">
            <header className="blog-post-header">
                <motion.h1 
                    className="blog-post-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Exploring Evrmore Assets
                    <img src={evrLogo} alt="Evrmore Logo" className="logo" />
                </motion.h1>
                <p className="blog-post-meta">By Manticore Technologies • August 24, 2024</p>
            </header>

            <motion.div className="blog-post-content">
                <section className="introduction">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        EVRmore's revolutionary asset system represents the next generation of digital asset creation and management. Built on a secure Proof-of-Work blockchain, EVRmore assets offer unparalleled flexibility - from fungible tokens and NFTs to sophisticated qualifier-restricted assets and communication channels. Whether you're building a social commerce platform, launching an NFT collection, or implementing regulatory-compliant securities, EVRmore's comprehensive asset toolkit provides everything you need.
                    </motion.p>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        With simple commands and powerful features, EVRmore makes asset creation accessible to everyone while maintaining the robust security and functionality demanded by enterprise applications. Let's explore the diverse world of EVRmore assets and discover how they can power your next blockchain project.
                    </motion.p>

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
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-description">{stat.description}</div>
                                <p className="stat-content">{stat.content}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="asset-types">
                    <h2 className="section-header">Types of Evrmore Assets</h2>
                    <div className="asset-grid">
                        {sections.assetTypes.map((asset, index) => (
                            <motion.div
                                key={asset.id}
                                className={`asset-card ${activeSection === asset.id ? 'expanded' : ''}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ 
                                    opacity: 1, 
                                    y: 0,
                                    height: activeSection === asset.id ? 'auto' : '100%',
                                }}
                                transition={{ duration: 0.3 }}
                                onClick={() => handleCardClick(asset.id)}
                            >
                                <div className="asset-header">
                                    <span className="asset-icon">{asset.icon}</span>
                                    <h3>{asset.title}</h3>
                                </div>
                                <p className="asset-description">{asset.description}</p>
                                
                                <AnimatePresence>
                                    {activeSection === asset.id && (
                                        <motion.div
                                            className="asset-details"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            <p className="asset-content">{asset.content}</p>
                                            
                                            <div className="details-grid">
                                                <div className="detail-section">
                                                    <h4>Key Features</h4>
                                                    <ul className="features-list">
                                                        {asset.details.features.map((feature, i) => (
                                                            <motion.li
                                                                key={feature}
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: i * 0.1 }}
                                                            >
                                                                {feature}
                                                            </motion.li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="detail-section">
                                                    <h4>Usage Examples</h4>
                                                    <div className="command-blocks">
                                                        {Object.entries(asset.details.commands).map(([name, command]) => (
                                                            <div key={name} className="command-block">
                                                                <span className="command-name">{name}:</span>
                                                                <code className="code-block">{command}</code>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {asset.details.metadata && (
                                                    <div className="detail-section">
                                                        <h4>Metadata Support</h4>
                                                        <ul className="metadata-list">
                                                            {asset.details.metadata.map((item, i) => (
                                                                <motion.li
                                                                    key={item}
                                                                    initial={{ opacity: 0, x: -20 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: i * 0.1 }}
                                                                >
                                                                    {item}
                                                                </motion.li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="creation-guide">
                    <h2 className="section-header">Creating Evrmore Assets</h2>
                    <div className="creation-grid">
                        {sections.creation.map((guide, index) => (
                            <motion.div
                                key={guide.id}
                                className="creation-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <span className="guide-icon">{guide.icon}</span>
                                <h3>{guide.title}</h3>
                                <p className="guide-description">{guide.description}</p>
                                <p>{guide.content}</p>
                                {guide.steps && (
                                    <ul className="steps-list">
                                        {guide.steps.map((step, i) => (
                                            <li key={i}>{step}</li>
                                        ))}
                                    </ul>
                                )}
                                {guide.properties && (
                                    <ul className="properties-list">
                                        {guide.properties.map((prop, i) => (
                                            <li key={i}>{prop}</li>
                                        ))}
                                    </ul>
                                )}
                                {guide.fields && (
                                    <ul className="fields-list">
                                        {guide.fields.map((field, i) => (
                                            <li key={i}>{field}</li>
                                        ))}
                                    </ul>
                                )}
                                <code className="code-block">{guide.code}</code>
                                {guide.rules && (
                                    <ul className="rules-list">
                                        {guide.rules.map((rule, i) => (
                                            <li key={i}>{rule}</li>
                                        ))}
                                    </ul>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="asset-management">
                    <h2 className="section-header">Managing Your Assets</h2>
                    <div className="management-grid">
                        {sections.management.map((item, index) => (
                            <motion.div
                                key={item.id}
                                className="management-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <span className="management-icon">{item.icon}</span>
                                <h3>{item.title}</h3>
                                <p className="management-description">{item.description}</p>
                                <p>{item.content}</p>
                                <ul className="features-list">
                                    {item.features.map((feature, i) => (
                                        <li key={i}>{feature}</li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="conclusion">
                    <h2 className="section-header">Ready to Create Your First Asset?</h2>
                    <div className="start-options">
                        <motion.a 
                            href="/wallet"
                            className="start-option"
                            whileHover={{ scale: 1.05 }}
                        >
                            <span className="option-icon">👛</span>
                            <h3>Get Started</h3>
                            <p>Create your first asset</p>
                        </motion.a>
                        <motion.a 
                            href="/docs/assets"
                            className="start-option"
                            whileHover={{ scale: 1.05 }}
                        >
                            <span className="option-icon">📚</span>
                            <h3>Learn More</h3>
                            <p>Read the detailed docs</p>
                        </motion.a>
                    </div>
                </section>
            </motion.div>

            <ReactTooltip id="tooltip" place="top" />
        </div>
    );
};

export default ExploringEvrmoreAssets; 