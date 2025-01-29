/**
 * 
 * /listing/:id
 * ex. /listing/1039818192293855233
 {
  "listing": {
    "description": "A tome of dark magic, cursed to be forever lost to the ages",
    "hearts": 0,
    "id": "1039818192293855233",
    "ipfs_hash": "QmXWBioKHKSj8f1xCQe6P8GLUxaPowtfAdxGzWkXP2NGoP",
    "name": "Cymos' Infernal Tome",
    "offerings": [
      {
        "asset_name": "INFERNA",
        "created_at": "2025-01-20T18:28:52.434133",
        "id": "1039818203116601345",
        "ipfs_hash": "Qm1234567890abcdef",
        "on_hold": 0.0,
        "price": 1000.0,
        "quantity": 0.0,
        "sold": 0.0,
        "updated_at": "2025-01-20T18:28:52.434133",
        "visible": true
      }
    ],
    "seller_address": "EW9wU7BDZy9X9uj2LfYJzfYnGz3rHmEMPt",
    "tags": "magic, tome, dark"
  },
  "success": true
}

 */


import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiShoppingCart, FiShare2, FiCopy, FiExternalLink } from 'react-icons/fi';
import QRCode from 'qrcode';
import './ListingDetails.css';
import ManticoreLogo from '@/images/enhanced_logo.png';
import { formatEvrAmount, truncateAddress } from '@/utils/formatting';

const trading_api_url = `${import.meta.env.VITE_TRADING_API_PROTO || 'https'}://${import.meta.env.VITE_TRADING_API_HOST || 'api.manticore.exchange'}:8000`;
const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

interface Balance {
  asset_name: string;
  confirmed_balance: string;
  pending_balance: string;
  last_confirmed_tx_hash: string | null;
  last_confirmed_tx_time: string | null;
}

interface Price {
  asset_name: string;
  price_evr: string;
  price_asset_name: string | null;
  price_asset_amount: string | null;
  ipfs_hash: string | null;
}

interface Listing {
  id: string;
  seller_address: string;
  listing_address: string;
  deposit_address: string;
  name: string;
  description: string;
  image_ipfs_hash: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  prices: Price[];
  balances: Balance[];
}

const ListingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });
  const [assetMediaStates, setAssetMediaStates] = useState<Record<string, { isVideo: boolean, isLoaded: boolean }>>({});
  const [qrCodeData, setQrCodeData] = useState<string>('');

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('manticore_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Fetch listing data
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${trading_api_url}/listings/${id}`);
        if (response.data) {
          console.log(response.data);
          setListing(response.data);
          // Initialize quantities for each asset
          const initialQuantities: Record<string, number> = {};
          response.data.balances.forEach((balance: Balance) => {
            initialQuantities[balance.asset_name] = 1;
          });
          setQuantities(initialQuantities);
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
  }, [id]);

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

  const handleQuantityChange = (assetName: string, increment: boolean) => {
    setQuantities(prev => {
      const currentQty = prev[assetName] || 1;
      const balance = listing?.balances.find(b => b.asset_name === assetName);
      const available = balance ? Number(balance.confirmed_balance) : 0;
      
      let newQty = increment ? currentQty + 1 : currentQty - 1;
      newQty = Math.max(1, Math.min(newQty, available)); // Clamp between 1 and available
      
      return { ...prev, [assetName]: newQty };
    });
  };

  const handleAddToCart = (assetName: string) => {
    if (!listing) return;

    const price = listing.prices.find(p => p.asset_name === assetName);
    const quantity = quantities[assetName] || 1;

    if (!price) return;

    const newItem = {
      listingId: listing.id,
      name: listing.name,
      description: listing.description,
      image_ipfs_hash: listing.image_ipfs_hash,
      quantity,
      unitPrice: price.price_evr,
      asset_name: assetName,
      seller_address: listing.seller_address
    };

    const updatedCart = [...cart, newItem];
    setCart(updatedCart);
    localStorage.setItem('manticore_cart', JSON.stringify(updatedCart));
    
    setNotification({
      show: true,
      type: 'success',
      message: 'Item added to cart successfully!'
    });

    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
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

  if (loading) {
    return (
      <div className="listing-details">
        <div className="details-header">
          <button className="action-button back-button" onClick={() => navigate('/trade')}>
            <FiArrowLeft /> Back to Listings
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-6)' }}>
          <div className="loading-spinner"></div>
          <span style={{ marginLeft: 'var(--spacing-3)' }}>Loading listing details...</span>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="listing-details">
        <div className="details-header">
          <button className="action-button back-button" onClick={() => navigate('/trade')}>
            <FiArrowLeft /> Back to Listings
          </button>
        </div>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          padding: 'var(--spacing-6)',
          gap: 'var(--spacing-4)'
        }}>
          <img src={ManticoreLogo} alt="Manticore Logo" style={{ width: '80px', opacity: 0.5 }} />
          <h2>Error Loading Listing</h2>
          <p>{error || 'Listing not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="listing-details">
      <header className="details-header">
        <button className="action-button back-button" onClick={() => navigate('/trade')}>
          <FiArrowLeft /> Back to Listings
        </button>
        <div className="header-actions">
          <button className="action-button share-button" onClick={handleShare}>
            <FiShare2 /> Share
          </button>
          <button 
            className="action-button cart-button" 
            onClick={() => navigate('/cart')}
            data-count={cart.length || ''}
          >
            <FiShoppingCart /> Cart
          </button>
        </div>
      </header>

      <main className="listing-content">
        <section className="listing-primary">
          <div className="listing-media">
            {listing.image_ipfs_hash ? (
              <img
                src={`${PINATA_GATEWAY}${listing.image_ipfs_hash}`}
                alt={listing.name}
                className="listing-image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = ManticoreLogo;
                  target.className = "placeholder-image";
                }}
              />
            ) : (
              <img
                src={ManticoreLogo}
                alt="Manticore Logo"
                className="placeholder-image"
              />
            )}
          </div>

          <div className="listing-info">
            <div className="listing-header">
              <h1>{listing.name}</h1>
              <div className="seller-info">
                <span>Listed by</span>
                <div className="seller-address">
                  <span>{truncateAddress(listing.seller_address)}</span>
                  <button 
                    className="copy-button"
                    onClick={() => {
                      navigator.clipboard.writeText(listing.seller_address);
                      setNotification({
                        show: true,
                        type: 'success',
                        message: 'Address copied!'
                      });
                    }}
                  >
                    <FiCopy />
                  </button>
                  <a 
                    href={`https://explorer.manticore.exchange/address/${listing.seller_address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="explorer-link"
                  >
                    <FiExternalLink />
                  </a>
                </div>
              </div>
            </div>

            <div className="listing-description">
              <h2>Description</h2>
              <p>{listing.description}</p>
            </div>

            <div className="listing-details-info">
              <div className="detail-item">
                <span className="detail-label">Listing ID</span>
                <span className="detail-value">{listing.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Created</span>
                <span className="detail-value">
                  {new Date(listing.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span className={`detail-value status-${listing.status.toLowerCase()}`}>
                  {listing.status}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="listing-assets">
          <h2>Available Assets</h2>
          <div className="assets-grid">
            {listing.balances.map((balance, index) => {
              const price = listing.prices.find(p => p.asset_name === balance.asset_name);
              const available = Number(balance.confirmed_balance);
              const quantity = quantities[balance.asset_name] || 1;

              return (
                <div key={`${balance.asset_name}-${index}`} className="asset-card">
                  <div className="asset-header">
                    {price?.ipfs_hash && (
                      <div className="asset-media">
                        {assetMediaStates[balance.asset_name]?.isVideo ? (
                          <video
                            src={`${PINATA_GATEWAY}${price.ipfs_hash}`}
                            className="asset-video"
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                        ) : (
                          <img
                            src={`${PINATA_GATEWAY}${price.ipfs_hash}`}
                            alt={balance.asset_name}
                            className="asset-image"
                          />
                        )}
                      </div>
                    )}
                    <div className="asset-info">
                      <h3>{balance.asset_name}</h3>
                      <span className="asset-price">
                        {price ? formatEvrAmount(price.price_evr) : 'N/A'} EVR
                      </span>
                    </div>
                  </div>

                  <div className="asset-availability">
                    <div className="availability-indicator">
                      <div 
                        className="availability-bar"
                        style={{ 
                          width: `${Math.min((available / (available + 1)) * 100, 100)}%`,
                          backgroundColor: available > 0 ? 'var(--accent-color)' : 'var(--color-error)'
                        }}
                      />
                    </div>
                    <span className="availability-text">
                      {available} available
                    </span>
                  </div>

                  <div className="asset-controls">
                    <div className="quantity-controls">
                      <button 
                        className="quantity-button"
                        onClick={() => handleQuantityChange(balance.asset_name, false)}
                        disabled={quantity <= 1}
                      >
                        −
                      </button>
                      <span className="quantity-display">{quantity}</span>
                      <button 
                        className="quantity-button"
                        onClick={() => handleQuantityChange(balance.asset_name, true)}
                        disabled={quantity >= available}
                      >
                        +
                      </button>
                    </div>

                    <button 
                      className="add-to-cart-button"
                      onClick={() => handleAddToCart(balance.asset_name)}
                      disabled={available <= 0}
                    >
                      <FiShoppingCart />
                      {available <= 0 ? 'Out' : 'Add'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {qrCodeData && (
          <div className="qr-code-container">
            <div className="qr-code-label">Deposit Address</div>
            <div className="qr-code">
              <img
                src={qrCodeData}
                alt="Deposit Address QR Code"
              />
            </div>
            <div 
              className="qr-code-address"
              onClick={() => {
                navigator.clipboard.writeText(listing.deposit_address);
                setNotification({
                  show: true,
                  type: 'success',
                  message: 'Address copied to clipboard!'
                });
              }}
              title="Click to copy address"
            >
              {listing.deposit_address}
            </div>
          </div>
        )}
      </main>

      {notification.show && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default ListingDetails;