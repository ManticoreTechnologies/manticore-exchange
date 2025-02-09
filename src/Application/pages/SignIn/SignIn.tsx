import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import './SignIn.css';

const SignIn: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { connectWallet, isConnecting, error } = useWallet();
    
    // Get the return URL from state or default to '/'
    const from = (location.state as any)?.from?.pathname || '/';

    const handleConnect = async () => {
        try {
            await connectWallet();
            // Navigate back to the page they came from
            navigate(from, { replace: true });
        } catch (err) {
            console.error('Failed to connect wallet:', err);
        }
    };

    return (
        <div className="sign-in">
            <div className="sign-in__container">
                <div className="sign-in__content">
                    <h1>Welcome to Manticore</h1>
                    <p className="sign-in__subtitle">Connect your Evrmore wallet to continue</p>

                    <div className="sign-in__wallet-section">
                        <button 
                            className="sign-in__connect-button"
                            onClick={handleConnect}
                            disabled={isConnecting}
                        >
                            {isConnecting ? (
                                <>
                                    <span className="sign-in__spinner"></span>
                                    Connecting...
                                </>
                            ) : (
                                'Connect Wallet'
                            )}
                        </button>

                        {error && (
                            <div className="sign-in__error">
                                {error}
                            </div>
                        )}

                        <div className="sign-in__help">
                            <p>Don't have the Evrmore wallet?</p>
                            <a 
                                href="https://chrome.google.com/webstore/detail/evrmore-wallet/YOUR_EXTENSION_ID" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="sign-in__install-link"
                            >
                                Install Wallet Extension
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn; 