import React, { useEffect, useState, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
import './TradeX.css';

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
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const lineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
    const [activeOrders, setActiveOrders] = useState<Order[]>([]);

    useEffect(() => {
        const connectWebSocket = () => {
            const ws = new WebSocket("ws://localhost:8765");
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('Connected to WebSocket');
                ws.send('get_tickers');
            };

            ws.onmessage = (event) => {
                const message = event.data;
                if (message.includes('Current Asks')) {
                    setAsks(parseOrders(message, 'Current Asks:'));
                } else if (message.includes('Current Bids')) {
                    setBids(parseOrders(message, 'Current Bids:'));
                } else if (message.includes('Filled')) {
                    handleFilledMessage(message);
                } else if (message.includes('Tickers: ')) {
                    updateTickerHistory(message);
                }
            };

            ws.onclose = () => {
                console.log('Disconnected from WebSocket');
                setTimeout(connectWebSocket, 3000);
            };

            ws.onerror = (error) => {
                console.error('WebSocket error: ', error);
            };
        };

        connectWebSocket();

        return () => wsRef.current?.close();
    }, []);

    useEffect(() => {
        if (chartContainerRef.current) {
            chartRef.current = createChart(chartContainerRef.current, {
                width: chartContainerRef.current.clientWidth,
                height: 400,
                layout: { backgroundColor: '#121212', textColor: '#ffffff' },
                grid: { vertLines: { color: '#2B2B43' }, horzLines: { color: '#363C4E' } },
            });

            lineSeriesRef.current = chartRef.current.addLineSeries({ color: '#8884d8' });
            lineSeriesRef.current.setData(
                tickerHistoryRef.current.map(ticker => ({
                    time: new Date(ticker.time).getTime() / 1000,
                    value: ticker.price,
                }))
            );
        }

        return () => chartRef.current?.remove();
    }, [tickerHistoryRef.current]);

    const parseOrders = (message: string, type: string) =>
        JSON.parse(message.split(type)[1]).map((order: any) => ({
            type: type.includes('Asks') ? 'sell' : 'buy',
            id: order[0],
            price: order[1],
            qty: order[2]
        }));

    const handleFilledMessage = (message: string) => {
        const formattedMessage = formatFilledMessage(message);
        setTradeLog(prevLog => [formattedMessage, ...prevLog]);
        console.log('Order Filled:', formattedMessage);
        wsRef.current?.send('get_tickers');
    };

    const updateTickerHistory = (message: string) => {
        const tickers = JSON.parse(message.split('Tickers: ')[1].trim());
        tickerHistoryRef.current = tickers.map((ticker: any) => ({
            time: ticker.timestamp,
            price: ticker.price
        }));
    };

    const formatFilledMessage = (message: string): string => {
        const regex = /Order\((buy|sell), id=([^,]+), price=(\d+\.?\d*), qty=(\d+)\)/g;
        let match;
        const formattedOrders = [];

        while ((match = regex.exec(message)) !== null) {
            const [_, type, id, price, qty] = match;
            const color = generateColor(id);
            formattedOrders.push(`<span style="color: ${color}">${type} ${qty} @ ${price}</span>`);
        }

        return formattedOrders.join('<br/>');
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

    const handlePlaceOrder = () => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            const orderMessage = `Place Order: ${orderType} ${orderQty} @ ${orderPrice}`;
            wsRef.current.send(orderMessage);
            console.log('Order Placed:', orderMessage);
            setActiveOrders(prevOrders => [
                ...prevOrders,
                { type: orderType, id: Date.now().toString(), price: orderPrice, qty: orderQty }
            ]);
        } else {
            console.error('WebSocket is not open. Cannot send message.');
        }
    };

    const aggregatedAsks = aggregateOrders(asks);
    const aggregatedBids = aggregateOrders(bids);

    return (
        <div className="orderbook-container">
            <div ref={chartContainerRef} className="chart-container"></div>
            <div className="order-form">
                <h3>Place Order</h3>
                <form onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }}>
                    <label>
                        Order Type:
                        <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                            <option value="buy">Buy</option>
                            <option value="sell">Sell</option>
                        </select>
                    </label>
                    <label>
                        Price:
                        <input type="number" value={orderPrice} onChange={(e) => setOrderPrice(parseFloat(e.target.value))} />
                    </label>
                    <label>
                        Quantity:
                        <input type="number" value={orderQty} onChange={(e) => setOrderQty(parseFloat(e.target.value))} />
                    </label>
                    <button type="submit">Place Order</button>
                </form>
            </div>
            <TradeLog tradeLog={tradeLog} />
            <div className="orderbook">
                <OrderTable title="Asks" orders={aggregatedAsks} getBackgroundColor={getBackgroundColor} />
                <OrderTable title="Bids" orders={aggregatedBids} getBackgroundColor={getBackgroundColor} />
            </div>
            <ActiveOrders activeOrders={activeOrders} />
        </div>
    );
}

const OrderTable: React.FC<{ title: string, orders: { [price: number]: number }, getBackgroundColor: (qty: number) => string }> = ({ title, orders, getBackgroundColor }) => (
    <div className={title.toLowerCase()}>
        <table>
            <thead>
                <tr>
                    <th>Price</th>
                    <th>Quantity</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(orders)
                    .sort(([priceA], [priceB]) => parseFloat(priceB) - parseFloat(priceA))
                    .map(([price, qty]) => (
                        <tr key={price} style={{ backgroundColor: getBackgroundColor(qty) }}>
                            <td>{parseFloat(price).toFixed(8)}</td>
                            <td>{qty}</td>
                        </tr>
                    ))}
            </tbody>
        </table>
    </div>
);

const TradeLog: React.FC<{ tradeLog: string[] }> = ({ tradeLog }) => (
    <div className="trade-log">
        <h3>Trade Log</h3>
        <ul>
            {tradeLog.map((trade, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: trade }} />
            ))}
        </ul>
    </div>
);

const ActiveOrders: React.FC<{ activeOrders: Order[] }> = ({ activeOrders }) => (
    <div className="active-orders">
        <h3>Active Orders</h3>
        <ul>
            {activeOrders.map((order, index) => (
                <li key={index}>
                    {order.type} {order.qty} @ {order.price}
                </li>
            ))}
        </ul>
    </div>
);

export default TradeX;
