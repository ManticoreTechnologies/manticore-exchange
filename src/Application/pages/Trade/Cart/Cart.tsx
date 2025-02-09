import React, { useState } from 'react';
import './Cart.css';
import placeholderImage from '@/Application/logos/white-manticore.png';
import Checkout from '../Checkout/Checkout';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { useCart } from '@/Application/hooks/useCart';

interface CartItem {
    listingId: string;
    name: string;
    description: string;
    image_ipfs_hash: string | null;
    quantity: number;
    unitPrice: string;
    asset_name: string;
    seller_address: string;
}

interface CartProps {
    onBack: () => void;
}

const Cart: React.FC<CartProps> = ({ onBack }) => {
    const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
    const navigate = useNavigate();
    const { clearCart, removeFromCart, cartItems } = useCart();
    const PINATA_GATEWAY = "https://rose-decent-prawn-420.mypinata.cloud/ipfs/";

    const getImageUrl = (item: CartItem) => {
        if (!item.image_ipfs_hash) return placeholderImage;
        return `${PINATA_GATEWAY}${item.image_ipfs_hash}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO`;
    };

    const calculateTotal = () => {
        if (!cartItems || cartItems.length === 0) return { subtotal: "0", fee: "0", total: "0" };
        
        const subtotal = cartItems.reduce((total, item) => 
            total + (Number(item.unitPrice) * item.quantity), 0);
        const fee = subtotal * 0.005; // 0.5% fee
        return {
            subtotal: subtotal.toString(),
            fee: fee.toString(),
            total: (subtotal + fee).toString()
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
        navigate('/trade');
    };

    const handleBack = () => {
        setIsCheckingOut(false);
    };

    const handleClearCart = () => {
        clearCart();
    };

    const handleRemoveItem = (listingId: string, assetName: string) => {
        removeFromCart(listingId, assetName);
    };

    const totals = calculateTotal();

    if (isCheckingOut) {
        return (
            <Checkout
                items={cartItems}
                onCheckoutComplete={handleCheckoutComplete}
                onBack={handleBack}
            />
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-page-header">
                <button className="back-button" onClick={onBack}>
                    <FiArrowLeft /> Back
                </button>
                <h1>Shopping Cart</h1>
            </div>

            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <p>Your cart is empty</p>
                    <button 
                        className="continue-shopping-button"
                        onClick={() => navigate('/trade')}
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items-section">
                        <ul className="cart-items">
                            {cartItems.map((item, index) => (
                                <li key={`${item.listingId}-${item.asset_name}`} className="cart-item">
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
                                                Unit Price: {item.unitPrice} EVR
                                            </div>
                                            <div className="cart-item-quantity">
                                                Quantity: {item.quantity}
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleRemoveItem(item.listingId, item.asset_name)} 
                                        className="remove-item-button"
                                    >
                                        ×
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="cart-summary-container">
                        <div className="cart-summary">
                            <h2>Order Summary</h2>
                            <div className="cart-totals">
                                <div className="cart-subtotal">
                                    <span>Subtotal</span>
                                    <span>{totals.subtotal} EVR</span>
                                </div>
                                <div className="cart-fee">
                                    <span>Network Fee (0.5%)</span>
                                    <span>{totals.fee} EVR</span>
                                </div>
                                <div className="cart-total">
                                    <span>Total</span>
                                    <span>{totals.total} EVR</span>
                                </div>
                            </div>
                            
                            <div className="cart-actions">
                                <button 
                                    className="checkout-button" 
                                    onClick={() => setIsCheckingOut(true)}
                                    disabled={cartItems.length === 0}
                                >
                                    Proceed to Checkout
                                </button>
                                <button className="clear-cart-button" onClick={handleClearCart}>
                                    Clear Cart
                                </button>
                                <button 
                                    className="continue-shopping-button" 
                                    onClick={() => navigate('/trade')}
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
