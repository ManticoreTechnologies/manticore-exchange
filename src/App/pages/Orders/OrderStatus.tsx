import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCopy } from 'react-icons/fi';
import './OrderStatus.css';

interface OrderDetails {
    id: string;
    status: string;
    payment_address?: string;
    error?: string;
    items?: Array<{
        asset_name: string;
        amount: number;
    }>;
    created_at?: string;
    updated_at?: string;
}

const OrderStatus: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const trading_api_url = `${import.meta.env.VITE_TRADING_API_PROTO || 'https'}://${import.meta.env.VITE_TRADING_API_HOST || 'api.manticore.exchange'}:8000`;

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await fetch(`${trading_api_url}/orders/${orderId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch order details');
                }
                const data = await response.json();
                setOrder(data);
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
            case 'complete':
                return 'var(--success-color)';
            case 'pending':
                return 'var(--warning-color)';
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

                    {order.payment_address && (
                        <div className="payment-info">
                            <h3>Payment Address</h3>
                            <div className="address-copy">
                                <span>{order.payment_address}</span>
                                <button 
                                    onClick={() => handleCopyAddress(order.payment_address!)}
                                    className="copy-button"
                                >
                                    <FiCopy />
                                </button>
                            </div>
                        </div>
                    )}

                    {order.items && order.items.length > 0 && (
                        <div className="order-items">
                            <h3>Items</h3>
                            {order.items.map((item, index) => (
                                <div key={index} className="order-item">
                                    <span>{item.asset_name}</span>
                                    <span>x{item.amount}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {order.error && (
                        <div className="order-error">
                            <h3>Error</h3>
                            <p>{order.error}</p>
                        </div>
                    )}

                    <div className="order-timestamps">
                        {order.created_at && (
                            <div className="timestamp">
                                <span>Created:</span>
                                <span>{new Date(order.created_at).toLocaleString()}</span>
                            </div>
                        )}
                        {order.updated_at && (
                            <div className="timestamp">
                                <span>Last Updated:</span>
                                <span>{new Date(order.updated_at).toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderStatus; 