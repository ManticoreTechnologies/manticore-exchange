import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaCubes } from 'react-icons/fa';
import './ListingsScroll.css';

interface Listing {
  id: string;
  name: string;
  price: string;
  highlight?: string;
}

interface ListingsScrollProps {
  listings: Listing[];
}

const ListingsScroll: React.FC<ListingsScrollProps> = ({ listings }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!scrollRef.current) return;
    
    const scrollElement = scrollRef.current;
    let scrollPosition = 0;
    
    const scrollAnimation = () => {
      if (!scrollElement) return;
      
      // Slow continuous scroll
      scrollPosition += 0.5;
      if (scrollPosition >= scrollElement.scrollWidth / 2) {
        scrollPosition = 0;
      }
      
      scrollElement.scrollLeft = scrollPosition;
      requestAnimationFrame(scrollAnimation);
    };
    
    const animation = requestAnimationFrame(scrollAnimation);
    
    return () => cancelAnimationFrame(animation);
  }, []);
  
  return (
    <section className="listings-scroll-section">
      {/* Tech decoration elements */}
      <div className="tech-circuit top-right"></div>
      <div className="tech-circuit bottom-left"></div>
      
      {/* Section title */}
      <motion.h2 
        className="section-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <FaCubes className="icon" />
        Available Assets
      </motion.h2>
      
      {/* Scrolling listings */}
      <div className="scroll-container">
        <div className="scroll-content" ref={scrollRef}>
          {/* Duplicate listings to create seamless scroll */}
          {[...listings, ...listings, ...listings].map((listing, idx) => (
            <motion.div 
              key={`${listing.id}-${idx}`}
              className="listing-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ 
                y: -10, 
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
            >
              <div className="listing-name">{listing.name}</div>
              <div className="listing-price">{listing.price}</div>
              {listing.highlight && (
                <div className="listing-highlight">{listing.highlight}</div>
              )}
              
              {/* Data pulse effect */}
              <motion.div
                className="pulse-decoration"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0, 0.3, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: idx * 0.5
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* View all button */}
      <motion.a 
        href="/assets"
        className="view-all-button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 0 20px rgba(85, 169, 254, 0.5)" 
        }}
      >
        View All Assets
      </motion.a>
    </section>
  );
};

export default ListingsScroll; 