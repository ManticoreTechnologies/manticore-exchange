/**
 {
  "id": "55f5489d-5de5-42d6-bcf5-bbd165ce357b",
  "seller_address": "EWDv4CA1AWRtHpw6dMBi9JfhbUTkwMySiV",
  "listing_address": "EeFAzLWKdbykXQTL9f5LuNEX8HDgUipK1C",
  "deposit_address": "ES6gE5dKK9Yx6HdkF7hdvKet4oFZUxcV6o",
  "name": "Super Cool Test Listing",
  "description": "Test",
  "image_ipfs_hash": null,
  "status": "active",
  "created_at": "2025-02-01T15:56:48.315203",
  "updated_at": "2025-02-01T15:56:48.315203",
  "prices": [
    {
      "asset_name": "CREDITS",
      "price_evr": "1",
      "price_asset_name": null,
      "price_asset_amount": null,
      "ipfs_hash": null
    }
  ],
  "balances": [
    {
      "asset_name": "CREDITS",
      "confirmed_balance": "10000.00000000",
      "pending_balance": "0",
      "last_confirmed_tx_hash": "8379dc0722cecb493d6fa1c8f10d3897a9837a343403b378bd12d424fbbe985f",
      "last_confirmed_tx_time": "2025-02-01T11:03:01"
    },
    {
      "asset_name": "CRONOS",
      "confirmed_balance": "2.00000000",
      "pending_balance": "0",
      "last_confirmed_tx_hash": "997be49a579cbdb9469dc146a72e2ed8f43cded49c9dfe0aae678c3f91d7bb38",
      "last_confirmed_tx_time": "2025-02-01T11:05:55"
    }
  ]
}
 * 
 */


import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiShoppingCart, FiShare2, FiCopy, FiExternalLink, FiEdit3 } from 'react-icons/fi';
import QRCode from 'qrcode';
import './ListingDetails.css';
import ManticoreLogo from '@/images/enhanced_logo.png';
import { formatEvrAmount, truncateAddress } from '@/utils/formatting';
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
import useCart from '@/App/hooks/useCart';

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

interface ListingUpdates {
  name: string;
  description: string;
  prices: {
    add_or_update: {
      asset_name: string;
      price_evr: string;
    }[];
    remove: string[];
  };
}

const ListingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
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
    prices: {
      add_or_update: [],
      remove: []
    }
  });
  const { addToCart } = useCart();

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
          setEditForm({
            name: response.data.name,
            description: response.data.description,
            prices: {
              add_or_update: response.data.prices.map((p: Price) => ({
                asset_name: p.asset_name,
                price_evr: p.price_evr
              })),
              remove: []
            }
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
      newQty = Math.max(1, Math.min(newQty, available));
      
      return { ...prev, [assetName]: newQty };
    });
  };

  const handleEditListing = () => {
    setIsEditModalOpen(true);
  };

  const handleAddToCart = (assetName: string) => {
    const asset = listing?.balances.find(b => b.asset_name === assetName);
    const price = listing?.prices.find(p => p.asset_name === assetName);
    const quantity = quantities[assetName] || 1;

    if (!asset || !price || !listing) return;

    const cartItem = {
      listingId: listing.id,
      name: listing.name,
      description: listing.description,
      image_ipfs_hash: listing.image_ipfs_hash,
      quantity: quantity,
      unitPrice: price.price_evr,
      asset_name: assetName,
      seller_address: listing.seller_address
    };

    addToCart(cartItem);

    // Show success notification
    setNotification({
      show: true,
      type: 'success',
      message: `Added ${quantity} ${assetName} to cart`
    });

    // Hide notification after 3 seconds
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

  const handleAssetSelect = (assetName: string) => {
    if (selectedAsset?.asset_name === assetName) {
      setSelectedAsset(null); // Deselect if clicking the same asset
    } else {
      const asset = listing?.balances.find(b => b.asset_name === assetName) || null;
      setSelectedAsset(asset);
    }
  };

  const handleEditSubmit = async (updates: ListingUpdates) => {
    if (!listing) return;

    try {
      const response = await axios.patch(
        `${trading_api_url}/listings/${listing.id}`,
        {
          name: updates.name,
          description: updates.description,
          prices: {
            add_or_update: updates.prices.add_or_update,
            remove: updates.prices.remove
          }
        },
        {
          headers: {
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
      setNotification({
        show: true,
        type: 'error',
        message: 'Failed to update listing. Please try again.'
      });
    }
  };

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
      <ListingHeader 
        onShare={handleShare} 
        onManageListing={handleEditListing}
      />
      <main className="listing-content">
        <section className="listing-primary">
          <ListingMedia 
            imageHash={listing?.image_ipfs_hash} 
            name={listing?.name || ''} 
            pinataGateway={PINATA_GATEWAY} 
          />
          
          <ListingInfo 
            name={listing?.name || ''}
            description={listing?.description || ''}
            sellerAddress={listing?.seller_address || ''}
            id={listing?.id || ''}
            createdAt={listing?.created_at || ''}
            status={listing?.status || ''}
            onCopyAddress={() => {
              navigator.clipboard.writeText(listing?.seller_address || '');
              setNotification({
                show: true,
                type: 'success',
                message: 'Address copied!'
              });
            }}
          />
        </section>

        <section className="listing-secondary">
          <AssetGrid
            balances={listing?.balances || []}
            prices={listing?.prices || []}
            quantities={quantities}
            pinataGateway={PINATA_GATEWAY}
            onQuantityChange={handleQuantityChange}
            onEditListing={handleEditListing}
            selectedAsset={selectedAsset?.asset_name || null}
            onSelectAsset={handleAssetSelect}
            onAddToCart={handleAddToCart}
          />

          {selectedAsset && (
            <SelectedAssetDisplay
              asset={selectedAsset}
              price={listing?.prices.find(p => p.asset_name === selectedAsset.asset_name)}
              ipfsGateway={PINATA_GATEWAY}
              onClose={() => setSelectedAsset(null)}
            />
          )}

          <PriceHistory 
            listingId={listing?.id || ''}
            selectedAsset={selectedAsset?.asset_name || null}
          />
        </section>
      </main>

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
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default ListingDetails;