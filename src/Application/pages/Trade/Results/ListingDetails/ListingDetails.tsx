import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/Application/contexts/AuthContext';
import { toast } from 'react-toastify';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { ImageCarousel } from './components/ImageCarousel/ImageCarousel';
import axios from 'axios';
import './ListingDetails.css';

interface Listing {
  id: string;
  name: string;
  description: string;
  seller_address: string;
  listing_address: string;
  status: string;
  created_at: string;
  updated_at: string;
  image_ipfs_hash: string | null;
  prices: Array<{
    asset_name: string;
    price_evr: string;
    price_asset_name: string | null;
    price_asset_amount: string | null;
    ipfs_hash: string | null;
  }>;
  balances: Array<{
    asset_name: string;
    confirmed_balance: string;
    pending_balance: string;
    units: number;
  }>;
  isOwnedByUser?: boolean;
}

const TRADING_API_URL = `${import.meta.env.VITE_TRADING_API_PROTO || 'http'}://${import.meta.env.VITE_TRADING_API_HOST || 'localhost'}:8000`;

const ListingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userAddress, isAuthenticated } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await axios.get(`${TRADING_API_URL}/listings/by-id/${id}`);
        
        if (response.data) {
          const listingData = response.data;
          setListing({
            ...listingData,
            isOwnedByUser: userAddress && userAddress.toLowerCase() === listingData.seller_address.toLowerCase()
          });
          setSelectedAsset(listingData.prices[0]?.asset_name || null);
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to load listing details');
        } else {
          setError('Failed to load listing details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, userAddress]);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    // TODO: Implement like functionality with API
    toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleAddToCart = async () => {
    if (!listing || !selectedAsset) return;
    
    try {
      // TODO: Implement add to cart functionality
      toast.success('Added to cart successfully!');
    } catch (err) {
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    if (!listing || !selectedAsset) return;
    
    try {
      // TODO: Implement buy now functionality
      toast.success('Processing purchase...');
      navigate('/checkout');
    } catch (err) {
      toast.error('Failed to process purchase');
    }
  };

  if (loading) {
    return (
      <div className="listing-details">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="listing-details">
        <div className="error-message">{error || 'Listing not found'}</div>
      </div>
    );
  }

  const selectedPrice = listing.prices.find(p => p.asset_name === selectedAsset);
  const selectedBalance = listing.balances.find(b => b.asset_name === selectedAsset);

  return (
    <div className="listing-details">
      <div className="listing-details__header">
        <h1 className="listing-details__title">{listing.name}</h1>
        <button 
          className={`listing-details__button listing-details__button--secondary ${isLiked ? 'active' : ''}`}
          onClick={handleLikeClick}
        >
          <FiHeart /> {isLiked ? 'Liked' : 'Like'}
        </button>
      </div>

      <div className="listing-details__container">
        <div className="listing-details__main">
          <ImageCarousel
            images={[
              ...(listing.image_ipfs_hash ? [{
                ipfs_hash: listing.image_ipfs_hash,
                asset_name: 'Listing Image'
              }] : []),
              ...listing.prices.map(price => ({
                ipfs_hash: price.ipfs_hash,
                asset_name: price.asset_name
              }))
            ]}
            onImageChange={(assetName) => {
              if (assetName !== 'Listing Image') {
                setSelectedAsset(assetName);
              }
            }}
          />

          <div className="listing-details__description">
            <h2 className="listing-details__description-title">Description</h2>
            <p className="listing-details__description-content">{listing.description}</p>
          </div>

          <div className="listing-details__info">
            <h3 className="listing-details__info-title">Item Details</h3>
            <div className="listing-details__info-item">
              <span className="listing-details__info-label">Seller</span>
              <span className="listing-details__info-value">{listing.seller_address}</span>
            </div>
            <div className="listing-details__info-item">
              <span className="listing-details__info-label">Status</span>
              <span className="listing-details__info-value">{listing.status}</span>
            </div>
            <div className="listing-details__info-item">
              <span className="listing-details__info-label">Listed</span>
              <span className="listing-details__info-value">
                {new Date(listing.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="listing-details__info-item">
              <span className="listing-details__info-label">Last Updated</span>
              <span className="listing-details__info-value">
                {new Date(listing.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="listing-details__sidebar">
          <div className="listing-details__trading">
            <div className="listing-details__price-list">
              {listing.prices.map(price => {
                const balance = listing.balances.find(b => b.asset_name === price.asset_name);
                const isSelected = price.asset_name === selectedAsset;

                return (
                  <div
                    key={price.asset_name}
                    className={`listing-details__price-item ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedAsset(price.asset_name)}
                  >
                    <div className="listing-details__price-info">
                      <span className="listing-details__price-asset">
                        {price.asset_name}
                      </span>
                      {balance && (
                        <span className="listing-details__price-balance">
                          {balance.confirmed_balance} available
                        </span>
                      )}
                    </div>
                    <span className="listing-details__price-value">
                      {price.price_evr} EVR
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="listing-details__actions">
              <button
                className="listing-details__button listing-details__button--primary"
                onClick={handleBuyNow}
                disabled={!selectedAsset}
              >
                Buy Now
              </button>
              <button
                className="listing-details__button listing-details__button--secondary"
                onClick={handleAddToCart}
                disabled={!selectedAsset}
              >
                <FiShoppingCart /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;