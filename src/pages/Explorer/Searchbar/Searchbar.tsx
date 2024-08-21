import React, { useState, useEffect, useCallback } from 'react';
import './Searchbar.css';

interface SearchbarProps {
    onSearch: (query: string) => void;
    onTypingStart: () => void; // New prop to notify when typing starts
}

const Searchbar: React.FC<SearchbarProps> = ({ onSearch, onTypingStart }) => {
    const [isSearching, setIsSearching] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [query, setQuery] = useState('');

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

    return (
        <div
            className={`search-container ${isLoaded ? 'loaded' : ''} ${isSearching ? 'searching' : ''}`}
        >
            <div className="search-wrapper">
                <input
                    type="text"
                    placeholder="Search..."
                    className="search-input"
                    value={query}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
};

export default Searchbar;
