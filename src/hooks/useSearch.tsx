import { useState } from 'react';
import axios from 'axios';

const useSearch = (cardsPerPage: number) => {
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [query, setQuery] = useState('');
    const [sort, setSortBy] = useState<String>('name');
    const [reissuable, setReissuable] = useState<String>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [isCleared, setIsCleared] = useState(true);

    const handleSearch = async (query: string, reissuable: String = "all", sort: String = "name", page: number = 1) => {
        console.log("Search initiated with query:", query);
        setQuery(query);
        console.log(query, reissuable, sort);

        setResults(null);
        setIsSearching(true);

        if (query.trim() === '') {
            setIsCleared(true);
            console.log("Empty");
            setResults(null);
            setIsSearching(false);
            return;
        }
        setIsCleared(false);

        const params: any = {
            query,
            sort,
            limit: cardsPerPage,
            page,
        };
        if (reissuable !== 'all') params["reissuable"] = reissuable;

        try {
            const response = await axios.get('https://api.manticore.exchange/search', { params });
            setResults(response.data);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching data:', error);
            setResults(null);
        } finally {
            setIsSearching(false);
        }
    };

    return {
        isSearching,
        results,
        query,
        sort,
        reissuable,
        currentPage,
        isCleared,
        setSortBy,
        setReissuable,
        handleSearch,
        setResults,
        setIsSearching,
        setQuery,
        setCurrentPage,
        setIsCleared,
    };
};

export default useSearch;