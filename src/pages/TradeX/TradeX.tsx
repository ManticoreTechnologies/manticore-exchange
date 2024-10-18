import React, { useEffect, useState, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
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
    const [ticker, setTicker] = useState<string | null>(null);
    const [tickerHistory, setTickerHistory] = useState<{ time: string, price: number }[]>([]);
    const wsRef = useRef<WebSocket | null>(null);
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const lineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);

    useEffect(() => {
        const connectWebSocket = () => {
            const uri = "ws://localhost:8765";
            const ws = new WebSocket(uri);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('Connected to WebSocket');
                ws.send('get_latest_ticker');
                ws.send('get_tickers');
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
                    const formattedMessage = formatFilledMessage(message);
                    setTradeLog(prevLog => [formattedMessage, ...prevLog]);
                    console.log('Order Filled:', formattedMessage);
                    ws.send('get_tickers'); // Request latest tickers after a filled order
                } else if (message.includes('Latest Ticker: ')) {
                    console.log("Made it to Ticker");
                } else if (message.includes('Tickers: ')) {
                    console.log("Made it where we looking");
                    const tickers = JSON.parse(message.split('Tickers: ')[1].trim());
                    setTickerHistory(tickers.map((ticker: any) => ({
                        time: ticker.timestamp,
                        price: ticker.price
                    })));
                }
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

    useEffect(() => {
        if (chartContainerRef.current) {
            chartRef.current = createChart(chartContainerRef.current, {
                width: chartContainerRef.current.clientWidth,
                height: 400,
                layout: {
                    backgroundColor: '#121212',
                    textColor: '#ffffff',
                },
                grid: {
                    vertLines: { color: '#2B2B43' },
                    horzLines: { color: '#363C4E' },
                },
            });

            lineSeriesRef.current = chartRef.current.addLineSeries({
                color: '#8884d8',
            });

            lineSeriesRef.current.setData(
                tickerHistory.map(ticker => ({
                    time: new Date(ticker.time).getTime() / 1000,
                    value: ticker.price,
                }))
            );
        }

        return () => {
            chartRef.current?.remove();
        };
    }, [tickerHistory]);

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
        let lowestQtyOrder = null;
        let match;
    
        // Find the order with the lowest quantity
        while ((match = regex.exec(message)) !== null) {
            const [_, type, id, price, qty] = match;
            const numericQty = parseFloat(qty);
            if (!lowestQtyOrder || numericQty < lowestQtyOrder.qty) {
                lowestQtyOrder = { type, id, price, qty: numericQty };
            }
        }
    
        // If we found an order, format it
        if (lowestQtyOrder) {
            const color = generateColor(lowestQtyOrder.id);
            return `<span style="color: ${color}">${lowestQtyOrder.type} ${lowestQtyOrder.qty} @ ${lowestQtyOrder.price}</span>`;
        }
    
        // If no match is found, return an empty string
        return '';
    };
    

    const aggregatedAsks = aggregateOrders(asks);
    const aggregatedBids = aggregateOrders(bids);

    const getBackgroundColor = (qty: number): string => {
        const maxQty = 100;
        const intensity = Math.min(qty / maxQty, 1);
        return `rgba(255, 0, 0, ${intensity})`;
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
            <div ref={chartContainerRef} className="chart-container" style={{ width: '50%', height: '400px' }}></div>
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
                                .sort(([priceA], [priceB]) => parseFloat(priceB) - parseFloat(priceA))
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
                                .sort(([priceA], [priceB]) => parseFloat(priceB) - parseFloat(priceA))
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
        </div>
    );
}

export default TradeX;
