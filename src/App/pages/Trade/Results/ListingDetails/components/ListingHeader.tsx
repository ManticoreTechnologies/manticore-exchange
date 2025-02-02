import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShare2, FiSettings } from 'react-icons/fi';

interface ListingHeaderProps {
  cartItemCount: number;
  onShare: () => void;
  onManageListing: () => void;
}

const ListingHeader: React.FC<ListingHeaderProps> = ({ onShare, onManageListing }) => {
  const navigate = useNavigate();

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
          className="action-button manage-button" 
          onClick={onManageListing}
        >
          <FiSettings /> Manage Listing
        </button>
      </div>
    </div>
  );
};

export default ListingHeader; 