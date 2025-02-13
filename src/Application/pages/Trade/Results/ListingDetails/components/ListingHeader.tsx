import React, { useState } from 'react';
import { FiCopy, FiShare2, FiArrowLeft, FiEdit } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './ListingHeader.css';

export interface ListingHeaderProps {
  id: string;
  name: string;
  description: string;
  sellerAddress: string;
  createdAt: string;
  tags: string[];
  onCopyAddress: () => Promise<void>;
  isOwner?: boolean;
  onManage?: () => void;
}

const ListingHeader: React.FC<ListingHeaderProps> = ({
  id,
  name,
  description,
  sellerAddress,
  createdAt,
  tags,
  onCopyAddress,
  isOwner = false,
  onManage
}) => {
  const navigate = useNavigate();
  const [isSharing, setIsSharing] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const copyToClipboard = (text: string): Promise<void> => {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise((resolve, reject) => {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    
    try {
      const url = window.location.href;
      await copyToClipboard(url);
      toast.success('Link copied to clipboard!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'custom-toast success-toast'
      });
    } catch (err) {
      console.error('Failed to copy link:', err);
      toast.error('Failed to copy link', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'custom-toast error-toast'
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleBack = () => {
    navigate('/trade');
  };

  const handleManage = () => {
    if (onManage) {
      onManage();
    } else {
      navigate(`/trade/listings/manage/${id}`);
    }
  };

  const handleCopyAddress = async (e: React.MouseEvent) => {
    if (isCopying) return;
    e.stopPropagation();
    setIsCopying(true);
    
    try {
      await onCopyAddress();
      toast.success('Address copied!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'custom-toast success-toast'
      });
    } catch (err) {
      console.error('Failed to copy address:', err);
      toast.error('Failed to copy address', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'custom-toast error-toast'
      });
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="listing-header">
      <div className="listing-header-main">
        <div className="listing-header-top">
          <div className="header-actions">
            <button 
              className="back-button" 
              onClick={handleBack}
              title="Go back to listings"
            >
              <FiArrowLeft className="button-icon" /> Back
            </button>
            <h1 className="listing-title">{name}</h1>
          </div>
          <div className="header-actions">
            <button 
              className={`share-button ${isSharing ? 'loading' : ''}`}
              onClick={handleShare}
              title="Share listing"
              disabled={isSharing}
            >
              <FiShare2 className="button-icon" /> {isSharing ? 'Sharing...' : 'Share'}
            </button>
            {isOwner && (
              <button 
                className="manage-button owner" 
                onClick={handleManage}
                title="Manage your listing"
              >
                <FiEdit className="button-icon" /> Manage Listing
              </button>
            )}
          </div>
        </div>
        <div className="listing-metadata">
          <div className="seller-info">
            <span className="seller-label">Seller:</span>
            <div 
              className={`seller-address ${isCopying ? 'copying' : ''}`}
              onClick={handleCopyAddress}
              title="Click to copy seller address"
            >
              <span>{sellerAddress.slice(0, 6)}...{sellerAddress.slice(-4)}</span>
              <FiCopy className={`copy-icon ${isCopying ? 'copying' : ''}`} />
            </div>
          </div>
          <div className="listing-created">
            <span className="created-label">Listed:</span>
            <span>{new Date(createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
        </div>
      </div>

      <div className="listing-description">
        <p>{description}</p>
      </div>

      {tags && tags.length > 0 && (
        <div className="listing-tags">
          {tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingHeader;
