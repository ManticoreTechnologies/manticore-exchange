import React from 'react';
import TradingResultCard from '../ResultCard/TradingResultCard';
import './ResultsGrid.css';
import Pagination from '../../Components/Pagination';

interface Balance {
    asset_name: string;
    confirmed_balance: string;
    pending_balance: string;
}

interface Price {
    asset_name: string;
    price_evr: string;
}

interface Listing {
    id: string;
    name: string;
    description: string;
    seller_address: string;
    listing_address: string;
    image_ipfs_hash: string | null;
    status: string;
    created_at: string;
    balances: Balance[];
    prices: Price[];
    tags?: string[];
}

interface ResultsGridProps {
    results: Listing[];
    addToCart: (listing: any) => void;
    buyNow: (listing: any) => void;
    showDetails: (listing: any) => void;
    currentPage: number;
    totalPages: number;
    totalResults: number;
    onPageChange: (page: number) => void;
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ 
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
        <div className="trading-results-grid">
            <div className="trading-results-grid-container">
                {results.map((result: Listing) => {
                    // Transform the listing data to match expected format
                    const listing = {
                        id: result.id,
                        name: result.name,
                        description: result.description,
                        seller: result.seller_address,
                        listingAddress: result.listing_address,
                        ipfsHash: result.image_ipfs_hash,
                        status: result.status,
                        createdAt: result.created_at,
                        // Get the first price in EVR
                        unitPrice: result.prices[0]?.price_evr || "0",
                        // Get the total balance from all assets
                        quantity: result.balances.reduce((total, balance) => 
                            total + parseFloat(balance.confirmed_balance), 0),
                        // Include the raw balances and prices for reference
                        balances: result.balances,
                        prices: result.prices,
                        tags: result.tags
                    };

                    return (
                        <div className="listing-card">
                            <TradingResultCard
                                key={listing.id}
                                {...listing}
                                addToCart={() => addToCart(listing)}
                                buyNow={() => buyNow(listing)}
                                showDetails={() => showDetails(listing)}
                            />
                        </div>
                    );
                })}
            </div>
            
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalResults={totalResults}
                pageSize={10}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default ResultsGrid;
