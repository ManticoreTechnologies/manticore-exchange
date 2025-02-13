import React from 'react';
import { SelectedAssetDisplayProps } from './types';
import './SelectedAssetDisplay.css';

export const SelectedAssetDisplay: React.FC<SelectedAssetDisplayProps> = ({ asset, onClose, ipfsGateway }) => {
  return (
    <div className="selected-asset-display">
      <div className="selected-asset-header">
        <h3>{asset.asset_name}</h3>
        <button onClick={onClose}>×</button>
      </div>
      <div className="selected-asset-content">
        <div className="asset-balance">
          <span>Balance:</span>
          <span>{asset.confirmed_balance}</span>
        </div>
        <div className="asset-pending">
          <span>Pending:</span>
          <span>{asset.pending_balance}</span>
        </div>
        {asset.last_confirmed_tx_hash && (
          <div className="asset-transaction">
            <span>Last Transaction:</span>
            <a 
              href={`${ipfsGateway}${asset.last_confirmed_tx_hash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectedAssetDisplay;