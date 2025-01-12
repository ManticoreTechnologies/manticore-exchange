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
                {results.map((result: any) => {
                    const sold = result.sold !== undefined ? result.sold : 0;
                    const assetData = JSON.parse(result.asset_data);
                    const listing = {
                        assetName: result.asset_name,
                        description: result.description,
                        unitPrice: result.unit_price,
                        listingAddress: result.listing_address,
                        orderStatus: result.listing_status,
                        quantity: result.remaining_quantity,
                        units: assetData.units,
                        sold: sold,
                        listingID: result.id,
                        ipfsHash: assetData.has_ipfs ? assetData.ipfs_hash : undefined,
                        seller: result.seller_address
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
