// AboutPage.tsx

import React from 'react';
import '../styles/AboutPage.css'; // Ensure the CSS file is available for styling
import AssetTypesTable from '../____components/assets/AssetTypesTable';
import '../styles/Buttons.css';

const About: React.FC = () => {
  return (
    <div className="about-page">
      <section className="hero">
        <h1>About Evrmore</h1>
        <p>Evrmore is a groundbreaking blockchain network with unique specifications designed for optimal performance and accessibility. Below are some of the key features of the Evrmore network:</p>
        <ul>
          <li>Block Time: 1 minute</li>
          <li>Block Reward: 2778 EVR (2500.2 EVR to the miner & 277.8 to the minerdevfund)</li>
          <li>Block Reward Halving Schedule: Approximately every 3.2 years</li>
          <li>Maximum Coin Supply: 21 Billion EVR</li>
          <li>Circulating Coin Supply: --- EVR</li>
          <li>Block Size: 2MB (potential future increases)</li>
          <li>Algorithm: EvrProgPow (Programmable Proof of Work with a starting DAG size of 3GB)</li>
        </ul>
        <a href="https://evrmorecoin.org" rel="noopener noreferrer" target="_blank" className="btn-primary">Evrmore Website</a>
        <AssetTypesTable />
      </section>
    </div>
  );
};

export default About;
