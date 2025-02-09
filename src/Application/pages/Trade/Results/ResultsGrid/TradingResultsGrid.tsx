import React from 'react';
import { Listing } from '../../types';
import './TradingResultsGrid.css';
import Pagination from '../../Components/Pagination';

interface TradingResultsGridProps {
    results: Listing[];
    addToCart: (listing: Listing) => void;
    buyNow: (listing: Listing) => void;
    showDetails: (listing: Listing) => void;
    currentPage: number;
    totalPages: number;
    totalResults: number;
    onPageChange: (page: number) => void;
}

const TradingResultsGrid: React.FC<TradingResultsGridProps> = ({
    results,
    addToCart,
    buyNow,
    showDetails,
    currentPage,
    totalPages,
    totalResults,
    onPageChange
}) => {
    return (
        <div className="trading-results">
            <div className="results-grid">
                {results.map((listing) => (
                    <div key={listing.id} className="result-card" onClick={() => showDetails(listing)}>
                        <div className="result-image">
                            {listing.image_ipfs_hash ? (
                                <img 
                                    src={`https://ipfs.io/ipfs/${listing.image_ipfs_hash}`} 
                                    alt={listing.name}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/placeholder.png';
                                    }}
                                />
                            ) : (
                                <div className="placeholder-image">No Image</div>
                            )}
                        </div>
                        <div className="result-info">
                            <h3>{listing.name}</h3>
                            <p className="description">{listing.description}</p>
                            <div className="price-info">
                                <span className="price">
                                    {listing.prices[0]?.price_evr || '0'} EVR
                                </span>
                                <span className="asset">
                                    {listing.balances[0]?.asset_name || 'Unknown'}
                                </span>
                            </div>
                            <div className="listing-status">
                                <span className={`status ${listing.status.toLowerCase()}`}>
                                    {listing.status}
                                </span>
                                {listing.balances[0]?.confirmed_balance && (
                                    <span className="quantity">
                                        Qty: {listing.balances[0].confirmed_balance}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="result-actions">
                            <button 
                                className="action-button add-to-cart"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(listing);
                                }}
                            >
                                Add to Cart
                            </button>
                            <button 
                                className="action-button buy-now"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    buyNow(listing);
                                }}
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalResults={totalResults}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default TradingResultsGrid;
