import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalResults,
    onPageChange,
}) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 3;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 2) {
                for (let i = 1; i <= 3; i++) {
                    pages.push(i);
                }
            } else if (currentPage >= totalPages - 1) {
                for (let i = totalPages - 2; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
            }
        }
        
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="pagination">
            <div className="pagination-controls">
                <button
                    className="pagination-button"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    title="First page"
                >
                    «
                </button>
                <button
                    className="pagination-button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    title="Previous page"
                >
                    ‹
                </button>
                
                {getPageNumbers().map(pageNum => (
                    <button
                        key={pageNum}
                        className={`pagination-button ${pageNum === currentPage ? 'active' : ''}`}
                        onClick={() => onPageChange(pageNum)}
                    >
                        {pageNum}
                    </button>
                ))}
                
                <button
                    className="pagination-button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    title="Next page"
                >
                    ›
                </button>
                <button
                    className="pagination-button"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    title="Last page"
                >
                    »
                </button>
            </div>
            <div className="pagination-stats">
                <span>Page {currentPage} of {totalPages}</span>
                <span>({totalResults} total results)</span>
            </div>
        </div>
    );
};

export default Pagination; 