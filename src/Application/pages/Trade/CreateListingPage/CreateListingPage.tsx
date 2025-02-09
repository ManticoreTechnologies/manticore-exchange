import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import CreateListing from '../CreateListing/CreateListing';
import WalletLogin from '../../../components/WalletLogin/WalletLogin';
import './CreateListingPage.css';

const CreateListingPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, userAddress } = useAuth();

    const handleClose = () => {
        navigate('/trade');
    };

    const handleComplete = () => {
        navigate('/trade');
    };

    const handleLoginSuccess = () => {
        // Optional: Add any additional logic after successful login
        console.log('Login successful');
    };

    if (!isAuthenticated) {
        return (
            <div className="create-listing-page">
                <div className="create-listing-container">
                    <WalletLogin 
                        message="Please connect your wallet to create a listing"
                        onSuccess={handleLoginSuccess}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="create-listing-page">
            <div className="create-listing-container">
                <CreateListing 
                    onClose={handleClose}
                    onComplete={handleComplete}
                    userAddress={userAddress || ''}
                />
            </div>
        </div>
    );
};

export default CreateListingPage; 