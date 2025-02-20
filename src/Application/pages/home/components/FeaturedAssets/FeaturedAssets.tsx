import React from 'react';
import { motion } from 'framer-motion';
import { FaFire } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './FeaturedAssets.css';

interface Listing {
  id: string;
  title: string;
  price?: string;
  highlight?: string;
  tags?: string[];
}

interface FeaturedAssetsProps {
  isLoading: boolean;
  listings: Listing[];
}

const FeaturedAssets: React.FC<FeaturedAssetsProps> = ({ isLoading, listings }) => {
  const navigate = useNavigate();

  const handleListingClick = (listing: Listing) => {
    navigate(`/trade/listings/by-id/${listing.id}`);
  };

  return (
    <section className="featured-assets">
      <motion.h2 
        className="section-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <FaFire className="icon" /> Featured Assets
      </motion.h2>
      <div className="assets-grid">
        {isLoading ? (
          <div className="loading">Loading featured assets...</div>
        ) : listings.length > 0 ? (
          listings.map((listing, index) => (
            <motion.div
              key={`featured-${listing.id}-${index}`}
              className="asset-card glassmorphism"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleListingClick(listing)}
            >
              <div className="asset-info">
                <h3>{listing.title}</h3>
                <p className="price">
                  {listing.price ? `${listing.price} EVR` : 'Price not set'}
                </p>
                <p className="description">{listing.highlight ? `(${listing.highlight})` : 'No description available'}</p>
                {listing.tags && listing.tags.length > 0 && (
                  <div className="tags">
                    {listing.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="no-listings">No featured assets available</div>
        )}
      </div>
    </section>
  );
};

export default FeaturedAssets; 