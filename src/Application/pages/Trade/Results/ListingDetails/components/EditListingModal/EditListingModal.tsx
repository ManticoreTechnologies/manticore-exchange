import React, { useState, useEffect } from 'react';
import { FiX, FiPlus, FiTrash2, FiChevronDown, FiChevronUp, FiCopy } from 'react-icons/fi';
import './EditListingModal.css';

interface Price {
  asset_name: string;
  price_evr: string;
  price_asset_name: string | null;
  price_asset_amount: string | null;
}

interface Balance {
  asset_name: string;
  confirmed_balance: string;
  pending_balance: string;
  last_confirmed_tx_hash: string | null;
  last_confirmed_tx_time: string | null;
}

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

interface EditListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updates: ListingUpdates) => Promise<void>;
  listing: {
    name: string;
    description: string;
    prices: Price[];
    balances: Balance[];
    deposit_address: string;
    payout_address: string;
    qrCodeData?: string;
    tags?: string[];
  };
  onCopyAddress: () => void;
}

const EditListingModal: React.FC<EditListingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  listing,
  onCopyAddress
}) => {
  const [formData, setFormData] = useState<ListingUpdates>({
    name: listing.name,
    description: listing.description,
    payout_address: listing.payout_address,
    tags: listing.tags || [],
    prices: listing.prices.map(price => ({
      asset_name: price.asset_name,
      price_evr: price.price_evr
    }))
  });

  const [newPrice, setNewPrice] = useState({
    asset_name: '',
    price_evr: ''
  });

  const [isBalancesExpanded, setIsBalancesExpanded] = useState(false);
  const [isDepositExpanded, setIsDepositExpanded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: listing.name,
        description: listing.description,
        payout_address: listing.payout_address,
        tags: listing.tags || [],
        prices: listing.prices.map(price => ({
          asset_name: price.asset_name,
          price_evr: price.price_evr
        }))
      });
      setNewPrice({
        asset_name: '',
        price_evr: ''
      });
    }
  }, [isOpen, listing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handlePriceChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      prices: prev.prices?.map((price, i) => 
        i === index ? { ...price, price_evr: value } : price
      )
    }));
  };

  const handleRemovePrice = (assetName: string) => {
    setFormData(prev => ({
      ...prev,
      prices: prev.prices?.filter(p => p.asset_name !== assetName)
    }));
  };

  const handleAddPrice = () => {
    if (!newPrice.asset_name || !newPrice.price_evr) return;

    // Check if price already exists
    const existingPriceIndex = formData.prices?.findIndex(
      p => p.asset_name === newPrice.asset_name
    );

    if (existingPriceIndex !== undefined && existingPriceIndex !== -1) {
      // Update existing price
      setFormData(prev => ({
        ...prev,
        prices: prev.prices?.map((p, i) => 
          i === existingPriceIndex ? { 
            asset_name: newPrice.asset_name,
            price_evr: newPrice.price_evr
          } : p
        )
      }));
    } else {
      // Add new price
      setFormData(prev => ({
        ...prev,
        prices: [...(prev.prices || []), { 
          asset_name: newPrice.asset_name,
          price_evr: newPrice.price_evr
        }]
      }));
    }

    // Reset new price form
    setNewPrice({
      asset_name: '',
      price_evr: ''
    });
  };

  const handleAddPriceFromBalance = (assetName: string) => {
    setNewPrice({
      asset_name: assetName,
      price_evr: ''
    });
    setIsBalancesExpanded(false); // Close the balances section
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="edit-listing-modal">
        <button className="close-button" onClick={onClose}>
          <FiX />
        </button>
        
        <h2>Edit Listing</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="edit-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="edit-input"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="payout_address">Payout Address</label>
            <input
              id="payout_address"
              type="text"
              value={formData.payout_address}
              onChange={(e) => setFormData({ ...formData, payout_address: e.target.value })}
              className="edit-input"
              placeholder="EVR address for receiving payments"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma separated)</label>
            <input
              id="tags"
              type="text"
              value={formData.tags?.join(', ')}
              onChange={(e) => setFormData({
                ...formData,
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
              })}
              className="edit-input"
              placeholder="tag1, tag2, tag3"
            />
          </div>

          <div className="deposit-section">
            <button
              type="button"
              className="expand-button"
              onClick={() => setIsDepositExpanded(!isDepositExpanded)}
            >
              {isDepositExpanded ? <FiChevronUp /> : <FiChevronDown />}
              Deposit Address
            </button>
            
            {isDepositExpanded && (
              <div className="deposit-content">
                {listing.qrCodeData && (
                  <div className="qr-code">
                    <img
                      src={listing.qrCodeData}
                      alt="Deposit Address QR Code"
                    />
                  </div>
                )}
                <div 
                  className="deposit-address"
                  onClick={onCopyAddress}
                  title="Click to copy address"
                >
                  <span>{listing.deposit_address}</span>
                  <FiCopy className="copy-icon" />
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Asset Prices</label>
            {formData.prices?.map((price, index) => {
              const balance = listing.balances.find(b => b.asset_name === price.asset_name);
              const originalPrice = listing.prices.find(p => p.asset_name === price.asset_name);
              return (
                <div key={price.asset_name} className="price-input-group">
                  <div className="price-header">
                    <div className="price-asset-name">{price.asset_name}</div>
                    <button
                      type="button"
                      className="remove-price-button"
                      onClick={() => handleRemovePrice(price.asset_name)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                  <div className="price-info">
                    {balance && (
                      <div className="balance-info">
                        Available: {balance.confirmed_balance} {price.asset_name}
                      </div>
                    )}
                    {originalPrice && (
                      <div className="price-inputs">
                        <div className="form-group">
                          <label>Price (EVR)</label>
                          <input
                            type="number"
                            step="0.00000001"
                            value={price.price_evr}
                            onChange={e => handlePriceChange(index, e.target.value)}
                            className="edit-input"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="balances-section">
              <button
                type="button"
                className="expand-button"
                onClick={() => setIsBalancesExpanded(!isBalancesExpanded)}
              >
                {isBalancesExpanded ? <FiChevronUp /> : <FiChevronDown />}
                Available Balances ({listing.balances.length})
              </button>
              
              {isBalancesExpanded && (
                <div className="balances-grid">
                  {listing.balances.map(balance => {
                    const hasPrice = listing.prices.some(
                      p => p.asset_name === balance.asset_name
                    );
                    return (
                      <div key={balance.asset_name} className="balance-item">
                        <div className="balance-info">
                          <strong>{balance.asset_name}</strong>
                          <span>{balance.confirmed_balance} available</span>
                        </div>
                        {!hasPrice && (
                          <button
                            type="button"
                            className="add-price-button"
                            onClick={() => handleAddPriceFromBalance(balance.asset_name)}
                          >
                            <FiPlus /> Add Price
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {newPrice.asset_name && (
              <div className="add-price-section">
                <h3>Add New Price</h3>
                <div className="add-price-form">
                  <div className="form-group">
                    <label>Asset: {newPrice.asset_name}</label>
                    <div className="form-group">
                      <label>Price (EVR)</label>
                      <input
                        type="number"
                        step="0.00000001"
                        value={newPrice.price_evr}
                        onChange={e => setNewPrice({ ...newPrice, price_evr: e.target.value })}
                        className="edit-input"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="add-price-button"
                    onClick={handleAddPrice}
                    disabled={!newPrice.asset_name || !newPrice.price_evr}
                  >
                    <FiPlus /> Add Price
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditListingModal;