import React from 'react';
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
  onCopyAddress: () => void;
  isOwner?: boolean;
}

const ListingHeader: React.FC<ListingHeaderProps> = ({
  id,
  name,
  description,
  sellerAddress,
  createdAt,
  tags,
  onCopyAddress,
  isOwner = false
}) => {
  const navigate = useNavigate();

  const copyToClipboard = (text: string): Promise<void> => {
    // Try using the Clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    // Fallback for older browsers
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
    try {
      const url = window.location.href;
      await copyToClipboard(url);
      toast.success('Link copied to clipboard!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error('Failed to copy link:', err);
      toast.error('Failed to copy link to clipboard', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleBack = () => {
    navigate('/trade');
  };

  const handleManage = () => {
    navigate(`/trade/listings/manage/${id}`);
  };

  return (
    <div className="listing-header">
      <div className="listing-header-main">
        <div className="listing-header-top">
          <div className="header-actions">
            <button className="back-button" onClick={handleBack}>
              <FiArrowLeft /> Back
            </button>
            <h1 className="listing-title">{name}</h1>
          </div>
          <div className="header-actions">
            <button className="share-button" onClick={handleShare}>
              <FiShare2 /> Share
            </button>
            {isOwner && (
              <button className="manage-button" onClick={handleManage}>
                <FiEdit /> Manage Listing
              </button>
            )}
          </div>
        </div>
        <div className="listing-metadata">
          <div className="seller-info">
            <span className="seller-label">Seller:</span>
            <div className="seller-address" onClick={onCopyAddress}>
              <span>{sellerAddress.slice(0, 6)}...{sellerAddress.slice(-4)}</span>
              <FiCopy className="copy-icon" />
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
