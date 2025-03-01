import React from 'react';
import { motion } from 'framer-motion';
import { FaFire, FaTag, FaRocket } from 'react-icons/fa';
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  return (
    <section className="featured-assets">
      <motion.h2 
        className="section-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <FaFire className="icon" /> Featured Assets
      </motion.h2>
      
      {/* Floating tech elements */}
      <div className="space-elements">
        {[...Array(3)].map((_, i) => (
          <motion.div 
            key={`floating-element-${i}`}
            className="floating-element"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
              width: `${Math.random() * 30 + 20}px`,
              height: `${Math.random() * 30 + 20}px`,
              borderRadius: Math.random() > 0.5 ? '50%' : '4px',
              background: i % 2 === 0 ? 'var(--space-accent-blue)' : 'var(--space-accent-teal)'
            }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      <motion.div 
        className="assets-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {isLoading ? (
          <div className="loading">
            <motion.div 
              className="loading-pulse"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            Loading featured assets...
          </div>
        ) : listings.length > 0 ? (
          listings.map((listing, index) => (
            <motion.div
              key={`featured-${listing.id}-${index}`}
              className="asset-card glassmorphism"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.03, 
                y: -8,
                boxShadow: "0 25px 50px rgba(0,0,0,0.2), 0 0 30px rgba(0, 255, 208, 0.2)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => handleListingClick(listing)}
            >
              {/* Tech decoration */}
              <div className="card-decoration">
                <div className="deco-line"></div>
                <div className="deco-corner top-left"></div>
                <div className="deco-corner top-right"></div>
                <div className="deco-corner bottom-left"></div>
                <div className="deco-corner bottom-right"></div>
              </div>
              
              {/* Card spotlight effect */}
              <div className="card-spotlight"></div>
              
              <div className="asset-info">
                <h3>{listing.title}</h3>
                <p className="price">
                  {listing.price ? `${listing.price} EVR` : 'Price not set'}
                </p>
                <p className="description">
                  {listing.highlight ? `${listing.highlight}` : 'No description available'}
                </p>
                {listing.tags && listing.tags.length > 0 && (
                  <div className="tags">
                    {listing.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        <FaTag className="tag-icon" /> {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* View button */}
                <div className="card-button">
                  <FaRocket className="button-icon" /> View Asset
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="no-listings">No featured assets available</div>
        )}
      </motion.div>
    </section>
  );
};

export default FeaturedAssets; 