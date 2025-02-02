import React from 'react';
import { FiX, FiExternalLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Balance, Price } from '../../types';
import { formatEvrAmount } from '@/utils/formatting';
import './SelectedAssetDisplay.css';

interface SelectedAssetDisplayProps {
  asset: Balance;
  price?: Price;
  ipfsGateway: string;
  onClose: () => void;
}

const SelectedAssetDisplay: React.FC<SelectedAssetDisplayProps> = ({
  asset,
  price,
  ipfsGateway,
  onClose
}) => {
    console.log(price);

  return (
    <div className="selected-asset-display">
      <div className="selected-asset-content">
        <div className="selected-asset-media">
          {price?.ipfs_hash ? (
            <img
              src={`${ipfsGateway}${price.ipfs_hash}`}
              alt={asset.asset_name}
              className="selected-asset-image"
            />
          ) : (
            <div className="selected-asset-placeholder">
              {asset.asset_name.charAt(0)}
            </div>
          )}
        </div>
        
        <div className="selected-asset-info">
          <div className="selected-asset-header">
            <h3>{asset.asset_name}</h3>
            <Link 
              to={`/asset/%23${encodeURIComponent(asset.asset_name)}`} 
              className="view-asset-link"
            >
              <FiExternalLink />
              <span>View Asset</span>
            </Link>
          </div>
          <div className="selected-asset-details">
            <div className="price-info">
              <span className="label">Price:</span>
              <span className="price">
                {price ? `${formatEvrAmount(price.price_evr)} EVR` : 'N/A'}
              </span>
            </div>
            <div className="balance-info">
              <span className="label">Balance:</span>
              <span className="balance">
                {formatEvrAmount(asset.confirmed_balance)}
              </span>
            </div>
            {asset.pending_balance !== "0" && (
              <div className="pending-info">
                <span className="label">Pending:</span>
                <span className="pending">
                  {formatEvrAmount(asset.pending_balance)}
                </span>
              </div>
            )}
          </div>
        </div>

        <button className="close-selection" onClick={onClose}>
          <FiX />
        </button>
      </div>
    </div>
  );
};

export default SelectedAssetDisplay; 