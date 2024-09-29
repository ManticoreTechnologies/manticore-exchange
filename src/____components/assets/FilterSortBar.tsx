import React from 'react';
import '../../styles/FilterSortBar.css';

interface FilterSortBarProps {
  onFilterChange: (filter: string, value: string) => void;
  onSortChange: (sort: string) => void;
}

const FilterSortBar: React.FC<FilterSortBarProps> = ({ onFilterChange, onSortChange }) => {
  return (
    <div className="filter-sort-bar">
      <div className="filter-options">
        <label>
          Type:
          <select onChange={(e) => onFilterChange('type', e.target.value)}>
            <option value="">All</option>
            <option value="token">Tokens</option>
            <option value="collectible">Collectibles</option>
            <option value="utility">Utility</option>
          </select>
        </label>

        <label>
          Status:
          <select onChange={(e) => onFilterChange('status', e.target.value)}>
            <option value="">All</option>
            <option value="listed">Listed</option>
            <option value="unlisted">Unlisted</option>
            <option value="reissuable">Reissuable</option>
            <option value="non-reissuable">Non-Reissuable</option>
          </select>
        </label>

        <label>
          IPFS:
          <select onChange={(e) => onFilterChange('ipfs', e.target.value)}>
            <option value="">All</option>
            <option value="with_ipfs">With IPFS</option>
            <option value="without_ipfs">Without IPFS</option>
          </select>
        </label>
      </div>

      <div className="sort-options">
        <label>
          Sort by:
          <select onChange={(e) => onSortChange(e.target.value)}>
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="amount_asc">Amount (Low to High)</option>
            <option value="amount_desc">Amount (High to Low)</option>
            <option value="date_newest">Date (Newest First)</option>
            <option value="date_oldest">Date (Oldest First)</option>
            <option value="status_listed">Status (Listed First)</option>
            <option value="status_unlisted">Status (Unlisted First)</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default FilterSortBar;

