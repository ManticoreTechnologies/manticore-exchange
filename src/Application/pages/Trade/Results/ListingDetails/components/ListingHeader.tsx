import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShare2, FiSettings } from 'react-icons/fi';
import { useAuth } from '@/Application/contexts/AuthContext';

interface ListingHeaderProps {
  onShare: () => void;
  onManageListing: () => void;
  isOwner: boolean;
}

const ListingHeader: React.FC<ListingHeaderProps> = ({ onShare, onManageListing, isOwner }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleManageClick = () => {
    if (!isAuthenticated) {
      // Redirect to sign in with return path
      navigate('/signin', { 
        state: { 
          from: window.location.pathname,
          message: 'Please authenticate to manage this listing'
        } 
      });
      return;
    }
    onManageListing();
  };

  return (
    <div className="details-header">
      <button className="action-button back-button" onClick={() => navigate('/trade')}>
        <FiArrowLeft /> Back to Listings
      </button>
      <div className="header-actions">
        <button className="action-button share-button" onClick={onShare}>
          <FiShare2 /> Share
        </button>
        <button 
          className={`action-button manage-button ${isOwner ? 'owner' : ''}`}
          onClick={handleManageClick}
        >
          <FiSettings /> Manage Listing
        </button>
      </div>
    </div>
  );
};

export default ListingHeader; 