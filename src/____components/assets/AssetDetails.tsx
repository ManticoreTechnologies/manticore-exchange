import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import '../../styles/AssetDetail.css'; // CSS for this page
import logo from '../../images/Placeholder.webp';
import api from '../../utility/api';

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

const AssetDetails: React.FC = () => {
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

  const from_faucet = searchParams.get('faucet');
  const faucet = from_faucet ? from_faucet : false;
  const showIPFSOnly = searchParams.get('showIPFSOnly') === 'true';

  const fetchAssets = async () => {
    setIsLoading(true);
    setError('');
    try {
      const sanitizedAssetName = name ? name.replace(/!/g, '') : '';
      const response = await api.node<any>('listassets', [sanitizedAssetName, true]);
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
  }, [name, showIPFSOnly]);

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

  return (
    <div className="asset-detail-container">
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
              <p><strong>Amount:</strong> {asset.amount}</p>
              <p><strong>Block Height:</strong> {asset.block_height}</p>
              <p className="truncate">
                <strong>Block Hash:</strong>
                <span className="copyable" onClick={() => copyToClipboard(asset.blockhash)}>
                  {asset.blockhash.slice(0, 10)}...<span className="copy-icon">📋</span>
                </span>
              </p>
              <p className="truncate">
                <strong>{asset.has_ipfs && asset.ipfs_hash ? "IPFS Hash: " : "TXID: "}</strong>
                <span className="copyable" onClick={() => copyToClipboard(asset.ipfs_hash || asset.txid_hash)}>
                  {(asset.ipfs_hash || asset.txid_hash).slice(0, 10)}...<span className="copy-icon">📋</span>
                </span>
              </p>
              <p><strong>Reissuable:</strong> {asset.reissuable ? 'Yes' : 'No'}</p>
              <p><strong>Decimals:</strong> {asset.units}</p>
            </div>
          )}

          {/* Video Controls */}
          {asset && asset.has_ipfs && isVideo && (
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
          <div className="asset-description">
            <button onClick={() => navigate(faucet ? `/faucet` : `/search`)}>Back</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetails;
