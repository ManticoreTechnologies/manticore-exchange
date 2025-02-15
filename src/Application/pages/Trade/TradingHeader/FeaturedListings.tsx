import React from 'react';
import { FiTrendingUp, FiStar, FiClock } from 'react-icons/fi';
import ManticoreLogo from '@/Application/logos/white-manticore.png';
import './FeaturedListings.css';

interface FeaturedListing {
    id: string;
    title: string;
    price: string;
    asset_name: string;
    highlight?: string;
    image_hash?: string | null;
    store_name?: string;
    balance?: string;
    prices?: { ipfs_hash?: string }[];
}

interface FeaturedListingsProps {
    listings: FeaturedListing[];
    onListingClick: (listing: FeaturedListing) => void;
}

const FeaturedListings: React.FC<FeaturedListingsProps> = ({ listings, onListingClick }) => {
    const getImageUrl = (listing: FeaturedListing): string => {
        // First try the listing's main image
        if (listing.image_hash) {
            return `https://ipfs.io/ipfs/${listing.image_hash}`;
        }

        // If no main image, try to get the first asset's image from prices
        const firstAssetWithImage = listing.prices?.find(price => price.ipfs_hash);
        if (firstAssetWithImage?.ipfs_hash) {
            return `https://ipfs.io/ipfs/${firstAssetWithImage.ipfs_hash}`;
        }

        // If no images found, return placeholder
        return ManticoreLogo;
    };

    const CarouselSection = ({ title, items, icon }: { title: string; items: FeaturedListing[]; icon: JSX.Element }) => {
        if (!items || items.length === 0) return null;
        
        return (
            <div className="fl_a7b3c9_carousel">
                <div className="fl_a7b3c9_header">
                    {React.cloneElement(icon, { className: 'fl_a7b3c9_icon' })}
                    <span>{title}</span>
                </div>
                <div className="fl_a7b3c9_scroll">
                    {items.map((listing) => (
                        <div
                            key={listing.id}
                            className="fl_a7b3c9_card"
                            onClick={() => onListingClick(listing)}
                            data-title={listing.title}
                        >
                            <div className="fl_a7b3c9_image">
                                <img 
                                    src={getImageUrl(listing)} 
                                    alt={listing.title}
                                    onError={(e) => {
                                        const img = e.target as HTMLImageElement;
                                        img.src = ManticoreLogo;
                                    }}
                                />
                            </div>
                            <div className="fl_a7b3c9_info">
                                <div className="fl_a7b3c9_title">{listing.title}</div>
                                <div className="fl_a7b3c9_price">{listing.price} EVR</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Split listings based on their sections from the home/featured endpoint
    const featuredListings = listings.filter(l => !l.highlight);
    const newListings = listings.filter(l => l.highlight === 'New');
    const trendingListings = listings.filter(l => l.highlight === 'Trending');

    return (
        <div className="fl_a7b3c9_container">
            <CarouselSection 
                title="Featured" 
                items={featuredListings} 
                icon={<FiStar />} 
            />
            <CarouselSection 
                title="New Listings" 
                items={newListings} 
                icon={<FiClock />} 
            />
            <CarouselSection 
                title="Trending" 
                items={trendingListings} 
                icon={<FiTrendingUp />} 
            />
        </div>
    );
};

export default FeaturedListings; 