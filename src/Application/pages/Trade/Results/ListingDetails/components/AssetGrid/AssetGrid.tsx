import React from 'react';
import { AssetGridProps } from './types';
import './AssetGrid.css';

export const AssetGrid: React.FC<AssetGridProps> = ({ assets, selectedAsset, onAssetSelect }) => {
  return (
    <div className="asset-grid">
      {assets.map((asset) => (
        <div
          key={asset.asset_name}
          className={`asset-item ${selectedAsset === asset.asset_name ? 'selected' : ''}`}
          onClick={() => onAssetSelect(asset.asset_name)}
        >
          <span className="asset-name">{asset.asset_name}</span>
          <span className="asset-balance">{asset.confirmed_balance}</span>
        </div>
      ))}
    </div>
  );
};