// @ts-ignore
import { FiPlus, FiShoppingCart, FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { RiExchangeFill } from 'react-icons/ri';
import React, { useState } from 'react';
import './TradingHeader.css';
import FeaturedListings from './FeaturedListings';
import SearchSpinner from '../../../components/Spinners/SearchSpinner';

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
    isConnected: boolean;
    featuredListings: Array<{
        id: string;
        title: string;
        price: string;
        asset_name: string;
        highlight?: string;
    }>;
    onFeaturedClick: (listing: any) => void;
    loading: boolean;
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
    handleFilterTypeChange,
    tags,
    handleTagsChange,
    minPrice,
    handleMinPriceChange,
    maxPrice,
    handleMaxPriceChange,
    isConnected,
    featuredListings,
    onFeaturedClick,
    loading
}) => {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <>
            <FeaturedListings 
                listings={featuredListings}
                onListingClick={onFeaturedClick}
            />
            
            <div className="trading-header">
                <div className="trading-header-content">
                    <div className="header-left">
                        <div className="title-with-icon">
                            <RiExchangeFill className="trading-icon" />
                            <h1 className="trading-title">Trading</h1>
                        </div>
                        
                        <button className="create-listing-button" onClick={createListing}>
                            <FiPlus className="create-icon" />
                            <span>Create Listing</span>
                        </button>
                    </div>

                    <div className="header-center">
                        <div className="search-bar-main">
                            <div className="search-input-wrapper">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    placeholder="Search listings..."
                                    aria-label="Search input"
                                />
                                <SearchSpinner loading={loading} />
                            </div>
                            <button 
                                className={`filter-toggle-button ${showFilters ? 'active' : ''}`}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <FiFilter />
                                <span>Filters</span>
                                {showFilters ? <FiChevronUp /> : <FiChevronDown />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`filters-panel ${showFilters ? 'show' : ''}`}>
                    <div className="filters-wrapper">
                        <div className="filter-row">
                            <div className="filter-group">
                                <label>Filter Type</label>
                                <select 
                                    value={filterType} 
                                    onChange={handleFilterTypeChange} 
                                    className="search-select"
                                >
                                    <option value="">All</option>
                                    <option value="seller">Seller Address</option>
                                    <option value="asset">Asset Name</option>
                                    <option value="tags">Tags</option>
                                </select>
                            </div>

                            <div className="filter-group">
                                <label>Filter Value</label>
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
                                        placeholder={`Filter by ${filterType || 'keyword'}...`}
                                        className="filter-input"
                                    />
                                )}
                            </div>

                            <div className="filter-group">
                                <label>Price Range (EVR)</label>
                                <div className="price-inputs">
                                    <input
                                        type="number"
                                        value={minPrice}
                                        onChange={handleMinPriceChange}
                                        placeholder="Min"
                                        className="price-input"
                                    />
                                    <span className="price-separator">to</span>
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
                </div>
            </div>
        </>
    );
};

export default TradingHeader;
