import React from 'react';
import './ResultsGrid.css'; // New CSS for XeggeX-style grid
import ResultRow from '../ResultRow/ResultRow';

interface ResultsGridProps {
    results: any[];
    addToCart: (listing: any) => void;
    buyNow: (listing: any) => void;
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ results, addToCart, buyNow }) => {
    if (!results || results.length === 0) {
        return <div className="no-results">No results found</div>;
    }

    return (
        <div className="results-table-container">
            <table className="results-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Asset</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((result) => (
                        <ResultRow
                            key={result.listing_id}
                            result={result}
                            addToCart={addToCart}
                            buyNow={buyNow}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ResultsGrid;



