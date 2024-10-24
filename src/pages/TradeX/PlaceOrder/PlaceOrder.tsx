import React, { useState, useEffect, useRef } from 'react';
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
    const wsRef = useRef<WebSocket | null>(null);
    const [nonce, setNonce] = useState<string | null>(null);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8765");
        wsRef.current = ws;

        ws.onmessage = (event) => {
            if (event.data.startsWith("Nonce:")) {
                setNonce(event.data.split("Nonce: ")[1]);
            } else if (event.data === "Authentication successful") {
                console.log("Authenticated successfully");
            }
        };

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    const handleBuySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onPlaceOrder('buy', buyOrderPrice, buyOrderQty);
    };

    const handleSellSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onPlaceOrder('sell', sellOrderPrice, sellOrderQty);
    };

    const handleLoginOrSignup = () => {
        if (!nonce) {
            alert("Nonce not received from server. Please try again.");
            return;
        }

        const evermoreAddress = prompt("Please enter your Evermore address:");
        const signedMessage = prompt(`Please sign this message with your Evermore wallet: ${nonce}`);

        if (evermoreAddress && signedMessage) {
            const authData = JSON.stringify({ address: evermoreAddress, signature: signedMessage });
            wsRef.current?.send(`Authenticate:${authData}`);
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
