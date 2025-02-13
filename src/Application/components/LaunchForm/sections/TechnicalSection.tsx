import React from 'react';
import Tooltip from '@/Application/components/Tooltip/Tooltip';

interface TechnicalSectionProps {
  values: {
    maxTransactionAmount: string;
    maxWalletAmount: string;
    transferDelay: string;
    transferFee: string;
    burnRate: string;
    votingRights: boolean;
    proposalThreshold: string;
    quorumRequirement: string;
    autoLiquidity: boolean;
    buybackEnabled: boolean;
    stakingEnabled: boolean;
    rewardToken: string;
    rewardRate: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isActive: boolean;
}

const TechnicalSection: React.FC<TechnicalSectionProps> = ({ values, onChange, isActive }) => {
  if (!isActive) return null;

  return (
    <div className="form-section active">
      <h2>Technical Parameters</h2>

      <div className="technical-group">
        <h3>Transaction Limits</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="maxTransactionAmount">
              Max Transaction
              <Tooltip content="Maximum tokens per transaction (0 for no limit)" />
            </label>
            <input
              type="number"
              id="maxTransactionAmount"
              name="maxTransactionAmount"
              value={values.maxTransactionAmount}
              onChange={onChange}
              min="0"
              placeholder="e.g., 1000000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="maxWalletAmount">
              Max Wallet Balance
              <Tooltip content="Maximum tokens per wallet (0 for no limit)" />
            </label>
            <input
              type="number"
              id="maxWalletAmount"
              name="maxWalletAmount"
              value={values.maxWalletAmount}
              onChange={onChange}
              min="0"
              placeholder="e.g., 5000000"
            />
          </div>
        </div>
      </div>

      <div className="technical-group">
        <h3>Transaction Parameters</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="transferDelay">
              Transfer Delay (seconds)
              <Tooltip content="Delay between transactions (0 for no delay)" />
            </label>
            <input
              type="number"
              id="transferDelay"
              name="transferDelay"
              value={values.transferDelay}
              onChange={onChange}
              min="0"
              placeholder="e.g., 60"
            />
          </div>

          <div className="form-group">
            <label htmlFor="transferFee">
              Transfer Fee (%)
              <Tooltip content="Fee charged on each transfer" />
            </label>
            <input
              type="number"
              id="transferFee"
              name="transferFee"
              value={values.transferFee}
              onChange={onChange}
              min="0"
              max="100"
              step="0.1"
              placeholder="e.g., 2.5"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="burnRate">
            Burn Rate (%)
            <Tooltip content="Percentage of tokens to burn on each transfer" />
          </label>
          <input
            type="number"
            id="burnRate"
            name="burnRate"
            value={values.burnRate}
            onChange={onChange}
            min="0"
            max="100"
            step="0.1"
            placeholder="e.g., 1"
          />
        </div>
      </div>

      <div className="technical-group">
        <h3>Governance Settings</h3>
        <div className="form-row">
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="votingRights"
              name="votingRights"
              checked={values.votingRights}
              onChange={onChange}
            />
            <label htmlFor="votingRights">
              Enable Voting Rights
              <Tooltip content="Allow token holders to participate in governance" />
            </label>
          </div>
        </div>

        {values.votingRights && (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="proposalThreshold">
                Proposal Threshold
                <Tooltip content="Minimum tokens required to submit a proposal" />
              </label>
              <input
                type="number"
                id="proposalThreshold"
                name="proposalThreshold"
                value={values.proposalThreshold}
                onChange={onChange}
                min="0"
                placeholder="e.g., 100000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="quorumRequirement">
                Quorum Requirement (%)
                <Tooltip content="Minimum participation required for valid vote" />
              </label>
              <input
                type="number"
                id="quorumRequirement"
                name="quorumRequirement"
                value={values.quorumRequirement}
                onChange={onChange}
                min="0"
                max="100"
                placeholder="e.g., 51"
              />
            </div>
          </div>
        )}
      </div>

      <div className="technical-group">
        <h3>Additional Features</h3>
        <div className="checkbox-grid">
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="autoLiquidity"
              name="autoLiquidity"
              checked={values.autoLiquidity}
              onChange={onChange}
            />
            <label htmlFor="autoLiquidity">
              Auto-Liquidity
              <Tooltip content="Automatically add to liquidity pool from fees" />
            </label>
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="buybackEnabled"
              name="buybackEnabled"
              checked={values.buybackEnabled}
              onChange={onChange}
            />
            <label htmlFor="buybackEnabled">
              Auto-Buyback
              <Tooltip content="Automatically buy back tokens from market" />
            </label>
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="stakingEnabled"
              name="stakingEnabled"
              checked={values.stakingEnabled}
              onChange={onChange}
            />
            <label htmlFor="stakingEnabled">
              Enable Staking
              <Tooltip content="Allow token holders to stake for rewards" />
            </label>
          </div>
        </div>

        {values.stakingEnabled && (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rewardToken">
                Reward Token
                <Tooltip content="Token used for staking rewards" />
              </label>
              <input
                type="text"
                id="rewardToken"
                name="rewardToken"
                value={values.rewardToken}
                onChange={onChange}
                placeholder="e.g., EVR"
              />
            </div>

            <div className="form-group">
              <label htmlFor="rewardRate">
                Reward Rate (% APY)
                <Tooltip content="Annual percentage yield for staking" />
              </label>
              <input
                type="number"
                id="rewardRate"
                name="rewardRate"
                value={values.rewardRate}
                onChange={onChange}
                min="0"
                placeholder="e.g., 12"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicalSection; 