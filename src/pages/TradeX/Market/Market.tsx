import React, { useEffect, useState } from 'react';
import useWebSocket from '../../../hooks/useWebSocket'; // Adjust the path as necessary
import { useParams, useLocation } from "react-router-dom";
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

  const { message, sendMessage, isConnected } = useWebSocket('ws://localhost:8765');
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
        // {'bids': {1.0: {'side': 'bid', 'price': 1.0, 'qty': 7.0, 'total': 7.0}}, 'asks': {1.00001: {'side': 'ask', 'price': 1.00001, 'qty': 1.0, 'total': 1.0}, 2.0: {'side': 'ask', 'price': 2.0, 'qty': 5.0, 'total': 6.0}}}
        
        const orderbookInfo = message.split("orderbook ")[1];
        console.log("Orderbook Info:", orderbookInfo);

        // parse the json string
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
        <ChartX tickerHistory={[
          { time: '2022-01-01', price: 100 },
          { time: '2022-01-02', price: 110 },
          { time: '2022-01-03', price: 120 },
          { time: '2022-01-04', price: 130 },
          { time: '2022-01-05', price: 140 },
          { time: '2022-01-06', price: 150 },
          { time: '2022-01-07', price: 160 },
          { time: '2022-01-08', price: 155 },
          { time: '2022-01-09', price: 157 },
          { time: '2022-01-10', price: 154 },
          { time: '2022-01-11', price: 156 },
          { time: '2022-01-12', price: 153 },
          { time: '2022-01-13', price: 155 },
          { time: '2022-01-14', price: 158 },
          { time: '2022-01-15', price: 160 },
          { time: '2022-01-16', price: 170 },
          { time: '2022-01-17', price: 180 },
          { time: '2022-01-18', price: 190 },
        ]} />
        <OrderBook 
          aggregatedAsks={orderBookData.asks} 
          aggregatedBids={orderBookData.bids} 
          getBackgroundColor={(qty: number) => "red"} 
          lastTradedPrice={100} 
        />
      </div>}
    </div>
  );
};

export default Market;

