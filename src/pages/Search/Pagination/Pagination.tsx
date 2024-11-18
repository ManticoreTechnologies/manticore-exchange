import React from 'react';
import './Pagination.css';

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
    const handleClick = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const renderPageNumbers = () => {
        const visiblePages = [];
        const rangeSize = 1; // Show 2 pages before and after the current page
        const startPage = Math.max(currentPage - rangeSize, 1);
        const endPage = Math.min(currentPage + rangeSize, totalPages);

        // Add the first page button if not in the current range
        if (currentPage > 1 + rangeSize) {
            visiblePages.push(
                <span key="start-ellipsis">...</span>
            );
        }

        // Add the range of pages around the current page
        for (let i = startPage; i <= endPage; i++) {
            visiblePages.push(
                <button
                    key={i}
                    className={i === currentPage ? 'active' : ''}
                    onClick={() => handleClick(i)}
                >
                    {i}
                </button>
            );
        }

        // Add the last page button if not in the current range
        if (currentPage < totalPages - rangeSize) {
            visiblePages.push(
                <span key="end-ellipsis">...</span>
            );
        }

        return visiblePages;
    };

    return (
        <div className="pagination-container">
             Pagination goes here
        </div>
    );
};

export default Pagination;

/*
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