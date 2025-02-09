import React from 'react';
import { motion } from 'framer-motion';
import './Glossary.css';

interface Term {
    term: string;
    definition: string;
    category: 'basic' | 'technical' | 'defi';
    examples?: string[];
}

const glossaryTerms: Term[] = [
    {
        term: 'Blockchain',
        definition: 'A digital ledger that records transactions across many computers securely. Think of it like a shared spreadsheet that everyone can see but no one can cheat.',
        category: 'basic',
        examples: ['Bitcoin', 'EVRmore']
    },
    {
        term: 'Cryptocurrency',
        definition: "Digital or virtual money that uses cryptography for security. Unlike traditional money, it's not controlled by any government or bank.",
        category: 'basic'
    },
    {
        term: 'Mining',
        definition: 'The process of verifying transactions and adding them to the blockchain. Miners use computer power to solve complex puzzles and are rewarded with new coins.',
        category: 'basic'
    },
    {
        term: 'DeFi (Decentralized Finance)',
        definition: 'Financial services that operate without traditional banks. Imagine banking services that run automatically through computer code.',
        category: 'defi',
        examples: ['Lending', 'Trading', 'Saving']
    },
    {
        term: 'Wallet',
        definition: 'A digital tool that lets you store, send, and receive cryptocurrencies. Like a bank account for your digital money.',
        category: 'basic'
    },
    {
        term: 'Smart Contract',
        definition: 'Self-executing contracts where the terms are written in code. Like a vending machine: if you put in money, it automatically gives you what you selected.',
        category: 'technical'
    },
    {
        term: 'Node',
        definition: 'A computer that participates in the network by maintaining a copy of the blockchain. Like having your own copy of the transaction history.',
        category: 'technical'
    },
    {
        term: 'Block',
        definition: 'A package of transactions that gets added to the blockchain. Like a page in a ledger book that gets filled with recent transactions.',
        category: 'basic'
    },
    {
        term: 'Hash',
        definition: 'A unique digital fingerprint for data. Every block has its own hash, making it impossible to alter the history without detection.',
        category: 'technical'
    },
    {
        term: 'Consensus',
        definition: 'The process by which all computers in the network agree on the valid transactions. Like everyone agreeing on what really happened.',
        category: 'technical'
    }
];

const Glossary: React.FC = () => {
    return (
        <div className="glossary-container">
            <h2>Blockchain Terms Explained</h2>
            <p className="glossary-intro">
                New to blockchain? Don't worry! Here's a simple guide to the terms 
                you'll encounter. Click any term to see more details.
            </p>

            <div className="terms-grid">
                {glossaryTerms.map((item, index) => (
                    <motion.div
                        key={item.term}
                        className={`term-card ${item.category}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <h3>{item.term}</h3>
                        <p>{item.definition}</p>
                        {item.examples && (
                            <div className="examples">
                                <span>Examples: </span>
                                {item.examples.join(', ')}
                            </div>
                        )}
                        <div className="category-badge">{item.category}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Glossary; 