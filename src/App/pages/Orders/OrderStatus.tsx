/*
{
  "order_id": "1339c530-ccc9-433c-8166-d9efc575c0ba",
  "status": "pending",
  "total_required": "101.00",
  "total_paid": "0",
  "is_paid": false,
  "balances": {
    "CREDITS": {
      "confirmed_balance": "0",
      "pending_balance": "0"
    }
  },
  "payout_info": {
    "is_completed": false,
    "failure_count": 0,
    "last_attempt": null,
    "completed_at": null,
    "total_fees_paid": "0"
  },
  "fulfillment": {
    "CREDITS": {
      "amount": "1",
      "fulfilled_at": null,
      "tx_hash": null
    }
  }
}
*/
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCopy, FiCheckCircle, FiAlertCircle, FiClock } from 'react-icons/fi';
import './OrderStatus.css';

interface OrderItem {
    asset_name: string;
    amount: string;
    price_evr: string;
    fee_evr: string;
}

interface OrderDetails {
    id: string;
    status: string;
    buyer_address: string;
    payment_address: string;
    total_price_evr: string;
    total_fee_evr: string;
    total_payment_evr: string;
    items: OrderItem[];
    created_at: string;
    updated_at: string;
    error?: string;
}

interface Balance {
    confirmed_balance: string;
    pending_balance: string;
}

interface PayoutInfo {
    is_completed: boolean;
    failure_count: number;
    last_attempt: string | null;
    completed_at: string | null;
    total_fees_paid: string;
}

interface FulfillmentItem {
    amount: string;
    fulfilled_at: string | null;
    tx_hash: string | null;
}

interface OrderStatus {
    order_id: string;
    status: string;
    total_required: string;
    total_paid: string;
    is_paid: boolean;
    balances: {
        [key: string]: Balance;
    };
    payout_info?: PayoutInfo;
    fulfillment: {
        [key: string]: FulfillmentItem;
    };
}

const OrderStatus: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const trading_api_url = `${import.meta.env.VITE_TRADING_API_PROTO || 'https'}://${import.meta.env.VITE_TRADING_API_HOST || 'api.manticore.exchange'}:8000`;

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const [orderResponse, statusResponse] = await Promise.all([
                    fetch(`${trading_api_url}/orders/${orderId}`),
                    fetch(`${trading_api_url}/orders/${orderId}/status`)
                ]);

                if (!orderResponse.ok || !statusResponse.ok) {
                    throw new Error('Failed to fetch order details');
                }

                const [orderData, statusData] = await Promise.all([
                    orderResponse.json(),
                    statusResponse.json()
                ]);

                setOrder(orderData);
                setOrderStatus(statusData);
            } catch (err) {
                setError('Failed to load order details. Please try again later.');
                console.error('Error fetching order details:', err);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'var(--success-color)';
            case 'pending':
            case 'paid':
                return 'var(--warning-color)';
            case 'expired':
            case 'failed':
                return 'var(--error-color)';
            default:
                return 'var(--text-secondary)';
        }
    };

    const handleCopyAddress = (address: string) => {
        navigator.clipboard.writeText(address);
        // You could add a toast notification here
    };

    const formatDateTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleString();
    };

    if (loading) {
        return <div className="order-status-loading">Loading order details...</div>;
    }

    if (error || !order) {
        return (
            <div className="order-status-error">
                <h2>Error</h2>
                <p>{error || 'Order not found'}</p>
                <button onClick={() => navigate(-1)} className="back-button">
                    <FiArrowLeft /> Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="order-status-page">
            <div className="order-status-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <FiArrowLeft /> Back
                </button>
                <h1>Order Details</h1>
            </div>

            <div className="order-status-content">
                <div className="order-status-card">
                    <div className="order-header">
                        <div className="order-id">Order #{order.id}</div>
                        <div 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(order.status) + '20', color: getStatusColor(order.status) }}
                        >
                            {order.status}
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="payment-info">
                        <h3>Payment Information</h3>
                        <div className="payment-details">
                            <div className="payment-row">
                                <span className="label">Send EVR to:</span>
                                <div className="address-copy">
                                    <span>{order.payment_address}</span>
                                    <button 
                                        onClick={() => handleCopyAddress(order.payment_address)}
                                        className="copy-button"
                                        title="Copy address"
                                    >
                                        <FiCopy />
                                    </button>
                                </div>
                            </div>
                            {orderStatus && (
                                <>
                                    <div className="payment-row">
                                        <span className="label">Total Required:</span>
                                        <span className="value">{orderStatus.total_required} EVR</span>
                                    </div>
                                    <div className="payment-row">
                                        <span className="label">Total Paid:</span>
                                        <span className="value">{orderStatus.total_paid} EVR</span>
                                    </div>
                                    <div className="payment-row">
                                        <span className="label">Payment Status:</span>
                                        <span className="value status-text">
                                            {orderStatus.is_paid ? (
                                                <><FiCheckCircle className="status-icon success" /> Paid</>
                                            ) : (
                                                <><FiClock className="status-icon pending" /> Awaiting Payment</>
                                            )}
                                        </span>
                                    </div>
                                    {Object.entries(orderStatus.balances).map(([asset, balance]) => (
                                        <div key={asset} className="payment-row">
                                            <span className="label">{asset} Balance:</span>
                                            <span className="value">
                                                {balance.confirmed_balance} {asset}
                                                {balance.pending_balance !== "0" && (
                                                    <span className="pending-balance">
                                                        (+{balance.pending_balance} pending)
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </>
                            )}
                            <div className="payment-row">
                                <span className="label">Item Total:</span>
                                <span className="value">{order.total_price_evr} EVR</span>
                            </div>
                            <div className="payment-row">
                                <span className="label">Network Fee:</span>
                                <span className="value">{order.total_fee_evr} EVR</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="order-items">
                        <h3>Items</h3>
                        {order.items.map((item, index) => (
                            <div key={index} className="order-item">
                                <div className="item-details">
                                    <span className="item-name">{item.asset_name}</span>
                                    <span className="item-quantity">x{item.amount}</span>
                                </div>
                                <div className="item-info">
                                    <span className="item-price">{item.price_evr} EVR</span>
                                    {orderStatus?.fulfillment[item.asset_name] && (
                                        <div className="item-transfer-status">
                                            <div className="status-text">
                                                {orderStatus.fulfillment[item.asset_name].fulfilled_at ? (
                                                    <>
                                                        <FiCheckCircle className="status-icon success" />
                                                        Transferred
                                                        {orderStatus.fulfillment[item.asset_name].tx_hash && (
                                                            <button 
                                                                onClick={() => handleCopyAddress(orderStatus.fulfillment[item.asset_name].tx_hash!)}
                                                                className="copy-button"
                                                                title="Copy TX Hash"
                                                            >
                                                                <FiCopy />
                                                            </button>
                                                        )}
                                                        <div className="transfer-timestamp">
                                                            {formatDateTime(orderStatus.fulfillment[item.asset_name].fulfilled_at!)}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiClock className="status-icon pending" />
                                                        Pending Transfer
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Payout Information */}
                    {orderStatus?.payout_info && (
                        <div className="payout-info">
                            <h3>Payout Information</h3>
                            <div className="payout-details">
                                <div className="payout-row">
                                    <span className="label">Status:</span>
                                    <span className="value status-text">
                                        {orderStatus.payout_info.is_completed ? (
                                            <><FiCheckCircle className="status-icon success" /> Completed</>
                                        ) : (
                                            <><FiClock className="status-icon pending" /> Pending</>
                                        )}
                                    </span>
                                </div>
                                <div className="payout-row">
                                    <span className="label">Total Fees Paid:</span>
                                    <span className="value">{orderStatus.payout_info.total_fees_paid} EVR</span>
                                </div>
                                {orderStatus.payout_info.completed_at && (
                                    <div className="payout-row">
                                        <span className="label">Completed:</span>
                                        <span className="value">{formatDateTime(orderStatus.payout_info.completed_at)}</span>
                                    </div>
                                )}
                                {orderStatus.payout_info.last_attempt && (
                                    <div className="payout-row">
                                        <span className="label">Last Attempt:</span>
                                        <span className="value">{formatDateTime(orderStatus.payout_info.last_attempt)}</span>
                                    </div>
                                )}
                                {orderStatus.payout_info.failure_count > 0 && (
                                    <div className="payout-row">
                                        <span className="label">Failed Attempts:</span>
                                        <span className="value">{orderStatus.payout_info.failure_count}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Error Display */}
                    {order.error && (
                        <div className="order-error">
                            <h3>Error</h3>
                            <p>{order.error}</p>
                        </div>
                    )}

                    {/* Timestamps */}
                    <div className="order-timestamps">
                        <div className="timestamp">
                            <span>Created:</span>
                            <span>{formatDateTime(order.created_at)}</span>
                        </div>
                        <div className="timestamp">
                            <span>Last Updated:</span>
                            <span>{formatDateTime(order.updated_at)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderStatus; 