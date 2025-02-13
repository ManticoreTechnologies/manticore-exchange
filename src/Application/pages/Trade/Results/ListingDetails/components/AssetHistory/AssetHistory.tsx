import * as React from 'react';
import axios from 'axios';
import './AssetHistory.css';

interface AssetHistoryProps {
  listingId: string;
  assetName: string;
}

interface AssetHistoryData {
  timestamp: string;
  asset_name: string;
  amount: string;
  type: 'deposit' | 'withdrawal';
  balance_after: string;
}

interface AssetHistoryResponse {
  listing_id: string;
  asset_name: string;
  current_balances: {
    confirmed: string;
    pending: string;
  };
  history: AssetHistoryData[];
}

export const AssetHistory: React.FC<AssetHistoryProps> = ({ listingId, assetName }) => {
  const [history, setHistory] = React.useState<AssetHistoryData[]>([]);
  const [currentBalances, setCurrentBalances] = React.useState<{confirmed: string; pending: string} | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const baseUrl = `${import.meta.env.VITE_TRADING_API_PROTO || 'https'}://${
          import.meta.env.VITE_TRADING_API_HOST || 'api.manticore.exchange'
        }:8000/listings/${encodeURIComponent(listingId)}/asset-history`;

        const params = new URLSearchParams();
        if (assetName) {
          params.append('asset', assetName);
        }

        const url = `${baseUrl}?${params.toString()}`;
        const response = await axios.get<AssetHistoryResponse>(url);
        
        // Set the history and current balances
        setHistory(response.data.history || []);
        setCurrentBalances(response.data.current_balances);
      } catch (err) {
        setError('Failed to load asset history');
        console.error('Error fetching asset history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [listingId, assetName]);

  if (loading) {
    return <div className="loading-spinner">Loading asset history...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Show current balances even if there's no history
  const renderCurrentBalances = () => {
    if (!currentBalances) return null;
    
    return (
      <div className="current-balances">
        <h3>Current Balances</h3>
        <div className="balance-grid">
          <div className="balance-item">
            <span className="balance-label">Confirmed:</span>
            <span className="balance-value">{currentBalances.confirmed} {assetName}</span>
          </div>
          <div className="balance-item">
            <span className="balance-label">Pending:</span>
            <span className="balance-value">{currentBalances.pending} {assetName}</span>
          </div>
        </div>
      </div>
    );
  };

  if (history.length === 0) {
    return (
      <div className="asset-history">
        {renderCurrentBalances()}
        <div className="no-data-message">
          <p>No transaction history found for {assetName}</p>
          <p className="empty-details">This asset hasn't had any balance changes yet.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="asset-history">
      {renderCurrentBalances()}
      <table className="asset-history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Balance After</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item: AssetHistoryData, index: number) => (
            <tr key={index} className={`type-${item.type}`}>
              <td>{new Date(item.timestamp).toLocaleString()}</td>
              <td>{item.type}</td>
              <td>{item.amount}</td>
              <td>{item.balance_after}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 