import React from 'react';
import './SearchSpinner.css';

interface SearchSpinnerProps {
    loading: boolean;
}

const SearchSpinner: React.FC<SearchSpinnerProps> = ({ loading }) => {
    return (
        <div className={`search-spinner ${loading ? 'loading' : ''}`} />
    );
};

export default SearchSpinner; 