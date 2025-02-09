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
import BlogPostLayout from '../components/BlogPostLayout';

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
        <BlogPostLayout
            title="Welcome to EVRMORE!"
            author="Manticore Technologies"
            date="August 24, 2024"
        >
            <section>
                <h2>Introduction</h2>
                <p>
                    Welcome to EVRMORE, the next generation blockchain platform designed for social commerce
                    and digital asset management. In this post, we'll explore the key features that make
                    EVRMORE unique and how it's set to revolutionize the way we think about digital
                    transactions.
                </p>
            </section>

            <section>
                <h2>Key Features</h2>
                <ul>
                    <li>Advanced smart contract capabilities</li>
                    <li>Efficient consensus mechanism</li>
                    <li>Seamless social commerce integration</li>
                    <li>Enhanced security protocols</li>
                </ul>
            </section>

            {/* Add more sections as needed */}
        </BlogPostLayout>
    );
};

export default WelcomeToEvrmore;





