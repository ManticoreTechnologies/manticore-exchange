import React from 'react';
import { FiArrowLeft, FiShare2, FiSettings } from 'react-icons/fi';
import './ListingHeader.css';

interface ListingHeaderProps {
  onShare: () => void;
  onManageListing: () => void;
  isOwner: boolean;
}

export const ListingHeader: React.FC<ListingHeaderProps> = ({ onShare, onManageListing, isOwner }) => {
  return (
    <div className="listing-details-header">
      <button className="listing-details-button listing-details-button--secondary" onClick={() => window.history.back()}>
        <FiArrowLeft /> Back
      </button>
      <div className="listing-details-actions">
        <button className="listing-details-button listing-details-button--secondary" onClick={onShare}>
          <FiShare2 /> Share
        </button>
        {isOwner && (
          <button className="listing-details-button listing-details-button--primary" onClick={onManageListing}>
            <FiSettings /> Manage
          </button>
        )}
      </div>
    </div>
  );
};


