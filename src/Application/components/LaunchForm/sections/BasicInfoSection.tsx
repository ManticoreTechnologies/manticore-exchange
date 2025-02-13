import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import Tooltip from '@/Application/components/Tooltip/Tooltip';

interface BasicInfoSectionProps {
  values: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  isActive: boolean;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ values, onChange, isActive }) => {
  if (!isActive) return null;
  
  return (
    <div className="form-section active">
      <h2>Basic Information</h2>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">
            Asset Name
            <Tooltip content="Full name of your asset (max 32 characters)" />
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={values.name}
            onChange={onChange}
            maxLength={32}
            required
            placeholder="e.g., My EVR Asset"
          />
        </div>

        <div className="form-group">
          <label htmlFor="symbol">
            Asset Symbol
            <Tooltip content="Trading symbol for your asset (max 8 characters)" />
          </label>
          <input
            type="text"
            id="symbol"
            name="symbol"
            value={values.symbol}
            onChange={onChange}
            maxLength={8}
            required
            placeholder="e.g., MYEVR"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">
          Description
          <Tooltip content="Detailed description of your asset and its purpose" />
        </label>
        <textarea
          id="description"
          name="description"
          value={values.description}
          onChange={onChange}
          required
          placeholder="Describe your asset's purpose, features, and benefits..."
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">
            Category
            <Tooltip content="Main category of your asset" />
          </label>
          <select
            id="category"
            name="category"
            value={values.category}
            onChange={onChange}
            required
          >
            <option value="">Select Category</option>
            <option value="defi">DeFi</option>
            <option value="nft">NFT</option>
            <option value="gaming">Gaming</option>
            <option value="metaverse">Metaverse</option>
            <option value="dao">DAO</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tags">
            Tags
            <Tooltip content="Comma-separated tags to help categorize your asset" />
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={values.tags}
            onChange={onChange}
            placeholder="e.g., defi, yield, staking"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection; 