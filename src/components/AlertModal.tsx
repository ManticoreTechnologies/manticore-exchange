// AlertModal.tsx
import React from 'react';
import '../styles/AlertModal.css';

interface AlertModalProps {
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ onClose }) => {
  return (
    <div className="alert-modal-overlay">
      <div className="alert-modal">
        <p style={{color: 'black'}}>Please install the Chrome wallet extension to connect your wallet.</p>
        <button onClick={() => window.open('https://chrome.google.com/webstore', '_blank')} className="alert-modal-button">
          Get Wallet Extension
        </button>
        <button onClick={onClose} className="alert-modal-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default AlertModal;
