import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionGraph from './TransactionGraph';
import TransactionTable from './TransactionTable';

interface TransactionHistoryProps {
  listingId: string;
  selectedAsset?: string;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ listingId, selectedAsset }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_TRADING_API_PROTO || 'https'}://${
            import.meta.env.VITE_TRADING_API_HOST || 'api.manticore.exchange'
          }:8000/listings/${listingId}/transactions${selectedAsset ? `?asset=${selectedAsset}` : ''}`
        );
        setTransactions(response.data);
      } catch (err) {
        setError('Failed to load transaction history');
        console.error('Error fetching transaction history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionHistory();
  }, [listingId, selectedAsset]);

  if (loading) {
    return <div className="loading-spinner">Loading transaction history...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const graphData = {
    timestamps: transactions.map(tx => tx.timestamp),
    values: transactions.map(tx => parseFloat(tx.amount))
  };

  return (
    <div className="transaction-history">
      <h2>Transaction History {selectedAsset ? `for ${selectedAsset}` : ''}</h2>
      <TransactionGraph 
        data={graphData} 
        assetName={selectedAsset || 'All Assets'} 
      />
      <TransactionTable transactions={transactions} />
    </div>
  );
};

export default TransactionHistory; 