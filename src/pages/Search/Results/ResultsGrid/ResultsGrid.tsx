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

    try{
        results = results.results;
    } catch (error) {
       return <div className={"results-grid " + (isSearching ? 'is-searching' : '') + (isLoaded ? 'is-loaded' : '')}>
            {isSearching && <div className="spinner-container"><LoadingSpinner /></div>}
        </div>;
    }
    return (
        <div className={"results-grid " + (isSearching ? 'is-searching' : '') + (isLoaded ? 'is-loaded' : '')}>
            {results.length === 0 && <div className="results-grid no-results">No results found</div>}
            <div className="results-grid-container">
                {!isSearching && results && Object.keys(results).map((index: any) => (
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
        </div>
    );    
};

export default ResultsGrid;
