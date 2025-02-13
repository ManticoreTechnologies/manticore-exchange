import React from 'react';
import './Filters.css';

interface FiltersProps {
    isVisible: boolean;
    onSortChange: (sort: string) => void;
    onReissuableChange: (reissuable: string) => void;
}

const Filters: React.FC<FiltersProps> = ({ isVisible, onSortChange, onReissuableChange }) => {
    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onSortChange(event.target.value);
    };

    const handleReissuableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onReissuableChange(event.target.value);
    };

    return (
        <div className={`filters-container ${isVisible ? 'visible' : ''}`}>
            {/* Dropdown filters */}
            <div className="filter-item">
                <label>
                    Sort By:
                    <select onChange={handleSortChange}>
                        <option value="name">Name</option>
                        <option value="height">Height</option>
                        <option value="amount">Amount</option>
                        <option value="units">Units</option>
                    </select>
                </label>
            </div>
            <div className="filter-item">
                <label>
                    Reissuable:
                    <select onChange={handleReissuableChange}>
                        <option value="all">All</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </label>
            </div>
        </div>
    );
};

export default Filters;
