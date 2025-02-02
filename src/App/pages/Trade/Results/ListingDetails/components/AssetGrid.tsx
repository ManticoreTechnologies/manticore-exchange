import React from 'react';
import AssetCard from './AssetCard';
import { Balance, Price } from '../types';

interface AssetGridProps {
  balances: Balance[];
  prices: Price[];
  quantities: Record<string, number>;
  pinataGateway: string;
  onQuantityChange: (assetName: string, increment: boolean) => void;
  onEditListing: () => void;
  selectedAsset: string | null;
  onSelectAsset: (assetName: string) => void;
  onAddToCart: (assetName: string) => void;
}

const AssetGrid: React.FC<AssetGridProps> = ({
  balances,
  prices,
  quantities,
  pinataGateway,
  onQuantityChange,
  onEditListing,
  selectedAsset,
  onSelectAsset,
  onAddToCart
}) => {
  // Filter balances to only show those that have prices
  const balancesWithPrices = balances.filter(balance => 
    prices.some(price => price.asset_name === balance.asset_name)
  );

  return (
    <div className="listing-assets">
      <h2>Available Assets</h2>
      <div className="assets-grid">
        {balancesWithPrices.map((balance, index) => {
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
              onEditListing={onEditListing}
              onAddToCart={() => onAddToCart(balance.asset_name)}
              onSelectAsset={() => onSelectAsset(balance.asset_name)}
              isSelected={isSelected}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AssetGrid; 