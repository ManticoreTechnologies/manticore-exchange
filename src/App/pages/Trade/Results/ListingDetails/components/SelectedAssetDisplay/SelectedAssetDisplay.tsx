import React from 'react';
import { FiX } from 'react-icons/fi';
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
          <h3>{asset.asset_name}</h3>
          <div className="selected-asset-details">
            <span className="price">
              {price ? formatEvrAmount(price.price_evr) : 'N/A'} EVR
            </span>
            <span className="balance">
              Balance: {asset.confirmed_balance}
            </span>
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