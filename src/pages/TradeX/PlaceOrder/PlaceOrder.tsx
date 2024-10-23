import React, { useState } from 'react';
import './PlaceOrder.css';

interface PlaceOrderProps {
    onPlaceOrder: (orderType: string, orderPrice: number, orderQty: number) => void;
}

const PlaceOrder: React.FC<PlaceOrderProps> = ({ onPlaceOrder }) => {
    const [buyOrderPrice, setBuyOrderPrice] = useState<number>(0);
    const [buyOrderQty, setBuyOrderQty] = useState<number>(0);
    const [sellOrderPrice, setSellOrderPrice] = useState<number>(0);
    const [sellOrderQty, setSellOrderQty] = useState<number>(0);
    const [available, setAvailable] = useState<number>(0); // Example available amount

    const handleBuySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onPlaceOrder('buy', buyOrderPrice, buyOrderQty);
    };

    const handleSellSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onPlaceOrder('sell', sellOrderPrice, sellOrderQty);
    };

    const handleLoginOrSignup = () => {
        const evermoreAddress = prompt("Please enter your Evermore address:");
        const nonce = Math.random().toString(36).substring(2); // Example nonce generation
        const signedMessage = prompt(`Please sign this message with your Evermore wallet: ${nonce}`);

        if (evermoreAddress && signedMessage) {
            // Here you would typically verify the signed message with the nonce
            console.log("Evermore Address:", evermoreAddress);
            console.log("Signed Message:", signedMessage);
            // Proceed with the order placement or authentication
        } else {
            alert("Both Evermore address and signed message are required.");
        }
    };

    return (
        <div className="order-container">
            <div className="order-form">
                <h3>Buy Order</h3>
                <form onSubmit={handleBuySubmit}>
                    <div className="available">
                        Available: {available.toFixed(2)} USDT
                    </div>
                    <label>
                        Price:
                        <input type="number" value={buyOrderPrice} onChange={(e) => setBuyOrderPrice(parseFloat(e.target.value))} />
                    </label>
                    <label>
                        Quantity:
                        <input type="number" value={buyOrderQty} onChange={(e) => setBuyOrderQty(parseFloat(e.target.value))} />
                    </label>
                    <div className="total">
                        Total: {(buyOrderPrice * buyOrderQty).toFixed(2)} USDT
                    </div>
                    <button type="button" onClick={handleLoginOrSignup}>Log in or Sign up to trade</button>
                </form>
            </div>
            <div className="order-form">
                <h3>Sell Order</h3>
                <form onSubmit={handleSellSubmit}>
                    <div className="available">
                        Available: {available.toFixed(2)} BTC
                    </div>
                    <label>
                        Price:
                        <input type="number" value={sellOrderPrice} onChange={(e) => setSellOrderPrice(parseFloat(e.target.value))} />
                    </label>
                    <label>
                        Quantity:
                        <input type="number" value={sellOrderQty} onChange={(e) => setSellOrderQty(parseFloat(e.target.value))} />
                    </label>
                    <div className="total">
                        Total: {(sellOrderPrice * sellOrderQty).toFixed(2)} BTC
                    </div>
                    <button type="button" onClick={handleLoginOrSignup}>Log in or Sign up to trade</button>
                </form>
            </div>
        </div>
    );
};

export default PlaceOrder;
