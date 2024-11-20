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
    if (!results || results.length === 0) {
        return <div className="no-results">No results found</div>;
    }
    return (
        <div className="trading-results-grid">
            <div className="trading-results-grid-container">
                {results.map((result: any) => {
                    const sold = result.sold !== undefined ? result.sold : 0;
                return (
                    <TradingResultCard
                        key={result.id}
                        assetName={result.asset_name}
                        description={result.description}
                        unitPrice={result.unit_price}
                        listingAddress={result.listing_address}
                        orderStatus={result.listing_status}
                        quantity={result.remaining_quantity}
                        units={JSON.parse(result.asset_data).units}
                        sold={sold}
                        listingID={result.id}
                        ipfsHash={JSON.parse(result.asset_data).has_ipfs ? JSON.parse(result.asset_data).ipfs_hash : undefined}
                        addToCart={addToCart}
                        buyNow={buyNow}
                        showDetails={showDetails}
                    />
                    );
                })}
            </div>
        </div>
    );
};

export default ResultsGrid;
