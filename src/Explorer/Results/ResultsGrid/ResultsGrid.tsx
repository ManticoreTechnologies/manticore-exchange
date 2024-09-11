import React from 'react';
import ResultCard from '../ResultCard/ResultCard';
import './ResultsGrid.css';

interface ResultsGridProps {
    results: any;
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ results }) => {
    if (!results || Object.keys(results).length === 0) {
        return <div className="no-results">No results found</div>; // Display message if there are no results
    }

    return (
        <div className="results-grid">
            {Object.keys(results).map((index: any) => (
                <ResultCard
                    key={results[index].name}
                    name={results[index].name}
                    blockHeight={results[index].block_height}
                    blockHash={results[index].blockhash}
                    amount={results[index].amount}
                    ipfsHash={results[index].has_ipfs ? results[index].ipfs_hash : undefined}
                    reissuable={results[index].reissuable}
                    units={results[index].units}
                />
            ))}
        </div>
    );
};

export default ResultsGrid;
