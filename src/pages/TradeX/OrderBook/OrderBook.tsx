import React, { useState, useEffect } from 'react';
import './OrderBook.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

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
        const interval = setInterval(() => {
            const isUnbalanced = Math.random() < 0.2; // 20% chance to unbalance

            setAsks(prevAsks => {
                const newAsks = { ...prevAsks };
                const randomPrice = Object.keys(newAsks)[Math.floor(Math.random() * Object.keys(newAsks).length)];
                const change = isUnbalanced ? Math.random() * 50 - 25 : Math.random() * 10 - 5;
                newAsks[randomPrice] = newAsks[randomPrice] + change;
                return newAsks;
            });

            setBids(prevBids => {
                const newBids = { ...prevBids };
                const randomPrice = Object.keys(newBids)[Math.floor(Math.random() * Object.keys(newBids).length)];
                const change = isUnbalanced ? Math.random() * 50 - 25 : Math.random() * 10 - 5;
                newBids[randomPrice] = newBids[randomPrice] + change;
                return newBids;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

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
                orders={asks} 
                getBackgroundColor={getBackgroundColor} 
            />
            <div className="last-traded-price">
                {lastTradedPrice.toFixed(2)} USDC
            </div>
            <OrderTable 
                title="Bids" 
                orders={bids} 
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
    let cumulativeQty = 0;
    return (
        <div className={`order-table-container ${title.toLowerCase()}`}>
            <table className={`order-table ${title.toLowerCase()}`}>
                <tbody>
                    {title.toLowerCase() === "asks" ? Object.entries(orders)
                        .sort(([priceA], [priceB]) => parseFloat(priceA) - parseFloat(priceB))
                        .map(([price, qty]) => {
                            cumulativeQty += qty;
                            return (
                                <tr key={price} className="order-table-row" style={{ backgroundColor: getBackgroundColor(qty) }}>
                                    <td className="order-table-cell">{parseFloat(price).toFixed(2)}</td>
                                    <td className="order-table-cell">{qty.toFixed(6)}</td>
                                    <td className="order-table-cell">{cumulativeQty.toFixed(2)}</td>
                                </tr>
                            );
                        }).reverse() : Object.entries(orders)
                        .sort(([priceA], [priceB]) => parseFloat(priceB) - parseFloat(priceA))
                        .map(([price, qty]) => {
                            cumulativeQty += qty;
                            return (
                                <tr key={price} className="order-table-row" style={{ backgroundColor: getBackgroundColor(qty) }}>
                                    <td className="order-table-cell">{parseFloat(price).toFixed(2)}</td>
                                    <td className="order-table-cell">{qty.toFixed(6)}</td>
                                    <td className="order-table-cell">{cumulativeQty.toFixed(2)}</td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
};

const PercentageBar: React.FC<{ bidPercentage: number }> = ({ bidPercentage }) => {
    return (
        <div className="percentage-bar">
            <span className="label bids">B</span>
            <div className="bar bids" style={{ width: `${bidPercentage}%` }}>
                <span>{bidPercentage.toFixed(0)}%</span>
            </div>
            <i className="fas fa-balance-scale" 
               style={{ 
                   position: 'absolute', 
                   left: `${bidPercentage}%`,
                   transform: 'translateX(-50%)', 
                   color: '#fff', 
                   zIndex: 1, 
                   transition: 'left 0.5s ease'
               }}></i>
            <div className="bar asks" style={{ width: `${100 - bidPercentage}%` }}>
                <span>{(100 - bidPercentage).toFixed(0)}%</span>
            </div>
            <span className="label asks">S</span>
        </div>
    );
};

export default OrderBook;
