import React from 'react';
import { Transaction } from '../../types';
import './TransactionHistory.css';

interface TransactionHistoryProps {
  listingId: string;
  assetName: string;
  transactions: Transaction[];
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  listingId,
  assetName,
  transactions
}) => {
  if (!transactions.length) {
    return (
      <div className="transaction-history-empty">
        <p>No transaction history</p>
        <p className="empty-details">No transactions found for {assetName}</p>
      </div>
    );
  }

  return (
    <div className="transaction-history">
      <h3>Transaction History</h3>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Transaction Hash</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr key={`${tx.tx_hash}-${index}`}>
              <td>{tx.time ? new Date(tx.time).toLocaleString() : 'Pending'}</td>
              <td className={`transaction-type ${tx.entry_type}`}>
                {tx.entry_type}
              </td>
              <td>{parseFloat(tx.amount).toLocaleString()} {assetName}</td>
              <td className={`transaction-status ${tx.confirmations >= 6 ? 'completed' : 'pending'}`}>
                {tx.confirmations >= 6 ? 'Confirmed' : `${tx.confirmations}/6 confirmations`}
              </td>
              <td className="transaction-hash">
                <a
                  href={`https://explorer.manticore.exchange/tx/${tx.tx_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {tx.tx_hash.substring(0, 8)}...{tx.tx_hash.substring(tx.tx_hash.length - 8)}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};