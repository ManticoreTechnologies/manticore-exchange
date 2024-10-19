import React from 'react';
import OrderTable from '../OrderTable/OrderTable';
import './OrderBook.css';
interface Order {
    type: string;
    id: string;
    price: number;
    qty: number;
}

interface OrderBookProps {
    aggregatedAsks: { [price: number]: number };
    aggregatedBids: { [price: number]: number };
    getBackgroundColor: (qty: number) => string;
}

const OrderBook: React.FC<OrderBookProps> = ({ aggregatedAsks, aggregatedBids, getBackgroundColor }) => (
    <div className="orderbook">
        <OrderTable title="Asks" orders={aggregatedAsks} getBackgroundColor={getBackgroundColor} />
        <OrderTable title="Bids" orders={aggregatedBids} getBackgroundColor={getBackgroundColor} />
    </div>
);

export default OrderBook;
