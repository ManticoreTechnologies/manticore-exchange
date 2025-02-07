import React from 'react';
import { FaCoins, FaCubes, FaShieldAlt } from 'react-icons/fa';
import './SecurityVisualization.css';

interface SecurityLayer {
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface SecurityVisualizationProps {
  layers?: SecurityLayer[];
}

const defaultLayers: SecurityLayer[] = [
  {
    name: 'Asset Protocol',
    icon: <FaCoins />,
    description: 'Built-in asset management and security'
  },
  {
    name: 'UTXO Model',
    icon: <FaCubes />,
    description: 'Isolated state and parallel processing'
  },
  {
    name: 'Network Security',
    icon: <FaShieldAlt />,
    description: 'EvrProgPow and consensus rules'
  }
];

export const SecurityVisualization: React.FC<SecurityVisualizationProps> = ({
  layers = defaultLayers
}) => {
  return (
    <div className="security-visualization">
      <div className="security-layers">
        {layers.map((layer, index) => (
          <div key={index} className="security-layer">
            <div className="layer-icon">
              {layer.icon}
            </div>
            <span className="layer-name">{layer.name}</span>
            <p className="layer-description">{layer.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityVisualization; 