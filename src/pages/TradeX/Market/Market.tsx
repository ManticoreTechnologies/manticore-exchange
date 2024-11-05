import React, { useEffect, useState } from 'react';
import useWebSocket from '../../../hooks/useWebSocket'; // Adjust the path as necessary
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import NotFoundPage from '../../NotFound/NotFound';
import ChartX from '../ChartX/ChartX';
import './Market.css';
import OrderBook from '../OrderBook/OrderBook';
interface MarketProps {
}

const Market: React.FC<MarketProps> = () => {
  const { marketName } = useParams<{ marketName: string }>();
  const { message, sendMessage, isConnected } = useWebSocket('ws://localhost:8765');
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();
  useEffect(()=>{
    if (message) {
        console.log(message);
        if (message.includes("market_info")) {
            const marketInfo = message.split("market_info ")[1];
            if (marketInfo=="None") {
                setNotFound(true);
            }
        }
    }
  }, [message]);

  useEffect(() => {
    if (isConnected) {
      console.log("WebSocket connected, sending get_market");
      sendMessage(`get_market_info ${marketName}`);
    }
  }, [isConnected]);

  return (
    <div>
      {notFound && <NotFoundPage />}
      {!notFound && <div className="market">
        <ChartX tickerHistory={[

    { time: '2022-01-01', price: 100 },
    { time: '2022-01-02', price: 110 },
    { time: '2022-01-03', price: 120 },
    { time: '2022-01-04', price: 130 },
    { time: '2022-01-05', price: 140 },
    { time: '2022-01-06', price: 150 },
    { time: '2022-01-07', price: 160 }, // End of the flagpole

    // Start of consolidation (flag)
    { time: '2022-01-08', price: 155 },
    { time: '2022-01-09', price: 157 },
    { time: '2022-01-10', price: 154 },
    { time: '2022-01-11', price: 156 },
    { time: '2022-01-12', price: 153 },
    { time: '2022-01-13', price: 155 },
    { time: '2022-01-14', price: 158 },
    { time: '2022-01-15', price: 160 }, // Breakout point after consolidation

    // Continuation of upward trend
    { time: '2022-01-16', price: 170 },
    { time: '2022-01-17', price: 180 },
    { time: '2022-01-18', price: 190 },
]

} />

<OrderBook aggregatedAsks={
    {
        120: 120,
        110: 110,
        100: 100,
    }

} aggregatedBids={
    {
        100: 100,
        99: 99,
        98: 98,
    }
} getBackgroundColor={
    (qty: number) => {
        return "red";
    }
} lastTradedPrice={100} />
</div>}
      {/* Add market details here */}
    </div>
  );
};

export default Market;

