// src/pages/EVRPage.tsx

import React, { useEffect, useState } from 'react';
import api from '../utility/api';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../styles/EVRPage.css';

const EVRPage: React.FC = () => {
  const [evrData, setEvrData] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>('30d');

  useEffect(() => {
    const getEVRData = async () => {
      try {
        const data = await api.getCoinMarketCapData<any>('cryptocurrency/quotes/latest');
        const evr = data.data['31424']; // The EVR data should be in data.data['31424']
        setEvrData(evr);
      } catch (error) {
        setError('Failed to fetch EVR data.');
      } finally {
        setLoading(false);
      }
    };

    getEVRData();
  }, []);

  useEffect(() => {
    const getHistoricalData = async () => {
      try {
        const end = new Date().toISOString().split('T')[0];
        let start: any;
        if (timeRange === '7d') {
          start = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0];
        } else if (timeRange === '30d') {
          start = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
        } else if (timeRange === '90d') {
          start = new Date(new Date().setDate(new Date().getDate() - 90)).toISOString().split('T')[0];
        } else if (timeRange === 'all') {
          start = '2013-04-28'; // CoinMarketCap earliest available data
        }
        console.log(`Fetching historical data from ${start} to ${end}`); // Add logging
        const data = await api.getHistoricalData<any>('EVR', start, end);
        console.log('Historical Data:', data); // Add logging
        setHistoricalData(data.data.quotes);
      } catch (error) {
        console.error('Failed to fetch historical data:', error); // Enhanced error logging
        setError('Failed to fetch historical data.');
      }
    };

    getHistoricalData();
  }, [timeRange]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const chartData = {
    labels: historicalData.map((entry: any) => new Date(entry.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'Price (USD)',
        data: historicalData.map((entry: any) => entry.quote.USD.price),
        borderColor: 'rgba(255, 255, 255, 1)', // Set line color to white
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  console.log('Chart Data:', chartData); // Add logging

  return (
    <div className="evr-page">
      <h1>EVR Chart</h1>
      {evrData ? (
        <div>
          <h2>{evrData.name} ({evrData.symbol})</h2>
          <p>Market Cap: ${evrData.quote.USD.market_cap?.toFixed(2)}</p>
          <p>Price: ${evrData.quote.USD.price?.toFixed(6)}</p>
          <p>24h Volume: ${evrData.quote.USD.volume_24h?.toFixed(2)}</p>
          <p>Circulating Supply: {evrData.circulating_supply}</p>
          <p>Total Supply: {evrData.total_supply}</p>
          <p>Max Supply: {evrData.max_supply}</p>
          <p>Self Reported Circulating Supply: {evrData.self_reported_circulating_supply}</p>
          <p>Self Reported Market Cap: ${evrData.self_reported_market_cap?.toFixed(2)}</p>
          <p>CMC Rank: {evrData.cmc_rank}</p>
          <p>Tags: {evrData.tags.join(', ')}</p>
          <p>Date Added: {new Date(evrData.date_added).toLocaleDateString()}</p>
          <p>Last Updated: {new Date(evrData.last_updated).toLocaleString()}</p>
        </div>
      ) : (
        <p>No EVR data found.</p>
      )}
      <div className="historical-chart">
        <h3>Historical Price Chart</h3>
        <div className="toolbar">
          <label>Time Range: </label>
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            {/* <option value="90d">Last 90 days</option>
            <option value="all">All Time</option> */}
          </select>
        </div>
        <div className="chart-container">
          {historicalData.length > 0 && <Line data={chartData} />}
        </div>
      </div>
    </div>
  );
};

export default EVRPage;

























