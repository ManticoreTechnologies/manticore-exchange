import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShoppingCart, FiShare2 } from 'react-icons/fi';

interface ListingHeaderProps {
  cartItemCount: number;
  onShare: () => void;
}

const ListingHeader: React.FC<ListingHeaderProps> = ({ cartItemCount, onShare }) => {
  const navigate = useNavigate();

  return (
    <header className="details-header">
      <button className="action-button back-button" onClick={() => navigate('/trade')}>
        <FiArrowLeft /> Back to Listings
      </button>
      <div className="header-actions">
        <button className="action-button share-button" onClick={onShare}>
          <FiShare2 /> Share
        </button>
        <button 
          className="action-button cart-button" 
          onClick={() => navigate('/cart')}
          data-count={cartItemCount || ''}
        >
          <FiShoppingCart /> Cart
        </button>
      </div>
    </header>
  );
};

export default ListingHeader; 