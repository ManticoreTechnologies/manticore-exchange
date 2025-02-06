import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import './FeaturedListings.css';

interface FeaturedListing {
    id: string;
    title: string;
    store_name: string;
    price: string;
    asset_name: string;
    highlight?: string;
    image_hash: string | null;
    balance?: string;
}

interface FeaturedListingsProps {
    listings: FeaturedListing[];
    onListingClick: (listing: FeaturedListing) => void;
}

const FeaturedListings: React.FC<FeaturedListingsProps> = ({ listings, onListingClick }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            nextListing();
        }, 5000);

        return () => clearInterval(timer);
    }, [currentIndex, listings.length]);

    const nextListing = () => {
        if (!isAnimating) {
            setIsAnimating(true);
            setCurrentIndex((prev) => (prev + 1) % listings.length);
            setTimeout(() => setIsAnimating(false), 500);
        }
    };

    const prevListing = () => {
        if (!isAnimating) {
            setIsAnimating(true);
            setCurrentIndex((prev) => (prev - 1 + listings.length) % listings.length);
            setTimeout(() => setIsAnimating(false), 500);
        }
    };

    const getImageUrl = (hash: string | null) => {
        if (!hash) return null;
        return `https://ipfs.io/ipfs/${hash}`;
    };

    return (
        <div className="featured-listings">
            <div className="featured-header">
                <span className="featured-label">Featured</span>
                <div className="featured-controls">
                    <button onClick={prevListing} className="control-button">
                        <FiArrowLeft />
                    </button>
                    <button onClick={nextListing} className="control-button">
                        <FiArrowRight />
                    </button>
                </div>
            </div>
            <div className="listings-carousel">
                {listings.map((listing, index) => (
                    <div
                        key={listing.id}
                        className={`carousel-item ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => onListingClick(listing)}
                        style={{
                            transform: `translateX(${(index - currentIndex) * 100}%)`,
                            opacity: index === currentIndex ? 1 : 0
                        }}
                    >
                        <div className="listing-content">
                            {listing.image_hash && (
                                <div className="listing-image">
                                    <img 
                                        src={getImageUrl(listing.image_hash)} 
                                        alt={listing.title}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                            <div className="listing-info">
                                <div className="listing-header">
                                    <div className="store-name">{listing.store_name}</div>
                                    <div className="listing-title">{listing.title}</div>
                                </div>
                                <div className="listing-details">
                                    <div className="listing-meta">
                                        <div className="asset-info">
                                            <span className="asset-name">{listing.asset_name}</span>
                                            <span className="asset-balance">
                                                Balance: {listing.balance || '0.00000000'}
                                            </span>
                                        </div>
                                        <div className="price-info">
                                            <div className="price">{listing.price} EVR</div>
                                            <span className="price-label">Fixed Price</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {listing.highlight && (
                                <div className="highlight">{listing.highlight}</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="carousel-dots">
                {listings.map((_, index) => (
                    <div
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default FeaturedListings; 