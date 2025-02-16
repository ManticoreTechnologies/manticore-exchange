import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/Application/contexts/AuthContext';
import { useCart } from '@/Application/hooks/useCart';
import { toast } from 'react-toastify';
import { FiHeart, FiShoppingCart, FiArrowLeft, FiShare2, FiEdit } from 'react-icons/fi';
import { ImageCarousel } from './components/ImageCarousel/ImageCarousel';
import axios from 'axios';
import './ListingDetails.css';

interface Listing {
    id: string;
  name: string;
  description: string;
    seller_address: string;
    listing_address: string;
    deposit_address: string;
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
  tags?: string[];
}

interface AssetQuantity {
  asset_name: string;
  quantity: string;
  max_quantity: string;
}

const TRADING_API_URL = `${import.meta.env.VITE_TRADING_API_PROTO || 'http'}://${import.meta.env.VITE_TRADING_API_HOST || 'localhost'}:8000`;

// Create a separate CartBadge component
const CartBadge: React.FC<{ count: number }> = React.memo(({ count }) => {
  if (count <= 0) return null;
  return <span className="cart-badge">{count}</span>;
});

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
  const [purchaseAll, setPurchaseAll] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [assetQuantities, setAssetQuantities] = useState<AssetQuantity[]>([]);

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

  useEffect(() => {
    if (listing) {
      const quantities = listing.balances
        .filter(balance => Number(balance.confirmed_balance) > 0)
        .map(balance => ({
          asset_name: balance.asset_name,
          quantity: balance.confirmed_balance,
          max_quantity: balance.confirmed_balance
        }));
      setAssetQuantities(quantities);
    }
  }, [listing]);

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
    if (isNaN(numValue) || numValue < 0) return;

    const selectedBalance = listing?.balances.find(b => b.asset_name === selectedAsset);
    const selectedPrice = listing?.prices.find(p => p.asset_name === selectedAsset);
    
    if (!selectedBalance || !selectedPrice) return;

    const maxQuantity = Number(selectedBalance.confirmed_balance);

    if (numValue > maxQuantity) {
        toast.error(`Maximum available quantity is ${maxQuantity}`);
        return;
    }

    setQuantity(value);
    const totalEvr = (numValue * Number(selectedPrice.price_evr)).toFixed(8);
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

  const handlePurchaseAllQuantityChange = (assetName: string, value: string) => {
    const balance = listing?.balances.find(b => b.asset_name === assetName);
    if (!balance) return;

    const numValue = Number(value);
    if (isNaN(numValue) || numValue < 0) return;

    const maxQuantity = Number(balance.confirmed_balance);
    if (numValue > maxQuantity) {
      toast.error(`Maximum available quantity is ${maxQuantity}`);
      return;
    }

    setAssetQuantities(prev => 
      prev.map(aq => 
        aq.asset_name === assetName 
          ? { ...aq, quantity: value }
          : aq
      )
    );

    // Recalculate total EVR amount
    if (listing) {
      const total = assetQuantities.reduce((sum, aq) => {
        const price = listing.prices.find(p => p.asset_name === aq.asset_name);
        if (price) {
          return sum + (Number(aq.quantity) * Number(price.price_evr));
        }
        return sum;
      }, 0);
      setEvrAmount(total.toFixed(8));
    }
  };

  const handlePurchaseAllToggle = () => {
    if (!hasAvailableAssets) return;
    
    setPurchaseAll(!purchaseAll);
    if (!purchaseAll && listing) {
      // Initialize quantities to max available for each asset
      const quantities = listing.balances
        .filter(balance => Number(balance.confirmed_balance) > 0)
        .map(balance => ({
          asset_name: balance.asset_name,
          quantity: balance.confirmed_balance,
          max_quantity: balance.confirmed_balance
        }));
      setAssetQuantities(quantities);

      // Calculate total EVR amount
      const total = quantities.reduce((sum, aq) => {
        const price = listing.prices.find(p => p.asset_name === aq.asset_name);
        if (price) {
          return sum + (Number(aq.quantity) * Number(price.price_evr));
        }
        return sum;
      }, 0);
      setEvrAmount(total.toFixed(8));
    } else {
      // Reset to selected asset only
      const selectedPrice = listing?.prices.find(p => p.asset_name === selectedAsset);
      if (selectedPrice) {
        setEvrAmount(selectedPrice.price_evr);
        setQuantity("1");
      }
    }
  };

  const handleAddToCart = () => {
    if (!listing) return;

    if (purchaseAll) {
      // Add all assets with their quantities
      assetQuantities.forEach(aq => {
        const price = listing.prices.find(p => p.asset_name === aq.asset_name);
        if (price && Number(aq.quantity) > 0) {
          const cartItem = {
            listingId: listing.id,
            name: listing.name,
            description: listing.description,
            image_ipfs_hash: listing.image_ipfs_hash,
            quantity: Number(aq.quantity),
            unitPrice: price.price_evr,
            asset_name: aq.asset_name,
            seller_address: listing.seller_address
          };
          addToCart(cartItem);
        }
      });
      toast.success('All items added to cart successfully!');
      return;
    }

    // Regular single asset add to cart
    if (!selectedAsset) return;

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

  const handleAssetSelect = (assetName: string) => {
    setSelectedAsset(assetName);
    setDropdownOpen(false);
    // Reset quantity and EVR amount when changing assets
    setQuantity("1");
    const selectedPrice = listing?.prices.find(p => p.asset_name === assetName);
    if (selectedPrice) {
      setEvrAmount(selectedPrice.price_evr);
    }
  };

  const hasAvailableAssets = useMemo(() => {
    if (!listing) return false;
    return listing.balances.some(balance => Number(balance.confirmed_balance) > 0);
  }, [listing]);

  const hasSelectedAssetBalance = useMemo(() => {
    if (!listing || !selectedAsset) return false;
    const selectedBalance = listing.balances.find(b => b.asset_name === selectedAsset);
    return selectedBalance && Number(selectedBalance.confirmed_balance) > 0;
  }, [listing, selectedAsset]);

  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link:', err);
      toast.error('Failed to copy link');
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
        <div className="listing-details__header-left">
          <button 
            className="listing-details__back-button"
            onClick={() => navigate('/trade')}
            aria-label="Go back"
          >
            <FiArrowLeft /> Back
          </button>
          <h1 className="listing-details__title">{listing.name}</h1>
        </div>
        <div className="listing-details__header-actions">
          <button 
            className={`listing-details__button listing-details__button--secondary ${isLiked ? 'active' : ''}`}
            onClick={handleLikeClick}
          >
            <FiHeart /> {isLiked ? 'Liked' : 'Like'}
          </button>
          <button 
            className="listing-details__button listing-details__button--secondary"
            onClick={handleShare}
          >
            <FiShare2 /> Share
          </button>
          {listing.isOwnedByUser && (
            <button 
              className="listing-details__button listing-details__button--primary"
              onClick={() => navigate(`/trade/listings/manage/${listing.id}`)}
            >
              <FiEdit /> Manage Listing
            </button>
          )}
        </div>
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
            {listing.tags && listing.tags.length > 0 && (
                <div className="listing-details__tags">
                    {listing.tags.map((tag, index) => (
                        <span key={index} className="listing-details__tag">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}
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
            <div className="listing-details__asset-selector">
              <div 
                className="listing-details__dropdown-header"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="listing-details__selected-asset">
                  {selectedAsset || "Select Asset"}
                </span>
                <svg
                  className={`listing-details__dropdown-arrow ${dropdownOpen ? 'open' : ''}`}
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L6 6L11 1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              {dropdownOpen && (
                <div className="listing-details__dropdown-content">
                  {listing?.prices.map(price => {
                    const balance = listing.balances.find(b => b.asset_name === price.asset_name);
                    const hasBalance = balance && Number(balance.confirmed_balance) > 0;
                    
                    return (
                      <div
                        key={price.asset_name}
                        className={`listing-details__dropdown-item ${
                          price.asset_name === selectedAsset ? 'active' : ''
                        } ${!hasBalance ? 'disabled' : ''}`}
                        onClick={() => hasBalance && handleAssetSelect(price.asset_name)}
                      >
                        <div className="listing-details__dropdown-item-info">
                          <span className="listing-details__dropdown-item-name">
                            {price.asset_name}
                          </span>
                          {balance && (
                            <span className="listing-details__dropdown-item-balance">
                              {Number(balance.confirmed_balance).toFixed(balance.units)} available
                            </span>
                          )}
                        </div>
                        <span className="listing-details__dropdown-item-price">
                          {price.price_evr} EVR
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="listing-details__trading-controls">
              <div className="listing-details__purchase-all">
                <label className={`listing-details__checkbox-label ${!hasAvailableAssets ? 'disabled' : ''}`}>
                  <input
                    type="checkbox"
                    checked={purchaseAll}
                    onChange={handlePurchaseAllToggle}
                    disabled={!hasAvailableAssets}
                  />
                  Purchase All Available Assets
                  {!hasAvailableAssets && (
                    <span className="listing-details__empty-message">No assets available</span>
                  )}
                </label>
              </div>

              {purchaseAll ? (
                <div className="listing-details__purchase-all-quantities">
                  {assetQuantities.map(aq => {
                    const price = listing?.prices.find(p => p.asset_name === aq.asset_name);
                    return (
                      <div key={aq.asset_name} className="listing-details__quantity-row">
                        <div className="listing-details__asset-info">
                          <span className="listing-details__asset-name">{aq.asset_name}</span>
                          <span className="listing-details__asset-price">{price?.price_evr} EVR</span>
                        </div>
                        <div className="listing-details__input-container">
                          <input
                            type="number"
                            className="listing-details__input quantity-field"
                            value={aq.quantity}
                            onChange={(e) => handlePurchaseAllQuantityChange(aq.asset_name, e.target.value)}
                            min="0"
                            max={aq.max_quantity}
                            step="0.00000001"
                            placeholder="0.00000000"
                          />
                          <span className="listing-details__max-quantity">
                            Max: {aq.max_quantity}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div className="listing-details__total-evr">
                    <span>Total</span>
                    <span>{evrAmount} EVR</span>
                  </div>
                </div>
              ) : (
                <div className="listing-details__input-group">
                  <div className="listing-details__input-container">
                    <label className="listing-details__input-label">Quantity</label>
                    <input
                      type="number"
                      className="listing-details__input quantity-field"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      min="0"
                      step="0.00000001"
                      placeholder="0.00000000"
                      disabled={purchaseAll || !hasSelectedAssetBalance}
                    />
                    {selectedAsset && (
                      <span className="listing-details__input-suffix">{selectedAsset}</span>
                    )}
                  </div>

                  <div className="listing-details__input-container">
                    <label className="listing-details__input-label">Total</label>
                    <input
                      type="number"
                      className="listing-details__input evr-field"
                      value={evrAmount}
                      onChange={(e) => handleEvrChange(e.target.value)}
                      min="0"
                      step="0.00000001"
                      placeholder="0.00000000"
                      disabled={purchaseAll || !hasSelectedAssetBalance}
                    />
                    <span className="listing-details__input-suffix">EVR</span>
                  </div>
                </div>
              )}
            </div>

            <div className="listing-details__actions">
              <button
                className="listing-details__button listing-details__button--primary"
                onClick={handleAddToCart}
                disabled={!hasAvailableAssets || (!purchaseAll && (!selectedAsset || Number(quantity) <= 0))}
              >
                <FiShoppingCart /> Add to Cart
                <CartBadge count={cartCount} />
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