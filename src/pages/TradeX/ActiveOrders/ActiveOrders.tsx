import React from 'react';

interface Order {
    type: string;
    id: string;
    price: number;
    qty: number;
}

interface ActiveOrdersProps {
    activeOrders: Order[];
    cancelOrder: (orderId: string) => void;
}

const ActiveOrders: React.FC<ActiveOrdersProps> = ({ activeOrders, cancelOrder }) => (
    <div className="active-orders">
        <h3>Active Orders</h3>
        <ul>
            {activeOrders.map((order, index) => (
                <li key={index}>
                    {order.type} {order.qty} @ {order.price} (ID: {order.id})
                    <button onClick={() => cancelOrder(order.id)}>Cancel</button>
                </li>
            ))}
        </ul>
    </div>
);

export default ActiveOrders;
