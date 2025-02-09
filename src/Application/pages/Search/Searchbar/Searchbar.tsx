import React, { useState, useEffect, useCallback } from 'react';
import './Searchbar.css';

//@ts-ignore
import { FaFilter } from 'react-icons/fa'; // Changed icon import

interface SearchbarProps {
    onSearch: (query: string) => void;
    onTypingStart: () => void;
    placeholder: string;
    bubbleButtons: Array<{ label: string, query: string }>; // New prop for bubble buttons
    initialQuery: string;
}

const Searchbar: React.FC<SearchbarProps> = ({ onSearch, onTypingStart, placeholder="Type to search...", bubbleButtons = [], initialQuery = ''}) => {
    const [isSearching, setIsSearching] = useState(!!initialQuery);
    const [isLoaded, setIsLoaded] = useState(false);
    const [query, setQuery] = useState(initialQuery);

    useEffect(() => {
        setTimeout(() => {
            setIsLoaded(true);
        }, 100);
        
        // Set initial searching state if there's an initial query
        if (initialQuery) {
            setIsSearching(true);
            onTypingStart();
        }
    }, [initialQuery]);

    // Update local state when initialQuery changes
    useEffect(() => {
        setQuery(initialQuery);
        setIsSearching(!!initialQuery);
    }, [initialQuery]);

    const debounce = (func: Function, wait: number) => {
        let timeoutId: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args);
            }, wait);
        };
    };

    const debouncedSearch = useCallback(debounce((input: string) => {
        onSearch(input);
    }, 650), []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setQuery(input);
        onTypingStart();

        if (input.trim().length > 0) {
            setIsSearching(true);
        } else {
            onSearch('');
            setIsSearching(false);
        }

        debouncedSearch(input);
    };

    const handleBubbleClick = (query: string) => {
        setQuery(query);
        setIsSearching(true);
        onTypingStart();
        // Immediately trigger search for bubble buttons
        onSearch(query);
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        const pastedText = event.clipboardData.getData('text');
        if (pastedText) {
            setIsSearching(true);
            onTypingStart();
        }
    };

    return (
        <div className={`search-page-searchbar ${isLoaded ? 'loaded' : ''} ${isSearching ? 'searching' : ''}`}>
            <input 
                type="text" 
                placeholder={placeholder} 
                className="search-input" 
                value={query} 
                onChange={handleChange}
                onPaste={handlePaste}
            />

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