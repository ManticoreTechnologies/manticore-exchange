// @ts-ignore
import { FiPlus, FiShoppingCart } from 'react-icons/fi';
import React from 'react';
import './TradingHeader.css';

interface TradingHeaderProps {
    createListing: () => void;
    toggleCartVisibility: () => void;
    cart: any[];
    searchColumn: string;
    handleColumnChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    searchQuery: string;
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    searchOptions: Array<{ value: string; label: string; }>;
}

const TradingHeader: React.FC<TradingHeaderProps> = ({
    createListing, 
    toggleCartVisibility, 
    cart,
    searchColumn,
    handleColumnChange,
    searchQuery,
    handleSearch,
    searchOptions
}) => {
    return (
        <div className="trading-header">
            <div className="list-icon-container" onClick={createListing}>
                <FiPlus className="list-icon" />
            </div>

            <div className="search-bar-container">
                <div className="search-input-wrapper">
                    <select 
                        value={searchColumn}
                        onChange={handleColumnChange}
                        aria-label="Search category"
                        className="search-select"
                    >
                        {searchOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder={`Search by ${searchOptions.find(opt => opt.value === searchColumn)?.label.toLowerCase()}...`}
                        aria-label="Search input"
                    />
                </div>
            </div>

            <div className="cart-icon-container" onClick={toggleCartVisibility}>
                <FiShoppingCart className="cart-icon" />
                {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
            </div>
        </div>
    );
};

export default TradingHeader;
