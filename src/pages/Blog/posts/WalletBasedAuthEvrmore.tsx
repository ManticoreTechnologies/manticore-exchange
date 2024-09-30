import React, { useState } from 'react';
import '../BlogPost.css';
import evrLogo from '../../../images/evr_logo_blue_400.svg';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const WalletBasedAuthEvrmore: React.FC = () => {
    //@ts-ignore
    const [menuOpen, setMenuOpen] = useState(false);


    return (
        <div className='page-container'>
            {/* Menu Toggle Button */}
            {/* <button onClick={toggleMenu} className='menu-button'>
                {menuOpen ? '▲' : '▼'}
            </button> */}

            {menuOpen && (
                <div className='nav-menu'>
                    <ul className='nav-list'>
                        <li className='nav-item'><a href="#introduction" className='nav-link'>Introduction</a></li>
                        <li className='nav-item'><a href="#what-is-wallet-auth" className='nav-link'>What is Wallet-Based Authentication?</a></li>
                        <li className='nav-item'><a href="#how-it-works" className='nav-link'>How Wallet-Based Authentication Works</a></li>
                        <li className='nav-item'><a href="#client-side" className='nav-link'>Client-Side Signing</a></li>
                        <li className='nav-item'><a href="#server-side" className='nav-link'>Server-Side Verification</a></li>
                        <li className='nav-item'><a href="#example-flow" className='nav-link'>Example Workflow</a></li>
                        <li className='nav-item'><a href="#best-practices" className='nav-link'>Best Practices</a></li>
                        <li className='nav-item'><a href="#conclusion" className='nav-link'>Conclusion</a></li>
                    </ul>
                </div>
            )}

            <div className='container'>
                {/* Introduction Section */}
                <div id="introduction">
                    <h1 className="header">Implementing Wallet-Based Authentication on the EVRmore Blockchain <img src={evrLogo} alt="Evrmore Logo" className="logo" /></h1>
                    <p className="paragraph">Welcome to this comprehensive guide where we’ll explore how to implement wallet-based authentication in a decentralized environment using the EVRmore blockchain.</p>
                    <p className="paragraph">If you're building a decentralized application (dApp) on EVRmore, using wallet-based authentication is an efficient and secure way to ensure that users can sign actions with their private keys without the risks that come with centralized credentials. Let’s dive in!</p>
                </div>

                {/* What is Wallet-Based Authentication */}
                <div id="what-is-wallet-auth">
                    <h2 className="sub-header">What is Wallet-Based Authentication?</h2>
                    <p className="paragraph">Wallet-based authentication uses cryptographic signatures to verify a user's identity. By signing a message with their wallet's private key, users can securely authenticate their ownership of an EVRmore wallet without exposing sensitive data. This method is ideal for decentralized platforms, providing security without central control.</p>
                    <p className="paragraph">Authentication is done by signing messages and verifying those signatures, using a combination of the user’s public key (wallet address) and a cryptographic signature generated from the private key.</p>
                </div>

                {/* How It Works Section */}
                <div id="how-it-works">
                    <h2 className="sub-header">How Wallet-Based Authentication Works</h2>
                    <p className="paragraph">Wallet-based authentication consists of two primary steps: the user (client-side) signs a message using their wallet, and the server verifies the signed message to confirm that the signature matches the wallet address and message.</p>
                    <p className="paragraph">Here’s how it works under the hood:</p>
                </div>

                {/* Client-Side Section */}
                <div id="client-side">
                    <h3 className="sub-sub-header">Client-Side: Signing a Message</h3>
                    <p className="paragraph">On the client-side, when a user performs an action (e.g., "signup" or "list_asset"), the dApp asks the user’s EVRmore wallet to sign a message using their private key.</p>
                    <p className="paragraph">The message typically includes the action the user wants to take and additional metadata like timestamps or nonce values to prevent replay attacks.</p>
                    <p className="paragraph">Example command for signing:</p>
                    <code className="code-block">signmessage "address" "private_key" "message"</code>
                    <p className="paragraph">The wallet returns a base58-encoded signature that proves the private key signed the message.</p>
                </div>

                {/* Server-Side Section */}
                <div id="server-side">
                    <h3 className="sub-sub-header">Server-Side: Verifying the Signature</h3>
                    <p className="paragraph">On the server side, the goal is to verify that the message and signature were signed by the user’s wallet. The server uses the wallet address (public key) to validate the signature against the message.</p>
                    <p className="paragraph">Example command for verification:</p>
                    <code className="code-block">verifymessage "address" "signature" "message"</code>
                    <p className="paragraph">If the verification passes, the server can trust that the user controls the wallet and proceed with the requested action.</p>
                </div>

                {/* Example Flow Section */}
                <div id="example-flow">
                    <h2 className="sub-header">Example Workflow</h2>
                    <h3 className="sub-sub-header">Scenario: User Signing Up for Your dApp</h3>
                    <p className="paragraph">Imagine a user wants to sign up for your dApp. Here’s how the flow would look:</p>
                    <ul>
                        <li className="paragraph"><strong>1. Client creates the message:</strong> The dApp generates a message like "signup" with additional metadata (e.g., timestamp).</li>
                        <li className="paragraph"><strong>2. Wallet signs the message:</strong> The wallet signs the message using the private key and returns a signature.</li>
                        <li className="paragraph"><strong>3. Send data to server:</strong> The dApp sends the signature, wallet address, and original message to the server.</li>
                        <li className="paragraph"><strong>4. Server verifies the signature:</strong> The server verifies the signature against the public key and the message.</li>
                        <li className="paragraph"><strong>5. Action is authorized:</strong> If verification succeeds, the server processes the signup request.</li>
                    </ul>
                </div>

                {/* Best Practices Section */}
                <div id="best-practices">
                    <h2 className="sub-header">Best Practices for Wallet-Based Authentication</h2>
                    <ul>
                        <li className="paragraph"><strong>Include a Timestamp or Nonce:</strong> Always include a timestamp or nonce to prevent replay attacks.</li>
                        <li className="paragraph"><strong>Contextual Messages:</strong> Ensure messages are unique to the action the user is performing.</li>
                        <li className="paragraph"><strong>Clear Error Handling:</strong> Gracefully handle signature verification failures to improve user experience.</li>
                    </ul>
                </div>

                {/* Conclusion Section */}
                <div id="conclusion">
                    <h2 className="sub-header">Conclusion</h2>
                    <p className="paragraph">By implementing wallet-based authentication, you can create a secure, decentralized, and user-friendly experience for your dApp users. EVRmore blockchain provides the tools you need to verify ownership and identity through cryptographic signatures, ensuring that only legitimate users can interact with your application.</p>
                    <p className="paragraph">Ready to take your EVRmore dApp to the next level? Start integrating wallet-based authentication today!</p>
                </div>
            </div>

            <ReactTooltip id="tooltip" place="top" />
        </div>
    );
};

export default WalletBasedAuthEvrmore;
