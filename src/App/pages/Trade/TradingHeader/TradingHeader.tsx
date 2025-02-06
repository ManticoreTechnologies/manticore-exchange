// @ts-ignore
import { FiPlus, FiShoppingCart, FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { RiExchangeFill } from 'react-icons/ri';
import React, { useState } from 'react';
import './TradingHeader.css';
import FeaturedListings from './FeaturedListings';

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
    tags: string[];
    handleTagsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    minPrice: string;
    handleMinPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    maxPrice: string;
    handleMaxPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    featuredListings: Array<{
        id: string;
        title: string;
        price: string;
        asset_name: string;
        highlight?: string;
    }>;
    onFeaturedClick: (listing: any) => void;
}

const TradingHeader: React.FC<TradingHeaderProps> = ({
    createListing,
    searchQuery,
    handleSearch,
    filterQuery,
    handleFilter,
    filterType,
    handleFilterTypeChange,
    tags,
    handleTagsChange,
    minPrice,
    handleMinPriceChange,
    maxPrice,
    handleMaxPriceChange,
    featuredListings,
    onFeaturedClick
}) => {
    const [showFilters, setShowFilters] = useState(false);

    const handleFeaturedClick = (listing: any) => {
        // Handle featured listing click
        console.log('Featured listing clicked:', listing);
    };

    return (
        <div className="trading-header">
            <div className="trading-header-main">
                <div className="title-section">
                    <div className="title-with-icon">
                        <h1 className="trading-title">Trading</h1>
                        <RiExchangeFill className="trading-icon" />
                    </div>
                    <p className="trading-subtitle">Buy and sell assets on the marketplace</p>
                </div>

                <div className="header-actions">
                    <div className="header-actions-left">
                        <button className="create-listing-button" onClick={createListing}>
                            <FiPlus className="create-icon" />
                            <span>Create New Listing</span>
                        </button>

                        <div className="search-bar-main">
                            <div className="search-input-wrapper">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    placeholder="Search listings..."
                                    aria-label="Search input"
                                />
                            </div>
                            <button 
                                className={`filter-toggle-button ${showFilters ? 'active' : ''}`}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <FiFilter />
                                <span className="filter-text">Filters</span>
                                {showFilters ? <FiChevronUp /> : <FiChevronDown />}
                            </button>
                        </div>
                    </div>

                    <FeaturedListings 
                        listings={featuredListings}
                        onListingClick={onFeaturedClick}
                    />
                </div>
            </div>

            <div className={`filters-section ${showFilters ? 'show' : ''}`}>
                <div className="filters-wrapper">
                    <div className="filter-group">
                        <select 
                            value={filterType} 
                            onChange={handleFilterTypeChange} 
                            className="search-select"
                        >
                            <option value="">Filter Type</option>
                            <option value="seller">Seller Address</option>
                            <option value="asset">Asset Name</option>
                            <option value="tags">Tags</option>
                        </select>

                        {filterType === 'tags' ? (
                            <input
                                type="text"
                                value={tags.join(', ')}
                                onChange={handleTagsChange}
                                placeholder="Enter tags (comma separated)"
                                className="filter-input"
                            />
                        ) : (
                            <input
                                type="text"
                                value={filterQuery}
                                onChange={handleFilter}
                                placeholder={`Filter by ${filterType}...`}
                                className="filter-input"
                            />
                        )}
                    </div>

                    <div className="price-group">
                        <span className="price-label">Price Range (EVR)</span>
                        <div className="price-filters">
                            <input
                                type="number"
                                value={minPrice}
                                onChange={handleMinPriceChange}
                                placeholder="Min"
                                className="price-input"
                            />
                            <input
                                type="number"
                                value={maxPrice}
                                onChange={handleMaxPriceChange}
                                placeholder="Max"
                                className="price-input"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="cart-icon-container" onClick={toggleCartVisibility}>
                <FiShoppingCart className="cart-icon" />
                {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
            </div> */}
        </div>
    );
};

export default TradingHeader;
