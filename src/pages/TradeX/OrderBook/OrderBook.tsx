import React, { useState, useEffect } from 'react';
import './OrderBook.css';

interface OrderBookProps {
    aggregatedAsks: { [price: number]: number };
    aggregatedBids: { [price: number]: number };
    getBackgroundColor: (qty: number) => string;
    lastTradedPrice: number;
}

const OrderBook: React.FC<OrderBookProps> = ({ aggregatedAsks, aggregatedBids, getBackgroundColor, lastTradedPrice = 0 }) => {
    const [asks, setAsks] = useState(aggregatedAsks);
    const [bids, setBids] = useState(aggregatedBids);

    useEffect(() => {
        setAsks(aggregatedAsks);
        setBids(aggregatedBids);
    }, [aggregatedAsks, aggregatedBids]);

    const totalAsks = Object.values(asks).reduce((acc, qty) => acc + qty, 0);
    const totalBids = Object.values(bids).reduce((acc, qty) => acc + qty, 0);
    const calculatedBidPercentage = (totalBids / (totalAsks + totalBids)) * 100;

    return (
        <div className="orderbook">
            <div className="orderbook-header">
                <span>Price (USDC)</span>
                <span>Qty (BTC)</span>
                <span>Total (BTC)</span>
            </div>
            <OrderTable 
                title="Asks" 
                orders={Object.fromEntries(Object.entries(aggregatedAsks).reverse())} 
                getBackgroundColor={getBackgroundColor} 
            />
            <div className="last-traded-price">
                {lastTradedPrice.toFixed(2)} USDC
            </div>
            <OrderTable 
                title="Bids" 
                orders={aggregatedBids} 
                getBackgroundColor={getBackgroundColor} 
            />
            <PercentageBar bidPercentage={calculatedBidPercentage} />
        </div>
    );
};

interface OrderTableProps {
    title: string;
    orders: { [price: number]: number };
    getBackgroundColor: (qty: number) => string;
}

const OrderTable: React.FC<OrderTableProps> = ({ title, orders, getBackgroundColor }) => {
    return (
        <div className={`order-table-container ${title.toLowerCase()}`}>
            <table className={`order-table ${title.toLowerCase()}`}>
                <tbody>
                    {Object.entries(orders).map(([price, { qty, total, side }]) => (
                        <tr key={price} className="order-table-row" style={{ backgroundColor: getBackgroundColor(qty) }}>
                            <td className="order-table-cell">{price}</td>
                            <td className="order-table-cell">{qty}</td>
                            <td className="order-table-cell">{total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const PercentageBar: React.FC<{ bidPercentage: number }> = ({ bidPercentage }) => {
    return (
        <div className="percentage-bar">
            <div className="bar bids" style={{ width: `${bidPercentage}%` }}>
                <span className="label">B</span>
            </div>
            <div className="bar asks" style={{ width: `${100 - bidPercentage}%` }}>
                <span className="label">S</span>
            </div>
        </div>
    );
};

export default OrderBook;
