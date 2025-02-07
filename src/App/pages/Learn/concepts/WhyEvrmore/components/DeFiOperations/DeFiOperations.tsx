import React from 'react';
import { FaExchangeAlt, FaCoins, FaCubes } from 'react-icons/fa';
import './DeFiOperations.css';

interface Operation {
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface DeFiOperationsProps {
  operations?: Operation[];
}

const defaultOperations: Operation[] = [
  {
    name: 'Asset Creation',
    icon: <FaCoins />,
    description: 'No Smart Contracts Required'
  },
  {
    name: 'Atomic Swaps',
    icon: <FaExchangeAlt />,
    description: 'Trustless Exchange'
  },
  {
    name: 'Asset Management',
    icon: <FaCubes />,
    description: 'Built-in Protocol Support'
  }
];

export const DeFiOperations: React.FC<DeFiOperationsProps> = ({
  operations = defaultOperations
}) => {
  return (
    <div className="defi-operations">
      <div className="operations-grid">
        {operations.map((op, index) => (
          <div key={index} className="operation-card">
            <div className="operation-icon">
              {op.icon}
            </div>
            <span className="operation-name">{op.name}</span>
            <p className="operation-description">{op.description}</p>
          </div>
        ))}
      </div>

      <div className="atomic-swap-demo">
        <div className="swap-assets">
          <div className="asset asset-a">
            <FaCoins className="asset-icon" />
            <span>Asset A</span>
          </div>
          <div className="swap-arrows">
            <FaExchangeAlt />
          </div>
          <div className="asset asset-b">
            <FaCoins className="asset-icon" />
            <span>Asset B</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeFiOperations; 