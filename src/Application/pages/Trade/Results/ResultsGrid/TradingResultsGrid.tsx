import React from 'react';
import TradingResultCard from '../ResultCard/TradingResultCard';
import './ResultsGrid.css';
import Pagination from '../../Components/Pagination';
import { Listing } from '../../../Trade/types';

interface Balance {
    asset_name: string;
    confirmed_balance: string;
    pending_balance: string;
}

interface Price {
    asset_name: string;
    price_evr: string;
}

interface ResultsGridProps {
    results: Listing[];
    addToCart: (listing: Listing) => void;
    buyNow: (listing: Listing) => void;
    showDetails: (listing: Listing) => void;
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
                    const listing = {
                        id: result.id,
                        name: result.name,
                        description: result.description,
                        seller: result.seller_address,
                        listingAddress: result.listing_address,
                        ipfsHash: result.image_ipfs_hash,
                        status: result.status,
                        createdAt: result.created_at,
                        unitPrice: result.prices[0]?.price_evr || "0",
                        quantity: result.balances.reduce((total: number, balance: { confirmed_balance: string }) => 
                            total + parseFloat(balance.confirmed_balance), 0),
                        balances: result.balances,
                        prices: result.prices,
                        tags: result.tags || []
                    };

                    return (
                        <div key={listing.id} className="listing-card">
                            <TradingResultCard
                                {...listing}
                                addToCart={() => addToCart(result)}
                                buyNow={() => buyNow(result)}
                                showDetails={() => showDetails(result)}
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
