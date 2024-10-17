import React, { useEffect, useState, useRef } from 'react';
import './TradeX.css';

interface Order {
    type: string;
    id: string;
    price: number;
    qty: number;
}

const aggregateOrders = (orders: Order[]): { [price: number]: number } => {
    return orders.reduce((acc, order) => {
        if (acc[order.price]) {
            acc[order.price] += order.qty;
        } else {
            acc[order.price] = order.qty;
        }
        return acc;
    }, {} as { [price: number]: number });
};

const TradeX: React.FC = () => {
    const [bids, setBids] = useState<Order[]>([]);
    const [asks, setAsks] = useState<Order[]>([]);
    const [tradeLog, setTradeLog] = useState<string[]>([]);
    const [orderType, setOrderType] = useState<string>('buy');
    const [orderPrice, setOrderPrice] = useState<number>(0);
    const [orderQty, setOrderQty] = useState<number>(0);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const connectWebSocket = () => {
            const uri = "ws://localhost:8765";
            const ws = new WebSocket(uri);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('Connected to WebSocket');
            };

            ws.onmessage = (event) => {
                const message = event.data;
                
                if (message.includes('Current Asks')) {
                    setAsks(JSON.parse(event.data.split('Current Asks:')[1]).map((order: any) => ({
                        type: 'sell',
                        id: order[0],
                        price: order[1],
                        qty: order[2]
                    })));
                } else if (message.includes('Current Bids')) {
                    setBids(JSON.parse(event.data.split('Current Bids:')[1]).map((order: any) => ({
                        type: 'buy',
                        id: order[0],
                        price: order[1],
                        qty: order[2]
                    })));
                } else if (message.includes('Filled')) {
                    // Parse and format the filled order message
                    const formattedMessage = formatFilledMessage(message);
                    setTradeLog(prevLog => [formattedMessage, ...prevLog]);
                    console.log('Order Filled:', formattedMessage);
                }
                // Ignore other messages
            };

            ws.onclose = () => {
                console.log('Disconnected from WebSocket');
            };

            ws.onerror = (error) => {
                console.error('WebSocket error: ', error);
            };
        };

        connectWebSocket();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    const generateColor = (id: string): string => {
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash = id.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = `hsl(${hash % 360}, 70%, 50%)`;
        return color;
    };

    const formatFilledMessage = (message: string): string => {
        const regex = /Order\((buy|sell), id=([^,]+), price=(\d+\.?\d*), qty=(\d+)\)/g;
        const orders = [];
        let match;
        while ((match = regex.exec(message)) !== null) {
            const [_, type, id, price, qty] = match;
            const color = generateColor(id);
            orders.push(
                `<span style="color: ${color}">${type} ${qty} @ ${price}</span>`
            );
        }
        return orders.join(' | ');
    };

    const aggregatedAsks = aggregateOrders(asks);
    const aggregatedBids = aggregateOrders(bids);

    const getBackgroundColor = (qty: number): string => {
        const maxQty = 100; // Adjust this value based on your data
        const intensity = Math.min(qty / maxQty, 1);
        return `rgba(255, 0, 0, ${intensity})`; // Red color with variable opacity
    };

    const handlePlaceOrder = () => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            const orderMessage = `Place Order: ${orderType} ${orderQty} @ ${orderPrice}`;
            wsRef.current.send(orderMessage);
            console.log('Order Placed:', orderMessage);
        } else {
            console.error('WebSocket is not open. Cannot send message.');
        }
    };

    return (
        <div className="orderbook-container">
            <div className="orderbook">
                <div className="asks">
                    <table>
                        <thead>
                            <tr>
                                <th>Price</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(aggregatedAsks)
                                .sort(([priceA], [priceB]) => parseFloat(priceB) - parseFloat(priceA)) // Sort asks in descending order
                                .map(([price, qty]) => (
                                    <tr key={price} style={{ backgroundColor: getBackgroundColor(qty) }}>
                                        <td>{price}</td>
                                        <td>{qty}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                <div className="bids">
                    <table>
                        <thead>
                            <tr>
                                <th>Price</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(aggregatedBids)
                                .sort(([priceA], [priceB]) => parseFloat(priceB) - parseFloat(priceA)) // Sort bids in descending order
                                .map(([price, qty]) => (
                                    <tr key={price} style={{ backgroundColor: getBackgroundColor(qty) }}>
                                        <td>{price}</td>
                                        <td>{qty}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="trade-log">
                <h3>Trade Log</h3>
                <ul>
                    {tradeLog.map((trade, index) => (
                        <li key={index} dangerouslySetInnerHTML={{ __html: trade }} />
                    ))}
                </ul>
            </div>
            <div className="order-form">
                <h3>Place Order</h3>
                <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                </select>
                <input
                    type="number"
                    placeholder="Price"
                    value={orderPrice}
                    onChange={(e) => setOrderPrice(parseFloat(e.target.value))}
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={orderQty}
                    onChange={(e) => setOrderQty(parseInt(e.target.value))}
                />
                <button onClick={handlePlaceOrder}>Place Order</button>
            </div>
        </div>
    );
}

export default TradeX;
