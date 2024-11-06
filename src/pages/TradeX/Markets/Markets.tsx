import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Markets.css';
import useWebSocket from '../../../hooks/useWebSocket'; // Adjust the path as necessary

const Markets = () => {
  const [markets, setMarkets] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query
  const [activeFilter, setActiveFilter] = useState<string>('All Markets'); // State for active filter
  const { message, sendMessage, isConnected } = useWebSocket('ws://localhost:8765');
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    console.log("Markets");
  }, []);

  useEffect(() => {
    console.log("message received");
    if (message) {
        if (message.includes("all_markets")) {
            setMarkets(JSON.parse(message.split("all_markets ")[1].replace(/'/g, '"')));
        }
    }
  }, [message]);

  useEffect(() => {
    if (isConnected) {
      console.log("WebSocket connected, sending get_all_markets");
      sendMessage('get_all_markets');
    }
  }, [isConnected]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleMarketClick = (marketName: string) => {
    const formattedMarketName = marketName.replace(/\//g, '_'); // Replace '/' with '_'
    navigate(`/tradex/market?name=${formattedMarketName}`); // Use query parameter
  };

  const filteredMarkets = Object.values(markets).filter((market) => {
    const matchesSearch = market.market_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All Markets' || market.market_name.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="marketsContainer">
      <div className="featuredAssets">
        <div className="highlightedAssets">
          <h2>Highlighted Assets</h2>
          <div className="asset">
            <img src="/favicon.ico" alt="Slopy" className="assetIcon" />
            <span>SLOPY</span>
          </div>
          <div className="asset">
            <img src="/favicon.ico" alt="Fry" className="assetIcon" />
            <span>FRY</span>
          </div>
          <div className="asset">
            <span>- Spot Open -</span>
            <a href="/rent-spot" className="rentLink">Rent This Spot</a>
          </div>
        </div>
        <div className="topGainers">
          <h2>Top Gainers</h2>
          <div className="gainer">
            <img src="/favicon.ico" alt="SOSHE" className="gainerIcon" />
            <span>SOSHE/USDT</span>
            <span className="gainerChange">+153.75%</span>
            <span className="gainerVolume">148</span>
          </div>
          <div className="gainer">
            <img src="/favicon.ico" alt="THC" className="gainerIcon" />
            <span>THC/BTC</span>
            <span className="gainerChange">+132.14%</span>
            <span className="gainerVolume">$393.00K</span>
          </div>
          <div className="gainer">
            <img src="/favicon.ico" alt="2X2" className="gainerIcon" />
            <span>2X2/DOGE</span>
            <span className="gainerChange">+100.00%</span>
            <span className="gainerVolume">$6.44K</span>
          </div>
        </div>
        <div className="topVolume">
          <h2>Top Volume</h2>
          <div className="volume">
            <img src="/favicon.ico" alt="BTC" className="volumeIcon" />
            <span>BTC/USDC</span>
            <span className="volumeAmount">26.1</span>
            <span className="volumeValue">$1.36T</span>
          </div>
          <div className="volume">
            <img src="/favicon.ico" alt="ETH" className="volumeIcon" />
            <span>ETH/USDT</span>
            <span className="volumeAmount">62.0</span>
            <span className="volumeValue">$303.00B</span>
          </div>
          <div className="volume">
            <img src="/favicon.ico" alt="POT" className="volumeIcon" />
            <span>POT/USDT</span>
            <span className="volumeAmount">29.8M</span>
            <span className="volumeValue">$1.14M</span>
          </div>
        </div>
      </div>
      <div className="tabs">
        <div className="tabContainer">
          <div className={`tab ${activeFilter === 'All Markets' ? 'active' : ''}`} onClick={() => handleFilterChange('All Markets')}>All Markets</div>
          <div className={`tab ${activeFilter === 'USDC' ? 'active' : ''}`} onClick={() => handleFilterChange('USDC')}>USDC</div>
          <div className={`tab ${activeFilter === 'EVR' ? 'active' : ''}`} onClick={() => handleFilterChange('EVR')}>EVR</div>
          {/* Add more tabs as needed */}
        </div>
        <input type="text" className="searchBar" placeholder="Search Assets" value={searchQuery} onChange={handleSearchChange} />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Market</th>
            <th>Price</th>
            <th>24h Change</th>
            <th>24h High</th>
            <th>24h Low</th>
            <th>24h Volume</th>
            <th>Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {filteredMarkets.map((market) => (
            <tr key={market.market_id}>
              <td>
                <img 
                  src="/favicon.ico" 
                  alt={`${market.market_name} Icon`} 
                  className="marketIcon" 
                  onClick={() => handleMarketClick(market.market_name)} 
                />
                <span 
                  className='marketName'
                  onClick={() => handleMarketClick(market.market_name)}
                >
                  {market.market_name.replace(/_/g, '/')}
                </span>
              </td>
              <td>--</td>
              <td>--</td>
              <td>--</td>
              <td>--</td>
              <td>--</td>
              <td>--</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Markets;

