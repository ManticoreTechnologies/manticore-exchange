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

    useEffect(() => {
        const loadOrders = () => {
            const existingOrders = Cookies.get('manticore_orders');
            if (existingOrders) {
                try {
                    const parsedOrders = JSON.parse(existingOrders);
                    if (Array.isArray(parsedOrders)) {
                        const validOrders = parsedOrders.filter(order => 
                            order && order.id && order.status
                        );
                        setOrders(validOrders);
                        
                        if (validOrders.length === 0) {
                            Cookies.remove('manticore_orders');
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
        const interval = setInterval(loadOrders, 60000);
        return () => clearInterval(interval);
    }, []);

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