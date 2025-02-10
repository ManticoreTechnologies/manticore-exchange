import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import ManageListing from '../ManageListing/ManageListing';
import { useAuth } from '@/Application/contexts/AuthContext';
import { checkAuthStatus } from '@/Application/services/ChatService';
import ErrorBoundary from '@/Application/components/ErrorBoundary/ErrorBoundary';
import './ManageListingPage.css';

const ManageListingContent: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [isChecking, setIsChecking] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                setIsChecking(true);
                const { isAuthenticated: isValid } = await checkAuthStatus();
                
                if (!isValid) {
                    const returnUrl = encodeURIComponent(`/trade/listings/manage/${id}`);
                    navigate(`/signin?returnUrl=${returnUrl}`, { replace: true });
                }
            } catch (error) {
                console.error('Auth verification error:', error);
                setAuthError('Failed to verify authentication status');
            } finally {
                setIsChecking(false);
            }
        };

        if (id) {
            verifyAuth();
        }
    }, [id, navigate]);

    const handleClose = () => {
        navigate('/trade');
    };

    if (!id) {
        return <Navigate to="/trade" replace />;
    }

    if (isChecking) {
        return (
            <div className="manage-listing-page">
                <div className="manage-listing-page-content">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Verifying authentication...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (authError) {
        return (
            <div className="manage-listing-page">
                <div className="manage-listing-page-content">
                    <div className="error-container">
                        <h2>Authentication Error</h2>
                        <p>{authError}</p>
                        <button onClick={() => navigate('/trade')} className="back-button">
                            Back to Trading
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="manage-listing-page">
            <div className="manage-listing-page-content">
                <ManageListing 
                    initialListingId={id} 
                    onClose={handleClose}
                />
            </div>
        </div>
    );
};

const ManageListingPage: React.FC = () => {
    return (
        <ErrorBoundary>
            <ManageListingContent />
        </ErrorBoundary>
    );
};

export default ManageListingPage; 