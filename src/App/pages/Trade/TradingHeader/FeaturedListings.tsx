import React from 'react';
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
    const getImageUrl = (hash: string | null) => {
        if (!hash) return null;
        return `https://ipfs.io/ipfs/${hash}`;
    };

    return (
        <div className="featured-listings">
            <div className="featured-header">
                <span className="featured-label">Featured</span>
            </div>
            <div className="featured-scroll">
                <div className="featured-cards">
                    {listings.map((listing) => (
                        <div
                            key={listing.id}
                            className="featured-card"
                            onClick={() => onListingClick(listing)}
                        >
                            <div className="card-content">
                                {listing.image_hash && (
                                    <div className="card-image">
                                        <img 
                                            src={getImageUrl(listing.image_hash)} 
                                            alt={listing.title}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                                <div className="card-info">
                                    <div className="card-title">{listing.title}</div>
                                    <div className="card-price">{listing.price} EVR</div>
                                </div>
                                {listing.highlight && (
                                    <div className="card-badge">{listing.highlight}</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturedListings; 