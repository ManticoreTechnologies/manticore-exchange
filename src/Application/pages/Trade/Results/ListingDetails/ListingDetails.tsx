import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiShoppingCart, FiShare2, FiCopy, FiExternalLink, FiEdit3, FiSettings } from 'react-icons/fi';
import QRCode from 'qrcode';
import './ListingDetails.css';
import { Balance, Price, Listing, Transaction, PriceHistoryEntry, AssetHistoryEntry } from './types';
import ListingHeader from './components/ListingHeader';
import { ListingMedia } from './components/ListingMedia/ListingMedia';
import PriceHistory from './components/PriceHistory/PriceHistory';
import { AssetHistory } from './components/AssetHistory/AssetHistory';
import { AssetGrid } from './components/AssetGrid/AssetGrid';
import SelectedAssetDisplay from './components/SelectedAssetDisplay/SelectedAssetDisplay';
import EditListingModal from './components/EditListingModal/EditListingModal';
import { TransactionHistory } from './components/TransactionHistory/TransactionHistory';
import useCart from '@/Application/hooks/useCart';
import { useAuth } from '@/Application/contexts/AuthContext';
import { formatDistance } from 'date-fns';
import placeholderImage from '@/Application/logos/white-manticore.png';
import UnAuthenticated from '@/Application/components/UnAuthenticated/UnAuthenticated';
import ListingActions from './components/ListingActions/ListingActions';
import { toast } from 'react-toastify';

const trading_api_url = `${import.meta.env.VITE_TRADING_API_PROTO || 'http'}://${import.meta.env.VITE_TRADING_API_HOST || 'localhost'}:8000`;
console.log('Trading API URL:', trading_api_url);
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

interface ListingDetailsProps {
  isConnected: boolean;
  userAddress?: string;
  addToCart: (listing: Listing) => void;
  onListingUpdate: (listing: Listing) => void;
}

