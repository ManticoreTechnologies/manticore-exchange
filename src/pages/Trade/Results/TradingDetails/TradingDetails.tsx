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
  const [mediaError, setMediaError] = useState<string>('');

  const { message, sendMessage } = useWebSocket('ws://localhost:8765');

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const [isVideo, setIsVideo] = useState(false); // Track if the file is a video

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5); // Default volume at 50%
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0); // Default playback speed

  const handleAddComment = () => {
    if (newComment.trim()) {
      sendMessage(`add_listing_comment ${name} "${newComment}"`);
      setNewComment('');
    }
  };
  // Fetch the file type from IPFS metadata to determine if it's a video
  const fetchFileMetadata = async (ipfsHash: string) => {
    const mediaSrc = `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${ipfsHash}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO`;
    try {
      const response = await fetch(mediaSrc, { method: 'HEAD' });
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.startsWith('video')) {
        setIsVideo(true);
      } else {
        setIsVideo(false);
      }
    } catch (error) {
      console.error('Error fetching file metadata:', error);
      setMediaError('Failed to fetch file metadata. Please try again later.');
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

  const getMediaType = (ipfsHash: string): 'video' | 'image' => {
    const extension = ipfsHash.split('.').pop()?.toLowerCase();
    return extension === 'mp4' ? 'video' : 'image';
  };

  const mediaSrc = listing.ipfsHash
    ? `https://ipfs.io/ipfs/${listing.ipfsHash.replace('ipfs://', '')}`
    : logo;
  
  const mediaType = listing.ipfsHash ? getMediaType(listing.ipfsHash) : 'image';

  const handleMediaError = (error: any) => {
    console.error('Media loading error:', error);
    setMediaError('Failed to load media. Please check your network connection or try again later.');
  };

  // Handle play/pause toggle
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
  useEffect(() => {
    if (listing && listing.ipfsHash) {
      fetchFileMetadata(listing.ipfsHash);
    }
  }, [listing]);

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  // Handle playback speed change
  const handlePlaybackSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const speed = Number(e.target.value);
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

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
          {isVideo ? (
            <video
              ref={videoRef}
              src={mediaSrc}
              controls
              className="trading-video"
              playsInline
              onError={handleMediaError}
              crossOrigin="anonymous"
            />
          ) : (
            <img 
              src={mediaSrc} 
              alt={listing.name} 
              className="trading-image" 
              onError={handleMediaError}
            />
          )}
          {mediaType === 'video' && (
            <div className="video-controls">
              <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
              <label>
                Volume:
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </label>
              <label>
                Speed:
                <select value={playbackSpeed} onChange={handlePlaybackSpeedChange}>
                  <option value="0.5">0.5x</option>
                  <option value="1.0">1.0x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2.0">2.0x</option>
                </select>
              </label>
            </div>
          )}
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
