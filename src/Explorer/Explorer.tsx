import React, { useState } from 'react';
import axios from 'axios';
import './Explorer.css';
import Searchbar from './Searchbar/Searchbar';
import ResultsGrid from './Results/ResultsGrid/ResultsGrid';
import Spinner from './Spinner/Spinner';
import Filters from './Filters/Filters';
import Pagination from './Pagination/Pagination';

const Explorer: React.FC = () => {
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [query, setQuery] = useState('');
    const [sort, setSortBy] = useState<String>('name');
    const [reissuable, setReissuable] = useState<String>('all');
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const [cardsPerPage] = useState(24); // Set a fixed limit of 24 (divisible by 2, 3, 4, 6, 8)
    const [isCleared, setIsCleared] = useState(true);
    const bubbleButtons = [
        { label: "All Assets", query: '%all' },
        { label: "Random Assets", query: '%random' }
    ];

    const handleSearch = async (query: string, reissuable: String = "all", sort: String = "name", page: number = 1) => {
        console.log("Search initiated with query:", query);
        setQuery(query);
        console.log(query, reissuable, sort);

        // Clear previous results and start searching
        setResults(null);
        setIsSearching(true);

        // Reset everything if the query is empty
        if (query.trim() === '') {
            setIsCleared(true);
            console.log("Empty");
            setResults(null);
            setIsSearching(false);
            return;
        }
        setIsCleared(false);

        // Setup our parameters for the search
        const params: any = {
            query,
            sort,
            limit: cardsPerPage, // Set the fixed limit
            page, // Set the page
        };
        if (reissuable !== 'all') params["reissuable"] = reissuable;

        // Try making the search request
        try {
            const response = await axios.get('https://api.manticore.exchange:666/search', { params });
            setResults(response.data);
            setCurrentPage(page); // Update current page after search
        } catch (error) {
            console.error('Error fetching data:', error);
            setResults(null); // Clear results if there's an error
        } finally {
            // Stop searching
            setIsSearching(false);
        }
    };

    const handleTypingStart = () => {
        setIsSearching(true);
    };

    const handleSortChange = (sort: string) => {
        setResults(null);
        setIsSearching(true);
        console.log("Sort filter changed to " + sort);
        setSortBy(sort);
        handleSearch(query, reissuable, sort); // Reset to page 1 when changing sort
    };

    const handleReissuableChange = (reissuable: string) => {
        setResults(null);
        setIsSearching(true);
        console.log("Reissuable filter changed to " + reissuable);
        setReissuable(reissuable);
        handleSearch(query, reissuable, sort); // Reset to page 1 when changing reissuable filter
    };

    const handlePageChange = (page: number) => {
        setResults(null);
        setIsSearching(true);
        handleSearch(query, reissuable, sort, page); // Use the updated page for new search
    };

    return (
        <div className="explorer-container">
            <div className="searchbar-filters-container">
                <Searchbar
                    onSearch={handleSearch}
                    onTypingStart={handleTypingStart}
                    placeholder="Search assets..."
                    bubbleButtons={bubbleButtons}
                />
                {query.length > 0 && (
                    <Filters
                        isVisible={true}
                        onSortChange={handleSortChange}
                        onReissuableChange={handleReissuableChange}
                    />
                )}
            </div>
            {isSearching && <Spinner />}
            {!isCleared && !isSearching && !results && <div className="no-results">No results found</div>}
            {results && (
                <div>
                    <ResultsGrid results={results.results} />
                    <Pagination
                        totalPages={results.total_pages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default Explorer;
