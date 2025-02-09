import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ManageListing from '../ManageListing/ManageListing';
import { useAuth } from '@/Application/contexts/AuthContext';
import { checkAuthStatus } from '@/Application/services/ChatService';
import './ManageListingPage.css';

const ManageListingPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            setIsChecking(true);
            const { isAuthenticated: isValid } = await checkAuthStatus();
            
            if (!isValid) {
                // Redirect to sign in with return URL
                const returnUrl = encodeURIComponent(`/trade/listings/manage/${id}`);
                navigate(`/signin?returnUrl=${returnUrl}`);
            }
            
            setIsChecking(false);
        };

        verifyAuth();
    }, [id, navigate]);

    const handleClose = () => {
        navigate('/trade');
    };

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

    if (!isAuthenticated || !id) {
        return null; // Will redirect in useEffect
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

export default ManageListingPage; 