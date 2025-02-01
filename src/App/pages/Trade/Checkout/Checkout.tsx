import React, { useState } from 'react';
import './Checkout.css';
import { FiArrowLeft, FiCopy } from 'react-icons/fi';
import Debug from '@/App/components/Debug/Debug';

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

interface OrderItem {
    asset_name: string;
    quantity: number;
}

interface CheckoutProps {
    items: CartItem[];
    onCheckoutComplete: () => void;
    onBack: () => void;
}

interface OrderError {
    status: number;
    detail: string;
}

const Checkout: React.FC<CheckoutProps> = ({ items, onCheckoutComplete, onBack }) => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [buyerAddress, setBuyerAddress] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [orderData, setOrderData] = useState<any>(null);

    const trading_api_url = `${import.meta.env.VITE_TRADING_API_PROTO || 'https'}://${import.meta.env.VITE_TRADING_API_HOST || 'api.manticore.exchange'}:8000`;

    const calculateTotals = () => {
        const subtotal = items.reduce((total, item) => 
            total + (Number(item.unitPrice) * item.quantity), 0);
        const fee = subtotal * 0.005; // 0.5% fee
        return {
            subtotal: subtotal.toFixed(8),
            fee: fee.toFixed(8),
            total: (subtotal + fee).toFixed(8)
        };
    };

    const handleCreateOrder = async () => {
        if (!buyerAddress) {
            setError('Please enter your EVR address');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Group items by listing ID
            const listingOrders = items.reduce((acc: { [key: string]: OrderItem[] }, item) => {
                if (!acc[item.listingId]) {
                    acc[item.listingId] = [];
                }
                acc[item.listingId].push({
                    asset_name: item.asset_name,
                    quantity: item.quantity
                });
                return acc;
            }, {});

            // Create orders for each listing
            const orderPromises = Object.entries(listingOrders).map(([listingId, orderItems]) => {
                return fetch(`${trading_api_url}/listings/${listingId}/orders/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        buyer_address: buyerAddress,
                        items: orderItems
                    }),
                });
            });

            const responses = await Promise.all(orderPromises);
            const results = await Promise.all(responses.map(r => r.json()));

            // Check for any errors
            const errors = results.filter(r => r.error);
            if (errors.length > 0) {
                throw new Error(errors[0].detail || 'Failed to create order');
            }

            setOrderData(results);
            setCurrentStep(2);

            // Start polling for order status
            startOrderStatusPolling(results.map((r: any) => r.id));

        } catch (err: any) {
            console.error('Order creation error:', err);
            if (err.detail?.includes('Insufficient balance')) {
                setError('Insufficient balance available for this order');
            } else {
                setError(err.message || 'Failed to create order. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const startOrderStatusPolling = (orderIds: string[]) => {
        const pollInterval = setInterval(async () => {
            try {
                const statusPromises = orderIds.map(id =>
                    fetch(`${trading_api_url}/orders/${id}`)
                );
                const responses = await Promise.all(statusPromises);
                const statuses = await Promise.all(responses.map(r => r.json()));

                // Check if all orders are complete
                const allComplete = statuses.every(s => s.status === 'complete');
                const anyFailed = statuses.some(s => s.status === 'failed');

                if (allComplete) {
                    clearInterval(pollInterval);
                    onCheckoutComplete();
                } else if (anyFailed) {
                    clearInterval(pollInterval);
                    setError('One or more orders failed to process');
                }

                // Update order data
                setOrderData(statuses);

            } catch (err) {
                console.error('Error polling order status:', err);
            }
        }, 5000);

        // Cleanup interval after 15 minutes
        setTimeout(() => {
            clearInterval(pollInterval);
        }, 15 * 60 * 1000);
    };

    const totals = calculateTotals();

    return (
        <div className="checkout-container">
            <div className="checkout-header">
                <button className="back-button" onClick={onBack}>
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
                                {items.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <div className="item-details">
                                            <h4>{item.name}</h4>
                                            <p className="item-quantity">
                                                {item.quantity} x {item.asset_name}
                                            </p>
                                        </div>
                                        <div className="item-price">
                                            {(Number(item.unitPrice) * item.quantity / 100000000).toFixed(8)} EVR
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
                            <h3>Your Information</h3>
                            <div className="input-group">
                                <label htmlFor="buyerAddress">Your EVR Address</label>
                                <input
                                    type="text"
                                    id="buyerAddress"
                                    value={buyerAddress}
                                    onChange={(e) => setBuyerAddress(e.target.value)}
                                    placeholder="Enter your EVR address"
                                    className={error ? 'error' : ''}
                                />
                                {error && <div className="error-message">{error}</div>}
                            </div>
                        </div>

                        <button
                            className="proceed-button"
                            onClick={handleCreateOrder}
                            disabled={loading || !buyerAddress}
                        >
                            {loading ? 'Processing...' : 'Create Order'}
                        </button>
                    </div>
                ) : (
                    <div className="payment-section">
                        {orderData && (
                            <div className="order-status-container">
                                <div className="order-header">
                                    <h2>Order Status</h2>
                                </div>

                                <div className="order-details">
                                    {orderData.map((order: any, index: number) => (
                                        <div key={index} className="order-detail-item">
                                            <div className="order-id">
                                                Order ID: {order.id}
                                                <button 
                                                    className="copy-button"
                                                    onClick={() => navigator.clipboard.writeText(order.id)}
                                                >
                                                    <FiCopy />
                                                </button>
                                            </div>
                                            <div className="order-status">
                                                Status: <span className={`status-badge ${order.status.toLowerCase()}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            {order.payment_address && (
                                                <div className="payment-address">
                                                    Payment Address: 
                                                    <div className="address-copy">
                                                        <span>{order.payment_address}</span>
                                                        <button 
                                                            className="copy-button"
                                                            onClick={() => navigator.clipboard.writeText(order.payment_address)}
                                                        >
                                                            <FiCopy />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {error && (
                                    <div className="error-message">
                                        {error}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
