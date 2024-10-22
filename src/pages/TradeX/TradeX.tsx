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
    const [userBalance, setUserBalance] = useState<string | null>(null);

    useEffect(() => {
        const connectWebSocket = () => {
            try {
                const ws = new WebSocket("ws://localhost:8765");
                wsRef.current = ws;

                ws.onopen = () => {
                    console.log('Connected to WebSocket');
                    ws.send('get_tickers'); // Initial request after connection
                    ws.send('get_trade_history'); // Request trade history
                    checkUserBalance('user3'); // Check balance on page load
                };

                ws.onmessage = (event) => {
                    handleWebSocketMessage(event.data);
                };

                ws.onclose = (event) => {
                    console.log(`WebSocket closed. Code: ${event.code}, Reason: ${event.reason}`);
                    console.log("Reconnecting in 3 seconds...");
                    setTimeout(connectWebSocket, 3000); // Reconnect after a delay
                };

                ws.onerror = (event) => {
                    console.error('WebSocket encountered an error:', event);
                    console.log("Attempting to reconnect...");
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

    useEffect(() => {
        const intervalId = setInterval(() => {
            checkUserBalance('user3');
        }, 10000); // 10 seconds

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
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

    const handleWebSocketMessage = (message: string) => {
        try {
            console.log(message);
            if (message.includes('Current Asks')) {
                setAsks(parseOrders(message, 'Current Asks:'));
            } else if (message.includes('Current Bids')) {
                setBids(parseOrders(message, 'Current Bids:'));
            } else if (message.includes('Filled')) {
                handleFilledMessage(message);
            } else if (message.includes('Tickers: ')) {
                updateTickerHistory(message);
            } else if (message.includes('Order ID:')) {
                const orderId = message.split('Order ID:')[1].trim();
                setActiveOrders(prevOrders => [
                    ...prevOrders,
                    { type: orderType, id: orderId, price: orderPrice, qty: orderQty }
                ]);
            } else if (message.includes('Order cancelled:')) {
                const orderId = message.split('Order cancelled:')[1].trim();
                setActiveOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
                console.log(`Order ${orderId} removed from active orders.`);
            } else if (message.includes('Cancel Order:')) {
                const orderId = message.split('Cancel Order:')[1].trim();
                setActiveOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
            } else if (message.includes('Balance for user')) {
                setUserBalance(message);
            } else if (message.includes('Trade History:')) {
                const tradeHistory = JSON.parse(message.split('Trade History:')[1].trim());
                setTradeLog(tradeHistory);
            }
        } catch (error) {
            console.error('Error processing WebSocket message:', error);
        }
    };

    const handleFilledMessage = (message: string) => {
        try {
            // [Order(buy, id=edc1adfb-2ac7-400a-89a2-c79045347c9c, price=99.0, qty=1, time=2024-10-22 10:40:43.488161, user_id=user1), Order(sell, id=b8190051-106c-4f3d-8a88-e7cc65927de3, price=95, qty=5, time=2024-10-22 10:55:52.730407, user_id=user2)]
            // use the second order in the message
            const regex = /Order\((buy|sell), id=([^,]+), price=(\d+\.?\d*), qty=(\d+\.?\d*), time=([^)]+), user_id=([^)]+)\)/g;
            let match;
            let secondMatch = null;
            let count = 0;
            while ((match = regex.exec(message)) !== null) {
                if (count === 1) {
                    secondMatch = match;
                    break;
                }
                count++;
            }
            if (secondMatch) {
                const [_, type, id, price, qty, time, userId] = secondMatch;
                const tradeTime = new Date(time).getTime();
                const latestTrade = { price: parseFloat(price), qty: parseFloat(qty), time, type };
                //setTradeLog(prevLog => [latestTrade, ...prevLog]);
            }

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
            // Adjusted regex to handle the message format with square brackets
            const regex = /Order\((buy|sell), id=([^,]+), price=(\d+\.?\d*), qty=(\d+\.?\d*), time=([^)]+), user_id=([^)]+)\)/g;
            let match;
            const formattedOrders = [];

            while ((match = regex.exec(message)) !== null) {
                const [_, type, id, price, qty, time, userId] = match;
                const color = type === 'buy' ? 'green' : 'red'; // Use green for buy, red for sell
                formattedOrders.push(
                    `<tr>
                        <td style="color: ${color}">${price}</td>
                        <td>${qty}</td>
                        <td>${new Date(time).toLocaleTimeString()}</td>
                    </tr>`
                );
            }

            return `<table>${formattedOrders.join('')}</table>`;
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
                const orderMessage = `Place Order: ${orderType} ${orderQty} @ ${orderPrice} by user3`;
                wsRef.current.send(orderMessage);
                checkUserBalance('user3'); // Check balance after placing an order
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
            } else {
                console.error('WebSocket is not open. Cannot send message.');
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    };

    const checkUserBalance = (userId: string) => {
        try {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                const balanceMessage = `Check Balance: ${userId}`;
                wsRef.current.send(balanceMessage);
            } else {
                console.error('WebSocket is not open. Cannot send message.');
            }
        } catch (error) {
            console.error('Error checking user balance:', error);
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
                <div>
                    {userBalance && <p>{userBalance}</p>}
                </div>
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
