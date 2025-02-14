import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/Application/contexts/AuthContext';
import { useCart } from '@/Application/hooks/useCart';
import { toast } from 'react-toastify';
import { FiHeart, FiShoppingCart, FiArrowLeft } from 'react-icons/fi';
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
  const { cartCount, addToCart } = useCart();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<string>("1");
  const [evrAmount, setEvrAmount] = useState<string>("0");

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

  const getDecimalPlaces = (units: number) => {
    return Math.abs(units);
  };

  const roundToUnits = (value: number, units: number) => {
    const decimals = getDecimalPlaces(units);
    return Number(value.toFixed(decimals));
  };

  const handleQuantityChange = (value: string) => {
    if (value === "") {
      setQuantity("");
      setEvrAmount("0");
      return;
    }

    const numValue = Number(value);
    if (isNaN(numValue)) return;

    const selectedBalance = listing?.balances.find(b => b.asset_name === selectedAsset);
    const selectedPrice = listing?.prices.find(p => p.asset_name === selectedAsset);
    
    if (!selectedBalance || !selectedPrice) return;

    const decimals = getDecimalPlaces(selectedBalance.units);
    const roundedQuantity = roundToUnits(numValue, selectedBalance.units);
    const maxQuantity = Number(selectedBalance.confirmed_balance);

    if (roundedQuantity > maxQuantity) {
      toast.error(`Maximum available quantity is ${maxQuantity}`);
      return;
    }

    if (roundedQuantity < Math.pow(10, -decimals)) {
      toast.error(`Minimum quantity is ${Math.pow(10, -decimals)}`);
      return;
    }

    setQuantity(roundedQuantity.toString());
    const totalEvr = (roundedQuantity * Number(selectedPrice.price_evr)).toFixed(8);
    setEvrAmount(totalEvr);
  };

  const handleEvrChange = (value: string) => {
    if (value === "") {
      setEvrAmount("");
      setQuantity("0");
      return;
    }

    const numValue = Number(value);
    if (isNaN(numValue)) return;

    const selectedPrice = listing?.prices.find(p => p.asset_name === selectedAsset);
    const selectedBalance = listing?.balances.find(b => b.asset_name === selectedAsset);
    
    if (!selectedPrice || !selectedBalance) return;

    const pricePerUnit = Number(selectedPrice.price_evr);
    const calculatedQuantity = numValue / pricePerUnit;
    const roundedQuantity = roundToUnits(calculatedQuantity, selectedBalance.units);
    const maxQuantity = Number(selectedBalance.confirmed_balance);

    if (roundedQuantity > maxQuantity) {
      toast.error(`Maximum available quantity is ${maxQuantity}`);
      return;
    }

    setQuantity(roundedQuantity.toString());
    setEvrAmount(value);
  };

  useEffect(() => {
    if (selectedAsset && listing) {
      const selectedPrice = listing.prices.find(p => p.asset_name === selectedAsset);
      if (selectedPrice) {
        const totalEvr = (Number(quantity) * Number(selectedPrice.price_evr)).toFixed(8);
        setEvrAmount(totalEvr);
      }
    }
  }, [selectedAsset, quantity, listing]);

  const handleAddToCart = () => {
    if (!listing || !selectedAsset) return;

    const selectedPrice = listing.prices.find(p => p.asset_name === selectedAsset);
    const selectedBalance = listing.balances.find(b => b.asset_name === selectedAsset);
    
    if (!selectedPrice || !selectedBalance) return;

    if (Number(quantity) > Number(selectedBalance.confirmed_balance)) {
      toast.error(`Cannot add more than available balance (${selectedBalance.confirmed_balance})`);
      return;
    }

    const cartItem = {
      listingId: listing.id,
      name: listing.name,
      description: listing.description,
      image_ipfs_hash: listing.image_ipfs_hash,
      quantity: Number(quantity),
      unitPrice: selectedPrice.price_evr,
      asset_name: selectedAsset,
      seller_address: listing.seller_address
    };

    addToCart(cartItem);
    toast.success('Added to cart successfully!');
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

  const handleBack = () => {
    navigate(-1);
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
        <div className="listing-details__header-left">
          <button 
            className="listing-details__back-button"
            onClick={handleBack}
            aria-label="Go back"
          >
            <FiArrowLeft /> Back
          </button>
          <h1 className="listing-details__title">{listing.name}</h1>
        </div>
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
                const hasBalance = balance && Number(balance.confirmed_balance) > 0;

                return (
                  <div
                    key={price.asset_name}
                    className={`listing-details__price-item ${isSelected ? 'active' : ''} ${!hasBalance ? 'disabled' : ''}`}
                    onClick={() => hasBalance && setSelectedAsset(price.asset_name)}
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

            <div className="listing-details__quantity-controls">
              <div className="quantity-input">
                <label>Quantity ({selectedAsset})</label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className="quantity-field"
                />
              </div>
              <div className="evr-input">
                <label>Total (EVR)</label>
                <input
                  type="text"
                  value={evrAmount}
                  onChange={(e) => handleEvrChange(e.target.value)}
                  className="evr-field"
                />
              </div>
            </div>

            <div className="listing-details__actions">
              <button
                className="listing-details__button listing-details__button--primary"
                onClick={handleAddToCart}
                disabled={!selectedAsset || Number(quantity) <= 0}
              >
                <FiShoppingCart /> Add to Cart
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
              <button
                className="listing-details__button listing-details__button--secondary"
                onClick={() => navigate('/cart')}
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
        </div>
    </div>
  );
};

export default ListingDetails;