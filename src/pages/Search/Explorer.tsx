import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Explorer.css';
import Searchbar from './Searchbar/Searchbar';
import ResultsGrid from './Results/ResultsGrid/ResultsGrid';
import Pagination from './Pagination/Pagination';
import useSearch from '../../hooks/useSearch';

const Explorer: React.FC = () => {
    const cardsPerPage = 24;
    const location = useLocation();
    const navigate = useNavigate();

    // Parse query parameters from the URL
    const params = new URLSearchParams(location.search);
    const initialQuery = params.get('query') || '';
    const initialPage = Number(params.get('page')) || 1;

    const {
        isSearching,
        results,
        query,
        sort,
        reissuable,
        currentPage,
        setCurrentPage,
        handleSearch,
        setResults,
        setIsSearching,
    } = useSearch(cardsPerPage);

    const [noResults, setNoResults] = useState(false);
    const [totalPages, setTotalPages] = useState(0);

    // Restore state from URL params when the URL changes
    useEffect(() => {
        handleSearch(initialQuery, reissuable, sort, initialPage);
        setCurrentPage(initialPage);
    }, [location.search]); // Triggered whenever the URL changes

    // Update UI based on search results
    useEffect(() => {
        if (results) {
            setNoResults(results.results.length === 0);
            setTotalPages(results.total_pages || 0);
        } else {
            setNoResults(true);
            setTotalPages(0);
        }
    }, [results]);

    const handlePageChange = (page: number) => {
        setResults(null);
        setIsSearching(true);
        setCurrentPage(page);

        // Update the URL with the new page
        navigate(`?query=${query}&page=${page}`);
        handleSearch(query, reissuable, sort, page);
    };

    const bubbleButtons = [
        { label: "All", query: '%all' },
        { label: "Random", query: '%random' },
    ];

    const handleSearchAction = (searchQuery: string) => {
        setIsSearching(true);
        setResults(null);
        setCurrentPage(1);

        // Update the URL with the new search query
        navigate(`?query=${searchQuery}&page=1`);
        handleSearch(searchQuery, reissuable, sort, 1);
    };

    return (
        <div className="explorer-container">
            <Searchbar
                onSearch={handleSearchAction}
                onTypingStart={() => {
                    setIsSearching(true);
                    setResults(null);
                }}
                placeholder="Search assets..."
                bubbleButtons={bubbleButtons}
                initialQuery={initialQuery}
            />
            <ResultsGrid results={results} isSearching={isSearching} isLoaded={results !== null} />
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                isSearching={isSearching}
                isLoaded={results !== null}
                noResults={noResults}
            />
        </div>
    );
};

export default Explorer;
