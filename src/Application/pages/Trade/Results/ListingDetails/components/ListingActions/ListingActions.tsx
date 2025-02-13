import * as React from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { Price, Balance } from '../../types';
import './ListingActions.css';

interface ListingActionsProps {
  prices: Price[];
  balances: Balance[];
  onAddToCart: (quantity: number) => void;
  onBuyNow: (quantity: number) => void;
}

const ListingActions: React.FC<ListingActionsProps> = ({
  prices,
  balances,
  onAddToCart,
  onBuyNow
}) => {
  const [selectedAsset, setSelectedAsset] = React.useState<string>('');
  const [quantity, setQuantity] = React.useState(1);

  // Initialize selected asset when prices are loaded
  React.useEffect(() => {
    if (prices.length > 0 && !selectedAsset) {
      setSelectedAsset(prices[0].asset_name);
    }
  }, [prices]);

  const selectedPrice = prices.find(p => p.asset_name === selectedAsset);
  const selectedBalance = balances.find(b => b.asset_name === selectedAsset);

  const handleQuantityChange = (change: number) => {
    if (!selectedBalance) return;
    
    const newQuantity = quantity + change;
    const maxQuantity = parseFloat(selectedBalance.confirmed_balance);
    const minQuantity = 1 / Math.pow(10, selectedBalance.units);
    
    if (newQuantity >= minQuantity && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  // If no prices or balances are available, don't render the component
  if (!prices.length || !balances.length) {
    return null;
  }

  // If no selected price or balance, don't render the component
  if (!selectedPrice || !selectedBalance) {
    return null;
  }

  const totalPrice = (parseFloat(selectedPrice.price_evr) * quantity).toFixed(8);

  return (
    <div className="listing-actions">
      <div className="asset-selector">
        <label>Select Asset:</label>
        <select 
          value={selectedAsset}
          onChange={(e) => setSelectedAsset(e.target.value)}
        >
          {prices.map((price) => (
            <option key={price.asset_name} value={price.asset_name}>
              {price.asset_name}
            </option>
          ))}
        </select>
      </div>

      <div className="quantity-control">
        <button 
          onClick={() => handleQuantityChange(-1)}
          disabled={quantity <= 1 / Math.pow(10, selectedBalance.units)}
        >
          -
        </button>
        <span className="quantity-value">{quantity}</span>
        <button 
          onClick={() => handleQuantityChange(1)}
          disabled={quantity >= parseFloat(selectedBalance.confirmed_balance)}
        >
          +
        </button>
      </div>

      <div className="price-display">
        <span>Total Price:</span>
        <span className="total-price">
          {totalPrice} EVR
        </span>
      </div>

      <div className="action-buttons">
        <button 
          className="add-to-cart-button"
          onClick={() => onAddToCart(quantity)}
          disabled={!selectedPrice || !selectedBalance}
        >
          <FiShoppingCart /> Add to Cart
        </button>
        <button 
          className="buy-now-button"
          onClick={() => onBuyNow(quantity)}
          disabled={!selectedPrice || !selectedBalance}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ListingActions;
