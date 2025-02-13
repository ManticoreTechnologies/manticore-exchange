import React from 'react';
import { FiCopy, FiShare2 } from 'react-icons/fi';
import './ListingHeader.css';

export interface ListingHeaderProps {
  name: string;
  description: string;
  sellerAddress: string;
  createdAt: string;
  tags: string[];
  onCopyAddress: () => void;
  onShare: () => void;
}

const ListingHeader: React.FC<ListingHeaderProps> = ({
  name,
  description,
  sellerAddress,
  createdAt,
  tags,
  onCopyAddress,
  onShare
}) => {
  return (
    <div className="listing-header">
      <div className="listing-header-main">
        <div className="listing-header-top">
          <h1 className="listing-title">{name}</h1>
          <button className="share-button" onClick={onShare}>
            <FiShare2 /> Share
          </button>
        </div>
        <div className="listing-metadata">
          <div className="seller-info">
            <span className="seller-label">Seller:</span>
            <div className="seller-address" onClick={onCopyAddress}>
              <span>{sellerAddress.slice(0, 6)}...{sellerAddress.slice(-4)}</span>
              <FiCopy className="copy-icon" />
            </div>
          </div>
          <div className="listing-created">
            <span className="created-label">Listed:</span>
            <span>{new Date(createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
        </div>
      </div>

      <div className="listing-description">
        <p>{description}</p>
      </div>

      {tags && tags.length > 0 && (
        <div className="listing-tags">
          {tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingHeader;


