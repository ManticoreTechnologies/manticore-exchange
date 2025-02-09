import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface UseWalletReturn {
    connectWallet: () => Promise<void>;
    disconnectWallet: () => Promise<void>;
    isConnecting: boolean;
    error: string | null;
}

export const useWallet = (): UseWalletReturn => {
    const { login, logout, requestChallenge } = useAuth();
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const connectWallet = async () => {
        setIsConnecting(true);
        setError(null);

        try {
            // Check if window.evr exists
            if (!window.evr) {
                throw new Error('Evrmore wallet not found. Please install the wallet extension.');
            }

            // Request account access
            const accounts = await window.evr.request({ method: 'eth_requestAccounts' });
            const address = accounts[0];

            // Get challenge from server
            const { challengeId, message } = await requestChallenge(address);

            // Request signature from wallet
            const signature = await window.evr.request({
                method: 'personal_sign',
                params: [message, address]
            });

            // Login with signature
            await login(address, signature, challengeId);

        } catch (err) {
            console.error('Wallet connection error:', err);
            setError(err instanceof Error ? err.message : 'Failed to connect wallet');
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectWallet = async () => {
        try {
            await logout();
        } catch (err) {
            console.error('Wallet disconnection error:', err);
            setError(err instanceof Error ? err.message : 'Failed to disconnect wallet');
        }
    };

    return {
        connectWallet,
        disconnectWallet,
        isConnecting,
        error
    };
}; 