import React, { useState, useEffect, useCallback } from 'react';
import './Searchbar.css';
import { FaFilter } from 'react-icons/fa'; // Changed icon import

interface SearchbarProps {
    onSearch: (query: string) => void;
    onTypingStart: () => void;
    placeholder: string;
    bubbleButtons: Array<{ label: string, query: string }>; // New prop for bubble buttons
    initialQuery: string;
}

const Searchbar: React.FC<SearchbarProps> = ({ onSearch, onTypingStart, placeholder="Type to search...", bubbleButtons = [], initialQuery = ''}) => {
    const [isSearching, setIsSearching] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [query, setQuery] = useState(initialQuery);
    const [filtersVisible, setFiltersVisible] = useState(false); // State to manage filter visibility

    useEffect(() => {
        setTimeout(() => {
            setIsLoaded(true); // Trigger the load animations
        }, 100);
    }, []);

    // Debounce function to delay search execution
    const debounce = (func: Function, wait: number) => {
        let timeoutId: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args);
            }, wait);
        };
    };

    // Memoized debounce search function
    const debouncedSearch = useCallback(debounce((input: string) => {
        onSearch(input);
    }, 650), []); // Only recreate the debounce function when the component mounts

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setQuery(input);

        // Notify Explorer that typing has started
        onTypingStart();

        // Move to the top right if the query length is greater than 0
        if (input.trim().length > 0) {
            setIsSearching(true);
        } else {
            onSearch('');
            setIsSearching(false); // Reset to center when the input is empty
        }

        // Trigger the debounced search function
        debouncedSearch(input);
    };

    const handleBubbleClick = (query: string) => {
        setQuery(query);
        onSearch(query);
        setIsSearching(true); // Move the search bar when a bubble is clicked
    };

    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible); // Toggle the visibility of the filters
    };

    const handleSortChange = (value: string) => {
        value
        // Handle sort change logic here
    };

    const handleReissuableChange = (value: string) => {
        value
        // Handle reissuable change logic here
    };

    return (
        <div className={`searchbar-container ${isLoaded ? 'loaded' : ''} ${isSearching ? 'searching' : ''}`}>
            <input type="text" placeholder={placeholder} className="search-input" value={query} onChange={handleChange} />

            {!isSearching && bubbleButtons.length > 0 && (
                    <div className="bubble-buttons">
                        {bubbleButtons.map((button, index) => (
                            <button
                                key={index}
                                className="bubble-button"
                                onClick={() => handleBubbleClick(button.query)}
                            >
                                {button.label}
                            </button>
                        ))}
                </div>
            )}
        </div>
    );
};

export default Searchbar;


/*
            <div className="search-wrapper">
                <input
                    type="text"
                    placeholder={placeholder}
                    className="search-input"
                    value={query}
                    onChange={handleChange}
                />
                {isSearching && <FaFilter className="filter-button" onClick={toggleFilters} />} 
                </div>
                {filtersVisible && (
                    <div className="filters-container">
                        <div className="filter-item">
                            <label>
                                Sort By:
                                <select onChange={(e) => handleSortChange(e.target.value)}>
                                    <option value="name">Name</option>
                                    <option value="height">Height</option>
                                    <option value="amount">Amount</option>
                                    <option value="units">Units</option>
                                </select>
                            </label>
                        </div>
                        <div className="filter-item">
                            <label>
                                Reissuable:
                                <select onChange={(e) => handleReissuableChange(e.target.value)}>
                                    <option value="all">All</option>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </label>
                        </div>
                    </div>
                )}

*/