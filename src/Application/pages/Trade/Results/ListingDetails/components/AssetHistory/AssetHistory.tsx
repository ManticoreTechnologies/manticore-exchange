import React from 'react';
import { FiX } from 'react-icons/fi';
import TransactionHistory from '../TransactionHistory';
import PriceHistory from '../PriceHistory/PriceHistory';
import { Balance } from '../../types';

interface AssetHistoryProps {
  selectedAsset: Balance | null;
  listingId: string;
  onClose: () => void;
}

const AssetHistory: React.FC<AssetHistoryProps> = ({ selectedAsset, listingId, onClose }) => {
  if (!selectedAsset) return null;

  return (
    <div className="asset-history-overlay">
      <div className="asset-history-content">
        <div className="asset-history-header">
          <h2>{selectedAsset.asset_name} Details</h2>
          <button className="close-button" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <div className="asset-history-stats">
          <div className="stat-item">
            <span className="stat-label">Available Balance</span>
            <span className="stat-value">{selectedAsset.confirmed_balance}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Pending Balance</span>
            <span className="stat-value">{selectedAsset.pending_balance}</span>
          </div>
          {selectedAsset.last_confirmed_tx_time && (
            <div className="stat-item">
              <span className="stat-label">Last Transaction</span>
              <span className="stat-value">
                {new Date(selectedAsset.last_confirmed_tx_time).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <div className="asset-history-tabs">
          <div className="asset-history-section">
            <h3>Price History</h3>
            <PriceHistory 
              listingId={listingId}
              selectedAsset={selectedAsset.asset_name}
            />
          </div>

          <div className="asset-history-section">
            <h3>Transaction History</h3>
            <TransactionHistory 
              listingId={listingId}
              selectedAsset={selectedAsset.asset_name}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetHistory; 