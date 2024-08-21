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
        const maxVisiblePages = window.innerWidth > 768 ? 2 : 1; // Adjust this value based on your requirement
        const maxPagesToShow = 2; // Show this many pages at the start and end

        for (let i = 1; i <= totalPages; i++) {
            if (
                i <= maxPagesToShow || 
                i > totalPages - maxPagesToShow || 
                (i >= currentPage - maxVisiblePages && i <= currentPage + maxVisiblePages)
            ) {
                visiblePages.push(
                    <button
                        key={i}
                        className={i === currentPage ? 'active' : ''}
                        onClick={() => handleClick(i)}
                    >
                        {i}
                    </button>
                );
            } else if (
                (i === currentPage - maxVisiblePages - 1 || i === currentPage + maxVisiblePages + 1) &&
                visiblePages[visiblePages.length - 1]?.type !== 'span'
            ) {
                visiblePages.push(<span key={i}>...</span>);
            }
        }

        return visiblePages;
    };

    return (
        <div className="pagination-container">
            <button
                onClick={() => handleClick(currentPage - 1)}
                disabled={currentPage === 1}
                className="arrow-button"
            >
                &#9664; {/* Left arrow */}
            </button>
            {renderPageNumbers()}
            <button
                onClick={() => handleClick(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="arrow-button"
            >
                &#9654; {/* Right arrow */}
            </button>
        </div>
    );
};

export default Pagination;
