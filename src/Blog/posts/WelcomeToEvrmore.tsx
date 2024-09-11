import React, { useState } from 'react';
import '../BlogPost.css';
import evrLogo from '../../images/evr_logo_blue_400.svg';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const WelcomeToEvrmore: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        toggleMenu()
    };

    

    return (
        <div className='page-container'>
            {/* <button onClick={toggleMenu} className='menu-button'>
                {menuOpen ? '▲' : '▼'}
            </button> */}

            {menuOpen && (
                <div className='nav-menu'>
                    <ul className='nav-list'>
                        <li className='nav-item'><a href="#welcome" className='nav-link'>Welcome</a></li>
                        <li className='nav-item'><a href="#purpose" className='nav-link'>Purpose of the Post</a></li>
                        <li className='nav-item'><a href="#basics" className='nav-link'>Understanding Blockchain Basics</a></li>
                        <li className='nav-item'><a href="#overview" className='nav-link'>Evrmore Blockchain: An Overview</a></li>
                        <li className='nav-item'><a href="#features" className='nav-link'>Key Features</a></li>
                        <li className='nav-item'><a href="#applications" className='nav-link'>Real-World Applications</a></li>
                        <li className='nav-item'><a href="#benefits" className='nav-link'>Benefits for Users</a></li>
                        <li className='nav-item'><a href="#roadmap" className='nav-link'>The Evrmore DeFi Roadmap</a></li>
                        <li className='nav-item'><a href="#future" className='nav-link'>Future of Evrmore</a></li>
                    </ul>
                </div>
            )}

            <div className='container'>
                <div id="welcome">
                    <h1 className="header">Welcome to Evrmore <img src={evrLogo} alt="Evrmore Logo" className="logo" /></h1>
                    <p className="paragraph">Hey there, and welcome!</p>
                    <p className="paragraph">We’re thrilled to have you here as we introduce you to <a className="blog-link" href="https://evrmore.com/">Evrmore</a>
                        —a blockchain that’s here to rewrite the rules. Whether you’re a seasoned developer, a savvy investor, or just someone curious about where technology is headed, you’re in the right place.</p>
                    <p className="paragraph">Evrmore combines the best aspects of <a className="blog-link" href="https://bitcoin.org/">Bitcoin</a> and <a className="blog-link" href="https://ravencoin.org/">Ravencoin</a>, while addressing the complexities that have challenged <a className='blog-link' href="https://ethereum.org/en/">Ethereum</a>. Imagine a blockchain with built-in DeFi features that eliminates the need for complex <span className="blog-tooltip" data-tooltip-id="smart-contract-tooltip" data-tooltip-content="Smart contracts are self-executing contracts with the terms of the agreement directly written into code. They automate contract execution without intermediaries, but can be complex and vulnerable to bugs. Evrmore eliminates these risks by integrating DeFi features directly into the blockchain protocol, avoiding the need for complex smart contracts.">smart contracts</span>, keeps fees low, and maintains high security. Evrmore offers the power of Ethereum but with a streamlined, user-friendly experience.</p>
                    <p className="paragraph">Let’s dive in and explore why Evrmore might be the blockchain you’ve been waiting for.</p>
                    <p className="paragraph">Let’s get started!</p>
                    <ReactTooltip id="smart-contract-tooltip" place="top"  />
                </div>

                <div id="purpose">
                    <h2 className="sub-sub-header">Purpose of the Post</h2>
                    <p className="paragraph">In this post, we’ll give you a comprehensive introduction to Evrmore, a blockchain that’s taking the best features from existing platforms and elevating them. We’ll explore what makes Evrmore unique, how it compares to other blockchains like Bitcoin, Ravencoin, and Ethereum, and why we believe it represents the future of decentralized finance (DeFi) and digital assets.</p>
                </div>

                <div className='divider'></div>

                <div id="basics">
                    <h2 className="sub-header">Understanding Blockchain Basics</h2>
                    <h3 className='sub-sub-header'>What is Blockchain?</h3>
                    <p className="paragraph">Let’s start with the basics. Blockchain is essentially a <span className="blog-tooltip" data-tooltip-id="digital-ledger-tooltip" data-tooltip-content="A digital ledger is a database that records transactions across a network of computers. In the context of blockchain, like Evrmore, it's a secure and decentralized system that logs every transaction in a transparent and tamper-proof way. Each transaction is added as a block to the chain, ensuring the integrity and security of the data without the need for a central authority.">digital ledger</span> that tracks transactions. Unlike traditional ledgers controlled by a single entity, blockchain is decentralized, meaning control is distributed across multiple computers (or "nodes") globally.</p>
                    <p className="paragraph">Think of it as a massive, shared spreadsheet that everyone can see and verify, but no one can alter without everyone else knowing. Every transaction gets recorded as a “block” in this chain, and once it’s there, it’s permanent—no edits, no deletions, no take-backs. This makes blockchain incredibly secure and transparent, which is why it’s revolutionizing finance and beyond.</p>

                    <h3 className='sub-sub-header'>Importance of Decentralization</h3>
                    <p className="paragraph">Decentralization is crucial because it offers significant benefits:</p>
                    <ul>
                        <li className='paragraph'><strong>Security:</strong> Since no single entity controls the blockchain, it’s incredibly difficult for hackers to compromise it. They’d need to control more than half of the entire network to make any changes, which is virtually impossible.</li>
                        <li className='paragraph'><strong>Transparency:</strong> Everyone on the network can see every transaction, promoting honesty and preventing fraud.</li>
                        <li className='paragraph'><strong>Elimination of Intermediaries:</strong> Blockchain enables direct transactions without the need for middlemen, speeding up processes and reducing costs.</li>
                    </ul>
                    <p className="paragraph">In short, blockchain technology provides a way to create trust in a trustless environment. It’s why blockchain is poised to revolutionize industries that rely on record-keeping, transactions, or contracts.</p>
                    <ReactTooltip id="digital-ledger-tooltip" place="top"  className="react-tooltip" />
                </div>

                <div className='divider'></div>
                <div id="overview">
                    <h2 className="sub-header">Evrmore Blockchain: An Overview</h2>

                    <h3 className='sub-sub-header'>What is Evrmore?</h3>
                    <p className="paragraph">Evrmore is a blockchain platform designed to make decentralized finance (DeFi) and digital asset management not just possible, but powerful and accessible for everyone. It combines the best elements of existing blockchains while adding unique features that address today’s decentralized challenges.</p>
                    <p className="paragraph">Whether you’re creating and trading digital assets, engaging in DeFi, or exploring blockchain’s possibilities, Evrmore is the versatile, reliable backbone of your journey.</p>

                    <h3 className='sub-sub-header'>Origins and Development</h3>
                    <p className="paragraph">Evrmore is rooted in two of the most trusted blockchain names: Bitcoin and Ravencoin. Let’s break that down:</p>
                    <ul>
                        <li className='paragraph'><strong>Bitcoin:</strong> The original cryptocurrency that introduced the world to blockchain technology. Bitcoin is secure, decentralized, and uses the <span className="blog-tooltip" data-tooltip-id="utxo-tooltip" data-tooltip-content="The UTXO model is a method of recording transactions on a blockchain. In Evrmore, it works by keeping track of unspent outputs from previous transactions. Each UTXO represents a specific amount of EVR that can be used as input in a future transaction. This model ensures that every transaction is accurately accounted for, preventing double-spending and enhancing the security and transparency of the blockchain.">UTXO (Unspent Transaction Output)</span> model to ensure every transaction is accounted for.</li>
                        <li className='paragraph'><strong>Ravencoin:</strong> Built on Bitcoin’s foundation, Ravencoin introduced assets—digital tokens representing ownership of any digital data—making it easier to manage and transfer these assets securely.</li>
                    </ul>
                    <p className="paragraph">Evrmore is a fork of Ravencoin, meaning it started with Ravencoin’s code but developed its own unique features. The goal? To push the boundaries of DeFi by integrating DeFi primitives directly into the protocol, making financial transactions simpler, faster, and more secure.</p>

                    <h3 className='sub-sub-header'>Core Philosophy</h3>
                    <p className="paragraph">At Evrmore’s core is a commitment to being a secure, open-source, and decentralized platform for all users. Here’s what that means:</p>
                    <ul>
                        <li className='paragraph'><strong>Security:</strong> Building on Bitcoin and Ravencoin’s proven security, Evrmore integrates DeFi functionalities directly into the protocol, minimizing risks associated with general-purpose smart contracts.</li>
                        <li className='paragraph'><strong>Open Source:</strong> Evrmore’s code is publicly available, allowing anyone to review, contribute, or fork the project, fostering trust and innovation within the community.</li>
                        <li className='paragraph'><strong>Decentralization:</strong> Evrmore is fully decentralized, with no central authority, giving power to the users—whether mining, trading, or developing on the platform.</li>
                    </ul>
                    <p className="paragraph">Evrmore is designed to empower users with a secure, user-friendly platform for decentralized finance and digital asset management, without the complexities and high costs of other platforms.</p>
                    <ReactTooltip id="utxo-tooltip" place="top"  className="react-tooltip" />
                </div>

                <div className='divider'></div>

                <div id="features">
                    <h2 className="sub-header">Key Features of Evrmore Blockchain</h2>

                    <h3 className='sub-sub-header'>UTXO Model Inheritance</h3>
                    <p className="paragraph">Evrmore inherits the UTXO (Unspent Transaction Output) model from Bitcoin, a battle-tested method of managing transactions. This ensures that your transactions are processed efficiently and securely, building on a foundation that has proven itself over a decade of use.</p>

                    <h3 className='sub-sub-header'>Proof-of-Work Mining</h3>
                    <p className="paragraph">Evrmore uses the <span className='blog-tooltip' data-tooltip-id='pow-tooltip' data-tooltip-content='Proof-of-Work is a consensus mechanism used by Evrmore to secure the blockchain. In PoW, miners compete to solve complex mathematical puzzles, and the first to solve it gets to add a new block to the blockchain, receiving EVR as a reward. This process ensures that transactions are verified and recorded in a decentralized and secure manner. Evrmore uses an adapted version of PoW, called EvrProgPow, which is designed to be ASIC-resistant, promoting fair and decentralized mining by allowing a wider range of participants to contribute.'>Proof-of-Work (PoW)</span> consensus mechanism, enhanced by the EvrProgPow algorithm. This custom adaptation resists specialized mining hardware (ASICs), ensuring mining remains accessible and decentralized, with a fair distribution of mining power.</p>

                    <h3 className='sub-sub-header'>Built-in Asset and DeFi Primitives</h3>
                    <p className="paragraph">Evrmore stands out with its built-in asset and DeFi primitives, the building blocks of DeFi and asset management. These are integrated directly into the protocol, eliminating the risks associated with complex smart contracts.</p>
                    <ul>
                        <li className='paragraph'><strong>Atomic Swaps:</strong> Secure, peer-to-peer exchanges of assets without intermediaries.</li>
                        <li className='paragraph'><strong>On-Chain Messaging:</strong> Communicate securely within the network, ensuring transparent information exchange.</li>
                        <li className='paragraph'><strong>Secure Asset Transfers:</strong> Move digital assets securely with full transparency.</li>
                    </ul>
                    <p className="paragraph">By integrating these functions into the core blockchain, Evrmore reduces the risk of smart contract bugs, providing a safer environment for every transaction.</p>

                    <h3 className='sub-sub-header'>Enhanced Transaction Features</h3>
                    <p className="paragraph">Evrmore enhances transaction handling with faster processing, support for <span className='blog-tooltip' data-tooltip-id='zero-tooltip' data-tooltip-content="In the context of Evrmore, zero-confirmation transactions are transactions that are accepted as valid before they are officially confirmed by being included in a block on the blockchain. This allows users to complete transactions quickly without waiting for the usual confirmation time. While there's a slight risk involved, zero-confirmation transactions in Evrmore are designed to be secure under certain conditions, making them useful for fast-paced environments where speed is essential.">zero-confirmation transactions</span>, and flexibility in transaction types. These features make Evrmore powerful, user-friendly, and cost-effective.</p>

                    <h3 className='sub-sub-header'>Scalability and Flexibility</h3>
                    <p className="paragraph">Evrmore addresses the scalability challenge with an optimized protocol that can handle more transactions per second, making it suitable for large-scale applications. This scalability ensures that you won’t hit bottlenecks as your project grows.</p>

                    <h3 className='sub-sub-header'>Security Enhancements</h3>
                    <p className="paragraph">Security is paramount in Evrmore, with features like:</p>
                    <ul>
                        <li className='paragraph'><strong>Replay Protection:</strong> Prevents malicious duplication of transactions across blockchains.</li>
                        <li className='paragraph'><strong>Asset Freezing:</strong> Allows assets to be frozen if necessary, protecting against fraud or misuse.</li>
                        <li className='paragraph'><strong>Elimination of Smart Contract Vulnerabilities:</strong> By embedding DeFi primitives into the blockchain, Evrmore avoids the risks of general-purpose smart contracts.</li>
                    </ul>
                    <p className="paragraph">Evrmore isn’t just another blockchain—it’s a smarter, more secure, and user-friendly platform designed for the demands of today’s decentralized world.</p>
                    <ReactTooltip id="pow-tooltip" place="top"  className="react-tooltip" />
                    <ReactTooltip id="zero-tooltip" place="top"  className="react-tooltip" />
                </div>
                <div className='divider'></div>

                <div id="future">
                    <h2 className="sub-header">Future of Evrmore: What’s Next?</h2>

                    <h3 className='sub-sub-header'>Ongoing Developments</h3>
                    <p className="paragraph">The future of Evrmore is bright, with ongoing development and exciting new features on the horizon. The Evrmore team is continuously enhancing the platform, focusing on advanced DeFi capabilities, enhanced security, and increased scalability.</p>
                    <p className="paragraph">Key developments include introducing financial primitives like partial order fulfillment, stop-limit orders, and options and futures contracts, further positioning Evrmore as a powerful player in decentralized finance.</p>
                    <p className="paragraph">The Evrmore roadmap also includes support for Schnorr signatures, Taproot, and Tapscript, which will enhance both privacy and performance, making transactions faster and more secure.</p>
                    <p className="paragraph">Expect to see Vault assets—assets with a "face value" of EVR that can be "melted" to extract their value—and expanded decentralized exchange (DEX) support, broadening the possibilities for trading and managing digital assets on Evrmore.</p>

                    <h3 className='sub-sub-header'>Community Involvement</h3>
                    <p className="paragraph">Evrmore’s strength lies in its technology and its community. Built on decentralization and open-source collaboration, Evrmore invites everyone to participate in its development and growth.</p>
                    <p className="paragraph">Join the Evrmore community to contribute to discussions, code, or propose new features that shape the platform’s future. As Evrmore grows, so does the need for a diverse range of participants to drive innovation and meet the needs of all users.</p>
                    <p className="paragraph">By getting involved today, you’re not just supporting a blockchain—you’re part of a movement towards a more decentralized, secure, and accessible financial future. The road ahead is exciting, and with the community’s continued support, Evrmore is set to redefine what’s possible in decentralized finance and digital assets.</p>
                    <p className="paragraph">Whether you’re developing DeFi applications, investing in a secure blockchain, or exploring digital assets, Evrmore offers a powerful platform to do just that. Join us on this journey, and together, let’s shape the future tech economy.</p>
                </div>
                <div className='divider'></div>

            </div>
        </div>
    );
};

export default WelcomeToEvrmore;





