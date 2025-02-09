import React from 'react';
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

    const handleConnect = async () => {
        try {
            await connectWallet();
            onSuccess?.();
        } catch (err) {
            console.error('Failed to connect wallet:', err);
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
                    disabled={isConnecting}
                >
                    {isConnecting ? (
                        <>
                            <span className="wallet-login__spinner"></span>
                            Connecting...
                        </>
                    ) : (
                        'Connect Wallet'
                    )}
                </button>

                {error && (
                    <div className="wallet-login__error">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WalletLogin; 