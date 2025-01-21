// @ts-ignore
import { FiPlus, FiShoppingCart } from 'react-icons/fi';
import React from 'react';
import './TradingHeader.css';

interface TradingHeaderProps {
    createListing: () => void;
    toggleCartVisibility: () => void;
    cart: any[];
    searchQuery: string;
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    filterQuery: string;
    handleFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
    filterType: string;
    handleFilterTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const TradingHeader: React.FC<TradingHeaderProps> = ({
    createListing, 
    toggleCartVisibility, 
    cart,
    searchQuery,
    handleSearch,
    filterQuery,
    handleFilter,
    filterType,
    handleFilterTypeChange
}) => {
    return (
        <div className="trading-header">
            <div className="list-icon-container" onClick={createListing}>
                <FiPlus className="list-icon" />
            </div>

            <div className="search-bar-container">
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search..."
                        aria-label="Search input"
                    />
                </div>
            </div>

            <div className="filter-bar-container">
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        value={filterQuery}
                        onChange={handleFilter}
                        placeholder="Filter..."
                        aria-label="Filter input"
                    />
                    <select value={filterType} onChange={handleFilterTypeChange} className="search-select">
                        <option value="">Select Filter</option>
                        <option value="seller_address">Seller Address</option>
                        <option value="listing_address">Listing Address</option>
                        <option value="tags">Tags</option>
                    </select>
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
