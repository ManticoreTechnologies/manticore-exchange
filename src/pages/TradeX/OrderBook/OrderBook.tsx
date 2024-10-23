import React from 'react';
import './OrderBook.css';

interface OrderBookProps {
    aggregatedAsks: { [price: number]: number };
    aggregatedBids: { [price: number]: number };
    getBackgroundColor: (qty: number) => string;
    lastTradedPrice: number;
}

const OrderBook: React.FC<OrderBookProps> = ({ aggregatedAsks, aggregatedBids, getBackgroundColor, lastTradedPrice = 0 }) => (
    <div className="orderbook">
        <div className="orderbook-header">
            <span>PRICE</span>
            <span>QTY</span>
        </div>
        <OrderTable 
            title="Asks" 
            orders={aggregatedAsks} 
            getBackgroundColor={getBackgroundColor} 
        />
        <div className="last-traded-price">
            Last Traded Price: {lastTradedPrice.toFixed(2)}
        </div>
        <OrderTable 
            title="Bids" 
            orders={aggregatedBids} 
            getBackgroundColor={getBackgroundColor} 
        />
    </div>
);

interface OrderTableProps {
    title: string;
    orders: { [price: number]: number };
    getBackgroundColor: (qty: number) => string;
}

const OrderTable: React.FC<OrderTableProps> = ({ title, orders, getBackgroundColor }) => (
    <div className={`order-table-container ${title.toLowerCase()}`}>
        <table className={`order-table ${title.toLowerCase()}`}>
            <tbody>
                {Object.entries(orders)
                    .sort(([priceA], [priceB]) => parseFloat(priceB) - parseFloat(priceA))
                    .map(([price, qty]) => (
                        <tr key={price} className="order-table-row" style={{ backgroundColor: getBackgroundColor(qty) }}>
                            <td className="order-table-cell">{parseFloat(price).toFixed(2)}</td>
                            <td className="order-table-cell">{qty}</td>
                        </tr>
                    ))}
            </tbody>
        </table>
    </div>
);

export default OrderBook;
