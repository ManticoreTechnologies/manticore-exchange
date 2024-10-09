// src/components/ActiveOrders.tsx
import React from 'react';

interface ActiveOrdersProps {
  orders: any[]; // You can replace `any[]` with a more specific type for orders
}

const ActiveOrders: React.FC<ActiveOrdersProps> = ({ orders }) => {
  return (
    <div className="active-orders-container">
      <h2>Active Orders</h2>
      {orders.length === 0 ? (
        <p>No active orders</p>
      ) : (
        <table className="active-orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Type</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.type}</td>
                <td>{order.price}</td>
                <td>{order.quantity}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ActiveOrders;
