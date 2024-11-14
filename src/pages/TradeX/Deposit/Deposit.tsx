import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useWebSocket from '../../../hooks/useWebSocket';
import QRCode from 'qrcode.react';
import Cookies from 'js-cookie';
import './Deposit.css';

const Deposit = () => {
  const { asset } = useParams();
  const navigate = useNavigate(); 
  //@ts-ignore
  const { message, sendMessage, isConnected } = useWebSocket('wss://ws.manticore.exchange');
  const [depositAddress, setDepositAddress] = useState<string>('');
  const [loadingAddress, setLoadingAddress] = useState(true);
  //@ts-ignore
  const [balances, setBalances] = useState<{ [key: string]: number }>({});
  //@ts-ignore
  const [balance, setBalance] = useState<number>(0);
  const userSession = Cookies.get('userSession');

  useEffect(() => {
    if (message) {
        console.log(message);
      if (message.startsWith('deposit_addresses ')) {
        const jsonString = message.replace('deposit_addresses ', '').replace(/'/g, '"');
        try {
          const addressesData = JSON.parse(jsonString);
          if (asset && addressesData[asset.toLowerCase()]) {
            setDepositAddress(addressesData[asset.toLowerCase()]);
            setLoadingAddress(false);
          }
        } catch (error) {
          console.error('Error parsing deposit addresses:', error);
        }
      } else if (message.startsWith('balance ')) {
        // Message is in the format: balance BTC 100.00000000
        const messageParts = message.split(' ');
        const assetBalance = messageParts[1];
        const balanceAmount = messageParts[2];
        if (asset && assetBalance.toLowerCase() === asset.toLowerCase()) {
            console.log('Balance for ' + asset + ' is ' + balanceAmount);
          setBalance(Number(balanceAmount) || 0);
        }
      }
    }
  }, [message, asset]);

  useEffect(() => {
    if (userSession) {
        if (Object.keys(balances).length === 0) {
            console.log('Getting balance for ' + asset);
            sendMessage('get_balance ' + asset);
        }
    }
}, [userSession, sendMessage]);



  const handleRescan = () => {
    console.log('Rescan initiated');
    sendMessage('rescan_deposit_addresses');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleTestDeposit = () => {
    if (asset) {
      const testQuantity = 1; // You can change this to any test quantity you want
      console.log(`Testing deposit for ${asset} with quantity ${testQuantity}`);
      sendMessage(`deposit_asset ${asset} ${testQuantity}`);
    }
  };

  return (
    <div className="deposit-container">
      <button className="back-button" onClick={handleBack}>
        Back
      </button>
      <h1>Deposit Crypto</h1>
      <div className="deposit-section">
        <h2>Select Currency</h2>
        <p>{asset}</p>
      </div>
      <div className="deposit-section">
        <h2>Select Network</h2>
        <p>{asset} Main Chain</p>
      </div>
      <div className="deposit-section">
        <h2>Deposit Details</h2>
        {loadingAddress ? (
          <p>Loading deposit address...</p>
        ) : (
          <div className="deposit-details">
            <QRCode value={depositAddress} />
            <p>Deposit Address: {depositAddress}</p>
            <button onClick={() => navigator.clipboard.writeText(depositAddress)}>Copy</button>
          </div>
        )}
      </div>
      <div className="deposit-info">
        <p>Minimum Deposit: 0 {asset}</p>
        <p>Will post to your balance after: 20 Confirmations (~20 minutes)</p>
        <p>Is available for withdrawal after: 80 Confirmations (~80 minutes)</p>
        <p>This address can only receive {asset}</p>
        <p>Please confirm again that the network you selected is {asset} Main Chain</p>
      </div>
      <div className="balance-info">
        <h2>Your Balance</h2>
        <p>{balance}</p>
      </div>
      <button className="rescan-button" onClick={handleRescan}>
        Missing Deposit? Self Service Rescan
      </button>
      <button className="test-deposit-button" onClick={handleTestDeposit}>
        Test Deposit
      </button>
    </div>
  );
};

export default Deposit;
