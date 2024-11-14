import React, { useEffect, useState, useRef } from 'react';
import './TradeX.css';
import ChartX from './ChartX/ChartX';
import OrderBook from './OrderBook/OrderBook';
import ActiveOrders from './ActiveOrders/ActiveOrders';
import TradeLog from './TradeLog/TradeLog';
import PlaceOrder from './PlaceOrder/PlaceOrder';

interface Order {
    type: string;
    id: string;
    price: number;
    qty: number;
}

interface OHLCData {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
}

const TradeX: React.FC = () => {
    const [bids, setBids] = useState<Order[]>([]);
    const [asks, setAsks] = useState<Order[]>([]);
    const [tradeLog, setTradeLog] = useState<string[]>([]);
    const [activeOrders, setActiveOrders] = useState<Order[]>([]);
    const [userBalance, setUserBalance] = useState<string | null>(null);
    const [ohlcData, setOhlcData] = useState<OHLCData[]>([]);
    //@ts-ignore
    const [resolution, setResolution] = useState<string>("15 second");
    const [address, setAddress] = useState<string>('');
    const [nonce, setNonce] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const tickerHistoryRef = useRef<{ time: string, price: number }[]>([]);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const connectWebSocket = () => {
            const ws = new WebSocket("wss://ws.manticore.exchange");
            wsRef.current = ws;

            ws.onopen = () => {
                ws.send(`get_ohlc_data:${resolution}`);
                getNonce();
                console.log('Connected to WebSocket');
            };

            ws.onmessage = (event) => handleWebSocketMessage(event.data);
            ws.onclose = () => setTimeout(connectWebSocket, 3000);
            ws.onerror = () => console.log("Attempting to reconnect...");
        };

        connectWebSocket();

        return () => wsRef.current?.close();
    }, [resolution]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(`get_ohlc_data:${resolution}`);
            }
        }, 15000);

        return () => clearInterval(intervalId);
    }, [resolution]);

    const handleWebSocketMessage = (message: string) => {
        if (message.includes('OHLC Data')) {
            const data = JSON.parse(message.split(`OHLC Data for ${resolution}: `)[1].trim());
            setOhlcData(data);
        } else if (message.startsWith('Error: ')) {
            setError(message.split('Error: ')[1].trim());
        } else if (message.includes('Current Asks')) {
            setAsks(parseOrders(message, 'Current Asks:'));
        } else if (message.includes('Current Bids')) {
            setBids(parseOrders(message, 'Current Bids:'));
        } else if (message.includes('Filled')) {
            handleFilledMessage(message);
        } else if (message.includes('Tickers: ')) {
            updateTickerHistory(message);
        } else if (message.includes('Order ID:')) {
            const orderId = message.split('Order ID:')[1].trim();
            setActiveOrders(prev => [...prev, { type: 'buy', id: orderId, price: 0, qty: 0 }]);
        } else if (message.includes('Order cancelled:')) {
            const orderId = message.split('Order cancelled:')[1].trim();
            setActiveOrders(prev => prev.filter(order => order.id !== orderId));
        } else if (message.includes('Balance for user')) {
            setUserBalance(message);
        } else if (message.includes('Trade History:')) {
            const tradeHistory = JSON.parse(message.split('Trade History:')[1].trim());
            setTradeLog(tradeHistory);
        } else if (message.startsWith('Nonce')) {
            setNonce(message.split('Nonce: ')[1].trim());
        }
    };

    const parseOrders = (message: string, type: string): Order[] => {
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
        const regex = /Order\((buy|sell), id=([^,]+), price=(\d+\.?\d*), qty=(\d+\.?\d*), time=([^)]+), user_id=([^)]+)\)/g;
        let match;
        let count = 0;
        while ((match = regex.exec(message)) !== null) {
            if (count === 1) {
                //@ts-ignore
                const [_, type, id, price, qty, time, userId] = match;
                //@ts-ignore
                const latestTrade = { price: parseFloat(price), qty: parseFloat(qty), time, type };
                // Update trade log or other state as needed
            }
            count++;
        }
        wsRef.current?.send('get_tickers');
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

    const handlePlaceOrder = (orderType: string, orderPrice: number, orderQty: number) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            const orderMessage = `Place Order: ${orderType} ${orderQty} @ ${orderPrice} by user3`;
            wsRef.current.send(orderMessage);
            checkUserBalance('user3');
        } else {
            console.error('WebSocket is not open. Cannot send message.');
        }
    };

    const cancelOrder = (orderId: string) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            const cancelMessage = `Cancel Order: ${orderId}`;
            wsRef.current.send(cancelMessage);
        } else {
            console.error('WebSocket is not open. Cannot send message.');
        }
    };

    const checkUserBalance = (userId: string) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            const balanceMessage = `Check Balance: ${userId}`;
            wsRef.current.send(balanceMessage);
        } else {
            console.error('WebSocket is not open. Cannot send message.');
        }
    };
    //@ts-ignore
    const handleAddressInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
    };

    const handleLoginOrSignup = (evermoreAddress: string, signedMessage: string) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            const authData = JSON.stringify({ address: evermoreAddress, signature: signedMessage });
            wsRef.current.send(`Authenticate:${authData}`);
        } else {
            console.error('WebSocket is not open. Cannot send message.');
        }
    };

    const getNonce = () => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            const nonceMessage = `GetNonce: ${address}`;
            wsRef.current.send(nonceMessage);
        } else {
            console.error('WebSocket is not open. Cannot send message.');
        }
    };

    return (
        <div className="trading-grid">
            <div className="chart-container">
                <ChartX tickerHistory={tickerHistoryRef.current} ohlcData={ohlcData.slice().reverse()} />
            </div>
            <div className="orderbook-container">
                <OrderBook 
                    aggregatedAsks={aggregateOrders(asks)} 
                    aggregatedBids={aggregateOrders(bids)} 
                    getBackgroundColor={getBackgroundColor} 
                    lastTradedPrice={0}
                />
            </div>
            <div className="place-order-container">
                <PlaceOrder 
                    onPlaceOrder={handlePlaceOrder} 
                    getNonce={getNonce}
                    nonce={nonce}
                    onLoginOrSignup={handleLoginOrSignup} 
                    error={error}
                    appendError={setError} 
                />
                <div>
                    {userBalance && <p>{userBalance}</p>}
                </div>
            </div>
            <div className="active-orders-container">
                <ActiveOrders activeOrders={activeOrders} cancelOrder={cancelOrder} />
            </div>
            <div className="trade-log-container">  
                <TradeLog tradeLog={tradeLog as any[]} />
            </div>                
        </div>
    );
};

const aggregateOrders = (orders: Order[]): { [price: number]: number } =>
    orders.reduce((acc, order) => {
        acc[order.price] = (acc[order.price] || 0) + order.qty;
        return acc;
    }, {} as { [price: number]: number });

const getBackgroundColor = (qty: number): string => {
    const maxQty = 100;
    const intensity = Math.min(qty / maxQty, 1);
    return `rgba(255, 0, 0, ${intensity})`;
};

export default TradeX;
