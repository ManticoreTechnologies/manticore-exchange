import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { createChart, ISeriesApi, IChartApi } from 'lightweight-charts';
import './EVRPage.css';

const EVRPage: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [ohlcData, setOhlcData] = useState<any[]>([]);
  const [xeggexData, setXeggexData] = useState<any>({
    ticker: 'EVR',
    name: 'Evrmore',
    network: 'Evrmore Main Chain',
    logo: 'https://images.xeggex.com/coin/d9fd06bd-8cdf-4869-a79a-c5a75652068c.webp',
    usdValue: '0.000685769092',
    circulation: '8741490031.46829987',
    explorer: 'https://evr.cryptoscope.io/',
    website: 'https://evrmore.com/',
    socialCommunity: {
      Twitter: 'https://twitter.com/EvrFoundation',
      Github: 'https://github.com/EvrmoreOrg',
      Discord: 'https://discord.gg/4csauGuvw3',
      Telegram: 'https://t.me/Evrmorecoin',
      Reddit: 'https://www.reddit.com/r/EvrmoreCoin/',
      BitcoinTalk: 'https://bitcointalk.org/index.php?topic=5416790.0;all',
    },
    about: 'Evrmore (EVR) is a blockchain Decentralized Finance and Commerce platform with built-in UTXO-based asset and DeFi primitives.',
    activeMarkets: [
      'EVR/BTC',
      'EVR/USDT',
    ],
  });

  const marketLinks: any = {
    'EVR/BTC': 'https://xeggex.com/market/EVR_BTC',
    'EVR/USDT': 'https://xeggex.com/market/EVR_USDT',
  };

  useEffect(() => {
    const fetchOHLCData = async () => {
      try {
        const response = await axios.get('https://api.xeggex.com/api/v2/market/candles', {
          params: {
            symbol: 'EVR/USDT',
            resolution: 1440, // daily candles
            countBack: 500,  // get the last 500 candles
            firstDataRequest: 1,
          },
        });
        const data = response.data.bars;
        const formattedData = data.map((entry: any) => ({
          time: entry.time / 1000, // Convert from milliseconds to seconds
          open: entry.open,
          high: entry.high,
          low: entry.low,
          close: entry.close,
        }));
        setOhlcData(formattedData);
      } catch (error) {
        console.error('Error fetching OHLC data:', error);
      }
    };

    const getXeggexData = async () => {
      try {
        const response = await axios.get('https://api.xeggex.com/api/v2/asset/getbyticker/EVR');
        setXeggexData(response.data);
      } catch (error) {
        console.error('Error fetching Xeggex data:', error);
      }
    };

    fetchOHLCData();
    getXeggexData();
  }, []);

  useEffect(() => {
    if (chartContainerRef.current) {
      // Create the chart with autoSize enabled
      if (!chartRef.current) {
        chartRef.current = createChart(chartContainerRef.current, {
          layout: {
            background: {
              color: '#1a1a1a'
            },
            
            textColor: '#fff',
          },
          grid: {
            vertLines: {
              color: '#2B2B43',
            },
            horzLines: {
              color: '#363C4E',
            },
          },
          autoSize: true, // Enable auto-sizing
          timeScale: {
              borderColor: '#555',
              timeVisible: true, // Ensure times are visible
              secondsVisible: true, // Ensure seconds are visible if applicable
          },
        });

        candleSeriesRef.current = chartRef.current.addCandlestickSeries({
          upColor: '#4CAF50',
          downColor: '#FF5252',
          borderDownColor: '#FF5252',
          borderUpColor: '#4CAF50',
          wickDownColor: '#FF5252',
          wickUpColor: '#4CAF50',
          priceFormat: {
            type: 'price',
            precision: 8, // Number of decimal places to show
            minMove: 0.00000001, // Smallest unit of price movement
          },
        });
      }

      // Update the data in the series
      if (candleSeriesRef.current) {
        candleSeriesRef.current.setData(ohlcData);
      }
    }
  }, [ohlcData]);

  return (
    <div className="evr-page">
      <div className="xeggex-data">
        <h1><strong>{xeggexData.name} ({xeggexData.ticker})</strong></h1>
        <img src={xeggexData.logo} alt={`${xeggexData.name} logo`} />
        <p>${xeggexData.usdValue}</p>
        <p>{xeggexData.circulation} circulating</p>
        <div className="links">
          <a href={xeggexData.explorer} target="_blank" rel="noopener noreferrer">Explorer</a>
          <a href='https://evrmore.com' target="_blank" rel="noopener noreferrer">Website</a>
        </div>
        <div className="about">{xeggexData.about}</div>
        <div className="social-links">
          {Object.keys(xeggexData.socialCommunity).map((key) => (
            <a key={key} href={xeggexData.socialCommunity[key]} target="_blank" rel="noopener noreferrer">{key}</a>
          ))}
        </div>
        <div ref={chartContainerRef} className="info-chart-container" style={{ marginLeft: 'auto', marginRight: 'auto' }} />
        <div className="trade-links">
          <p>Trade on Xeggex</p>
          <ul>
            {xeggexData.activeMarkets.map((market: string) => (
              <li key={market}>
                <a href={marketLinks[market] || '#'} target="_blank" rel="noopener noreferrer">
                  {market}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EVRPage;
