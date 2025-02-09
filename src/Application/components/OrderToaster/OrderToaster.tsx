import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiX, FiChevronRight, FiCheckCircle, FiAlertCircle, FiClock } from 'react-icons/fi';
import Cookies from 'js-cookie';
import './OrderToaster.css';

interface OrderItem {
    listing_id: string;
    listing_name: string;
    seller_address: string;
    asset_name: string;
    amount: string;
    price_evr: string;
    fee_evr: string;
}

interface Order {
    id: string;
    buyer_address: string;
    payment_address: string;
    status: string;
    total_price_evr: string;
    total_fee_evr: string;
    total_payment_evr: string;
    items: OrderItem[];
    created_at: string | null;
    updated_at: string | null;
    error?: string;
}

interface OrderStatus {
    order_id: string;
    order_type: 'regular' | 'cart';
    status: string;
    total_required: string;
    total_paid: string;
    is_paid: boolean;
    balances: Record<string, {
        confirmed_balance: string;
        unconfirmed_balance: string;
    }>;
    payout_info: {
        is_completed: boolean;
        failure_count: number;
        last_attempt: string | null;
        completed_at: string | null;
        total_fees_paid: string;
    };
    fulfillment: Record<string, {
        amount: string;
        fulfilled_at: string | null;
        tx_hash: string | null;
    }>;
}

const OrderToaster: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderStatuses, setOrderStatuses] = useState<Record<string, OrderStatus>>({});
    const navigate = useNavigate();

    const trading_api_url = `${import.meta.env.VITE_TRADING_API_PROTO || 'https'}://${import.meta.env.VITE_TRADING_API_HOST || 'api.manticore.exchange'}:8000`;

    useEffect(() => {
        const loadOrders = async () => {
            const existingOrders = Cookies.get('manticore_orders');
            if (existingOrders) {
                try {
                    const parsedOrders = JSON.parse(existingOrders);
                    if (Array.isArray(parsedOrders)) {
                        const validOrders = parsedOrders.filter(order => 
                            order && order.id && order.status
                        );

                        // Fetch latest status for each order
                        const updatedStatuses = await Promise.all(
                            validOrders.map(async (order) => {
                                try {
                                    const response = await fetch(`${trading_api_url}/orders/${order.id}/status`);
                                    if (!response.ok) {
                                        if (response.status === 404) {
                                            return null; // Order not found
                                        }
                                        console.error(`Failed to fetch status for order ${order.id}`);
                                        return null;
                                    }
                                    const status = await response.json();
                                    return { orderId: order.id, status };
                                } catch (error) {
                                    console.error(`Error fetching order ${order.id}:`, error);
                                    return null;
                                }
                            })
                        );

                        // Update order statuses
                        const newOrderStatuses = { ...orderStatuses };
                        updatedStatuses.forEach(update => {
                            if (update) {
                                newOrderStatuses[update.orderId] = update.status;
                            }
                        });
                        setOrderStatuses(newOrderStatuses);

                        // Filter out completed/failed orders after 1 hour
                        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
                        const activeOrders = validOrders.filter(order => {
                            const status = newOrderStatuses[order.id];
                            const isActive = status && status.status.toLowerCase() === 'pending';
                            const isRecent = !order.updated_at || new Date(order.updated_at) > oneHourAgo;
                            return isActive || isRecent;
                        });
                        
                        setOrders(activeOrders);
                        
                        // Update cookies with latest order data
                        if (activeOrders.length === 0) {
                            Cookies.remove('manticore_orders');
                        } else {
                            Cookies.set('manticore_orders', JSON.stringify(activeOrders));
                        }
                    }
                } catch (error) {
                    console.error('Error parsing orders:', error);
                    Cookies.remove('manticore_orders');
                    setOrders([]);
                }
            } else {
                setOrders([]);
            }
        };

        loadOrders();
        // Poll for updates every 30 seconds
        const interval = setInterval(loadOrders, 30000);
        return () => clearInterval(interval);
    }, [trading_api_url]);

    const handleOrderClick = (orderId: string) => {
        navigate(`/orders/${orderId}`);
        setIsExpanded(false);
    };

    const getStatusIcon = (orderId: string) => {
        const status = orderStatuses[orderId]?.status.toLowerCase();
        switch (status) {
            case 'complete':
                return <FiCheckCircle className="status-icon success" />;
            case 'failed':
                return <FiAlertCircle className="status-icon error" />;
            case 'pending':
                return <FiClock className="status-icon pending" />;
            default:
                return <FiClock className="status-icon" />;
        }
    };

    const getStatusColor = (orderId: string) => {
        const status = orderStatuses[orderId]?.status.toLowerCase();
        switch (status) {
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

    const getPaymentProgress = (orderId: string) => {
        const status = orderStatuses[orderId];
        if (!status) return 0;
        
        const total = parseFloat(status.total_required);
        const paid = parseFloat(status.total_paid);
        return total > 0 ? (paid / total) * 100 : 0;
    };

    if (orders.length === 0) return null;

    return !isExpanded ? (
        <div 
            className="minimized-toaster"
            onClick={() => setIsExpanded(true)}
        >
            <div className="toaster-icon-container">
                <FiShoppingBag className="toaster-icon" />
                <span className="order-count-badge">{orders.length}</span>
            </div>
        </div>
    ) : (
        <div className="order-toaster">
            <div className="order-toaster-header">
                <div className="order-toaster-title">
                    <div className="toaster-icon-container">
                        <FiShoppingBag className="toaster-icon" />
                        <span className="order-count-badge">{orders.length}</span>
                    </div>
                    <div className="toaster-content">
                        <div className="toaster-title">Active Orders</div>
                        <div className="toaster-message">
                            Click to view details
                        </div>
                    </div>
                </div>
                <div className="toaster-actions">
                    <button 
                        className="close-toaster"
                        onClick={() => setIsExpanded(false)}
                    >
                        <FiX />
                    </button>
                </div>
            </div>

            <div className="order-list">
                {orders.map((order) => {
                    const status = orderStatuses[order.id];
                    const progress = getPaymentProgress(order.id);
                    
                    return (
                        <div
                            key={order.id}
                            className="order-item"
                            onClick={() => handleOrderClick(order.id)}
                        >
                            <div className="order-info">
                                <div className="order-id">
                                    {getStatusIcon(order.id)}
                                    Order #{order.id.slice(-6)}
                                </div>
                                <div 
                                    className="order-status"
                                    style={{ color: getStatusColor(order.id) }}
                                >
                                    {status?.status || order.status}
                                    {status && !status.is_paid && (
                                        <span className="payment-progress">
                                            ({Math.round(progress)}% paid)
                                        </span>
                                    )}
                                </div>
                                {status && status.is_paid && !status.payout_info.is_completed && (
                                    <div className="payout-status">Processing payout...</div>
                                )}
                            </div>
                            <FiChevronRight className="view-order-icon" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderToaster; 