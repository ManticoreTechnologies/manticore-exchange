// src/components/PlaceOrder.tsx
import React, { useState } from 'react';

interface PlaceOrderProps {
  onPlaceOrder: (order: { type: string; price: number; quantity: number }) => void;
}

const PlaceOrder: React.FC<PlaceOrderProps> = ({ onPlaceOrder }) => {
  const [orderType, setOrderType] = useState<string>('buy');
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlaceOrder({ type: orderType, price, quantity });
  };

  return (
    <div className="place-order-container">
      <h2>Place Order</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Order Type:
          <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </label>
        <label>
          Price:
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Quantity:
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseFloat(e.target.value))}
          />
        </label>
        <button type="submit">Place {orderType === 'buy' ? 'Buy' : 'Sell'} Order</button>
      </form>
    </div>
  );
};

export default PlaceOrder;
