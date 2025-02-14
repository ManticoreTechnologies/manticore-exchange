import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './PrivateRoute.css';

interface PrivateRouteProps {
    children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div className="private-route__loading">
                <div className="private-route__spinner"></div>
                <p>Checking authentication...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to sign-in page but save the attempted url
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}; 