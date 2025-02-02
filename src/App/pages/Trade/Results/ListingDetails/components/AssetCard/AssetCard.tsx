import React from 'react';
import { FiEdit3 } from 'react-icons/fi';
import { formatEvrAmount } from '@/utils/formatting';

interface AssetCardProps {
  asset: {
    asset_name: string;
    confirmed_balance: string;
    ipfs_hash?: string | null;
  };
  price?: {
    price_evr: string;
  };
  quantity: number;
  pinataGateway: string;
  onQuantityChange: (increment: boolean) => void;
  onEditListing: () => void;
  onSelectAsset: () => void;
  onAddToCart: () => void;
  isSelected: boolean;
}

const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  price,
  quantity,
  pinataGateway,
  onQuantityChange,
  onEditListing,
  onSelectAsset,
  onAddToCart,
  isSelected
}) => {
  const available = Number(asset.confirmed_balance);

  // If there's no price, we shouldn't render the card at all
  if (!price) return null;

  return (
    <div 
      className={`asset-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelectAsset}
    >
      <div className="asset-header">
        {asset.ipfs_hash && (
        <div className="asset-media">
          <img
              src={`${pinataGateway}${asset.ipfs_hash}`}
            alt={asset.asset_name}
              className="asset-image"
          />
        </div>
      )}
      <div className="asset-info">
        <h3>{asset.asset_name}</h3>
          <span className="asset-price">
            {formatEvrAmount(price.price_evr)} EVR
          </span>
        </div>
      </div>

      <div className="asset-availability">
        <div className="availability-indicator">
          <div 
            className="availability-bar"
            style={{ 
              width: `${Math.min((available / (available + 1)) * 100, 100)}%`,
              backgroundColor: available > 0 ? 'var(--accent-color)' : 'var(--color-error)'
            }}
          />
        </div>
        <span className="availability-text">
          {available} available
        </span>
      </div>
      
      <div className="asset-controls">
        <div className="quantity-controls">
          <button 
            className="quantity-button"
            onClick={(e) => {
              e.stopPropagation();
              onQuantityChange(false);
            }}
            disabled={quantity <= 1}
          >
            −
          </button>
          <span className="quantity-display">{quantity}</span>
          <button 
            className="quantity-button"
            onClick={(e) => {
              e.stopPropagation();
              onQuantityChange(true);
            }}
            disabled={quantity >= available}
          >
            +
          </button>
        </div>
        
        <div className="action-buttons">
          <button 
            className="add-to-cart-button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
          >
            Add to Cart
          </button>
          
          <button 
            className="edit-listing-button"
            onClick={(e) => {
              e.stopPropagation();
              onEditListing();
            }}
          >
            <FiEdit3 />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetCard; 