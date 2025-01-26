import React, { useState } from 'react';
import './Cart.css';
import placeholderImage from '@/images/enhanced_logo.png';
import Checkout from '../Checkout/Checkout';

interface CartProps {
    cart: Array<{
        id: string;
        name: string;
        description: string;
        image_ipfs_hash: string | null;
        quantity: number;
        unitPrice: string;
        asset_name: string;
    }>;
    onClose: () => void;
    onRemove: (index: number) => void;
    onClear: () => void;
    onCheckout: (items: any[]) => void;
}

const Cart: React.FC<CartProps> = ({ cart, onClose, onRemove, onClear, onCheckout }) => {
    const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
    const PINATA_GATEWAY = "https://rose-decent-prawn-420.mypinata.cloud/ipfs/";

    const getImageUrl = (item: any) => {
        if (!item.image_ipfs_hash) return placeholderImage;
        return `${PINATA_GATEWAY}${item.image_ipfs_hash}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO`;
    };

    const calculateTotal = () => {
        if (!cart || cart.length === 0) return { subtotal: "0", fee: "0", total: "0" };
        
        const subtotal = cart.reduce((total, item) => 
            total + (Number(item.unitPrice) * item.quantity), 0);
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
        onClear();
        onClose();
    };

    const handleBack = () => {
        setIsCheckingOut(false);
    };

    const totals = calculateTotal();

    if (isCheckingOut) {
        return (
            <Checkout
                selectedItems={cart}
                onCheckoutComplete={handleCheckoutComplete}
                onBack={handleBack}
            />
        );
    }

    return (
        <div className="cart">
            <div className="cart-header">
                <h2>Your Cart</h2>
                <button className="close-cart-button" onClick={onClose}>×</button>
            </div>

            <div className="cart-items-container">
                {cart.length === 0 ? (
                    <div className="empty-cart">
                        <p>Your cart is empty</p>
                    </div>
                ) : (
                    <ul className="cart-items">
                        {cart.map((item, index) => (
                            <li key={index} className="cart-item">
                                <img 
                                    src={getImageUrl(item)} 
                                    alt={item.asset_name}
                                    className="cart-item-image"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = placeholderImage;
                                    }}
                                />
                                <div className="cart-item-info">
                                    <div className="cart-item-name">{item.asset_name}</div>
                                    <div className="cart-item-description">
                                        {truncateDescription(item.description)}
                                    </div>
                                    <div className="cart-item-details">
                                        <div className="cart-item-price">
                                            Unit Price: {(Number(item.unitPrice) / 100000000).toFixed(8)} EVR
                                        </div>
                                        <div className="cart-item-quantity">
                                            Quantity: {item.quantity}
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => onRemove(index)} className="remove-item-button">×</button>
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
                        disabled={cart.length === 0}
                    >
                        Proceed to Checkout
                    </button>
                    <button className="clear-cart-button" onClick={onClear}>Clear Cart</button>
                    <button className="continue-shopping-button" onClick={onClose}>Continue Shopping</button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
