import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UnAuthenticated.css'; // Ensure to create this CSS file for styling

const UnAuthenticated: React.FC = () => {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate('/signin');
  };

  return (
    <div className="unauthenticated-container">
      <div className="unauthenticated-content">
        <h1 className="main-title">Wallet Authentication Required</h1>
        
        <div className="message-container">
          <p className="main-message">
            Connect your wallet to access full trading features
          </p>
          <p className="sub-message">
            Authenticate to unlock advanced trading capabilities, portfolio tracking, 
            and personalized market insights.
          </p>
        </div>

        <button onClick={handleSignInClick} className="signin-button">
          Authenticate Wallet
        </button>
      </div>
    </div>
  );
};

export default UnAuthenticated;
