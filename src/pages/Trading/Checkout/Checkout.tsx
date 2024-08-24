import React, { useState } from 'react';
import './Checkout.css';

interface CheckoutProps {
    selectedItems: any[];
    onCheckoutComplete: () => void;
    onBack: () => void;  // New prop for handling the back action
}

const Checkout: React.FC<CheckoutProps> = ({ selectedItems, onCheckoutComplete, onBack }) => {
    const [processing, setProcessing] = useState(false);

    const totalAmount = selectedItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0);

    const handleCheckout = () => {
        setProcessing(true);

        // Simulate an API call for the checkout process
        setTimeout(() => {
            alert('Checkout successful!');
            setProcessing(false);
            onCheckoutComplete();
        }, 2000);
    };

    return (
        <div className="checkout">
            <h2>Checkout</h2>
            <ul className="checkout-items">
                {selectedItems.map((item, index) => (
                    <li key={index} className="checkout-item">
                        <div>
                            <strong>{item.assetName}</strong>
                            <p>Quantity: {item.quantity}</p>
                            <p>Total: {(item.unitPrice * item.quantity).toFixed(2)} $EVR</p>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="checkout-summary">
                <p><strong>Total Amount: </strong>{totalAmount.toFixed(2)} $EVR</p>
                <button 
                    className="complete-checkout-button" 
                    onClick={handleCheckout} 
                    disabled={processing}
                >
                    {processing ? 'Processing...' : 'Complete Purchase'}
                </button>
                <button 
                    className="back-button" 
                    onClick={onBack} 
                    disabled={processing}
                >
                    {processing ? 'Processing...' : 'Back'}
                </button>
            </div>
        </div>
    );
};

export default Checkout;
