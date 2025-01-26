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
import './ListingDetails.css';
import useWebSocket from '@/hooks/useWebSocket';
import { FiHeart, FiMessageCircle, FiTool, FiShare2, FiShoppingCart, FiArrowLeft } from 'react-icons/fi';
//@ts-ignore
import Cookies from 'js-cookie';
import axios from 'axios';
// @ts-ignore
import IsAuthenticated from '@/components/Authentication/IsAuthenticated';
import CommentsSection from '@/components/Comments/CommentsSection';
import Cart from '../../Cart/Cart';
import Checkout from '../../Checkout/Checkout';
import InvoiceToaster from '../../InvoiceToaster/InvoiceToaster';

const wsUrl = `${process.env.VITE_TRADING_WS_HOST === 'localhost' ? 'ws' : 'wss'}://${process.env.VITE_TRADING_WS_HOST}:${process.env.VITE_TRADING_WS_PORT}`;

//${import.meta.env.VITE_TRADING_API_PORT || '668'}
const trading_api_url = `${import.meta.env.VITE_TRADING_API_PROTO || 'https'}://${import.meta.env.VITE_TRADING_API_HOST || 'api.manticore.exchange'}:8000`;

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

interface Comment {
  id: string;
  content: string;
  friend_name: string;
  address: string;
  ipfsHash: string;
  created_at?: Date;
  hidden?: boolean;
}

const ListingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const [mediaError, setMediaError] = useState<string>('');
  const [isVideo, setIsVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showMediaControls, setShowMediaControls] = useState(false);
  const [isManageMode, setIsManageMode] = useState(false);
  const [editedListing, setEditedListing] = useState<Listing | null>(null);
  const [newIpfsHash, setNewIpfsHash] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showIpfsModal, setShowIpfsModal] = useState(false);
  const [newIpfsHashInput, setNewIpfsHashInput] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [cartVisible, setCartVisible] = useState<boolean>(false);
  const [cart, setCart] = useState<any[]>([]);
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const cartRef = useRef<HTMLDivElement>(null);

  const { message, sendMessage, isAuthenticated, getUserAddress } = useWebSocket(wsUrl);

  useEffect(() => {
    axios.get(`${trading_api_url}/listings/${id}`)
      .then(response => {
        if (response.data) {
          setListing(response.data);
          setEditedListing(response.data);
        }
      })
      .catch(error => console.error('Error fetching listing:', error));
  }, [id]);

  useEffect(() => {
    if (message) {
      try {
        const data = JSON.parse(message);
        if (data.type === 'comments') setComments(data.comments);
        else if (data.type === 'like_update') setLikeCount(data.count);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    }
  }, [message]);

  const mediaSrc = listing?.image_ipfs_hash ?
    `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${listing.image_ipfs_hash}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO` : '';

  useEffect(() => {
    if (listing?.image_ipfs_hash) {
      fetchFileMetadata(listing.image_ipfs_hash);
    }
  }, [listing]);

  //@ts-ignore
  const fetchFileMetadata = async (ipfsHash: string) => {
    try {
      const response = await fetch(mediaSrc, { method: 'HEAD' });
      const contentType = response.headers.get('Content-Type');
      setIsVideo(contentType?.startsWith('video') || false);
      setIsMediaLoading(false);
    } catch (error) {
      console.error('Error fetching file metadata:', error);
      setMediaError('Failed to load media. Please try again later.');
      setIsMediaLoading(false);
    }
  };

  const handleMediaLoad = () => {
    setIsMediaLoading(false);
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
          // Unmute after autoplay starts if it's not in manage mode
          if (!isManageMode) {
            videoRef.current!.muted = false;
          }
        })
        .catch(error => {
          console.error('Error autoplaying media:', error);
        });
    }
  };

  const handleMediaError = () => {
    setMediaError('Failed to load media. Please try again later.');
    setIsMediaLoading(false);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      sendMessage(JSON.stringify({
        type: 'add_comment',
        listing_id: listing?.name,
        text: newComment
      }));
      setNewComment('');
    }
  };

  //@ts-ignore
  const handleDeleteComment = (commentId: string) => {
    sendMessage(JSON.stringify({
      type: 'delete_comment',
      comment_id: commentId
    }));
  };

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    sendMessage(JSON.stringify({
      type: 'toggle_like',
      listing_id: listing?.name
    }));
  };

  const handleBack = () => {
    navigate('/trade');
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setNotificationType('success');
      setNotificationMessage('Link copied to clipboard!');
      setShowNotificationModal(true);
    } catch (error) {
      console.error('Failed to copy link:', error);
      setNotificationType('error');
      setNotificationMessage('Failed to copy link');
      setShowNotificationModal(true);
    }
  };

  const handleViewCart = () => {
    setCartVisible(true);
  };

  const handleReport = () => {
    if (reportReason.trim()) {
      sendMessage(JSON.stringify({
        type: 'report_listing',
        listing_id: listing?.name,
        reason: reportReason
      }));
      setIsReporting(false);
      setReportReason('');
      alert('Thank you for your report. We will review it shortly.');
    }
  };

  const handleQuantityChange = (increment: boolean) => {
    setQuantity(prev => {
      const newQuantity = increment ? prev + 1 : Math.max(1, prev - 1);
      return Math.min(newQuantity, Math.floor(Number(listing?.balances[0].confirmed_balance || 0)));
    });
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handlePlaybackSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleImageUpload = () => {
    setShowIpfsModal(true);
  };

  const handleIpfsSubmit = () => {
    if (newIpfsHashInput) {
      setNewIpfsHash(newIpfsHashInput);
      setShowIpfsModal(false);
    }
  };

  const handleManageSave = async () => {
    if (!editedListing || !listing) return;
    setIsLoading(true);
    setError(null);

    // Immediately update UI with the edited data
    const updatedListing: Listing = {
      name: editedListing.name || 'Unknown',
      description: editedListing.description || 'No description',
      image_ipfs_hash: newIpfsHash || editedListing.image_ipfs_hash,
      status: listing.status,
      created_at: listing.created_at,
      updated_at: listing.updated_at,
      prices: editedListing.prices.map(price => ({
        ...price,
        price_evr: (Number(price.price_evr) * 100000000).toString()
      })),
      balances: editedListing.balances.map(balance => ({
        ...balance,
        confirmed_balance: (Number(balance.confirmed_balance) * 100000000).toString()
      })),
      listing_address: listing.listing_address,
      deposit_address: listing.deposit_address,
      seller_address: listing.seller_address,
      id: listing.id
    };
    setEditedListing(updatedListing);
    setIsManageMode(false);

    // Then submit to backend
    try {
      const response = await axios.post(`${trading_api_url}/manage`, {
        listing_id: updatedListing.id,
        password,
        action: 'update',
        unit_price: Number(updatedListing.prices[0].price_evr) * 100000000,
        description: updatedListing.description,
        ipfs_hash: updatedListing.image_ipfs_hash,
        offerings: updatedListing.balances.map(balance => ({
          asset_name: balance.asset_name,
          price: Number(balance.confirmed_balance) * 100000000
        })),
      });

      setSuccessMessage(response.data.message);
      setPassword(''); // Clear password after successful save
      setNotificationType('success');
      setNotificationMessage('Listing updated successfully!');
      setShowNotificationModal(true);
      onListingUpdate(updatedListing);
    } catch (error: any) {
      console.error('Error updating listing:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update listing.';
      setError(errorMessage);
      setNotificationType('error');
      setNotificationMessage(`Failed to update listing: ${errorMessage}`);
      setShowNotificationModal(true);
      setIsManageMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageClick = () => {
    setShowPasswordModal(true);
    setError(null);
  };

  const handlePasswordSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      //@ts-ignore
      const response = await axios.post(`${trading_api_url}/manage`, {
        listing_id: listing?.id,
        password,
        action: 'fetch'
      });
      setIsLoading(false);
      setShowPasswordModal(false);
      setIsManageMode(true);
      // Don't clear password here anymore since we need it for saving changes
      // setPassword('');
    } catch (error: any) {
      console.error('Error authenticating:', error);
      setError(error.response?.data?.message || 'Invalid password');
      setIsLoading(false);
    }
  };

  const handleRefund = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${trading_api_url}/manage`, {
        listing_id: listing?.id,
        password,
        action: 'refund'
      });
      setNotificationType('success');
      setNotificationMessage(response.data.message);
      setShowNotificationModal(true);
      setIsManageMode(false);
    } catch (error: any) {
      console.error('Error refunding listing:', error);
      setError(error.response?.data?.message || 'Failed to process refund');
      setNotificationType('error');
      setNotificationMessage(error.response?.data?.message || 'Failed to process refund');
      setShowNotificationModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${trading_api_url}/manage`, {
        listing_id: listing?.id,
        password,
        action: 'cancel'
      });
      setNotificationType('success');
      setNotificationMessage(response.data.message);
      setShowNotificationModal(true);
      setIsManageMode(false);
    } catch (error: any) {
      console.error('Error canceling listing:', error);
      setError(error.response?.data?.message || 'Failed to cancel listing');
      setNotificationType('error');
      setNotificationMessage(error.response?.data?.message || 'Failed to cancel listing');
      setShowNotificationModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle undefined functions by providing basic implementations
  const onListingUpdate = (updatedListing: Listing) => {
    console.log('Listing updated:', updatedListing);
  };

  const closeDetails = () => {
    console.log('Closing details view');
  };

  const addToCart = (listing: Listing, quantity: number) => {
    console.log(`Adding ${quantity} of ${listing.name} to cart`);
  };

  // Add to Cart Functionality
  const handleAddToCart = (assetName: string, quantity: number) => {
    if (!listing) return;

    const price = listing.prices.find(p => p.asset_name === assetName);
    if (!price) return;

    const newItem = {
      id: listing.id,
      name: listing.name,
      description: listing.description,
      image_ipfs_hash: listing.image_ipfs_hash,
      quantity: quantity,
      unitPrice: price.price_evr,
      asset_name: assetName
    };

    const updatedCart = [...cart, newItem];
    setCart(updatedCart);
    localStorage.setItem('manticore_cart', JSON.stringify(updatedCart));
    
    setNotificationType('success');
    setNotificationMessage('Item added to cart!');
    setShowNotificationModal(true);
  };

  // Render offerings in the UI
  const renderOfferings = () => (
    listing?.balances.map((balance, index) => {
      const price = listing.prices.find(p => p.asset_name === balance.asset_name);
      return (
        <div key={`${balance.asset_name}-${index}`} className="offering-item">
          <h4>{balance.asset_name}</h4>
          <p>Price: {price ? `${Number(price.price_evr)/100000000} EVR` : 'N/A'}</p>
          <p>Available: {balance.confirmed_balance}</p>
          <p>Status: {listing.status}</p>
          <div className="quantity-controls">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
          <button 
            onClick={() => handleAddToCart(balance.asset_name, quantity)}
            className="add-to-cart-button"
            disabled={Number(balance.confirmed_balance) <= 0}
          >
            Add to Cart
          </button>
        </div>
      );
    }) || <p>No offerings available.</p>
  );

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (editedListing) {
      setEditedListing({ ...editedListing, description: e.target.value });
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, assetName: string) => {
    if (editedListing) {
      const updatedPrices = editedListing.prices.map(price =>
        price.asset_name === assetName
          ? { ...price, price_evr: e.target.value }
          : price
      );
      setEditedListing({ ...editedListing, prices: updatedPrices });
    }
  };

  const toggleCartVisibility = () => {
    setCartVisible(!cartVisible);
  };

  const removeFromCart = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem('manticore_cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('manticore_cart');
  };

  const handleCheckout = (items: any[]) => {
    setCheckoutItems(items);
    setIsCheckingOut(true);
    setCartVisible(false);
  };

  return (
    <div className="listing-details">
      <header className="details-header">
        <button className="action-button back-button" onClick={handleBack}>
          <FiArrowLeft /> Back to Listings
        </button>
        <div className="header-actions">
          <button className="action-button share-button" onClick={handleShare}>
            <FiShare2 /> Share
          </button>
          <button className="action-button cart-button" onClick={handleViewCart}>
            <FiShoppingCart /> View Cart
          </button>
        </div>
      </header>

      <main className="trading-main">
        <section className="media-section">
          <div className="trading-media">
            <div
              className="media-container"
              onClick={() => isManageMode && handleImageUpload()}
              style={{ cursor: isManageMode ? 'pointer' : 'default' }}
            >
              {isMediaLoading ? (
                <div className="media-loader">Loading...</div>
              ) : mediaError ? (
                <div className="media-error">{mediaError}</div>
              ) : isVideo ? (
                <div className="video-container">
                  <video
                    ref={videoRef}
                    src={newIpfsHash || mediaSrc}
                    className="trading-video"
                    playsInline
                    autoPlay
                    muted
                    loop
                    onError={handleMediaError}
                    onLoadedData={handleMediaLoad}
                    crossOrigin="anonymous"
                  />
                  {showMediaControls && !isManageMode && (
                    <div className="video-controls">
                      <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
                      <div className="volume-control">
                        <label>Volume:</label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={handleVolumeChange}
                        />
                      </div>
                      <div className="speed-control">
                        <label>Speed:</label>
                        <div className="speed-buttons">
                          {[0.5, 1.0, 1.5, 2.0].map(speed => (
                            <button
                              key={speed}
                              onClick={() => handlePlaybackSpeedChange(speed)}
                              className={playbackSpeed === speed ? 'active' : ''}
                            >
                              {speed}x
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <img
                  src={newIpfsHash || mediaSrc}
                  alt={listing?.name}
                  className="trading-image"
                  onError={handleMediaError}
                  onLoad={handleMediaLoad}
                />
              )}
              {isManageMode && (
                <div className="media-overlay">
                  <FiTool className="wrench-icon" /> Click to change IPFS hash
                </div>
              )}
            </div>
          </div>
          <div className="media-actions">
            <button
              className={`action-button manage-button ${isManageMode ? 'active' : ''}`}
              onClick={() => setIsManageMode(!isManageMode)}
            >
              <FiTool /> Manage Listing
            </button>
            <button
              className="action-button report-button"
              onClick={() => setIsReporting(true)}
            >
              Report
            </button>
          </div>
        </section>

        <section className="trading-info">
          <div className="info-content">
            {isManageMode ? (
              <>
                <div className="description-section">
                  <h2>Edit Details</h2>
                  <input
                    type="text"
                    value={editedListing?.name}
                    className="edit-input title"
                    placeholder="Listing Title"
                    disabled
                  />
                  <textarea
                    value={editedListing?.description}
                    onChange={handleDescriptionChange}
                    className="edit-input description"
                    placeholder="Description"
                  />
                </div>

                <div className="price-section">
                  <h3>Price Settings</h3>
                  {listing?.prices.map((price, index) => (
                    <div key={`${price.asset_name}-${index}`} className="price-item">
                      <label>{price.asset_name}</label>
                      <input
                        type="number"
                        value={Number(price.price_evr) / 100000000}
                        onChange={(e) => handlePriceChange(e, price.asset_name)}
                        className="edit-input price"
                        placeholder="Price in EVR"
                        min="0"
                        step="0.00000001"
                      />
                    </div>
                  ))}
                  <div className="manage-actions">
                    <button onClick={handleManageSave} className="save-changes-button">
                      Save Changes
                    </button>
                    <button onClick={handleRefund} className="refund-button" disabled={isLoading}>
                      Refund Balance
                    </button>
                    <button onClick={handleCancel} className="cancel-button" disabled={isLoading}>
                      Cancel Listing
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="info-header">
                  <h1 className="trading-title">{listing?.name}</h1>
                  {listing?.seller_address && (
                    <p className="seller-info">
                      Listed by <span className="seller-name">{listing.seller_address}</span>
                    </p>
                  )}
                </div>

                <div className="info-content">
                  <div className="description-section">
                    <h2>Description</h2>
                    <p className="trading-description" style={{ color: 'var(--text-secondary)' }}>{listing?.description}</p>
                  </div>

                  <section className="offerings-section">
                    <h3>Offerings</h3>
                    {renderOfferings()}
                  </section>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <div className="trading-comments">
        <div className="comments-header" onClick={() => setShowComments(!showComments)}>
          <h2>
            <FiMessageCircle /> Comments ({comments.length})
          </h2>
          <span className="toggle-icon">{showComments ? '−' : '+'}</span>
        </div>

        {showComments && (
          <CommentsSection
            comments={comments}
            isAuthenticated={isAuthenticated}
            onAddComment={handleAddComment}
          />
        )}
      </div>

      {isReporting && (
        <div className="report-modal">
          <div className="report-content">
            <h2>Report Listing</h2>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Please describe why you're reporting this listing..."
              rows={4}
            />
            <div className="report-actions">
              <button onClick={handleReport} disabled={!reportReason.trim()}>
                Submit Report
              </button>
              <button onClick={() => setIsReporting(false)} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showIpfsModal && (
        <div className="report-modal">
          <div className="report-content">
            <h2>Change IPFS Hash</h2>
            <input
              type="text"
              value={newIpfsHashInput}
              onChange={(e) => setNewIpfsHashInput(e.target.value)}
              placeholder="Enter new IPFS hash"
              className="edit-input"
            />
            <div className="report-actions">
              <button onClick={handleIpfsSubmit} disabled={!newIpfsHashInput.trim()}>
                Update Image
              </button>
              <button onClick={() => setShowIpfsModal(false)} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="report-modal">
          <div className="report-content password-modal">
            <h2>Enter Listing Password</h2>
            <div className="password-modal-field">
              <div className="password-modal-field-label">Listing ID</div>
              <input
                type="text"
                id="listingID"
                value={listing?.id}
                className="password-modal-input"
                disabled
              />
            </div>
            <div className="password-modal-field">
              <div className="password-modal-field-label">Password</div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="password-modal-input"
              />
            </div>
            <div className="password-modal-hint">
              Listing ID and password are required.
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="password-modal-actions">
              <button
                onClick={handlePasswordSubmit}
                disabled={isLoading || !password.trim()}
                className="password-modal-submit"
              >
                {isLoading ? 'Verifying...' : 'Submit'}
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword('');
                  setError(null);
                }}
                className="password-modal-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="report-modal">
          <div className="report-content">
            <h2 style={{ color: notificationType === 'success' ? '#00ff9d' : '#ff4444' }}>
              {notificationType === 'success' ? 'Success!' : 'Error'}
            </h2>
            <p style={{
              color: '#fff',
              margin: '1rem 0',
              textAlign: 'center',
              fontSize: '1.1rem'
            }}>
              {notificationMessage}
            </p>
            <div className="report-actions">
              <button
                onClick={() => setShowNotificationModal(false)}
                style={{
                  backgroundColor: notificationType === 'success' ? '#00ff9d' : '#ff4444',
                  color: '#000',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {cartVisible && (
        <div className="cart-modal-overlay">
          <Cart
            cart={cart}
            onClose={() => setCartVisible(false)}
            onRemove={removeFromCart}
            onClear={clearCart}
            onCheckout={handleCheckout}
            ref={cartRef}
          />
        </div>
      )}

      {isCheckingOut && (
        <Checkout
          items={checkoutItems}
          onClose={() => setIsCheckingOut(false)}
          onComplete={() => {
            setIsCheckingOut(false);
            clearCart();
          }}
        />
      )}
      
      <InvoiceToaster />
    </div>
  );
};

export default ListingDetails;