import React, { useState } from 'react';
import './PlaceOrder.css';
interface PlaceOrderProps {
    onPlaceOrder: (orderType: string, orderPrice: number, orderQty: number, userId: string) => void;
}

const PlaceOrder: React.FC<PlaceOrderProps> = ({ onPlaceOrder }) => {
    const [orderType, setOrderType] = useState<string>('buy');
    const [orderPrice, setOrderPrice] = useState<number>(0);
    const [orderQty, setOrderQty] = useState<number>(0);
    const userId = 'user3'; // Hardcoded user ID

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onPlaceOrder(orderType, orderPrice, orderQty, userId); // Pass userId
    };

    return (
        <div className="order-form">
            <h3>Place Order</h3>
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
                    <input type="number" value={orderPrice} onChange={(e) => setOrderPrice(parseFloat(e.target.value))} />
                </label>
                <label>
                    Quantity:
                    <input type="number" value={orderQty} onChange={(e) => setOrderQty(parseFloat(e.target.value))} />
                </label>
                <button type="submit">Place Order</button>
            </form>
        </div>
    );
};

export default PlaceOrder;
