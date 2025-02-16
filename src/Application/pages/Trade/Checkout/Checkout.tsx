import React, { useState, useEffect, useCallback } from 'react';
import './Checkout.css';
import { FiArrowLeft, FiCopy } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import TradingService, { CartOrder } from '@/Application/services/TradingService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CheckoutItem } from '../types';
import useCart from '@/Application/hooks/useCart';

const EVR_ADDRESS_REGEX = /^[A-Za-z0-9]{34}$/;

const POLL_INTERVAL = 3000; // 3 seconds
const MAX_POLL_TIME = 15 * 60 * 1000; // 15 minutes

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [order, setOrder] = useState<CartOrder | null>(null);
    const [buyerAddress, setBuyerAddress] = useState<string>('');
    const [addressError, setAddressError] = useState<string>('');
    const [isInitialized, setIsInitialized] = useState(false);
    const [pollTimer, setPollTimer] = useState<NodeJS.Timeout | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(MAX_POLL_TIME);
    const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
    const { clearCart } = useCart();

    // Handle cart initialization and validation
    useEffect(() => {
        const timer = setTimeout(() => {
            const storedItems = sessionStorage.getItem('checkout_items');
            if (!storedItems) {
                toast.error('No items selected for checkout');
                navigate('/cart');
                return;
            }

            try {
                const items = JSON.parse(storedItems);
                setCheckoutItems(items);
                setIsInitialized(true);
            } catch (err) {
                console.error('Error parsing checkout items:', err);
                toast.error('Error loading checkout items');
                navigate('/cart');
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [navigate]);

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (pollTimer) {
                clearInterval(pollTimer);
            }
        };
    }, [pollTimer]);

    // Handle order status polling
    const startPolling = useCallback((orderId: string) => {
        if (pollTimer) {
            clearInterval(pollTimer);
        }

        const startTime = Date.now();
        
        const timer = setInterval(async () => {
            try {
                const updatedOrder = await TradingService.getCartOrder(orderId);
                console.log('Order status updated:', updatedOrder);
                setOrder(updatedOrder);

                const elapsed = Date.now() - startTime;
                const remaining = Math.max(0, MAX_POLL_TIME - elapsed);
                setTimeLeft(remaining);

                if (remaining <= 0) {
                    clearInterval(timer);
                    setError('Order expired. Please try again.');
                    return;
                }

                switch (updatedOrder.status.toLowerCase()) {
                    case 'completed':
                        clearInterval(timer);
                        toast.success('Payment received! Your order is complete.');
                        // Clear checkout items from session storage
                        sessionStorage.removeItem('checkout_items');
                        // Clear the cart
                        clearCart();
                        break;
                    case 'failed':
                        clearInterval(timer);
                        toast.error('Order failed. Please try again.');
                        break;
                    case 'cancelled':
                        clearInterval(timer);
                        toast.error('Order was cancelled.');
                        break;
                    case 'expired':
                        clearInterval(timer);
                        toast.error('Order expired. Please try again.');
                        break;
                    default:
                        break;
                }
            } catch (err) {
                console.error('Error polling order status:', err);
            }
        }, POLL_INTERVAL);

        setPollTimer(timer);
    }, [pollTimer, clearCart]);

    if (!isInitialized) {
        return null;
    }

    const validateAddress = (address: string): boolean => {
        if (!address) {
            setAddressError('Please enter your EVR address');
            return false;
        }
        if (!EVR_ADDRESS_REGEX.test(address)) {
            setAddressError('Please enter a valid EVR address');
            return false;
        }
        setAddressError('');
        return true;
    };

    const calculateTotals = () => {
        if (!checkoutItems || checkoutItems.length === 0) return { subtotal: "0", fee: "0", total: "0" };
        
        const subtotal = checkoutItems.reduce((total, item) => 
            total + (item.unitPrice * item.quantity), 0);
        const fee = subtotal * 0.005; // 0.5% fee
        return {
            subtotal: subtotal.toFixed(8),
            fee: fee.toFixed(8),
            total: (subtotal + fee).toFixed(8)
        };
    };

    const handleCreateOrder = async () => {
        if (!validateAddress(buyerAddress)) {
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const cartOrderItems = checkoutItems.map(item => ({
                listing_id: item.listingId,
                asset_name: item.asset_name,
                amount: item.quantity.toString(),
                listing_name: item.name,
                seller_address: item.seller_address
            }));

            console.log('Creating cart order with items:', cartOrderItems);

            const createdOrder = await TradingService.createCartOrder({
                buyer_address: buyerAddress,
                items: cartOrderItems
            });

            console.log('Order created successfully:', createdOrder);

            setOrder(createdOrder);
            setCurrentStep(2);

            // Start polling for order status
            startPolling(createdOrder.id);

        } catch (err: any) {
            console.error('Order creation error:', err);
            if (err.code === 'INSUFFICIENT_BALANCE') {
                setError('Insufficient balance in listing');
            } else if (err.code === 'LISTING_NOT_FOUND') {
                setError('One or more listings not found');
            } else {
                setError(err.response?.data?.detail || err.message || 'Failed to create order. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCopyToClipboard = async (text: string, label: string = 'Text') => {
        try {
            // Try the modern clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                toast.success(`${label} copied to clipboard!`);
                return;
            }

            // Fallback to older method
            const textArea = document.createElement('textarea');
            textArea.value = text;
            
            // Avoid scrolling to bottom
            textArea.style.top = '0';
            textArea.style.left = '0';
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand('copy');
                toast.success(`${label} copied to clipboard!`);
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
                toast.error(`Failed to copy ${label.toLowerCase()} to clipboard`);
            } finally {
                document.body.removeChild(textArea);
            }
        } catch (err) {
            console.error('Failed to copy:', err);
            toast.error(`Failed to copy ${label.toLowerCase()} to clipboard`);
        }
    };

    const handleBack = () => {
        if (currentStep === 2 && !order?.status) {
            setCurrentStep(1);
        } else {
            navigate('/cart');
        }
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const address = e.target.value;
        setBuyerAddress(address);
        if (address) {
            validateAddress(address);
        } else {
            setAddressError('');
        }
    };

    const totals = calculateTotals();

    const formatTimeLeft = (ms: number): string => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="checkout-page">
            <ToastContainer
                position="bottom-right"
                autoClose={2000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover={false}
                theme="dark"
                style={{ fontSize: '14px' }}
            />
            <div className="checkout-header">
                <button className="back-button" onClick={handleBack}>
                    <FiArrowLeft /> Back
                </button>
                <div className="checkout-steps">
                    <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                        <div className="step-number">1</div>
                        <span>Review</span>
                    </div>
                    <div className={`step-connector ${currentStep >= 2 ? 'active' : ''}`} />
                    <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                        <div className="step-number">2</div>
                        <span>Payment</span>
                    </div>
                </div>
            </div>

            <div className="checkout-content">
                {currentStep === 1 ? (
                    <div className="checkout-review">
                        <div className="order-summary">
                            <h3>Order Summary</h3>
                            <div className="order-items">
                                {checkoutItems.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <div className="item-details">
                                            <h4>{item.name}</h4>
                                            <p className="item-quantity">
                                                {item.quantity} x {item.asset_name}
                                            </p>
                                        </div>
                                        <div className="item-price">
                                            {item.unitPrice} EVR
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="order-totals">
                                <div className="total-line">
                                    <span>Subtotal</span>
                                    <span>{totals.subtotal} EVR</span>
                                </div>
                                <div className="total-line">
                                    <span>Network Fee (0.5%)</span>
                                    <span>{totals.fee} EVR</span>
                                </div>
                                <div className="total-line total">
                                    <span>Total</span>
                                    <span>{totals.total} EVR</span>
                                </div>
                            </div>
                        </div>

                        <div className="buyer-address-section">
                            <h3>Delivery Information</h3>
                            <div className="input-group">
                                <label>Your EVR Address</label>
                                <input
                                    type="text"
                                    className={`address-input ${addressError ? 'error' : ''}`}
                                    value={buyerAddress}
                                    onChange={handleAddressChange}
                                    placeholder="Enter your EVR address"
                                />
                                {addressError && (
                                    <div className="error-message">{addressError}</div>
                                )}
                                <p className="address-hint">
                                    This is the address where your purchased assets will be sent.
                                </p>
                            </div>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button
                            className="proceed-button"
                            onClick={handleCreateOrder}
                            disabled={loading || !buyerAddress.trim() || !!addressError}
                        >
                            {loading ? 'Processing...' : 'Create Order'}
                        </button>
                    </div>
                ) : (
                    <div className="order-status-container">
                        <div className="order-header">
                            <h2>Order Created Successfully!</h2>
                            <p className="order-subtitle">Please complete the payment to receive your items</p>
                            <div className="time-remaining">
                                Time remaining: {formatTimeLeft(timeLeft)}
                            </div>
                        </div>

                        {order && (
                            <div className="order-details">
                                <div className="order-detail-item">
                                    <div className="order-id">
                                        <span>Order #{order.id}</span>
                                        <button 
                                            className="copy-button"
                                            onClick={() => handleCopyToClipboard(order.id, 'Order ID')}
                                            title="Copy Order ID"
                                        >
                                            <FiCopy />
                                        </button>
                                    </div>

                                    <div className="order-status">
                                        Status: <span className={`status-badge ${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="payment-info">
                                        <h4>Payment Details</h4>
                                        <div className="payment-row">
                                            <span className="label">Send payment to:</span>
                                            <div className="address-copy">
                                                <span>{order.payment_address}</span>
                                                <button 
                                                    className="copy-button"
                                                    onClick={() => handleCopyToClipboard(order.payment_address, 'Payment address')}
                                                    title="Copy Payment Address"
                                                >
                                                    <FiCopy />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="payment-row">
                                            <span className="label">Amount to Send:</span>
                                            <span className="value highlight">{order.total_payment_evr} EVR</span>
                                        </div>
                                        <div className="payment-status">
                                            <div className={`status-indicator ${order.status.toLowerCase()}`}>
                                                {order.status}
                                            </div>
                                            {order.status.toLowerCase() === 'pending' && (
                                                <p className="payment-instructions">
                                                    Send exactly {order.total_payment_evr} EVR to the address above.
                                                    The order will automatically complete once payment is detected.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {'fulfillment_txid' in order && (order as any).fulfillment_txid && (
                                        <div className="transaction-info">
                                            <h4>Transaction Details</h4>
                                            <div className="address-copy">
                                                <span>{(order as any).fulfillment_txid as string}</span>
                                                <button 
                                                    className="copy-button"
                                                    onClick={() => handleCopyToClipboard((order as any).fulfillment_txid as string, 'Transaction ID')}
                                                    title="Copy Transaction ID"
                                                >
                                                    <FiCopy />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="order-timestamp">
                                        Created: {new Date(order.created_at).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && <div className="error-message">{error}</div>}

                        <div className="order-actions">
                            <p className="order-note">
                                * Your order has been saved. You can access it anytime from your orders page.
                                {order?.status.toLowerCase() === 'pending' && 
                                    " The order will automatically update once payment is received."}
                            </p>
                            {(order?.status.toLowerCase() === 'completed' || 
                             order?.status.toLowerCase() === 'failed' ||
                             order?.status.toLowerCase() === 'cancelled' ||
                             order?.status.toLowerCase() === 'expired') && (
                                <button 
                                    className="proceed-button"
                                    onClick={handleBack}
                                >
                                    Continue Shopping
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
