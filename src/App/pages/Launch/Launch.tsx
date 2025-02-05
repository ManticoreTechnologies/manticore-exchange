import React, { useState } from 'react';
import './Launch.css';

interface AssetParams {
  name: string;
  symbol: string;
  totalSupply: string;
  initialPrice: string;
  description: string;
  vestingPeriod: string;
  vestingIncrement: string;
  metadata: string;
}

const Launch: React.FC = () => {
  const [assetParams, setAssetParams] = useState<AssetParams>({
    name: '',
    symbol: '',
    totalSupply: '',
    initialPrice: '',
    description: '',
    vestingPeriod: '',
    vestingIncrement: '',
    metadata: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement asset creation logic
    console.log('Asset parameters:', assetParams);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAssetParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="launch-container">
      <div className="launch-header">
        <h1>Launch Your EVR Asset</h1>
        <p>Create and configure your custom asset on the Evrmore blockchain</p>
      </div>

      <form className="launch-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Asset Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={assetParams.name}
            onChange={handleChange}
            placeholder="Enter asset name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="symbol">Asset Symbol</label>
          <input
            type="text"
            id="symbol"
            name="symbol"
            value={assetParams.symbol}
            onChange={handleChange}
            placeholder="Enter asset symbol"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="totalSupply">Total Supply</label>
          <input
            type="number"
            id="totalSupply"
            name="totalSupply"
            value={assetParams.totalSupply}
            onChange={handleChange}
            placeholder="Enter total supply"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="initialPrice">Initial Price (EVR)</label>
          <input
            type="number"
            id="initialPrice"
            name="initialPrice"
            value={assetParams.initialPrice}
            onChange={handleChange}
            placeholder="Enter initial price"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={assetParams.description}
            onChange={handleChange}
            placeholder="Enter asset description"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="vestingPeriod">Vesting Period (days)</label>
          <input
            type="number"
            id="vestingPeriod"
            name="vestingPeriod"
            value={assetParams.vestingPeriod}
            onChange={handleChange}
            placeholder="Enter vesting period in days"
          />
        </div>

        <div className="form-group">
          <label htmlFor="vestingIncrement">Vesting Increment (%)</label>
          <input
            type="number"
            id="vestingIncrement"
            name="vestingIncrement"
            value={assetParams.vestingIncrement}
            onChange={handleChange}
            placeholder="Enter vesting increment percentage"
          />
        </div>

        <div className="form-group">
          <label htmlFor="metadata">Additional Metadata (JSON)</label>
          <textarea
            id="metadata"
            name="metadata"
            value={assetParams.metadata}
            onChange={handleChange}
            placeholder="Enter additional metadata in JSON format"
          />
        </div>

        <button type="submit" className="submit-button">
          Launch Asset
        </button>
      </form>
    </div>
  );
};

export default Launch; 