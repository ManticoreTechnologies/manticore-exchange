import React from 'react';
import './Pagination.css';

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    isSearching: boolean;
    isLoaded: boolean;
    noResults: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange, isSearching, isLoaded, noResults }) => {
    const handleClick = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const renderPageNumbers = () => {
        const visiblePages = [];
        const rangeSize = 1; // Show 1 page before and after the current page
        const startPage = Math.max(currentPage - rangeSize, 2); // Start after the first page
        const endPage = Math.min(currentPage + rangeSize, totalPages - 1); // End before the last page
    
        // Add the first page button
        visiblePages.push(
            <button
                key={1}
                className={currentPage === 1 ? 'page-number active' : 'page-number'}
                onClick={() => handleClick(1)}
            >
                1
            </button>
        );
    
        // Add the ellipsis if there's a gap between the first and the start of the range
        if (startPage > 2) {
            visiblePages.push(
                <span key="start-ellipsis" className="ellipsis">...</span>
            );
        }
    
        // Add the range of pages around the current page
        for (let i = startPage; i <= endPage; i++) {
            visiblePages.push(
                <button
                    key={i}
                    className={i === currentPage ? 'page-number active' : 'page-number'}
                    onClick={() => handleClick(i)}
                >
                    {i}
                </button>
            );
        }
    
        // Add the ellipsis if there's a gap between the end of the range and the last page
        if (endPage < totalPages - 1) {
            visiblePages.push(
                <span key="end-ellipsis" className="ellipsis">...</span>
            );
        }
    
        // Add the last page button
        if (totalPages > 1) {
            visiblePages.push(
                <button
                    key={totalPages}
                    className={currentPage === totalPages ? 'page-number active' : 'page-number'}
                    onClick={() => handleClick(totalPages)}
                >
                    {totalPages}
                </button>
            );
        }
    
        return visiblePages;
    };
    

    return (
        <div className={"pagination-container " + (isSearching ? 'is-searching' : '') + (isLoaded ? 'is-loaded' : '') + (noResults ? 'no-results' : '')}>
             <div className="pagination-content">
             <button
                onClick={() => handleClick(1)}
                disabled={currentPage === 1}
                className="arrow-button"
            >
                &#171; 
                </button>
                <button
                    onClick={() => handleClick(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="arrow-button"
                >
                    &#9664; 
                </button>
                {renderPageNumbers()}
                <button
                    onClick={() => handleClick(totalPages)}
                    disabled={currentPage === totalPages}
                    className="arrow-button"
                >
                    &#187; 
                </button>
             </div>
        </div>
    );
};

export default Pagination;

/*
            /**
             <button
                onClick={() => handleClick(1)}
                disabled={currentPage === 1}
                className="arrow-button"
            >
                &#171; 
                </button>
                <button
                    onClick={() => handleClick(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="arrow-button"
                >
                    &#9664; 
                </button>
                {renderPageNumbers()}
                <button
                    onClick={() => handleClick(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="arrow-button"
                >
                    &#9654; 
                </button>
                <button
                    onClick={() => handleClick(totalPages)}
                    disabled={currentPage === totalPages}
                    className="arrow-button"
                >
                    &#187; 
                </button>
             */
