import React from 'react';
import { Listing } from '../../types';
import TradingResultCard from '../ResultCard/TradingResultCard';
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
            <div className="trading-results-grid">
                {results.map((listing) => (
                    <TradingResultCard
                        key={listing.id}
                        id={listing.id}
                        name={listing.name}
                        description={listing.description}
                        seller={listing.seller_address}
                        listingAddress={listing.listing_address}
                        ipfsHash={listing.image_ipfs_hash}
                        status={listing.status}
                        createdAt={listing.created_at}
                        unitPrice={listing.prices[0]?.price_evr || '0'}
                        quantity={Number(listing.balances[0]?.confirmed_balance || 0)}
                        balances={listing.balances}
                        prices={listing.prices.map(price => ({
                            asset_name: price.asset_name,
                            price_evr: price.price_evr,
                            ipfs_hash: price.ipfs_hash || undefined
                        }))}
                        addToCart={() => addToCart(listing)}
                        buyNow={() => buyNow(listing)}
                        showDetails={() => showDetails(listing)}
                        tags={listing.tags || []}
                    />
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
