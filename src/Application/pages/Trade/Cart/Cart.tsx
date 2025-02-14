import React, { useState } from 'react';
import './Cart.css';
import placeholderImage from '@/Application/logos/white-manticore.png';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '@/Application/hooks/useCart';
import { useAuth } from '@/Application/contexts/AuthContext';
import { toast } from 'react-toastify';
import InvoiceStatusPopup from '../InvoiceStatusPopup/InvoiceStatusPopup';

const Cart: React.FC = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, clearCart, processCart, isProcessing } = useCart();
    const { isAuthenticated } = useAuth();
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const PINATA_GATEWAY = "https://rose-decent-prawn-420.mypinata.cloud/ipfs/";

    const getImageUrl = (ipfsHash: string | null) => {
        if (!ipfsHash) return placeholderImage;
        return `${PINATA_GATEWAY}${ipfsHash}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO`;
    };

    const calculateTotal = () => {
        if (!cartItems || cartItems.length === 0) return { subtotal: "0", fee: "0", total: "0" };
        
        const subtotal = cartItems.reduce((total, item) => 
            total + (Number(item.unitPrice) * item.quantity), 0);
        const fee = subtotal * 0.005; // 0.5% fee
        return {
            subtotal: subtotal.toFixed(8),
            fee: fee.toFixed(8),
            total: (subtotal + fee).toFixed(8)
        };
    };

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            toast.error('Please sign in to proceed with checkout');
            navigate('/signin');
            return;
        }

        const orders = await processCart();
        if (orders && orders.length > 0) {
            // Show the first order in the invoice popup
            setSelectedOrder(orders[0]);
        }
    };

    const handleInvoiceClose = (expired: boolean) => {
        setSelectedOrder(null);
        if (expired) {
            toast.error('Order expired. Please try again.');
        } else {
            navigate('/trade');
        }
    };

    const handleBack = () => {
        navigate(-1); // This will go back to the previous page
    };

    const totals = calculateTotal();

    return (
        <div className="cart-page">
            <div className="cart-page-header">
                <button className="back-button" onClick={handleBack}>
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
                            {cartItems.map((item) => (
                                <li key={`${item.listingId}-${item.asset_name}`} className="cart-item">
                                    <img 
                                        src={getImageUrl(item.image_ipfs_hash)} 
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
                                            {item.description}
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
                                        onClick={() => removeFromCart(item.listingId, item.asset_name)} 
                                        className="remove-item-button"
                                        aria-label="Remove item"
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
                                    onClick={handleCheckout}
                                    disabled={isProcessing || cartItems.length === 0}
                                >
                                    {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                                </button>
                                <button 
                                    className="clear-cart-button" 
                                    onClick={clearCart}
                                    disabled={isProcessing}
                                >
                                    Clear Cart
                                </button>
                                <button 
                                    className="continue-shopping-button" 
                                    onClick={() => navigate('/trade')}
                                    disabled={isProcessing}
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedOrder && (
                <InvoiceStatusPopup
                    invoiceData={selectedOrder}
                    onClose={handleInvoiceClose}
                />
            )}
        </div>
    );
};

export default Cart;
