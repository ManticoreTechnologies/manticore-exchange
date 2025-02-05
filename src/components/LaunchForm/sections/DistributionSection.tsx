import React from 'react';
import Tooltip from '@/components/Tooltip/Tooltip';

interface DistributionSectionProps {
  values: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isActive: boolean;
}

const DistributionSection: React.FC<DistributionSectionProps> = ({ values, onChange, isActive }) => {
  if (!isActive) return null;

  const totalAllocation = [
    Number(values.teamAllocation) || 0,
    Number(values.advisorAllocation) || 0,
    Number(values.marketingAllocation) || 0,
    Number(values.ecosystemAllocation) || 0,
    Number(values.liquidityAllocation) || 0,
    Number(values.publicSaleAllocation) || 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="form-section active">
      <h2>Token Distribution</h2>
      
      <div className="distribution-total">
        <span>Total Allocation: {totalAllocation}%</span>
        {totalAllocation !== 100 && (
          <span className="distribution-warning">
            Total allocation must equal 100%
          </span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="publicSaleAllocation">
            Public Sale
            <Tooltip content="Percentage allocated for public sale" />
          </label>
          <input
            type="number"
            id="publicSaleAllocation"
            name="publicSaleAllocation"
            value={values.publicSaleAllocation}
            onChange={onChange}
            min="0"
            max="100"
            required
            placeholder="e.g., 40"
          />
        </div>

        <div className="form-group">
          <label htmlFor="liquidityAllocation">
            Liquidity Pool
            <Tooltip content="Percentage allocated for initial liquidity" />
          </label>
          <input
            type="number"
            id="liquidityAllocation"
            name="liquidityAllocation"
            value={values.liquidityAllocation}
            onChange={onChange}
            min="0"
            max="100"
            required
            placeholder="e.g., 20"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="teamAllocation">
            Team
            <Tooltip content="Percentage allocated to team members" />
          </label>
          <input
            type="number"
            id="teamAllocation"
            name="teamAllocation"
            value={values.teamAllocation}
            onChange={onChange}
            min="0"
            max="100"
            required
            placeholder="e.g., 15"
          />
        </div>

        <div className="form-group">
          <label htmlFor="advisorAllocation">
            Advisors
            <Tooltip content="Percentage allocated to project advisors" />
          </label>
          <input
            type="number"
            id="advisorAllocation"
            name="advisorAllocation"
            value={values.advisorAllocation}
            onChange={onChange}
            min="0"
            max="100"
            required
            placeholder="e.g., 5"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="marketingAllocation">
            Marketing
            <Tooltip content="Percentage allocated for marketing activities" />
          </label>
          <input
            type="number"
            id="marketingAllocation"
            name="marketingAllocation"
            value={values.marketingAllocation}
            onChange={onChange}
            min="0"
            max="100"
            required
            placeholder="e.g., 10"
          />
        </div>

        <div className="form-group">
          <label htmlFor="ecosystemAllocation">
            Ecosystem
            <Tooltip content="Percentage allocated for ecosystem development" />
          </label>
          <input
            type="number"
            id="ecosystemAllocation"
            name="ecosystemAllocation"
            value={values.ecosystemAllocation}
            onChange={onChange}
            min="0"
            max="100"
            required
            placeholder="e.g., 10"
          />
        </div>
      </div>

      <div className="distribution-chart">
        {/* TODO: Add pie chart visualization */}
      </div>
    </div>
  );
};

export default DistributionSection; 