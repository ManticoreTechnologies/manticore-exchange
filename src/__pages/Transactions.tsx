import React, { useEffect, useState } from 'react';
import { fetchTransactions } from '../utility/apiUtils';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Transactions.css';

const Transactions: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation
  const { address } = useParams<{ address: string }>(); // Retrieve 'address' from URL parameters
  const [transactions, setTransactions] = useState<string[]>([]); // State to store fetched transactions
  const [search, setSearch] = useState<string>(address || ''); // State to store search input

  // Function to fetch and set transactions based on an address
  const getTransactions = async (address: string) => {
    const fetchedTransactions = await fetchTransactions(address);
    setTransactions(fetchedTransactions);
  };

  // Fetch transactions when the component mounts or 'address' changes
  useEffect(() => {
    if (address) {
      setSearch(address); // Set the search input to the address from URL params
      getTransactions(address); // Fetch transactions for the address
    }
  }, [address]);

  // Handle change in search input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  // Handle form submission for search
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`/transactions/${search}`); // Navigate to the new address
  };

  // Navigate to the transaction details page
  const handleTransactionClick = (txid: string) => {
    navigate(`/transaction/${txid}`);
  };

  return (
    <div className="transaction-assets-container">
      {/* Search form */}
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Enter wallet address..."
          value={search}
          onChange={handleSearchChange}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '20px',
            boxSizing: 'border-box'
          }}
        />
        <button type="submit" style={{ display: 'none' }}>Search</button>
      </form>

      {/* Display fetched transactions as buttons */}
      {transactions.map((transaction, index) => (
        <button
          key={index}
          onClick={() => handleTransactionClick(transaction)}
          className="transaction-button"
        >
          {transaction}
        </button>
      ))}
    </div>
  );
};

export default Transactions;
