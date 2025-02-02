import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import './EditListingModal.css';

interface Price {
  asset_name: string;
  price_evr: string;
  price_asset_name: string | null;
  price_asset_amount: string | null;
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

interface EditListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updates: ListingUpdates) => Promise<void>;
  listing: {
    name: string;
    description: string;
    prices: Price[];
  };
}

const EditListingModal: React.FC<EditListingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  listing
}) => {
  const [formData, setFormData] = useState<ListingUpdates>({
    name: listing.name,
    description: listing.description,
    prices: {
      add_or_update: listing.prices.map(price => ({
        asset_name: price.asset_name,
        price_evr: price.price_evr
      })),
      remove: []
    }
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: listing.name,
        description: listing.description,
        prices: {
          add_or_update: listing.prices.map(price => ({
            asset_name: price.asset_name,
            price_evr: price.price_evr
          })),
          remove: []
        }
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
      prices: {
        ...prev.prices,
        add_or_update: prev.prices.add_or_update.map((price, i) => 
          i === index ? { ...price, price_evr: value } : price
        )
      }
    }));
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
            <label htmlFor="name">Listing Name</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="edit-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="edit-input"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Asset Prices</label>
            {formData.prices.add_or_update.map((price, index) => (
              <div key={price.asset_name} className="price-input-group">
                <div className="price-asset-name">{price.asset_name}</div>
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
              </div>
            ))}
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
};

export default EditListingModal; 