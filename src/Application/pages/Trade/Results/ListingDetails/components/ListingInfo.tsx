import React from 'react';
import { FiCopy, FiExternalLink } from 'react-icons/fi';
import { truncateAddress } from '@/utils/formatting';

interface ListingInfoProps {
  name: string;
  description: string;
  sellerAddress: string;
  id: string;
  createdAt: string;
  status: string;
  onCopyAddress: () => void;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  name,
  description,
  sellerAddress,
  id,
  createdAt,
  status,
  onCopyAddress
}) => {
  return (
    <div className="listing-info">
      <div className="listing-header">
        <h1>{name}</h1>
        <div className="seller-info">
          <span>Listed by</span>
          <div className="seller-address">
            <span>{truncateAddress(sellerAddress)}</span>
            <button 
              className="copy-button"
              onClick={onCopyAddress}
            >
              <FiCopy />
            </button>
            <a 
              href={`https://explorer.manticore.exchange/address/${sellerAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="explorer-link"
            >
              <FiExternalLink />
            </a>
          </div>
        </div>
      </div>

      <div className="listing-description">
        <h2>Description</h2>
        <p>{description}</p>
      </div>

      <div className="listing-details-info">
        <div className="detail-item">
          <span className="detail-label">Listing ID</span>
          <span className="detail-value">{id}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Created</span>
          <span className="detail-value">
            {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Status</span>
          <span className={`detail-value status-${status.toLowerCase()}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ListingInfo; 