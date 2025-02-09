import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import './WalletLogin.css';

interface WalletLoginProps {
    message?: string;
    onSuccess?: () => void;
}

const WalletLogin: React.FC<WalletLoginProps> = ({ 
    message = "Please connect your wallet to continue",
    onSuccess 
}) => {
    const { connectWallet, isConnecting, error } = useWallet();
    const navigate = useNavigate();
    const location = useLocation();
    const [connectionStep, setConnectionStep] = useState<'initial' | 'connecting' | 'signing'>('initial');

    const handleConnect = async () => {
        try {
            setConnectionStep('connecting');
            await connectWallet();
            setConnectionStep('initial');
            
            // Handle successful connection
            onSuccess?.();
            
            // Redirect to the originally requested page or default to home
            const from = (location.state as any)?.from?.pathname || '/';
            navigate(from, { replace: true });
        } catch (err) {
            console.error('Failed to connect wallet:', err);
            setConnectionStep('initial');
        }
    };

    const getButtonText = () => {
        switch (connectionStep) {
            case 'connecting':
                return 'Connecting Wallet...';
            case 'signing':
                return 'Waiting for Signature...';
            default:
                return 'Connect Wallet';
        }
    };

    return (
        <div className="wallet-login">
            <div className="wallet-login__content">
                <h2>Authentication Required</h2>
                <p>{message}</p>
                
                <button 
                    className="wallet-login__button"
                    onClick={handleConnect}
                    disabled={isConnecting || connectionStep !== 'initial'}
                >
                    {(isConnecting || connectionStep !== 'initial') && (
                        <span className="wallet-login__spinner"></span>
                    )}
                    {getButtonText()}
                </button>

                {error && (
                    <div className="wallet-login__error">
                        {error}
                    </div>
                )}

                <div className="wallet-login__info">
                    <p>By connecting your wallet, you agree to our Terms of Service and Privacy Policy.</p>
                    <p>Make sure you have the Evrmore wallet extension installed and unlocked.</p>
                </div>
            </div>
        </div>
    );
};

export default WalletLogin; 