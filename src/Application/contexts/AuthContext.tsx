import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// Use the same API base configuration
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

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

    // Check for existing auth on mount
    useEffect(() => {
        const checkExistingAuth = async () => {
            const savedToken = Cookies.get('auth_token');
            const savedAddress = Cookies.get('user_address');
            
            if (savedToken && savedAddress) {
                try {
                    // Verify the token with the backend
                    const response = await axios.get(`${API_BASE}/auth/verify`, {
                        headers: { Authorization: `Bearer ${savedToken}` }
                    });

                    if (response.data.valid && response.data.address === savedAddress) {
                        setToken(savedToken);
                        setUserAddress(savedAddress);
                        setIsAuthenticated(true);
                        
                        // Set axios default authorization header
                        axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
                        return;
                    }
                } catch (error) {
                    console.error('Failed to verify existing auth:', error);
                }

                // If verification fails, clear the cookies
                Cookies.remove('auth_token');
                Cookies.remove('user_address');
            }

            // Reset state if no valid auth
            setToken(null);
            setUserAddress(null);
            setIsAuthenticated(false);
            delete axios.defaults.headers.common['Authorization'];
        };

        checkExistingAuth();
    }, []);

    const requestChallenge = async (address: string) => {
        try {
            const response = await axios.post(`${API_BASE}/auth/challenge`, {
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
            const response = await axios.post(`${API_BASE}/auth/login`, {
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
                await axios.post(`${API_BASE}/auth/logout`, {}, {
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