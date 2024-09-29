// WalletConnect.tsx
import React, { useState } from 'react';
import '../styles/WalletConnect.css';
import AlertModal from './AlertModal'; // Import AlertModal component

interface WalletConnectProps {
  onWalletConnected: (address: string) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onWalletConnected }) => {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        onWalletConnected(accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        setShowAlert(true);
      }
    } else {
      setShowAlert(true);
    }
  };

  return (
    <>
      <button onClick={connectWallet} className="link-wallet-button">
        {walletAddress ? 'Wallet Connected' : 'Link Wallet'}
      </button>
      {showAlert && <AlertModal onClose={() => setShowAlert(false)} />}
    </>
  );
};

export default WalletConnect;
