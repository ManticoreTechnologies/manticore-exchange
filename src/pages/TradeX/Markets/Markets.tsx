import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Markets.css';
import useWebSocket from '../../../hooks/useWebSocket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

const Markets = () => {
  const [markets, setMarkets] = useState<any[]>([]);
  const [favoriteMarkets, setFavoriteMarkets] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('All Markets');
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const { message, sendMessage, isConnected, isAuthenticated } = useWebSocket('wss://ws.manticore.exchange');
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Markets");
  }, []);

  useEffect(() => {
    console.log("message received");
    if (message) {
      try {
        if (message.includes("all_markets")) {
          const marketsString = message.split("all_markets ")[1].replace(/'/g, '"');
          const marketsData = marketsString === "None" ? [] : JSON.parse(marketsString);
          setMarkets(marketsData);
        }
        if (message.includes("favorite_markets")) {
          const favoritesString = message.split("favorite_markets ")[1].replace(/'/g, '"');
          const favoritesData = favoritesString === "None" ? [] : JSON.parse(favoritesString);
          setFavoriteMarkets(favoritesData);
          console.log("Favorite markets received:", favoritesData);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    }
  }, [message]);

  useEffect(() => {
    if (isConnected) {
      console.log("WebSocket connected, sending get_all_markets");
      sendMessage('get_all_markets');
      if (isAuthenticated) {
        console.log("User is authenticated, sending get_favorite_markets");
        sendMessage('get_favorite_markets');
      }
    }
  }, [isConnected, isAuthenticated]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleMarketClick = (marketName: string) => {
    const formattedMarketName = marketName.replace(/\//g, '_');
    navigate(`/tradex/market?name=${formattedMarketName}`);
  };

  const handleFavoriteClick = (marketName: string) => {
    if (favoriteMarkets.includes(marketName)) {
      sendMessage(`unfavorite_market ${marketName}`);
    } else {
      sendMessage(`favorite_market ${marketName}`);
    }
  };

  const handleShowFavoritesToggle = () => {
    setShowFavorites(!showFavorites);
  };

  const filteredMarkets = Object.values(markets).filter((market) => {
    const matchesSearch = market.market_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All Markets' || market.market_name.includes(activeFilter);
    const isFavorite = favoriteMarkets.includes(market.market_name);
    return matchesSearch && matchesFilter && (!showFavorites || isFavorite);
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
          <button className="showFavoritesButton" onClick={handleShowFavoritesToggle}>
            <FontAwesomeIcon icon={showFavorites ? faStar : faStarRegular} />
          </button>
          <div className={`tab ${activeFilter === 'All Markets' ? 'active' : ''}`} onClick={() => handleFilterChange('All Markets')}>All Markets</div>
          <div className={`tab ${activeFilter === 'USDC' ? 'active' : ''}`} onClick={() => handleFilterChange('USDC')}>USDC</div>
          <div className={`tab ${activeFilter === 'EVR' ? 'active' : ''}`} onClick={() => handleFilterChange('EVR')}>EVR</div>
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
            <th>Favorite</th>
          </tr>
        </thead>
        <tbody>
          {filteredMarkets.map((market) => (
            <tr key={market.market_id}>
              <td>
                <FontAwesomeIcon 
                  icon={favoriteMarkets.includes(market.market_name) ? faStar : faStarRegular} 
                  className="favoriteIcon" 
                  onClick={() => handleFavoriteClick(market.market_name)} 
                />
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

