import React, { useEffect, useState } from 'react';
import useWebSocket from '../../../hooks/useWebSocket'; // Adjust the path as necessary
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import NotFoundPage from '../../NotFound/NotFound';
import ChartX from '../ChartX/ChartX';
import './Market.css';
import OrderBook from '../OrderBook/OrderBook';
interface MarketProps {
}

const Market: React.FC<MarketProps> = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const marketName = queryParams.get('name') || 'default_market_name';

  const { message, sendMessage, isConnected } = useWebSocket('wss://ws.manticore.exchange');
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  const [orderBookData, setOrderBookData] = useState<{ asks: { [price: number]: number }, bids: { [price: number]: number } }>({ asks: {}, bids: {} });

  useEffect(() => {
    if (isConnected) {
      console.log("WebSocket connected, sending get_orderbook");
      sendMessage(`get_orderbook ${marketName.replace(/_/g, '/')}`);
    } else {
      console.log("WebSocket not connected, retrying...");
      const retryInterval = setInterval(() => {
        if (isConnected) {
          console.log("WebSocket reconnected, sending get_orderbook");
          sendMessage(`get_orderbook ${marketName}`);
          clearInterval(retryInterval);
        }
      }, 1000); // Retry every second

      return () => clearInterval(retryInterval);
    }
  }, [isConnected, marketName, sendMessage]);

  useEffect(() => {
    if (message) {
      console.log(message);
      if (message.includes("market_info")) {
        const marketInfo = message.split("market_info ")[1];
        if (marketInfo === "None") {
          setNotFound(true);
        }
      }
      if (message.includes("orderbook")) {
        const orderbookInfo = message.split("orderbook ")[1];
        console.log("Orderbook Info:", orderbookInfo);

        const parsedOrderbook = JSON.parse(orderbookInfo);
        
        setOrderBookData(parsedOrderbook);
      }
    }
  }, [message]);

  return (
    <div>
      <button onClick={() => navigate(-1)} className="backButton">Back</button>
      {notFound && <NotFoundPage />}
      {!notFound && <div className="market">
        <div className="market-chart-container">
          <ChartX />
        </div>
        <OrderBook 
          aggregatedAsks={orderBookData.asks} 
          aggregatedBids={orderBookData.bids} 
          //@ts-ignore
          getBackgroundColor={(qty: number) => "red"} 
          //@ts-ignore
          lastTradedPrice={100} 
        />
      </div>}
    </div>
  );
};

export default Market;
