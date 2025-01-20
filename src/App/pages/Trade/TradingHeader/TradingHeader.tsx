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
}

const TradingHeader: React.FC<TradingHeaderProps> = ({
    createListing, 
    toggleCartVisibility, 
    cart,
    searchQuery,
    handleSearch
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

            <div className="cart-icon-container" onClick={toggleCartVisibility}>
                <FiShoppingCart className="cart-icon" />
                {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
            </div>
        </div>
    );
};

export default TradingHeader;
