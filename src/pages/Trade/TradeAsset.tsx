import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TradingChart from "./TradingChart"; // Candlestick chart
import ActiveOrders from "./ActiveOrders"; // Active orders component
import OrderBook from "./OrderBook"; // Order book component
import PlaceOrder from "./PlaceOrder"; // Place order component
import './TradeAsset.css'; // Custom CSS for layout

const TradeAsset: React.FC = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [assetDetails, setAssetDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [candlestickData, setCandlestickData] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);  // Active buy/sell orders
  const [bids, setBids] = useState<any[]>([]);      // Bid orders
  const [asks, setAsks] = useState<any[]>([]);      // Ask orders

  const trading_api_host = import.meta.env.VITE_TRADING_API_HOST || 'api.manticore.exchange';
  const trading_api_port = import.meta.env.VITE_TRADING_API_PORT || '668';
  const trading_api_proto = import.meta.env.VITE_TRADING_API_PROTO || 'https';
  const trading_api_url = `${trading_api_proto}://${trading_api_host}:${trading_api_port}`;

  useEffect(() => {
    const fetchAssetDetails = async () => {
      try {
        const response = await axios.get(`${trading_api_url}/listing/${listingId}`);
        setAssetDetails(response.data);
        setLoading(false);

        // Mocked candlestick data (time, open, high, low, close)
        setCandlestickData([
          { time: '2023-10-01', open: 75.32, high: 77.22, low: 74.11, close: 76.18 },
          { time: '2023-10-02', open: 77.41, high: 78.24, low: 75.22, close: 76.35 },
          { time: '2023-10-03', open: 79.22, high: 80.41, low: 77.91, close: 78.52 },
          { time: '2023-10-04', open: 78.92, high: 80.44, low: 78.01, close: 79.65 },
        ]);

        setOrders([
          { id: 1, type: 'buy', price: 75.5, quantity: 10, status: 'open' },
          { id: 2, type: 'sell', price: 78.0, quantity: 5, status: 'open' },
        ]);

        setBids([
          { price: 75.0, quantity: 10 },
          { price: 74.5, quantity: 20 },
        ]);

        setAsks([
          { price: 78.0, quantity: 5 },
          { price: 79.0, quantity: 10 },
        ]);
      } catch (err) {
        setError("Error fetching asset details");
        setLoading(false);
      }
    };

    if (listingId) {
      fetchAssetDetails();
    }
  }, [listingId]);

  const handlePlaceOrder = (order: { type: string; price: number; quantity: number }) => {
    console.log("Placing order:", order);
    // Logic for placing the order
  };

  const handleBack = () => {
    navigate('/trade');
  };

  if (loading) {
    return <div>Loading asset details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="trade-asset-page">
      <button className="back-button" onClick={handleBack}>Back to Trade</button>
      <h1>Asset Details for {listingId}</h1>
      {assetDetails ? (
        <div className="asset-details-container">
          <div className="asset-info">
            <p><strong>Asset Name:</strong> {assetDetails.asset_name}</p>
            <p><strong>Description:</strong> {assetDetails.description}</p>
            <p><strong>Price:</strong> {assetDetails.price} EVR</p>
          </div>
        </div>
      ) : (
        <p>No asset details available.</p>
      )}

      {/* Layout container for chart, order book, and buy/sell */}
      <div className="trading-layout">
        {/* Candlestick Chart */}
        <div className="chart-container">
          <TradingChart data={candlestickData} />
        </div>

        {/* Order Book */}
        <div className="order-book-container">
          <OrderBook bids={bids} asks={asks} />
        </div>

        {/* Place Buy/Sell Orders */}
        <div className="place-order-container">
          <PlaceOrder onPlaceOrder={handlePlaceOrder} />
        </div>
      </div>

      {/* Active Orders */}
      <ActiveOrders orders={orders} />
    </div>
  );
};

export default TradeAsset;






