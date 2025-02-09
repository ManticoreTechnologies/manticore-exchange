import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PriceChart from '../PriceChart/PriceChart';
import './PriceHistory.css';

interface PriceHistoryProps {
  listingId: string;
  selectedAsset?: string | null;
}

interface PriceData {
  time: string;
  asset_name: string;
  num_sales: number;
  min_price: string;
  max_price: string;
  avg_price: string;
  volume: string;
}

const TIME_RANGES = [
  { value: '1D', label: '1D' },
  { value: '1W', label: '1W' },
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '1Y', label: '1Y' },
  { value: 'ALL', label: 'ALL' }
] as const;

type TimeRange = typeof TIME_RANGES[number]['value'];

const SalesHistory: React.FC<PriceHistoryProps> = ({ listingId, selectedAsset }) => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        setLoading(true);
        const baseUrl = `${import.meta.env.VITE_TRADING_API_PROTO || 'https'}://${
          import.meta.env.VITE_TRADING_API_HOST || 'api.manticore.exchange'
        }:8000/listings/${encodeURIComponent(listingId)}/prices`;

        const params = new URLSearchParams();
        if (selectedAsset) {
          params.append('asset', selectedAsset);
        }
        params.append('range', timeRange);

        const url = `${baseUrl}?${params.toString()}`;
        const response = await axios.get<PriceData[]>(url);
        setPriceData(response.data);
      } catch (err) {
        setError('Failed to load price history');
        console.error('Error fetching price history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceHistory();
  }, [listingId, selectedAsset, timeRange]);

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };

  if (loading) {
    return <div className="loading-spinner">Loading price history...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const hasData = priceData.length > 0;

  return (
    <div className="sales-history">
      <div className="sales-chart-header">
        <div className="sales-chart-title">
          <h2>
            {selectedAsset ? (
              <>
                <span className="selected-asset">{selectedAsset}</span>
                <span className="title-separator">•</span>
                <span>Sales History</span>
              </>
            ) : (
              'Sales History'
            )}
          </h2>
        </div>
        <div className="time-range-selector">
          {TIME_RANGES.map(({ value, label }) => (
            <button
              key={value}
              className={`time-range-button ${timeRange === value ? 'active' : ''}`}
              onClick={() => handleTimeRangeChange(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="sales-history-content">
        <PriceChart 
          data={priceData}
          assetName={selectedAsset || undefined}
          isIndex={!selectedAsset}
        />
        <div className="sales-table">
          {hasData ? (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Volume</th>
                  <th>Sales</th>
                </tr>
              </thead>
              <tbody>
                {priceData.map((price) => (
                  <tr key={price.time}>
                    <td>{new Date(price.time).toLocaleDateString()}</td>
                    <td>{Number(price.avg_price).toFixed(2)}</td>
                    <td>{Number(price.volume).toLocaleString()}</td>
                    <td>{price.num_sales.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data-message">No sales data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesHistory; 