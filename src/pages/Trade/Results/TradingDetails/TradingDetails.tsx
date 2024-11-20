import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import './TradingDetails.css'; // CSS for this page
import logo from '../../../../images/Placeholder.webp';
import api from '../../../../utility/api';
import Cookies from 'js-cookie';
// const wsUrl = `${process.env.VITE_TRADING_WS_HOST === 'localhost' ? 'ws' : 'wss'}://${process.env.VITE_TRADING_WS_HOST}:${process.env.VITE_TRADING_WS_PORT}`;
const wsUrl = 'ws://localhost:8765'; //'wss://ws.manticore.exchange';
import useWebSocket from '../../../../hooks/useWebSocket';

interface Asset {
  name: string;
  amount: number;
  block_height: number;
  blockhash: string;
  txid_hash: string;
  ipfs_hash?: string;
  reissuable: boolean;
  units: number;
  has_ipfs: boolean;
}

// Update Comment interface to match websocket response
interface Comment {
  id: string;
  asset_name: string;
  friend_name: string

  address: string;
  text: string;
  created_at: Date
  updated_at: Date
  hidden: boolean
}

const TradingDetails: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5); // Default volume at 50%
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0); // Default playback speed
  const [isVideo, setIsVideo] = useState(false); // Track if the file is a video
  const videoRef = useRef<HTMLVideoElement | null>(null); // Reference to the video

  // Add new state variables for comments
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [ws, setWs] = useState<WebSocket | null>(null);

  const from_faucet = searchParams.get('faucet');
  const faucet = from_faucet ? from_faucet : false;
  const showIPFSOnly = searchParams.get('showIPFSOnly') === 'true';
  const address = Cookies.get('address');
  const { sendMessage, message, isConnected, isAuthenticated, getUserAddress } = useWebSocket("ws://localhost:8765");

  // Add new state for tracking which comment is being edited
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState<string>('');

  // Add new state for dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  /* Process incoming messages from websocket */
  useEffect(() => {
    if (message && message.includes("asset_comments")) {
      const parsedMessage = JSON.parse(message.replace("asset_comments ", ""));
      setComments(parsedMessage);
    }

    if (message && message.includes("asset_comment_added")) {
      const parsedMessage = JSON.parse(message.replace("asset_comment_added ", ""));
      if (parsedMessage.asset_name === name) {
        setComments(prevComments => [...prevComments, parsedMessage]);
      }
    }

    if (message && message.includes("asset_comment_deleted")) {
      const id = message.replace("asset_comment_deleted ", "");
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === id ? { ...comment, hidden: true } : comment
        )
      );
    }

    if (message && message.includes("asset_comment_updated")) {
      const parsedMessage = JSON.parse(message.replace("asset_comment_updated ", ""));
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === parsedMessage.id ? parsedMessage : comment
        )
      );
    }
  }, [message, name]);

  useEffect(() => {
    sendMessage(`get_asset_comments ${name}`);
    ;
  }, [isConnected]);


  const fetchAssets = async () => {
    setIsLoading(true);
    setError('');
    try {
      const sanitizedAssetName = name ? name.replace(/!/g, '') : '';
      const response = await api.node<any>('listassets', [sanitizedAssetName, true]);
      console.log(response);
      setAsset(response[sanitizedAssetName]);
    } catch (error: unknown) {
      setError('Failed to load asset details');
      console.error('Error fetching asset details:', error);
    } finally {
      setIsLoading(false);
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
    }
  };


  useEffect(() => {
    fetchAssets();
  }, [name]);

  useEffect(() => {
    if (asset && asset.ipfs_hash) {
      fetchFileMetadata(asset.ipfs_hash);
    }
  }, [asset]);

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Determine the media source (image or video)
  const mediaSrc = asset && asset.has_ipfs && asset.ipfs_hash
    ? `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${asset.ipfs_hash}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO`
    : logo;

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

  // Update the comment handling functions to include type field
  const handleAddComment = () => {
    sendMessage(`add_asset_comment ${name} ${address} "${newComment}"`);

    setNewComment('');
  };

  const handleDeleteComment = (commentId: string) => {
    sendMessage(`delete_asset_comment ${commentId}`);
      // Optimistically remove the comment from the local state
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );
  };

  const handleUpdateComment = (commentId: string, newComment: string) => {
    sendMessage(`update_asset_comment ${name} ${commentId} ${newComment}`);
  }

  const handleEditComment = (commentId: string, commentText: string) => {
    setEditingCommentId(commentId);
    setEditingCommentText(commentText);
  };

  const handleSaveEdit = () => {
    if (editingCommentId) {
      handleUpdateComment(editingCommentId, editingCommentText);
      setEditingCommentId(null);
      setEditingCommentText('');
    }
  };

  return (
    <div className={`asset-detail-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="back-button-container">
        <button onClick={() => window.history.back()}>Back</button>
        <button onClick={toggleDarkMode}>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <div className="asset-detail-card">
        <div className="asset-image-container">
          {asset && asset.has_ipfs && isVideo ? (
            <video
              ref={videoRef}
              width="100%"
              height="auto"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              controls={false} // Remove default controls
            >
              <source src={mediaSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={mediaSrc} alt={`${asset ? asset.name : 'Asset'} logo`} className="asset-detail-image" />
          )}
        </div>
        <div className="asset-info-container">
          <h1 className="asset-title">{asset ? asset.name : 'Asset Name'}</h1>
          {asset && (
            <div className="asset-meta">
              <p><strong>Block Hash:</strong> <span className="copyable" onClick={() => copyToClipboard(asset.blockhash)}>{asset.blockhash.slice(0, 5)}...{asset.blockhash.slice(-5)}<span className="copy-icon">📋</span></span></p>
              <p><strong>Block Height:</strong> {asset.block_height}</p>
              <p><strong>Reissuable:</strong> {asset.reissuable ? 'Yes' : 'No'}</p>
              <p><strong>Amount:</strong> {asset.amount}</p>
              <p><strong>Decimals:</strong> {asset.units}</p>
            </div>
          )}
          {/* Video Controls */}
          {asset && asset.has_ipfs == true && isVideo && (
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
        </div>
        {/* Add comments section before closing asset-detail-card div */}
        <div className="comments-section">
          <h2>Comments</h2>
          {isAuthenticated ? (
            <div>
              <ul>
                {comments.map((comment) => (
                  <li 
                    key={comment.id} 
                    style={{ display: comment.hidden ? 'none' : 'block' }}
                  >
                    {editingCommentId === comment.id ? (
                      <>
                        <textarea
                          value={editingCommentText}
                          onChange={(e) => setEditingCommentText(e.target.value)}
                          maxLength={500}
                        />
                        <button onClick={handleSaveEdit}>Save</button>
                        <button onClick={() => setEditingCommentId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <strong>{comment.friend_name}:</strong> {comment.text}
                        {comment.address === getUserAddress() && (
                          <>
                            <button
                              onClick={() => handleEditComment(comment.id, comment.text)}
                              className="edit-comment"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="delete-comment"
                            >
                              🗑️
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ul>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                maxLength={500} // Add reasonable limit
              />
              <button onClick={handleAddComment}>Submit</button>
            </div>
          ) : (
            <div className="locked-comments">
              <span role="img" aria-label="lock">🔒</span> Authenticate with wallet for access to feature.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingDetails;