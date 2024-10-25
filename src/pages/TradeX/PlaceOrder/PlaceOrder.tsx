import React, { useEffect, useState } from 'react';
import './PlaceOrder.css';
import Notification from '../Notification/Notification'; // Adjust the path as necessary

interface PlaceOrderProps {
    onPlaceOrder: (orderType: string, orderPrice: number, orderQty: number) => void;
    getNonce: () => void;
    nonce: string | null;
    onLoginOrSignup: (evermoreAddress: string, signedMessage: string) => void;
    error: string | null;
    appendError: (error: string) => void; // New prop
}

const PlaceOrder: React.FC<PlaceOrderProps> = ({ onPlaceOrder, getNonce, nonce, onLoginOrSignup, error }) => {
    const [buyOrderPrice, setBuyOrderPrice] = useState<number>(0);
    const [buyOrderQty, setBuyOrderQty] = useState<number>(0);
    const [sellOrderPrice, setSellOrderPrice] = useState<number>(0);
    const [sellOrderQty, setSellOrderQty] = useState<number>(0);
    const [available, setAvailable] = useState<number>(0); // Example available amount
    const [evermoreAddress, setEvermoreAddress] = useState<string>('');
    const [signedMessage, setSignedMessage] = useState<string>('');
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        if (error) {
            setErrors(prevErrors => [...prevErrors, error]);
        }
    }, [error]);

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
            console.log("Fetching nonce from server.");
            getNonce();
            return;
        }
        setShowPopup(true);
    };

    const handlePopupSubmit = () => {
        if (evermoreAddress && signedMessage) {
            onLoginOrSignup(evermoreAddress, signedMessage);
            setShowPopup(false);
        } else {
            setErrors(prevErrors => [...prevErrors, "Both Evermore address and signed message are required."]);
        }
    };

    const removeError = (index: number) => {
        console.log("Removing error at index: " + index);
        setErrors(prevErrors => prevErrors.filter((_, i) => i !== index));
    };

    return (
        <div className="order-container">
            <Notification messages={errors} onClose={removeError} />
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
            <div className="login-container">
                <input 
                    type="text" 
                    value={evermoreAddress} 
                    onChange={(e) => setEvermoreAddress(e.target.value)} 
                    placeholder="Enter Evermore address" 
                />
                <input 
                    type="text" 
                    value={signedMessage} 
                    onChange={(e) => setSignedMessage(e.target.value)} 
                    placeholder={`Sign this message: ${nonce}`} 
                />
                <button type="button" onClick={handleLoginOrSignup}>Log in or Sign up to trade</button>
            </div>
            {showPopup && (
                <div className="popup-container">
                    <div className="popup-header">Nonce: {nonce}</div>
                    <input 
                        type="text" 
                        className="popup-input"
                        value={evermoreAddress} 
                        onChange={(e) => setEvermoreAddress(e.target.value)} 
                        placeholder="Enter Evermore address" 
                    />
                    <input 
                        type="text" 
                        className="popup-input"
                        value={signedMessage} 
                        onChange={(e) => setSignedMessage(e.target.value)} 
                        placeholder="Enter signed message" 
                    />
                    <button className="popup-button" onClick={handlePopupSubmit}>Submit</button>
                </div>
            )}
        </div>
    );
};

export default PlaceOrder;
