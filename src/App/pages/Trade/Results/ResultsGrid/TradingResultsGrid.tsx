import React from 'react';
import TradingResultCard from '../ResultCard/TradingResultCard';
import './ResultsGrid.css';

interface ResultsGridProps {
    results: any[];
    addToCart: (listing: any) => void;
    buyNow: (listing: any) => void;
    showDetails: (listing: any) => void;
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ results, addToCart, buyNow, showDetails }) => {
    return (
        <div className="trading-results-grid">
            <div className="trading-results-grid-container">
                {
                results.map((result: any) => {
                    const listing = {
                        name: result.name,
                        description: result.description,
                        offerings: result.offerings,
                        tags: result.tags,
                        ipfsHash: result.ipfs_hash,
                        seller_address: result.seller_address
                    };
                    return (
                        <TradingResultCard
                            key={result.id}
                            {...listing}
                            addToCart={addToCart}
                            buyNow={buyNow}
                            showDetails={() => showDetails(listing)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default ResultsGrid;
