import React from 'react';
import './Explorer.css';
import Searchbar from './Searchbar/Searchbar';
import ResultsGrid from './Results/ResultsGrid/ResultsGrid';
import LoadingSpinner from '../../components/Spinners/LoadingSpinner';
import Pagination from './Pagination/Pagination';
import useSearch from '../../hooks/useSearch';

const Explorer: React.FC = () => {
    const cardsPerPage = 24;
    const {
        isSearching,
        results,
        query,
        sort,
        reissuable,
        currentPage,
        isCleared,
        handleSearch,
        setResults,
        setIsSearching,
    } = useSearch(cardsPerPage);

    const bubbleButtons = [
        { label: "All Assets", query: '%all' },
        { label: "Random Assets", query: '%random' }
    ];

    const handlePageChange = (page: number) => {
        setResults(null);
        setIsSearching(true);
        handleSearch(query, reissuable, sort, page);
    };

    return (
        <div className="explorer-container">
            <Searchbar
                onSearch={handleSearch}
                onTypingStart={() => {
                    setIsSearching(true);
                    setResults(null);
                } }
                placeholder="Search assets..."
                bubbleButtons={bubbleButtons}
            />
            {/* If searching show the spinner */}
            {isSearching && <div className="spinner-container"><LoadingSpinner /></div>}
            {/* If results are not null, show the results grid */}
            <div className="results-container">
                    Results go here
            </div>
            <Pagination
                totalPages={100}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default Explorer;


/*

            <div className="searchbar-filters-container">
                <Searchbar
                    onSearch={handleSearch}
                    onTypingStart={() => {
                        setIsSearching(true);
                        setResults(null);
                    }}
                    placeholder="Search assets..."
                    bubbleButtons={bubbleButtons}
                />
            </div>
            {isSearching && <div className="spinner-container"><LoadingSpinner /></div>}
            {!isCleared && !isSearching && !results && <div className="no-results">No results found</div>}
            {results && (
                <div className="results-container">
                    <ResultsGrid results={results.results} />
                    <Pagination
                        totalPages={results.total_pages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            */