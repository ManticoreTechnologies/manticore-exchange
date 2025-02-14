import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import TradingService, { Order, OrderStatus } from '@/Application/services/TradingService';
import { toast } from 'react-toastify';

interface OrderContextType {
    activeOrders: Order[];
    orderHistory: Order[];
    refreshOrders: () => Promise<void>;
    pollOrderStatus: (orderId: string) => void;
    stopPolling: (orderId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeOrders, setActiveOrders] = useState<Order[]>([]);
    const [orderHistory, setOrderHistory] = useState<Order[]>([]);
    const [pollingIntervals, setPollingIntervals] = useState<Record<string, ReturnType<typeof setInterval>>>({});

    const refreshOrders = useCallback(async () => {
        try {
            const [active, history] = await Promise.all([
                TradingService.getActiveOrders(),
                TradingService.getOrderHistory()
            ]);
            setActiveOrders(active);
            setOrderHistory(history);
        } catch (error) {
            console.error('Error refreshing orders:', error);
            toast.error('Failed to refresh orders');
        }
    }, []);

    const pollOrderStatus = useCallback((orderId: string) => {
        // Clear any existing polling for this order
        if (pollingIntervals[orderId]) {
            clearInterval(pollingIntervals[orderId]);
        }

        const interval = setInterval(async () => {
            try {
                const order = await TradingService.getOrder(orderId);
                
                // Update orders lists
                setActiveOrders(prev => {
                    const isActive = !['completed', 'failed', 'cancelled', 'expired'].includes(order.status);
                    if (isActive) {
                        return prev.map(o => o.id === orderId ? order : o);
                    }
                    return prev.filter(o => o.id !== orderId);
                });

                setOrderHistory(prev => {
                    const isComplete = ['completed', 'failed', 'cancelled', 'expired'].includes(order.status);
                    if (isComplete) {
                        const exists = prev.some(o => o.id === orderId);
                        return exists ? prev.map(o => o.id === orderId ? order : o) : [order, ...prev];
                    }
                    return prev;
                });

                // Stop polling if order is in a final state
                if (['completed', 'failed', 'cancelled', 'expired'].includes(order.status)) {
                    clearInterval(interval);
                    setPollingIntervals(prev => {
                        const { [orderId]: _, ...rest } = prev;
                        return rest;
                    });

                    // Show appropriate notification
                    if (order.status === 'completed') {
                        toast.success('Order completed successfully!');
                    } else if (order.status === 'failed') {
                        toast.error('Order failed to process');
                    } else if (order.status === 'cancelled') {
                        toast.info('Order was cancelled');
                    } else if (order.status === 'expired') {
                        toast.warning('Order expired');
                    }
                }
            } catch (error) {
                console.error(`Error polling order ${orderId}:`, error);
                clearInterval(interval);
                setPollingIntervals(prev => {
                    const { [orderId]: _, ...rest } = prev;
                    return rest;
                });
            }
        }, 5000);

        setPollingIntervals(prev => ({
            ...prev,
            [orderId]: interval
        }));
    }, []);

    const stopPolling = useCallback((orderId: string) => {
        if (pollingIntervals[orderId]) {
            clearInterval(pollingIntervals[orderId]);
            setPollingIntervals(prev => {
                const { [orderId]: _, ...rest } = prev;
                return rest;
            });
        }
    }, [pollingIntervals]);

    // Initial load
    useEffect(() => {
        refreshOrders();
    }, [refreshOrders]);

    // Listen for order updates from localStorage
    useEffect(() => {
        const handleOrderUpdate = (event: CustomEvent) => {
            if (event.detail?.orders) {
                const orders = event.detail.orders;
                const active = orders.filter((o: Order) => 
                    !['completed', 'failed', 'cancelled', 'expired'].includes(o.status)
                );
                const history = orders.filter((o: Order) => 
                    ['completed', 'failed', 'cancelled', 'expired'].includes(o.status)
                );
                setActiveOrders(active);
                setOrderHistory(history);
            }
        };

        window.addEventListener('orderUpdate', handleOrderUpdate as EventListener);
        return () => {
            window.removeEventListener('orderUpdate', handleOrderUpdate as EventListener);
        };
    }, []);

    // Cleanup polling intervals on unmount
    useEffect(() => {
        return () => {
            Object.values(pollingIntervals).forEach(interval => clearInterval(interval));
        };
    }, [pollingIntervals]);

    return (
        <OrderContext.Provider value={{
            activeOrders,
            orderHistory,
            refreshOrders,
            pollOrderStatus,
            stopPolling
        }}>
            {children}
        </OrderContext.Provider>
    );
};

export default OrderContext; 