export const ListingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { userAddress, isAuthenticated, token } = useAuth();
  const { addToCart } = useCart();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryEntry[]>([]);
  const [assetHistory, setAssetHistory] = useState<AssetHistoryEntry[]>([]);
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });
  const [assetMediaStates, setAssetMediaStates] = useState<Record<string, { isVideo: boolean, isLoaded: boolean }>>({});
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [showManageSection, setShowManageSection] = useState(false);

  const showError = (message: string) => {
    setNotification({
      show: true,
      type: 'error',
      message
    });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const showSuccess = (message: string) => {
    setNotification({
      show: true,
      type: 'success',
      message
    });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  useEffect(() => {
    const fetchListingData = async () => {
      if (!id) {
        console.error('No listing ID provided');
        setError('Invalid listing ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log('Fetching listing data from:', `${trading_api_url}/listings/by-id/${id}`);
        const response = await axios.get(`${trading_api_url}/listings/by-id/${id}`);
        console.log('Listing data response:', response.data);
        
        if (!response.data) {
          setError('Listing not found');
          return;
        }

        const listingData = response.data;
        
        // Add isOwnedByUser flag
        listingData.isOwnedByUser = userAddress && 
          userAddress.toLowerCase() === listingData.seller_address.toLowerCase();

        setListing(listingData);
        
        // Set initial selected asset if there are prices
        if (listingData.prices && listingData.prices.length > 0) {
          setSelectedAsset(listingData.prices[0].asset_name);
          console.log('Selected initial asset:', listingData.prices[0].asset_name);
        } else {
          console.log('No prices available in listing data');
        }

        // Fetch additional data
        await Promise.all([
          fetchPriceHistory(listingData.prices[0]?.asset_name),
          fetchAssetHistory(listingData.prices[0]?.asset_name),
          fetchTransactions(listingData.prices[0]?.asset_name)
        ]);

      } catch (err) {
        console.error('Error fetching listing:', err);
        if (axios.isAxiosError(err)) {
          const errorMessage = err.response?.data?.message || 'Failed to load listing details';
          console.error('API Error:', {
            status: err.response?.status,
            data: err.response?.data,
            message: errorMessage
          });
          setError(errorMessage);
          showError(errorMessage);
        } else {
          setError('Failed to load listing details');
          showError('Failed to load listing details');
        }
      } finally {
        setLoading(false);
      }
    };
    console.log(listing);
    fetchListingData();
  }, [id, userAddress]);

  const fetchPriceHistory = async (asset?: string) => {
    if (!id || !asset) return;
    try {
      const response = await axios.get(
        `${trading_api_url}/listings/${id}/prices?asset=${asset}&range=1M`
      );
      setPriceHistory(response.data.history || []);
    } catch (err) {
      console.error('Error fetching price history:', err);
    }
  };

  const fetchAssetHistory = async (asset?: string) => {
    if (!id || !asset) return;
    try {
      const response = await axios.get(
        `${trading_api_url}/listings/${id}/asset-history?asset=${asset}`
      );
      setAssetHistory(response.data.history || []);
    } catch (err) {
      console.error('Error fetching asset history:', err);
    }
  };

  const fetchTransactions = async (asset?: string) => {
    if (!id || !asset) return;
    try {
      const response = await axios.get(
        `${trading_api_url}/listings/${id}/transactions?asset=${asset}`
      );
      setTransactions(response.data.transactions || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  useEffect(() => {
    if (id && selectedAsset) {
      Promise.all([
        fetchPriceHistory(selectedAsset),
        fetchAssetHistory(selectedAsset),
        fetchTransactions(selectedAsset)
      ]);
    }
  }, [id, selectedAsset]);

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
      setSelectedQuantity(initialQuantities[selectedAsset] || 1);
    }
  }, [listing, selectedAsset]);

  const handleEditListing = () => {
    // Implementation of handleEditListing
  };

  const handleAddToCart = async (quantity: number) => {
    if (!listing || !listing.prices?.[0] || !listing.balances?.[0]) return;
    
    try {
      await addToCart({
        listingId: listing.id,
        name: listing.name,
        description: listing.description,
        image_ipfs_hash: listing.image_ipfs_hash,
        quantity: quantity,
        unitPrice: listing.prices[0].price_evr,
        asset_name: listing.balances[0].asset_name,
        seller_address: listing.seller_address
      });
      toast.success('Added to cart successfully!');
    } catch (err) {
      toast.error('Failed to add to cart');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
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

  const handleAssetSelect = async (assetName: string) => {
    if (selectedAsset === assetName) {
      return; // Keep the same asset selected if clicked again
    }
    
    setSelectedAsset(assetName);
    setLoading(true);
    
    try {
      // Fetch all relevant data for the selected asset
      await Promise.all([
        fetchPriceHistory(assetName),
        fetchAssetHistory(assetName),
        fetchTransactions(assetName)
      ]);
      
      toast.success(`Showing history for ${assetName}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error('Error fetching asset data:', err);
      toast.error(`Failed to load ${assetName} history`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
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
        showSuccess('Listing updated successfully!');
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
      
      showError(errorMessage);
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
    if (!isAuthenticated || !userAddress || !(listing?.seller_address.toLowerCase() === userAddress.toLowerCase())) {
        showError('You must be the listing owner to manage this listing');
        return;
    }

    navigate(`/trade/listings/manage/${id}`);
  };

  const isListingOwner = Boolean(token && userAddress && listing?.seller_address.toLowerCase() === userAddress.toLowerCase());

  const handleCopyAddress = async () => {
    if (!listing) return;
    
    try {
      await navigator.clipboard.writeText(listing.seller_address);
      toast.success('Seller address copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy address');
    }
  };

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
      <div className="listing-details-content">
        <div className="listing-details-main">
          {listing && (
            <>
              <ListingHeader
                id={listing.id}
                name={listing.name}
                description={listing.description}
                sellerAddress={listing.seller_address}
                createdAt={listing.created_at}
                tags={listing.tags}
                onCopyAddress={() => {
                  navigator.clipboard.writeText(listing.seller_address);
                  toast.success('Seller address copied to clipboard!');
                }}
                isOwner={listing.isOwnedByUser}
              />

              <div className="listing-addresses-info">
                <div className="address-info-item">
                  <h4>Listing Address</h4>
                  <div className="address-display" onClick={() => {
                    navigator.clipboard.writeText(listing.listing_address);
                    toast.success('Listing address copied to clipboard!');
                  }}>
                    <span>{listing.listing_address}</span>
                    <FiCopy className="copy-icon" />
                  </div>
                </div>

                <div className="address-info-item">
                  <h4>Status</h4>
                  <span className={`listing-status status-${listing.status}`}>
                    {listing.status.toUpperCase()}
                  </span>
                </div>

                <div className="address-info-item">
                  <h4>Last Updated</h4>
                  <span>{new Date(listing.updated_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>

              {listing?.prices && listing.prices.length > 0 && listing.balances && listing.balances.length > 0 && (
                <>
                  <div className="listing-price-info">
                    <h4>Price Information</h4>
                    <div className="price-details">
                      {listing.prices.map((price, index) => (
                        <div key={`${price.asset_name}-${index}`} className="price-item">
                          <span className="price-label">Asset:</span>
                          <span className="price-value">{price.asset_name}</span>
                          <span className="price-label">Price (EVR):</span>
                          <span className="price-value">{price.price_evr}</span>
                          {price.price_asset_name && (
                            <>
                              <span className="price-label">Alternative Price:</span>
                              <span className="price-value">
                                {price.price_asset_amount} {price.price_asset_name}
                              </span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="listing-assets">
                    <h4>Available Assets</h4>
                    <div className="assets-grid">
                      {listing.balances.map((balance, index) => (
                        <div 
                          key={`${balance.asset_name}-${index}`}
                          className={`asset-card ${selectedAsset === balance.asset_name ? 'selected' : ''}`}
                          onClick={() => handleAssetSelect(balance.asset_name)}
                        >
                          <div className="asset-name">{balance.asset_name}</div>
                          <div className="asset-balance">
                            Available: {formatAmount(balance.confirmed_balance, balance.units)}
                          </div>
                          <div className="asset-balance">
                            Pending: {formatAmount(balance.pending_balance, balance.units)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="listing-balance-info">
                    <h4>Balance Information</h4>
                    <div className="balance-details">
                      {listing.balances.map((balance, index) => (
                        <div key={`${balance.asset_name}-${index}`} className="balance-item">
                          <span className="balance-label">Asset:</span>
                          <span className="balance-value">{balance.asset_name}</span>
                          <span className="balance-label">Available:</span>
                          <span className="balance-value">
                            {formatAmount(balance.confirmed_balance, balance.units)} {balance.asset_name}
                          </span>
                          <span className="balance-label">Pending:</span>
                          <span className="balance-value">
                            {formatAmount(balance.pending_balance, balance.units)} {balance.asset_name}
                          </span>
                          {balance.last_confirmed_tx_hash && (
                            <div className="balance-item">
                              <span className="balance-label">Last Transaction:</span>
                              <a 
                                href={`https://explorer.manticore.exchange/tx/${balance.last_confirmed_tx_hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="tx-link"
                              >
                                {balance.last_confirmed_tx_hash.slice(0, 8)}...
                                {balance.last_confirmed_tx_hash.slice(-8)}
                                <FiExternalLink className="external-link-icon" />
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <ListingActions
                    prices={listing.prices}
                    balances={listing.balances}
                    onAddToCart={handleAddToCart}
                    onBuyNow={(quantity: number) => {
                      if (!listing) return;
                      handleAddToCart(quantity);
                      navigate('/trade/checkout');
                    }}
                  />
                </>
              )}
            </>
          )}
        </div>

        <div className="listing-details-history">
          {selectedAsset && (
            <>
              <div className="history-section">
                <PriceHistory
                  listingId={listing?.id || ''}
                  assetName={selectedAsset}
                  data={priceHistory}
                />
              </div>

              <div className="history-section">
                <AssetHistory
                  listingId={listing?.id || ''}
                  assetName={selectedAsset}
                />
              </div>

              <div className="history-section">
                <TransactionHistory
                  listingId={listing?.id || ''}
                  assetName={selectedAsset}
                  transactions={transactions}
                />
              </div>
            </>
          )}
        </div>
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
                    toast.success('Deposit address copied!');
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
                    toast.success('Payout address copied!');
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
              onClick={() => handleEditListing()}
            >
              <FiEdit3 /> Edit Listing
            </button>
          </div>
        </div>
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