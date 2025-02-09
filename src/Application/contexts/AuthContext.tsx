import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface AuthContextType {
    isAuthenticated: boolean;
    userAddress: string | null;
    token: string | null;
    login: (address: string, signature: string, challengeId: string) => Promise<void>;
    logout: () => Promise<void>;
    requestChallenge: (address: string) => Promise<{ challengeId: string; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userAddress, setUserAddress] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const trading_api_host = import.meta.env.VITE_TRADING_API_HOST || 'api.manticore.exchange';
    const trading_api_port = import.meta.env.VITE_TRADING_API_PORT || '8000';
    const trading_api_proto = import.meta.env.VITE_TRADING_API_PROTO || 'https';
    const trading_api_url = `${trading_api_proto}://${trading_api_host}:${trading_api_port}`;

    useEffect(() => {
        // Check for existing auth on mount
        const savedToken = Cookies.get('auth_token');
        const savedAddress = Cookies.get('user_address');
        
        if (savedToken && savedAddress) {
            setToken(savedToken);
            setUserAddress(savedAddress);
            setIsAuthenticated(true);
            
            // Set axios default authorization header
            axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        }
    }, []);

    const requestChallenge = async (address: string) => {
        try {
            const response = await axios.post(`${trading_api_url}/auth/challenge`, {
                address: address
            });
            
            return {
                challengeId: response.data.challenge_id,
                message: response.data.message
            };
        } catch (error) {
            console.error('Error requesting challenge:', error);
            throw error;
        }
    };

    const login = async (address: string, signature: string, challengeId: string) => {
        try {
            const response = await axios.post(`${trading_api_url}/auth/login`, {
                challenge_id: challengeId,
                address: address,
                signature: signature
            });

            const { token: newToken } = response.data;

            // Set cookies with appropriate security settings
            Cookies.set('auth_token', newToken, {
                secure: true,
                sameSite: 'Strict',
                expires: 7 // 7 days
            });
            
            Cookies.set('user_address', address, {
                secure: true,
                sameSite: 'Strict',
                expires: 7
            });

            setToken(newToken);
            setUserAddress(address);
            setIsAuthenticated(true);

            // Configure axios defaults for future requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            if (token) {
                await axios.post(`${trading_api_url}/auth/logout`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear cookies and state regardless of logout API success
            Cookies.remove('auth_token');
            Cookies.remove('user_address');
            delete axios.defaults.headers.common['Authorization'];
            
            setToken(null);
            setUserAddress(null);
            setIsAuthenticated(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            userAddress,
            token,
            login,
            logout,
            requestChallenge
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 