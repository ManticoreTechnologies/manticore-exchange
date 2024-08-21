// src/components/Banner.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Banner.css'; // Ensure to create this file for styling the banner

const Banner: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/roadmap');
  };

  return (
    <div className="banner">
      <p>Wallets are currently under development!</p>
      <button onClick={handleClick} className="banner-button">View Project Roadmap</button>
    </div>
  );
};

export default Banner;
