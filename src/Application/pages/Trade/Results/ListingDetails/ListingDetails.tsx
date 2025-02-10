import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiShoppingCart, FiShare2, FiCopy, FiExternalLink, FiEdit3, FiSettings } from 'react-icons/fi';
import QRCode from 'qrcode';
import './ListingDetails.css';
import ManticoreLogo from '@/Application/logos/white-manticore.png';
import { Balance, Price, Listing } from './types';
import {
  AssetHistory,
  TransactionHistory,
  ListingHeader,
  ListingInfo,
  ListingMedia,
  AssetGrid
} from './components';
import PriceHistory from './components/PriceHistory/PriceHistory';
import SelectedAssetDisplay from './components/SelectedAssetDisplay/SelectedAssetDisplay';
import EditListingModal from './components/EditListingModal/EditListingModal';
import useCart from '@/Application/hooks/useCart';
import { useAuth } from '@/Application/contexts/AuthContext';
import { formatDistance } from 'date-fns';
import placeholderImage from '@/Application/logos/white-manticore.png';
import UnAuthenticated from '@/Application/components/UnAuthenticated/UnAuthenticated';

const trading_api_url = `${import.meta.env.VITE_TRADING_API_PROTO || 'https'}://${import.meta.env.VITE_TRADING_API_HOST || 'api.manticore.exchange'}:8000`;
const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

interface ListingUpdates {
  name?: string;
  description?: string;
  image_ipfs_hash?: string;
  payout_address?: string;
  tags?: string[];
  prices?: Array<{
    asset_name: string;
    price_evr?: string;
    price_asset_name?: string;
    price_asset_amount?: string;
  }>;
}

// Add a helper function to format amounts according to units
const formatAmount = (amount: string | number, units: number): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return num.toFixed(units);
};

// Add a helper function to validate quantity against units
const validateQuantity = (quantity: number, balance: Balance): boolean => {
  const minAmount = 1 / Math.pow(10, balance.units);
  const maxAmount = parseFloat(balance.confirmed_balance);
  return quantity >= minAmount && quantity <= maxAmount;
};

interface ListingDetails {
    id: string;
    seller_address: string;
    listing_address: string;
    deposit_address: string;
    payout_address: string;
    name: string;
    description: string;
    image_ipfs_hash: string | null;
    tags: string[];
    status: string;
    created_at: string;
    updated_at: string;
    prices: Array<{
        asset_name: string;
        price_evr: string;
        price_asset_name: string | null;
        price_asset_amount: string | null;
        ipfs_hash: string | null;
        units: number;
        created_at: string;
        updated_at: string;
    }>;
    balances: Array<{
        asset_name: string;
        confirmed_balance: string;
        pending_balance: string;
        units: number;
        last_confirmed_tx_hash: string | null;
        last_confirmed_tx_time: string | null;
        created_at: string;
        updated_at: string;
    }>;
}

const ListingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, userAddress, token } = useAuth();
  const [listing, setListing] = useState<ListingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });
  const [assetMediaStates, setAssetMediaStates] = useState<Record<string, { isVideo: boolean, isLoaded: boolean }>>({});
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [selectedAsset, setSelectedAsset] = useState<Balance | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<ListingUpdates>({
    name: '',
    description: '',
    prices: []
  });
  const { addToCart } = useCart();
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [showManageSection, setShowManageSection] = useState(false);

  // Fetch listing data
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`${trading_api_url}/listings/by-id/${id}`, { headers });
        if (response.data) {
          setListing(response.data);
          // Initialize quantities for each asset with minimum unit amount
          const initialQuantities: Record<string, number> = {};
          response.data.balances.forEach((balance: Balance) => {
            initialQuantities[balance.asset_name] = 1 / Math.pow(10, balance.units);
          });
          setQuantities(initialQuantities);
          setEditForm({
            name: response.data.name,
            description: response.data.description,
            prices: response.data.prices.map((p: Price) => ({
                asset_name: p.asset_name,
                price_evr: p.price_evr
            }))
          });
        }
      } catch (err) {
        setError('Failed to load listing details. Please try again later.');
        console.error('Error fetching listing:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id, token]);

  // Add this function to check media type
  const checkMediaType = async (ipfsHash: string, assetName: string) => {
    try {
      const response = await fetch(`${PINATA_GATEWAY}${ipfsHash}`, { method: 'HEAD' });
      const contentType = response.headers.get('Content-Type');
      setAssetMediaStates(prev => ({
      ...prev,
        [assetName]: {
          isVideo: contentType?.startsWith('video') || false,
          isLoaded: true
        }
    }));
    } catch (error) {
      console.error('Error checking media type:', error);
      setAssetMediaStates(prev => ({
        ...prev,
        [assetName]: {
          isVideo: false,
          isLoaded: true
        }
      }));
    }
  };

  // Add effect to check media types when listing changes
  useEffect(() => {
    if (listing) {
      listing.prices.forEach(price => {
        if (price.ipfs_hash) {
          checkMediaType(price.ipfs_hash, price.asset_name);
        }
      });
    }
  }, [listing]);

  const handleQuantityChange = (change: number) => {
    const newQuantity = selectedQuantity + change;
    const maxQuantity = listing?.balances[0]?.confirmed_balance 
        ? parseInt(listing.balances[0].confirmed_balance)
        : 0;
    
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
        setSelectedQuantity(newQuantity);
    }
  };

  // Initialize quantities with minimum unit amount
  useEffect(() => {
    if (listing) {
      const initialQuantities: Record<string, number> = {};
      listing.balances.forEach((balance: Balance) => {
        // Start with exactly one unit
        const step = 1 / Math.pow(10, balance.units);
        initialQuantities[balance.asset_name] = step;
      });
      setQuantities(initialQuantities);
    }
  }, [listing]);

  const handleEditListing = () => {
    setIsEditModalOpen(true);
  };

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', { listingId: id, quantity: selectedQuantity });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setNotification({
        show: true,
        type: 'success',
        message: 'Link copied to clipboard!'
      });
    } catch (err) {
      setNotification({
        show: true,
        type: 'error',
        message: 'Failed to copy link'
      });
    }
  };
    
  // Generate QR code when deposit address changes
  useEffect(() => {
    if (listing?.deposit_address) {
      QRCode.toDataURL(listing.deposit_address, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      .then((url: string) => {
        setQrCodeData(url);
      })
      .catch((err: Error) => {
        console.error('Error generating QR code:', err);
      });
    }
  }, [listing?.deposit_address]);

  const handleAssetSelect = (assetName: string) => {
    if (selectedAsset?.asset_name === assetName) {
      setSelectedAsset(null); // Deselect if clicking the same asset
    } else {
      const asset = listing?.balances.find(b => b.asset_name === assetName) || null;
      setSelectedAsset(asset);
    }
  };

  const handleEditSubmit = async (updates: ListingUpdates) => {
    if (!listing || !token) return;

    try {
      const apiUpdates: ListingUpdates = {
        name: updates.name,
        description: updates.description,
        payout_address: updates.payout_address,
        tags: updates.tags,
        image_ipfs_hash: listing.image_ipfs_hash || undefined
      };

      // Only include prices if there are changes
      if (updates.prices?.length) {
        apiUpdates.prices = updates.prices;
      }

      const response = await axios.patch(
        `${trading_api_url}/listings/${listing.id}`,
        apiUpdates,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setListing({ ...listing, ...response.data });
        setIsEditModalOpen(false);
        setNotification({
          show: true,
          type: 'success',
          message: 'Listing updated successfully!'
        });
      }
    } catch (err) {
      console.error('Error updating listing:', err);
      let errorMessage = 'Failed to update listing. Please try again.';
      
      // Handle validation errors
      if (axios.isAxiosError(err) && err.response?.status === 422) {
        const validationErrors = err.response.data?.detail;
        if (Array.isArray(validationErrors)) {
          errorMessage = validationErrors.map(err => {
            const field = err.loc[err.loc.length - 1];
            return `${field}: ${err.msg}`;
          }).join('\n');
        }
      }
      
      setNotification({
        show: true,
        type: 'error',
        message: errorMessage
      });
    }
  };

  const getMediaSrc = () => {
    if (!listing?.image_ipfs_hash) return placeholderImage;
    return `https://ipfs.io/ipfs/${listing.image_ipfs_hash}`;
  };

  const handleManageListing = async () => {
    // Check for auth token first
    if (!token) {
        const returnUrl = encodeURIComponent(`/trade/listings/manage/${id}`);
        navigate(`/signin?returnUrl=${returnUrl}`);
        return;
    }

    // Only check ownership if user is authenticated
    if (!isListingOwner) {
        setNotification({
            show: true,
            type: 'error',
            message: 'You must be the listing owner to manage this listing'
        });
        return;
    }

    navigate(`/trade/listings/manage/${id}`);
  };

  const isListingOwner = Boolean(token && userAddress && listing?.seller_address.toLowerCase() === userAddress.toLowerCase());

  if (loading) {
    return (
      <div className="listing-details">
        <div className="listing-details-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="listing-details">
        <div className="listing-details-container">
          <div className="error-message">{error || 'Listing not found'}</div>
        </div>
      </div>
    );
  }

  const timeAgo = formatDistance(new Date(listing.created_at), new Date(), { addSuffix: true });

  return (
    <div className="listing-details">
      <div className="listing-details-container">
        <ListingHeader 
          onShare={handleShare} 
          onManageListing={handleManageListing}
          isOwner={isListingOwner}
        />

        <div className="listing-details-content">
          <div className="listing-details-media">
            <ListingMedia
              imageUrl={getMediaSrc()}
              altText={listing.name}
              onLoad={() => setMediaLoaded(true)}
              mediaLoaded={mediaLoaded}
            />
          </div>

          <div className="listing-info">
            <div className="listing-info-header">
              <h2 className="listing-info-title">{listing.name}</h2>
              <p className="listing-info-subtitle">Listed {timeAgo}</p>
            </div>

            <div className="listing-info-section">
              <h3 className="listing-info-section-title">Description</h3>
              <p className="listing-description">{listing.description}</p>
            </div>

            {isAuthenticated && !isListingOwner && showManageSection && (
              <div className="listing-error-message">
                You must be the listing owner to manage this listing
              </div>
            )}

            {isListingOwner && showManageSection && (
              <div className="listing-management-section">
                <h3 className="listing-info-section-title">Management</h3>
                
                <div className="listing-addresses">
                  <div className="address-item">
                    <h4>Deposit Address</h4>
                    <div className="address-content">
                      {qrCodeData && (
                        <div className="qr-code">
                          <img src={qrCodeData} alt="Deposit Address QR Code" />
                        </div>
                      )}
                      <div 
                        className="address-display"
                        onClick={() => {
                          navigator.clipboard.writeText(listing.deposit_address);
                          setNotification({
                            show: true,
                            type: 'success',
                            message: 'Deposit address copied!'
                          });
                        }}
                      >
                        <span>{listing.deposit_address}</span>
                        <FiCopy className="copy-icon" />
                      </div>
                    </div>
                  </div>

                  <div className="address-item">
                    <h4>Payout Address</h4>
                    <div className="address-content">
                      <div 
                        className="address-display"
                        onClick={() => {
                          navigator.clipboard.writeText(listing.payout_address);
                          setNotification({
                            show: true,
                            type: 'success',
                            message: 'Payout address copied!'
                          });
                        }}
                      >
                        <span>{listing.payout_address}</span>
                        <FiCopy className="copy-icon" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="management-actions">
                  <button 
                    className="edit-listing-button"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <FiEdit3 /> Edit Listing
                  </button>
                </div>
              </div>
            )}

            <div className="listing-info-section">
              <h3 className="listing-info-section-title">Pricing</h3>
              <div className="listing-price-container">
                {listing.prices.map((price, index) => (
                  <div key={index} className="listing-price-item">
                    <div className="listing-price-info">
                      <span className="listing-price-asset">{price.asset_name}</span>
                      <span className="listing-price-amount">
                        {parseFloat(price.price_evr).toLocaleString()} EVR
                      </span>
                    </div>
                    <div className="listing-price-controls">
                      <div className="quantity-control">
                        <button 
                          className="quantity-button"
                          onClick={() => handleQuantityChange(-1)}
                          disabled={selectedQuantity <= 1}
                        >
                          -
                        </button>
                        <span className="quantity-value">{selectedQuantity}</span>
                        <button 
                          className="quantity-button"
                          onClick={() => handleQuantityChange(1)}
                          disabled={selectedQuantity >= parseInt(listing.balances[0]?.confirmed_balance || '0')}
                        >
                          +
                        </button>
                      </div>
                      <button 
                        className="add-to-cart-button"
                        onClick={handleAddToCart}
                        disabled={!listing.balances[0]?.confirmed_balance || parseInt(listing.balances[0].confirmed_balance) === 0}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="listing-info-section">
              <h3 className="listing-info-section-title">Seller Information</h3>
              <div className="seller-info">
                <div className="seller-details">
                  <h4 className="seller-name">Seller</h4>
                  <p className="seller-address">{listing.seller_address}</p>
                </div>
              </div>
            </div>

            {listing.tags && listing.tags.length > 0 && (
              <div className="listing-info-section">
                <h3 className="listing-info-section-title">Tags</h3>
                <div className="listing-tags">
                  {listing.tags.map((tag, index) => (
                    <span key={index} className="listing-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {listing && (
        <EditListingModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSubmit}
          listing={{
            name: listing.name,
            description: listing.description,
            prices: listing.prices,
            balances: listing.balances,
            deposit_address: listing.deposit_address,
            payout_address: listing.payout_address,
            qrCodeData: qrCodeData
          }}
          onCopyAddress={() => {
            navigator.clipboard.writeText(listing.deposit_address);
            setNotification({
              show: true,
              type: 'success',
              message: 'Address copied to clipboard!'
            });
          }}
        />
      )}

      {notification.show && (
        <div className={`listing-details-notification listing-details-notification-${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default ListingDetails;