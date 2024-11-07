import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UnAuthenticated.css'; // Ensure to create this CSS file for styling

const UnAuthenticated: React.FC = () => {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate('/tradex/signin');
  };

  return (
    <div className="unauthenticated-container">
      <h2>You are not logged in</h2>
      <p>Please sign in to access this page.</p>
      <button onClick={handleSignInClick} className="signin-button">
        Go to Sign In
      </button>
    </div>
  );
};

export default UnAuthenticated;
