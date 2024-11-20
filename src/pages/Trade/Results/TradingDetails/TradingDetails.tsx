import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './TradingDetails.css'; // Refined CSS
import logo from '../../../../images/Placeholder.webp';
import useWebSocket from '../../../../hooks/useWebSocket';
import Cookies from 'js-cookie';

interface Listing {
  name: string;
  description: string;
  quantity: number;
  unitPrice: string;
  ipfsHash: string;
  listingAddress: string;
}

interface Comment {
  id: string;
  text: string;
  created_at: Date;
  hidden: boolean;
}

const TradingDetails: React.FC<{ listing: Listing; closeDetails: () => void; addToCart: (listing: Listing, quantity: number) => void; }> = ({ listing, closeDetails, addToCart }) => {
  const { name } = useParams<{ name: string }>();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const { message, sendMessage } = useWebSocket('ws://localhost:8765');

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleAddComment = () => {
    if (newComment.trim()) {
      sendMessage(`add_listing_comment ${name} "${newComment}"`);
      setNewComment('');
    }
  };

  const handleDeleteComment = (commentId: string) => {
    sendMessage(`delete_listing_comment ${commentId}`);
  };

  useEffect(() => {
    if (message && message.includes('listing_comments')) {
      const parsedMessage = JSON.parse(message.replace('listing_comments ', ''));
      setComments(parsedMessage);
    }
  }, [message]);

  useEffect(() => {
    const handlePopState = () => {
      closeDetails();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [closeDetails]);

  const mediaSrc = listing.ipfsHash
    ? `https://gateway.pinata.cloud/ipfs/${listing.ipfsHash}`
    : logo;

  return (
    <div className={`trading-details ${isDarkMode ? 'dark-mode' : ''}`}>
      <header className="trading-header">
        <button onClick={closeDetails} className="back-button">Back</button>
        <button onClick={toggleDarkMode} className="dark-mode-toggle">
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>

      <main className="trading-main">
        <section className="trading-media">
          <img src={mediaSrc} alt={listing.name} className="trading-image" />
        </section>

        <section className="trading-info">
          <h1 className="trading-title">{listing.name}</h1>
          <p className="trading-description">{listing.description}</p>
          <p><strong>Quantity:</strong> {listing.quantity}</p>
          <p><strong>Unit Price:</strong> {listing.unitPrice}</p>
          <p><strong>Address:</strong> {listing.listingAddress}</p>
          <div className="add-to-cart-section">
            <input
              type="number"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="quantity-input"
            />
            <button className="add-to-cart" onClick={() => addToCart(listing, quantity)}>Add to Cart</button>
          </div>
        </section>
      </main>

      <section className="trading-comments">
        <h2>Comments</h2>
        <ul className="comments-list">
          {comments.map(comment => (
            <li key={comment.id} className={comment.hidden ? 'hidden-comment' : ''}>
              {comment.text}
              <button onClick={() => handleDeleteComment(comment.id)} className="delete-comment">Delete</button>
            </li>
          ))}
        </ul>
        <div className="comment-form">

        </div>
      </section>
    </div>
  );
};

export default TradingDetails;
