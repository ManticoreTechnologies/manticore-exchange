import React from 'react';

// Define the structure for the transaction's script pub key
interface ScriptPubKey {
  addresses?: string[];
  asm: string;
  hex: string;
  reqSigs: number;
  type: string;
}

// Define the structure for outputs
interface Vout {
  n: number;
  scriptPubKey: ScriptPubKey;
  spentHeight?: number;
  spentIndex?: number;
  spentTxId?: string;
  value: number;
  valueSat: number;
}

// Define the structure for inputs
interface Vin {
  coinbase: string;
  sequence: number;
}

// Define the main structure for a transaction
interface TransactionDetail {
  blockhash: string;
  blocktime: number;
  confirmations: number;
  hash: string;
  height: number;
  hex: string;
  locktime: number;
  size: number;
  time: number;
  txid: string;
  version: number;
  vin: Vin[];
  vout: Vout[];
  vsize: number;
}

// Component props
interface TransactionDetailProps {
  transaction: TransactionDetail;
}

// Functional component with props
const TransactionDetail: React.FC<TransactionDetailProps> = ({ transaction }) => (
  <div className="transaction-page-container">
    <div className="transaction-card">
      <h2>Transaction Details</h2>
      <div className="transaction-details">
        <div className="transaction-detail-item">
          <label>Transaction ID:</label>
          <p>{transaction.txid}</p>
        </div>
        {/* Add more transaction details similarly */}
      </div>
    </div>

    <div className="transaction-card">
      <h2>Inputs</h2>
      {transaction.vin.map((input, index) => (
        <div key={index} className="input-item">
          <label>Coinbase:</label>
          <p>{input.coinbase}</p>
          {/* Additional input details can be added here */}
        </div>
      ))}
    </div>

    <div className="transaction-card">
      <h2>Outputs</h2>
      {transaction.vout.map((output, index) => (
        <div key={index} className="output-item">
          <label>Address:</label>
          <p>{output.scriptPubKey.addresses?.join(', ')}</p>
          <label>Amount:</label>
          <p>{output.value}</p>
          {/* Additional output details can be added here */}
        </div>
      ))}
    </div>
  </div>
);

export default TransactionDetail;
