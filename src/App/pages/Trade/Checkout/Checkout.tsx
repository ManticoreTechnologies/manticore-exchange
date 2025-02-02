import React, { useState, useEffect } from 'react';
import './Checkout.css';
import { FiArrowLeft, FiCopy, FiShoppingBag } from 'react-icons/fi';
import Cookies from 'js-cookie';

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

interface OrderResponse {
    id: string;
    status: string;
    payment_address?: string;
    error?: string;
    items?: Array<{
        asset_name: string;
        amount: number;
        price_evr?: string;
    }>;
    total_price_evr?: string;
    total_payment_evr?: string;
    total_fee_evr?: string;
    buyer_address?: string;
    created_at?: string;
    updated_at?: string;
}

interface CheckoutProps {
    items: CartItem[];
    onCheckoutComplete: () => void;
    onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ items, onCheckoutComplete, onBack }) => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [buyerAddress, setBuyerAddress] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [orderData, setOrderData] = useState<OrderResponse[]>([]);

    const trading_api_url = `${import.meta.env.VITE_TRADING_API_PROTO || 'https'}://${import.meta.env.VITE_TRADING_API_HOST || 'api.manticore.exchange'}:8000`;

    const saveOrdersToCookies = (orders: OrderResponse[]) => {
        const existingOrders = Cookies.get('manticore_orders');
        let allOrders = orders;
        
        if (existingOrders) {
            const parsedOrders = JSON.parse(existingOrders);
            allOrders = [...parsedOrders, ...orders];
        }
        
        Cookies.set('manticore_orders', JSON.stringify(allOrders), { expires: 7 }); // Expires in 7 days
    };

    const calculateTotals = () => {
        const subtotal = items.reduce((total, item) => 
            total + (Number(item.unitPrice) * item.quantity), 0);
        const fee = subtotal * 0.005; // 0.5% fee
        return {
            subtotal: subtotal.toString(),
            fee: fee.toString(),
            total: (subtotal + fee).toString()
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
            const listingOrders = items.reduce((acc: { [key: string]: { asset_name: string, amount: number }[] }, item) => {
                if (!acc[item.listingId]) {
                    acc[item.listingId] = [];
                }
                acc[item.listingId].push({
                    asset_name: item.asset_name,
                    amount: item.quantity  // Changed from quantity to amount to match API requirements
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
                }).then(async response => {
                    const data = await response.json();
                    if (!response.ok) {
                        console.error('Order creation failed:', {
                            status: response.status,
                            statusText: response.statusText,
                            data
                        });
                        
                        // Handle specific error cases
                        if (data.detail) {
                            if (typeof data.detail === 'object') {
                                // Handle validation errors
                                const errors = Object.entries(data.detail)
                                    .map(([key, value]) => `${key}: ${value}`)
                                    .join('\n');
                                throw new Error(`Validation Error:\n${errors}`);
                            } else {
                                throw new Error(data.detail);
                            }
                        }
                        
                        throw new Error(`Failed to create order (${response.status}): ${response.statusText}`);
                    }
                    return data;
                });
            });

            const results = await Promise.all(orderPromises);
            console.log('Order creation successful:', results);
            setOrderData(results);
            saveOrdersToCookies(results);
            setCurrentStep(2);

            // Start polling for order status
            startOrderStatusPolling(results.map(r => r.id));

        } catch (err: any) {
            console.error('Order creation error:', err);
            setError(err.message || 'Failed to create order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const startOrderStatusPolling = (orderIds: string[]) => {
        const pollInterval = setInterval(async () => {
            try {
                const statusPromises = orderIds.map(async id => {
                    const response = await fetch(`${trading_api_url}/orders/${id}`);
                    if (response.status === 422) {
                        console.error(`Invalid order ID format: ${id}`);
                        throw new Error(`Invalid order ID format: ${id}`);
                    }
                    
                    const data = await response.json();
                    if (!response.ok) {
                        console.error('Order status check failed:', {
                            orderId: id,
                            status: response.status,
                            statusText: response.statusText,
                            data
                        });
                        throw new Error(data.detail || `Failed to fetch status for order ${id}`);
                    }
                    return data;
                });

                const statuses = await Promise.all(statusPromises);
                console.log('Order statuses:', statuses);
                
                // Check if all orders are complete or if any have failed
                const allComplete = statuses.every(s => s.status === 'complete');
                const anyFailed = statuses.some(s => s.status === 'failed');
                const anyError = statuses.some(s => s.error);

                if (allComplete) {
                    clearInterval(pollInterval);
                    onCheckoutComplete();
                } else if (anyFailed || anyError) {
                    clearInterval(pollInterval);
                    const failedOrders = statuses.filter(s => s.status === 'failed' || s.error);
                    const errorMessages = failedOrders.map(order => {
                        const baseMessage = order.error || `Order ${order.id} failed to process`;
                        const details = order.status_details ? `\nDetails: ${order.status_details}` : '';
                        return `${baseMessage}${details}`;
                    });
                    setError(errorMessages.join('\n'));
                }

                setOrderData(statuses);

            } catch (err: any) {
                console.error('Error polling order status:', err);
                const errorMessage = err.message || 'Failed to update order status. Please check your orders page for the latest status.';
                setError(`Error checking order status: ${errorMessage}`);
            }
        }, 5000);

        // Cleanup interval after 15 minutes
        setTimeout(() => {
            clearInterval(pollInterval);
            setError('Order status check timed out. Please check your orders page for the latest status.');
        }, 15 * 60 * 1000);

        return () => clearInterval(pollInterval);
    };

    const totals = calculateTotals();

    return (
        <div className="checkout-page">
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
                                    <span>Trading Fee (0.5%)</span>
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
                    <div className="order-status-container">
                        <div className="order-header">
                            <h2>Orders Created Successfully!</h2>
                            <p className="order-subtitle">Please complete the payment to receive your items</p>
                        </div>

                        <div className="order-details">
                            {orderData.map((order: OrderResponse, index: number) => (
                                <div key={index} className="order-detail-item">
                                    <div className="order-id">
                                        <span>Order #{order.id}</span>
                                        <button 
                                            className="copy-button"
                                            onClick={() => navigator.clipboard.writeText(order.id)}
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

                                    {order.items && order.items.length > 0 && (
                                        <div className="order-items-list">
                                            <h4>Items</h4>
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="order-item-detail">
                                                    <span>{item.asset_name}</span>
                                                    <span>x{item.amount}</span>
                                                    {item.price_evr && (
                                                        <span className="item-price">{item.price_evr} EVR</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {order.payment_address && (
                                        <div className="payment-info">
                                            <h4>Payment Details</h4>
                                            <div className="payment-row">
                                                <span className="label">Send payment to:</span>
                                                <div className="address-copy">
                                                    <span>{order.payment_address}</span>
                                                    <button 
                                                        className="copy-button"
                                                        onClick={() => navigator.clipboard.writeText(order.payment_address!)}
                                                        title="Copy Payment Address"
                                                    >
                                                        <FiCopy />
                                                    </button>
                                                </div>
                                            </div>
                                            {order.total_payment_evr && (
                                                <div className="payment-row">
                                                    <span className="label">Total to Pay:</span>
                                                    <span className="value highlight">{order.total_payment_evr} EVR</span>
                                                </div>
                                            )}
                                            {order.total_price_evr && (
                                                <div className="payment-row">
                                                    <span className="label">Items Total:</span>
                                                    <span className="value">{order.total_price_evr} EVR</span>
                                                </div>
                                            )}
                                            {order.total_fee_evr && (
                                                <div className="payment-row">
                                                    <span className="label">Network Fee:</span>
                                                    <span className="value">{order.total_fee_evr} EVR</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="delivery-info">
                                        <h4>Delivery Information</h4>
                                        <div className="address-copy">
                                            <span>{order.buyer_address}</span>
                                            <button 
                                                className="copy-button"
                                                onClick={() => navigator.clipboard.writeText(order.buyer_address!)}
                                                title="Copy Delivery Address"
                                            >
                                                <FiCopy />
                                            </button>
                                        </div>
                                    </div>

                                    {order.created_at && (
                                        <div className="order-timestamp">
                                            Created: {new Date(order.created_at).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {error && (
                            <div className="error-message">
                                {error.split('\n').map((line, i) => (
                                    <div key={i}>{line}</div>
                                ))}
                            </div>
                        )}

                        <div className="order-actions">
                            <p className="order-note">
                                * Your orders have been saved. You can access them anytime from the orders menu.
                            </p>
                            <button 
                                className="proceed-button"
                                onClick={onCheckoutComplete}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
