import React from 'react';
import Tooltip from '@/components/Tooltip/Tooltip';

interface ComplianceSectionProps {
  values: {
    kycProvider: string;
    auditProvider: string;
    restrictedCountries: string[];
    transferRestricted: boolean;
    qualifiedInvestorsOnly: boolean;
    kycRequired: boolean;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isActive: boolean;
}

const ComplianceSection: React.FC<ComplianceSectionProps> = ({ values, onChange, isActive }) => {
  if (!isActive) return null;

  const kycProviders = ['None', 'Manticore KYC', 'External KYC'];
  const auditProviders = ['None', 'Manticore Audit', 'External Audit'];

  return (
    <div className="form-section active">
      <h2>Compliance & Security</h2>

      <div className="compliance-requirements">
        <h3>Basic Requirements</h3>
        <div className="checkbox-grid">
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="kycRequired"
              name="kycRequired"
              checked={values.kycRequired}
              onChange={onChange}
            />
            <label htmlFor="kycRequired">
              KYC Required
              <Tooltip content="Require KYC verification for token holders" />
            </label>
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="transferRestricted"
              name="transferRestricted"
              checked={values.transferRestricted}
              onChange={onChange}
            />
            <label htmlFor="transferRestricted">
              Transfer Restrictions
              <Tooltip content="Enable transfer restrictions between wallets" />
            </label>
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="qualifiedInvestorsOnly"
              name="qualifiedInvestorsOnly"
              checked={values.qualifiedInvestorsOnly}
              onChange={onChange}
            />
            <label htmlFor="qualifiedInvestorsOnly">
              Qualified Investors Only
              <Tooltip content="Restrict to qualified/accredited investors" />
            </label>
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="kycProvider">
            KYC Provider
            <Tooltip content="Select KYC verification provider" />
          </label>
          <select
            id="kycProvider"
            name="kycProvider"
            value={values.kycProvider}
            onChange={onChange}
            required={values.kycRequired}
          >
            {kycProviders.map(provider => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="auditProvider">
            Audit Provider
            <Tooltip content="Select smart contract audit provider" />
          </label>
          <select
            id="auditProvider"
            name="auditProvider"
            value={values.auditProvider}
            onChange={onChange}
          >
            {auditProviders.map(provider => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="restricted-countries">
        <h3>Restricted Regions</h3>
        <div className="info-alert">
          <p>Select regions where your token cannot be traded due to regulations</p>
        </div>
        <div className="countries-grid">
          {/* TODO: Add country selection component */}
          <div className="form-group">
            <label>
              Restricted Countries
              <Tooltip content="Countries where trading is not allowed" />
            </label>
            {/* Placeholder for country selection */}
            <div className="country-select-placeholder">
              Country selection component will be added here
            </div>
          </div>
        </div>
      </div>

      <div className="compliance-info">
        <div className="info-panel">
          <h4>Compliance Notes</h4>
          <ul>
            <li>KYC verification can take up to 24 hours</li>
            <li>Audit process typically takes 5-7 business days</li>
            <li>Transfer restrictions can be modified after launch</li>
            <li>Regional restrictions are enforced automatically</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ComplianceSection; 