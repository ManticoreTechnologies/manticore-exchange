import React from 'react';
import TradingResultCard from '../ResultCard/TradingResultCard';
import './ResultsGrid.css';

interface ResultsGridProps {
    results: any[];
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
                {results.map((result: any) => {
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
            
            {totalPages > 1 && (
                <div className="pagination">
                    <button 
                        className="pagination-button"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    
                    <div className="pagination-info">
                        Page {currentPage} of {totalPages}
                        <span className="total-results">
                            ({totalResults} total results)
                        </span>
                    </div>

                    <button 
                        className="pagination-button"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ResultsGrid;
