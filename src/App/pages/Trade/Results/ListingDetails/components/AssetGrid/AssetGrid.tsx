import React from 'react';
import AssetCard from '../AssetCard/AssetCard';
import { Balance, Price } from '../../types';
import './AssetGrid.css';

interface AssetGridProps {
  balances: Balance[];
  prices: Price[];
  quantities: Record<string, number>;
  pinataGateway: string;
  onQuantityChange: (assetName: string, increment: boolean) => void;
  onAddToCart: (assetName: string) => void;
  onEditListing: () => void;
  selectedAsset: string | null;
  onSelectAsset: (assetName: string) => void;
  formatAmount: (amount: string | number, units: number) => string;
}

const AssetGrid: React.FC<AssetGridProps> = ({
  balances,
  prices,
  quantities,
  pinataGateway,
  onQuantityChange,
  onAddToCart,
  onEditListing,
  selectedAsset,
  onSelectAsset,
  formatAmount
}) => {
  return (
    <div className="listing-assets">
      <h2>Available Assets</h2>
      <div className="assets-grid">
        {balances.map((balance, index) => {
          const price = prices.find(p => p.asset_name === balance.asset_name);
          const isSelected = selectedAsset === balance.asset_name;
          
          return (
            <AssetCard
              key={`${balance.asset_name}-${index}`}
              asset={balance}
              price={price}
              quantity={quantities[balance.asset_name] || 1}
              pinataGateway={pinataGateway}
              onQuantityChange={(increment) => onQuantityChange(balance.asset_name, increment)}
              onAddToCart={() => onAddToCart(balance.asset_name)}
              onEditListing={onEditListing}
              onSelectAsset={() => onSelectAsset(balance.asset_name)}
              isSelected={isSelected}
              formatAmount={formatAmount}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AssetGrid; 