// src/components/OrderBook.tsx
import React from 'react';

interface OrderBookProps {
  bids: any[]; // List of bid orders
  asks: any[]; // List of ask orders
}

const OrderBook: React.FC<OrderBookProps> = ({ bids, asks }) => {
  return (
    <div className="order-book-container">
      <h2>Order Book</h2>
      <div className="order-book">
        <div className="order-book-side">
          <h3>Bids</h3>
          <table className="order-book-table">
            <thead>
              <tr>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid, index) => (
                <tr key={index}>
                  <td>{bid.price}</td>
                  <td>{bid.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="order-book-side">
          <h3>Asks</h3>
          <table className="order-book-table">
            <thead>
              <tr>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {asks.map((ask, index) => (
                <tr key={index}>
                  <td>{ask.price}</td>
                  <td>{ask.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
