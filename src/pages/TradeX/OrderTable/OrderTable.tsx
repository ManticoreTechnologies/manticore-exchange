import React from 'react';
import './OrderTable.css';

interface OrderTableProps {
    title: string;
    orders: { [price: number]: number };
    getBackgroundColor: (qty: number) => string;
}

const OrderTable: React.FC<OrderTableProps> = ({ title, orders, getBackgroundColor }) => (
    <table className={`order-table ${title.toLowerCase()}`}>
        <thead>
            <tr>
                <th className="order-table-header">Price</th>
                <th className="order-table-header">Qty</th>
            </tr>
        </thead>
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
);

export default OrderTable;
