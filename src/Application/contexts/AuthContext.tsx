/* Manticore Technologies, LLC */
/* Copyright 2025 Manticore Technologies, LLC */
/* All Rights Reserved */

/*
    This file is responsible for handling the authentication state of the application.
    It uses AuthService to manage authentication and provides a consistent interface
    across the entire application.
*/

import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/AuthService';
import { toast } from 'react-toastify';

/*
    This interface is used to define the type of the authentication context.
    It is used to store the user's address and token in cookies and to verify the user's token.
    It also handles the challenge and login process and restoring session from cookies.
*/
interface AuthContextType {
    isAuthenticated: boolean;
    userAddress: string | null;
    token: string | null;
    login: (address: string, signature: string, challengeId: string) => Promise<void>;
    logout: () => Promise<void>;
    requestChallenge: (address: string) => Promise<{ challengeId: string; message: string }>;
    isLoading: boolean;
}

/*
    This context is used to store the user's address and token in cookies and to verify the user's token.
    It also handles the challenge and login process and restoring session from cookies.
*/
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/*
    This component is used to provide the authentication context to the application.
    It is used to store the user's address and token in cookies and to verify the user's token.
    It also handles the challenge and login process and restoring session from cookies.
*/
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userAddress, setUserAddress] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Check for existing auth on mount
    useEffect(() => {
        const checkExistingAuth = async () => {
            try {
                const storedToken = authService.getToken();
                const storedAddress = authService.getAddress();
                
                if (storedToken && storedAddress) {
                    try {
                        const result = await authService.verifyToken();
                        if (result.valid && result.address === storedAddress) {
                            setToken(storedToken);
                            setUserAddress(storedAddress);
                            setIsAuthenticated(true);
                        } else {
                            await handleLogout();
                        }
                    } catch (error) {
                        console.error('Token verification failed:', error);
                        await handleLogout();
                    }
                } else {
                    await handleLogout();
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                await handleLogout();
            } finally {
                setIsLoading(false);
            }
        };

        checkExistingAuth();
    }, []);

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setToken(null);
            setUserAddress(null);
            setIsAuthenticated(false);
        }
    };

    const requestChallenge = async (address: string) => {
        try {
            const result = await authService.createChallenge(address);
            return {
                challengeId: result.challenge_id,
                message: result.message
            };
        } catch (error) {
            console.error('Error requesting challenge:', error);
            toast.error('Failed to request authentication challenge');
            throw error;
        }
    };

    const login = async (address: string, signature: string, challengeId: string) => {
        try {
            const result = await authService.verifyChallenge({
                challenge_id: challengeId,
                address: address,
                signature: signature
            });

            if (result.token) {
                setToken(result.token);
                setUserAddress(address);
                setIsAuthenticated(true);
                toast.success('Successfully authenticated');
            } else {
                throw new Error('No token received');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Authentication failed');
            await handleLogout();
            throw error;
        }
    };

    const logout = async () => {
        try {
            await handleLogout();
            toast.success('Successfully logged out');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Failed to logout');
            throw error;
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

/*
    This hook is used to access the authentication context.
    It is used to check if the user is authenticated and to get the user's address and token.
*/
export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    
    return context;
}; 