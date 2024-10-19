import React, { useEffect, useState, useRef } from 'react';
import './TradeX.css';
import ChartX from './ChartX/ChartX'; // Import the new ChartX component
import OrderBook from './OrderBook/OrderBook'; // Import the new OrderBook component
import ActiveOrders from './ActiveOrders/ActiveOrders'; // Import the new ActiveOrders component
import TradeLog from './TradeLog/TradeLog'; // Import the new TradeLog component
import PlaceOrder from './PlaceOrder/PlaceOrder'; // Import the new PlaceOrder component

interface Order {
    type: string;
    id: string;
    price: number;
    qty: number;
}

const aggregateOrders = (orders: Order[]): { [price: number]: number } =>
    orders.reduce((acc, order) => {
        acc[order.price] = (acc[order.price] || 0) + order.qty;
        return acc;
    }, {} as { [price: number]: number });

const TradeX: React.FC = () => {
    const [bids, setBids] = useState<Order[]>([]);
    const [asks, setAsks] = useState<Order[]>([]);
    const [tradeLog, setTradeLog] = useState<string[]>([]);
    const [orderType, setOrderType] = useState<string>('buy');
    const [orderPrice, setOrderPrice] = useState<number>(0);
    const [orderQty, setOrderQty] = useState<number>(0);
    const tickerHistoryRef = useRef<{ time: string, price: number }[]>([]);
    const wsRef = useRef<WebSocket | null>(null);
    const [activeOrders, setActiveOrders] = useState<Order[]>([]);

    useEffect(() => {
        const connectWebSocket = () => {
            try {
                const ws = new WebSocket("ws://localhost:8765");
                wsRef.current = ws;
    
                ws.onopen = () => {
                    console.log('Connected to WebSocket');
                    ws.send('get_tickers'); // Initial request after connection
                };
    
                ws.onmessage = (event) => {
                    try {
                        const message = event.data;
    
                        // Handle different messages
                        if (message.includes('Current Asks')) {
                            setAsks(parseOrders(message, 'Current Asks:'));
                        } else if (message.includes('Current Bids')) {
                            setBids(parseOrders(message, 'Current Bids:'));
                        } else if (message.includes('Filled')) {
                            handleFilledMessage(message);
                        } else if (message.includes('Tickers: ')) {
                            updateTickerHistory(message);
                        } else if (message.includes('Order cancelled:')) {
                            const orderId = message.split('Order cancelled:')[1].trim();
                            setActiveOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
                            console.log(`Order ${orderId} removed from active orders.`);
                        }
                    } catch (error) {
                        console.error('Error processing WebSocket message:', error);
                    }
                };
    
                ws.onclose = (event) => {
                    console.log(`WebSocket closed. Code: ${event.code}, Reason: ${event.reason}`);
                    console.log("Reconnecting in 3 seconds...");
                    setTimeout(connectWebSocket, 3000); // Reconnect after a delay
                };
    
                ws.onerror = (event) => {
                    console.error('WebSocket encountered an error:', event);
                    console.log("Attempting to reconnect...");
                    // Optional: you could add additional retry logic here if needed
                };
    
            } catch (error) {
                console.error('Failed to establish WebSocket connection:', error);
            }
        };
    
        connectWebSocket();
    
        // Close WebSocket when component unmounts
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    const parseOrders = (message: string, type: string) => {
        try {
            return JSON.parse(message.split(type)[1]).map((order: any) => ({
                type: type.includes('Asks') ? 'sell' : 'buy',
                id: order[0],
                price: order[1],
                qty: order[2]
            }));
        } catch (error) {
            console.error(`Error parsing ${type} orders:`, error);
            return [];
        }
    };

    const handleFilledMessage = (message: string) => {
        try {
            console.log('Filled: ', message);
            const formattedMessage = formatFilledMessage(message);

            // Extract times and messages from the formatted message
            const regex = /<span style="color: [^>]+">[^<]+ at (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d+)<\/span>/g;
            let match;
            let latestTime = 0;
            let latestOrder = '';

            while ((match = regex.exec(formattedMessage)) !== null) {
                const time = new Date(match[1]).getTime();
                if (time > latestTime) {
                    latestTime = time;
                    latestOrder = match[0];
                }
            }

            // Add the latest order to the trade log
            setTradeLog(prevLog => [latestOrder, ...prevLog]);

            console.log('Filled: ', latestOrder);
            wsRef.current?.send('get_tickers');
        } catch (error) {
            console.error('Error handling filled order message:', error);
        }
    };

    const updateTickerHistory = (message: string) => {
        try {
            const tickers = JSON.parse(message.split('Tickers: ')[1].trim());
            tickerHistoryRef.current = tickers.map((ticker: any) => ({
                time: ticker.timestamp,
                price: ticker.price
            }));
        } catch (error) {
            console.error('Error updating ticker history:', error);
        }
    };
    const formatFilledMessage = (message: string): string => {
        try {
            const regex = /Order\((buy|sell), id=([^,]+), price=(\d+\.?\d*), qty=(\d+), time=([^)]+)\)/g;
            let match;
            const formattedOrders = [];

            while ((match = regex.exec(message)) !== null) {
                const [_, type, id, price, qty, time] = match;
                const color = generateColor(id);
                formattedOrders.push(`<span style="color: ${color}">${type} ${qty} @ ${price} at ${time}</span>`);
            }

            return formattedOrders.join('<br/>');
        } catch (error) {
            console.error('Error formatting filled message:', error);
            return 'Error formatting message';
        }
    };

    const generateColor = (id: string): string => {
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash = id.charCodeAt(i) + ((hash << 5) - hash);
        }
        return `hsl(${hash % 360}, 70%, 50%)`;
    };

    const getBackgroundColor = (qty: number): string => {
        const maxQty = 100;
        const intensity = Math.min(qty / maxQty, 1);
        return `rgba(255, 0, 0, ${intensity})`;
    };

    const handlePlaceOrder = (orderType: string, orderPrice: number, orderQty: number) => {
        try {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                const orderMessage = `Place Order: ${orderType} ${orderQty} @ ${orderPrice}`;
                wsRef.current.send(orderMessage);
                console.log('Order Placed:', orderMessage);

                // Ensure the onmessage handler is set up to handle ticker updates
                wsRef.current.onmessage = (event) => {
                    try {
                        const message = event.data;
                        console.log('WebSocket Message Received:', message); // Debugging log

                        if (message.includes('Order ID:')) {
                            const orderId = message.split('Order ID:')[1].trim();
                            setActiveOrders(prevOrders => [
                                ...prevOrders,
                                { type: orderType, id: orderId, price: orderPrice, qty: orderQty }
                            ]);
                        } else if (message.includes('Tickers: ')) {
                            updateTickerHistory(message);
                        }
                    } catch (error) {
                        console.error('Error handling order response:', error);
                    }
                };
            } else {
                console.error('WebSocket is not open. Cannot send message.');
            }
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    const cancelOrder = (orderId: string) => {
        try {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                const cancelMessage = `Cancel Order: ${orderId}`;
                wsRef.current.send(cancelMessage);
                console.log('Order Cancelled:', cancelMessage);

                wsRef.current.onmessage = (event) => {
                    try {
                        const message = event.data;
                        if (message.includes(`Cancelled Order ID: ${orderId}`)) {
                            setActiveOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
                            console.log(`Order ${orderId} removed from active orders.`);
                        }
                    } catch (error) {
                        console.error('Error handling cancel order response:', error);
                    }
                };
            } else {
                console.error('WebSocket is not open. Cannot send message.');
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    };

    const aggregatedAsks = aggregateOrders(asks);
    const aggregatedBids = aggregateOrders(bids);

    return (
        <div className="trading-grid">
            <div className="chart-container">
                <ChartX tickerHistory={tickerHistoryRef.current} />
            </div>
            <div className="orderbook-container">
                <OrderBook 
                    aggregatedAsks={aggregatedAsks} 
                    aggregatedBids={aggregatedBids} 
                    getBackgroundColor={getBackgroundColor} 
                />
            </div>
            <div className="place-order-container">
                <PlaceOrder onPlaceOrder={handlePlaceOrder} />
            </div>
            <div className="trade-log-container">  
                <TradeLog tradeLog={tradeLog} />
            </div>
            <div className="active-orders-container">
                <ActiveOrders activeOrders={activeOrders} cancelOrder={cancelOrder} />
            </div>
        </div>
    );
};

export default TradeX;
