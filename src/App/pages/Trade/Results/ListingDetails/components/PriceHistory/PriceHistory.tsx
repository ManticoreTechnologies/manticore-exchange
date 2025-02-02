import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PriceChart from '../PriceChart/PriceChart';
import './PriceHistory.css';

interface PriceHistoryProps {
  listingId: string;
  selectedAsset?: string | null;
}

type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';

const PriceHistory: React.FC<PriceHistoryProps> = ({ listingId, selectedAsset }) => {
  const [priceData, setPriceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_TRADING_API_PROTO || 'https'}://${
            import.meta.env.VITE_TRADING_API_HOST || 'api.manticore.exchange'
          }:8000/listings/${listingId}/prices${selectedAsset ? `?asset=${selectedAsset}` : ''}&range=${timeRange}`
        );
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

  if (loading) {
    return <div className="loading-spinner">Loading price history...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="price-chart-container">
      <div className="price-chart-header">
        <div className="price-chart-title">
          <h2>
            {selectedAsset ? (
              <>
                <span className="selected-asset">{selectedAsset}</span>
                <span className="title-separator">•</span>
                <span>Price History</span>
              </>
            ) : (
              'Listing Price Index'
            )}
          </h2>
        </div>
        <div className="time-range-selector">
          {(['1D', '1W', '1M', '3M', '1Y', 'ALL'] as TimeRange[]).map((range) => (
            <button
              key={range}
              className={`time-range-button ${timeRange === range ? 'active' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      <PriceChart 
        data={priceData}
        assetName={selectedAsset || undefined}
        isIndex={!selectedAsset}
      />
    </div>
  );
};

export default PriceHistory; 