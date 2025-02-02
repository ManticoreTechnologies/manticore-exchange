import React from 'react';
import { FiExternalLink } from 'react-icons/fi';

interface Transaction {
  tx_hash: string;
  timestamp: string;
  amount: string;
  type: 'in' | 'out';
  asset_name: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  return (
    <div className="transaction-table-container">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Transaction</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr key={`${tx.tx_hash}-${index}`}>
              <td>{new Date(tx.timestamp).toLocaleString()}</td>
              <td>
                <span className={`transaction-type ${tx.type}`}>
                  {tx.type === 'in' ? 'Received' : 'Sent'}
                </span>
              </td>
              <td>{tx.amount} {tx.asset_name}</td>
              <td>
                <a
                  href={`https://explorer.manticore.exchange/tx/${tx.tx_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tx-link"
                >
                  {tx.tx_hash.substring(0, 8)}...
                  <FiExternalLink />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable; 