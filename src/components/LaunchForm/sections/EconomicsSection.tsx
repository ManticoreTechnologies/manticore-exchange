import React from 'react';
import Tooltip from '@/components/Tooltip/Tooltip';

interface EconomicsSectionProps {
  values: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isActive: boolean;
}

const EconomicsSection: React.FC<EconomicsSectionProps> = ({ values, onChange, isActive }) => {
  if (!isActive) return null;

  return (
    <div className="form-section active">
      <h2>Economic Parameters</h2>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="totalSupply">
            Total Supply
            <Tooltip content="Maximum number of tokens that can ever exist" />
          </label>
          <input
            type="number"
            id="totalSupply"
            name="totalSupply"
            value={values.totalSupply}
            onChange={onChange}
            min="1"
            required
            placeholder="e.g., 1000000"
          />
        </div>

        <div className="form-group">
          <label htmlFor="initialSupply">
            Initial Supply
            <Tooltip content="Number of tokens to mint at launch" />
          </label>
          <input
            type="number"
            id="initialSupply"
            name="initialSupply"
            value={values.initialSupply}
            onChange={onChange}
            min="1"
            required
            placeholder="e.g., 100000"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="divisibility">
            Decimals
            <Tooltip content="Number of decimal places (usually 8 for EVR assets)" />
          </label>
          <input
            type="number"
            id="divisibility"
            name="divisibility"
            value={values.divisibility}
            onChange={onChange}
            min="0"
            max="8"
            required
            placeholder="8"
          />
        </div>

        <div className="form-group">
          <label htmlFor="initialPrice">
            Initial Price (EVR)
            <Tooltip content="Initial price per token in EVR" />
          </label>
          <input
            type="number"
            id="initialPrice"
            name="initialPrice"
            value={values.initialPrice}
            onChange={onChange}
            min="0"
            step="0.00000001"
            required
            placeholder="e.g., 0.0001"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="saleType">
            Sale Type
            <Tooltip content="Type of token sale" />
          </label>
          <select
            id="saleType"
            name="saleType"
            value={values.saleType}
            onChange={onChange}
            required
          >
            <option value="public">Public Sale</option>
            <option value="private">Private Sale</option>
            <option value="presale">Presale</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="listingPrice">
            Listing Price (EVR)
            <Tooltip content="Price at which the token will be listed for trading" />
          </label>
          <input
            type="number"
            id="listingPrice"
            name="listingPrice"
            value={values.listingPrice}
            onChange={onChange}
            min="0"
            step="0.00000001"
            required
            placeholder="e.g., 0.0002"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="softCap">
            Soft Cap (EVR)
            <Tooltip content="Minimum amount to raise for the sale to be considered successful" />
          </label>
          <input
            type="number"
            id="softCap"
            name="softCap"
            value={values.softCap}
            onChange={onChange}
            min="0"
            required
            placeholder="e.g., 1000"
          />
        </div>

        <div className="form-group">
          <label htmlFor="hardCap">
            Hard Cap (EVR)
            <Tooltip content="Maximum amount that can be raised" />
          </label>
          <input
            type="number"
            id="hardCap"
            name="hardCap"
            value={values.hardCap}
            onChange={onChange}
            min="0"
            required
            placeholder="e.g., 5000"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="minInvestment">
            Min Investment (EVR)
            <Tooltip content="Minimum amount per investor" />
          </label>
          <input
            type="number"
            id="minInvestment"
            name="minInvestment"
            value={values.minInvestment}
            onChange={onChange}
            min="0"
            required
            placeholder="e.g., 0.1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="maxInvestment">
            Max Investment (EVR)
            <Tooltip content="Maximum amount per investor" />
          </label>
          <input
            type="number"
            id="maxInvestment"
            name="maxInvestment"
            value={values.maxInvestment}
            onChange={onChange}
            min="0"
            required
            placeholder="e.g., 10"
          />
        </div>
      </div>

      <div className="form-group checkbox-group">
        <input
          type="checkbox"
          id="reissuable"
          name="reissuable"
          checked={values.reissuable}
          onChange={onChange}
        />
        <label htmlFor="reissuable">
          Reissuable
          <Tooltip content="Allow minting additional tokens after initial creation" />
        </label>
      </div>
    </div>
  );
};

export default EconomicsSection; 