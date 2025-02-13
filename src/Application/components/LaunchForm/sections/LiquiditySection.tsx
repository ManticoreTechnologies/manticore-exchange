import React from 'react';
import Tooltip from '@/Application/components/Tooltip/Tooltip';

interface LiquiditySectionProps {
  values: {
    liquidityPair: string;
    liquidityLockDuration: string;
    initialLiquidity: string;
    autoLiquidity: boolean;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isActive: boolean;
}

const LiquiditySection: React.FC<LiquiditySectionProps> = ({ values, onChange, isActive }) => {
  if (!isActive) return null;

  return (
    <div className="form-section active">
      <h2>Liquidity Configuration</h2>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="liquidityPair">
            Trading Pair
            <Tooltip content="The trading pair for your asset (e.g., EVR)" />
          </label>
          <select
            id="liquidityPair"
            name="liquidityPair"
            value={values.liquidityPair}
            onChange={onChange}
            required
          >
            <option value="">Select Trading Pair</option>
            <option value="EVR">EVR</option>
            <option value="WEVR">Wrapped EVR</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="initialLiquidity">
            Initial Liquidity (EVR)
            <Tooltip content="Amount of EVR to add as initial liquidity" />
          </label>
          <input
            type="number"
            id="initialLiquidity"
            name="initialLiquidity"
            value={values.initialLiquidity}
            onChange={onChange}
            min="0"
            step="0.00000001"
            required
            placeholder="e.g., 1000"
          />
        </div>
      </div>

      <div className="liquidity-lock-section">
        <h3>Liquidity Locking</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="liquidityLockDuration">
              Lock Duration (days)
              <Tooltip content="Period to lock liquidity tokens" />
            </label>
            <input
              type="number"
              id="liquidityLockDuration"
              name="liquidityLockDuration"
              value={values.liquidityLockDuration}
              onChange={onChange}
              min="30"
              required
              placeholder="e.g., 365"
            />
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="autoLiquidity"
              name="autoLiquidity"
              checked={values.autoLiquidity}
              onChange={onChange}
            />
            <label htmlFor="autoLiquidity">
              Auto-Add Liquidity
              <Tooltip content="Automatically add liquidity from transaction fees" />
            </label>
          </div>
        </div>
      </div>

      <div className="info-panel">
        <h4>Liquidity Information</h4>
        <ul>
          <li>Minimum lock period: 30 days</li>
          <li>Recommended lock period: 365 days</li>
          <li>Lock extensions available after initial period</li>
          <li>Early unlock not possible</li>
        </ul>
      </div>

      <div className="liquidity-chart">
        {/* TODO: Add liquidity projection chart */}
      </div>
    </div>
  );
};

export default LiquiditySection; 