import React from 'react';
import ResultCard from '../ResultCard/ResultCard';
import './ResultsGrid.css';
import LoadingSpinner from '../../../../components/Spinners/LoadingSpinner';

interface ResultsGridProps {
    results: any;
    isSearching: boolean;
    isLoaded: boolean;
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ results, isSearching, isLoaded }) => {
    let processedResults;
    let hasResults = false;

    try {
        processedResults = results?.results;
        hasResults = Array.isArray(processedResults) && processedResults.length > 0;
    } catch (error) {
        processedResults = [];
    }

    const gridClasses = [
        'results-grid',
        isSearching ? 'is-searching' : '',
        isLoaded ? 'is-loaded' : '',
        !hasResults && isLoaded ? 'no-results' : ''
    ].filter(Boolean).join(' ');

    return (
        <div className={gridClasses}>
            {isSearching && (
                <div className="spinner-container">
                    <LoadingSpinner />
                </div>
            )}
            
            {!isSearching && !hasResults && isLoaded && (
                <div className="no-results-message">No results found</div>
            )}

            {hasResults && (
                <div className="results-grid-container">
                    {processedResults.map((result: any) => (
                        <ResultCard
                            key={result.name}
                            name={result.name}
                            blockHeight={result.block_height}
                            blockHash={result.blockhash}
                            amount={result.amount}
                            ipfsHash={result.has_ipfs ? result.ipfs_hash : undefined}
                            reissuable={result.reissuable}
                            units={result.units}
                        />
                    ))}
                </div>
            )}
        </div>
    );    
};

export default ResultsGrid;
