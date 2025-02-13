import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import ManageListing from '../ManageListing/ManageListing';
import { useAuth } from '@/Application/contexts/AuthContext';
import { FaExclamationCircle } from 'react-icons/fa';
import './ManageListingPage.css';

const ManageListingContent: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const handleClose = () => {
        navigate('/trade');
    };

    if (authLoading) {
        return (
            <div className="manage-listing-page">
                <div className="manage-listing-page-content">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Checking authentication...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="manage-listing-page">
                <div className="manage-listing-page-content">
                    <div className="auth-required-container">
                        <FaExclamationCircle className="auth-required-icon" />
                        <h2>Authentication Required</h2>
                        <p>Please sign in to manage your listings</p>
                        <div className="auth-required-actions">
                            <button 
                                onClick={() => navigate('/signin')}
                                className="primary-button"
                            >
                                Sign In
                            </button>
                            <button 
                                onClick={() => navigate('/trade')}
                                className="secondary-button"
                            >
                                Back to Trading
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!id) {
        return <Navigate to="/trade" replace />;
    }

    if (error) {
        return (
            <div className="manage-listing-page">
                <div className="manage-listing-page-content">
                    <div className="error-container">
                        <FaExclamationCircle className="error-icon" />
                        <h2>Error</h2>
                        <p>{error}</p>
                        <div className="error-actions">
                            <button 
                                onClick={() => window.location.reload()}
                                className="primary-button"
                            >
                                Retry
                            </button>
                            <button 
                                onClick={() => navigate('/trade')}
                                className="secondary-button"
                            >
                                Back to Trading
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
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
    return <ManageListingContent />;
};

export default ManageListingPage; 