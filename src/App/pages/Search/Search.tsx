import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Search.css';

import Searchbar from './Searchbar/Searchbar';
import ResultsGrid from './Results/ResultsGrid/ResultsGrid';
import Pagination from './Pagination/Pagination';

import useSearch from '@/hooks/useSearch';

const Search: React.FC = () => {
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

    // Set initial searching state based on URL params
    useEffect(() => {
        if (initialQuery) {
            setIsSearching(true);
            handleSearch(initialQuery, reissuable, sort, initialPage);
            setCurrentPage(initialPage);
        }
    }, []); // Run only on mount

    // Handle URL changes
    useEffect(() => {
        if (initialQuery) {
            handleSearch(initialQuery, reissuable, sort, initialPage);
            setCurrentPage(initialPage);
        }
    }, [location.search]);

    // Update UI based on search results
    useEffect(() => {
        if (results) {
            const hasSearchResults = results.results && results.results.length > 0;
            setNoResults(!hasSearchResults);
            setTotalPages(results.total_pages || 0);
        } else {
            setNoResults(true);
            setTotalPages(0);
        }
    }, [results]);

    const handlePageChange = (page: number) => {
        // Scroll the content area to top
        const contentArea = document.querySelector('.search-content');
        if (contentArea) {
            contentArea.scrollTo({ 
                top: 0,
                behavior: 'smooth' 
            });
        }
        
        setResults(null);
        setIsSearching(true);
        setCurrentPage(page);
        navigate(`?query=${encodeURIComponent(query)}&page=${page}`);
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
        navigate(`?query=${encodeURIComponent(searchQuery)}&page=1`);
        handleSearch(searchQuery, reissuable, sort, 1);
    };

    return (
        <div className={`search-container ${isSearching || initialQuery ? 'is-searching' : ''}`}>
            <div className="search-header">
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
            </div>
                <ResultsGrid 
                    results={results} 
                    isSearching={isSearching} 
                    isLoaded={results !== null || !!initialQuery} 
                />
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

export default Search;
