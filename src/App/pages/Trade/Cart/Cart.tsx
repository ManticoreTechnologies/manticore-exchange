import React, { useState } from 'react';
import './Cart.css';
import placeholderImage from '@/images/enhanced_logo.png';
import Checkout from '../Checkout/Checkout';

interface CartProps {
    cartItems: any[];
    removeFromCart: (index: number) => void;
    clearCart: () => void;
    closeCart: () => void;
    updateQuantity: (index: number, quantity: number) => void;
}

const Cart: React.FC<CartProps> = ({ cartItems, removeFromCart, clearCart, closeCart }) => {
    const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
    const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

    const getImageUrl = (item: any) => {
        if (!item.ipfsHash) return placeholderImage;
        return `${PINATA_GATEWAY}${item.ipfsHash}`;
    };

    const calculateTotal = () => {
        const subtotal = cartItems.reduce((total, item) => total + (item.unitPrice * item.quantity) / 100000000, 0);
        const fee = subtotal * 0.005; // 0.5% fee
        return {
            subtotal: subtotal.toFixed(8),
            fee: fee.toFixed(8),
            total: (subtotal + fee).toFixed(8)
        };
    };

    const truncateDescription = (description: string, maxLength: number = 50) => {
        if (!description) return "No description available";
        if (description.length <= maxLength) return description;
        return `${description.substring(0, maxLength)}...`;
    };

    const handleCheckoutComplete = () => {
        setIsCheckingOut(false);
        clearCart();
        closeCart();
    };

    const handleBack = () => {
        setIsCheckingOut(false);
    };

    const totals = calculateTotal();

    if (isCheckingOut) {
        return (
            <Checkout
                selectedItems={cartItems}
                onCheckoutComplete={handleCheckoutComplete}
                onBack={handleBack}
            />
        );
    }

    return (
        <>
            <div className="cart-header">
                <h2>Your Cart</h2>
                <button className="close-cart-button" onClick={closeCart}>×</button>
            </div>

            <div className="cart-items-container">
                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <p>Your cart is empty</p>
                    </div>
                ) : (
                    <ul className="cart-items">
                        {cartItems.map((item, index) => (
                            <li key={index} className="cart-item">
                                <img 
                                    src={getImageUrl(item)} 
                                    alt={item.assetName}
                                    className="cart-item-image"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = placeholderImage;
                                    }}
                                />
                                <div className="cart-item-info">
                                    <div className="cart-item-name">{item.assetName}</div>
                                    <div className="cart-item-description">
                                        {truncateDescription(item.description)}
                                    </div>
                                    <div className="cart-item-details">
                                        <div className="cart-item-price">
                                            Unit Price: {(item.unitPrice / 100000000).toFixed(8)} EVR
                                        </div>
                                        <div className="cart-item-quantity">
                                            Quantity: {item.quantity}
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(index)} className="remove-item-button">×</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="cart-footer">
                <div className="cart-summary">
                    <div className="cart-subtotal">Subtotal: {totals.subtotal} EVR</div>
                    <div className="cart-fee">Fee (0.5%): {totals.fee} EVR</div>
                    <div className="cart-total">Total: {totals.total} EVR</div>
                </div>
                
                <div className="cart-buttons">
                    <button 
                        className="checkout-button" 
                        onClick={() => setIsCheckingOut(true)}
                        disabled={cartItems.length === 0}
                    >
                        Proceed to Checkout
                    </button>
                    <button className="clear-cart-button" onClick={clearCart}>Clear Cart</button>
                    <button className="continue-shopping-button" onClick={closeCart}>Continue Shopping</button>
                </div>
            </div>
        </>
    );
};

export default Cart;
