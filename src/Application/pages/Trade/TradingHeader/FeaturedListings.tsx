import React, { useState, useEffect } from 'react';
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
}

interface FeaturedListingsProps {
    listings: FeaturedListing[];
    onListingClick: (listing: FeaturedListing) => void;
}

const FeaturedListings: React.FC<FeaturedListingsProps> = ({ listings, onListingClick }) => {
    const [newListings, setNewListings] = useState<FeaturedListing[]>([]);
    const [featuredListings, setFeaturedListings] = useState<FeaturedListing[]>([]);
    const [trendingListings, setTrendingListings] = useState<FeaturedListing[]>([]);

    const getImageUrl = (hash: string | null | undefined): string => {
        if (!hash) return ManticoreLogo;
        return `https://ipfs.io/ipfs/${hash}`;
    };

    useEffect(() => {
        // Split listings into categories
        const newOnes = listings.filter(l => l.highlight === 'New');
        const featured = listings.filter(l => !l.highlight);
        const trending = listings.filter(l => l.highlight === 'Trending');

        setNewListings(newOnes);
        setFeaturedListings(featured);
        setTrendingListings(trending);
    }, [listings]);

    const CarouselSection = ({ title, items, icon }: { title: string; items: FeaturedListing[]; icon: JSX.Element }) => (
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
                                src={getImageUrl(listing.image_hash)} 
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

    return (
        <div className="fl_a7b3c9_container">
            <CarouselSection 
                title="New Listings" 
                items={newListings} 
                icon={<FiClock />} 
            />
            <CarouselSection 
                title="Featured" 
                items={featuredListings} 
                icon={<FiStar />} 
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