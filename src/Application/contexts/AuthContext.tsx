import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// Use the same API base configuration
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

// Cookie configuration
const COOKIE_CONFIG = {
    secure: true,
    sameSite: 'Strict' as const,
    expires: 7, // 7 days
    path: '/'
};

interface AuthContextType {
    isAuthenticated: boolean;
    userAddress: string | null;
    token: string | null;
    login: (address: string, signature: string, challengeId: string) => Promise<void>;
    logout: () => Promise<void>;
    requestChallenge: (address: string) => Promise<{ challengeId: string; message: string }>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userAddress, setUserAddress] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Check for existing auth on mount
    useEffect(() => {
        const checkExistingAuth = async () => {
            try {
                const savedToken = Cookies.get('auth_token');
                const savedAddress = Cookies.get('user_address');
                
                if (savedToken && savedAddress) {
                    try {
                        // Verify the token with the backend
                        const response = await axios.get(`${API_BASE}/auth/verify`, {
                            headers: {
                                'Authorization': `Bearer ${savedToken}`
                            }
                        });
                        
                        if (response.data.valid && response.data.address === savedAddress) {
                            // Set token in axios defaults AFTER successful verification
                            axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
                            setToken(savedToken);
                            setUserAddress(savedAddress);
                            setIsAuthenticated(true);
                        } else {
                            handleLogout();
                        }
                    } catch (error) {
                        console.error('Failed to verify token:', error);
                        handleLogout();
                    }
                } else {
                    handleLogout();
                }
            } catch (error) {
                console.error('Failed to check existing auth:', error);
                handleLogout();
            } finally {
                setIsLoading(false);
            }
        };

        checkExistingAuth();
    }, []);

    const handleLogout = () => {
        // Clear cookies
        Cookies.remove('auth_token', { path: '/' });
        Cookies.remove('user_address', { path: '/' });
        
        // Clear axios default header
        delete axios.defaults.headers.common['Authorization'];
        
        // Reset state
        setToken(null);
        setUserAddress(null);
        setIsAuthenticated(false);
    };

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

            // Set cookies with secure settings
            Cookies.set('auth_token', newToken, COOKIE_CONFIG);
            Cookies.set('user_address', address, COOKIE_CONFIG);

            // Configure axios defaults
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            // Update state
            setToken(newToken);
            setUserAddress(address);
            setIsAuthenticated(true);

        } catch (error) {
            console.error('Login error:', error);
            handleLogout();
            throw error;
        }
    };

    const logout = async () => {
        try {
            if (token) {
                // Attempt to notify backend of logout
                await axios.post(`${API_BASE}/auth/logout`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            handleLogout();
        }
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            userAddress,
            token,
            login,
            logout,
            requestChallenge,
            isLoading
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