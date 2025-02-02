import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiX, FiChevronRight, FiMaximize2 } from 'react-icons/fi';
import Cookies from 'js-cookie';
import './OrderToaster.css';

interface Order {
    id: string;
    status: string;
    payment_address?: string;
    error?: string;
}

const OrderToaster: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
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
                        const updatedOrders = await Promise.all(
                            validOrders.map(async (order) => {
                                try {
                                    const response = await fetch(`${trading_api_url}/orders/${order.id}`);
                                    if (!response.ok) {
                                        console.error(`Failed to fetch status for order ${order.id}`);
                                        return order; // Keep existing order data on error
                                    }
                                    return await response.json();
                                } catch (error) {
                                    console.error(`Error fetching order ${order.id}:`, error);
                                    return order; // Keep existing order data on error
                                }
                            })
                        );

                        // Filter out completed/failed orders after 1 hour
                        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
                        const activeOrders = updatedOrders.filter(order => {
                            const isActive = order.status.toLowerCase() === 'pending';
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
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="order-item"
                        onClick={() => handleOrderClick(order.id)}
                    >
                        <div className="order-info">
                            <div className="order-id">Order #{order.id.slice(-6)}</div>
                                <div 
                                    className="order-status"
                                    style={{ color: getStatusColor(order.status) }}
                                >
                                    {order.status}
                            </div>
                        </div>
                        <FiChevronRight className="view-order-icon" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderToaster; 