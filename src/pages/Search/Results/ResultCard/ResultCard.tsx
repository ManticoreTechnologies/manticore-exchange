import React, { useState, useEffect } from 'react';
import './ResultCard.css';
import placeholderImage from '../../../../images/Placeholder.webp'; // Import the placeholder image
import LoadingSpinner from '../../../../components/Spinners/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
// Import Font Awesome icons
import { FaWrench, FaShoppingCart } from 'react-icons/fa';

interface ResultCardProps {
    name: string;
    blockHeight: number;
    blockHash: string;
    amount: number;
    ipfsHash?: string;
    reissuable: boolean;
    units: number;
    onClick?: () => void;
    overlayButtons?: {
        wrench: () => void;
        addToCart: () => void;
    };
    quantityWord?: React.ReactNode;
}

const ResultCard: React.FC<ResultCardProps> = ({
    name,
    blockHeight,
    blockHash,
    amount,
    ipfsHash,
    reissuable,
    units,
    onClick,
    overlayButtons,
    quantityWord
}) => {
    const [isLoaded, setIsLoaded] = useState(false); // Track loading state
    const [isVideo, setIsVideo] = useState(false); // Track if the file is a video
    const [showPlaceholder, setShowPlaceholder] = useState(false); // Track if the placeholder should be shown
    const navigate = useNavigate();
    // Helper function to truncate long strings
    const truncateString = (str: string, length: number) => {
        return str.length > length ? `${str.substring(0, length - 4)}... ` : str;
    };

    // IPFS URL
    const mediaSrc = ipfsHash
        ? `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${ipfsHash}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO`
        : placeholderImage;

    // Fetch the content type to determine if the file is a video or image
    useEffect(() => {
        console.log(name);
        if (ipfsHash) {
            fetch(mediaSrc, { method: 'HEAD' })
                .then((response) => {
                    const contentType = response.headers.get('Content-Type');
                    if (contentType && contentType.startsWith('video')) {
                        setIsVideo(true);
                    }
                })
                .catch(() => setIsLoaded(true)); // In case of error, mark as loaded
        }
    }, [ipfsHash, mediaSrc]);
    return (
        <div className="result-card" onClick={() => {onClick ? onClick() : navigate(`/asset/${encodeURIComponent(name)}`);}}>
            {overlayButtons && (
                <div className="result-card-buttons">
                    {overlayButtons.wrench && (
                        <button 
                            className="wrench-button" 
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent event from bubbling up
                                overlayButtons.wrench();
                            }}
                        >
                            <div className="result-card-action-icon" data-icon="🔧">🔧</div>
                        </button>
                    )}
                    {overlayButtons.addToCart && (
                        <button 
                            className="add-to-cart-button" 
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent event from bubbling up
                                overlayButtons.addToCart();
                            }}
                        >
                            <div className="result-card-action-icon" data-icon="🛒">🛒</div>
                        </button>
                    )}
                </div>
            )}
            {!isLoaded && (       
                <div className="loading-spinner-container"><LoadingSpinner/></div>
            )}
            {isVideo ? (
                <video
                    className="result-card-image"
                    autoPlay
                    muted
                    loop
                    onCanPlayThrough={() => setIsLoaded(true)}
                    onError={() => setIsLoaded(true)}
                >
                    <source src={mediaSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            ) : (
                showPlaceholder ? (
                    <img 
                        className="result-card-image"
                        src={placeholderImage}
                    />
                ) : (
                    <img 
                        className="result-card-image"
                        src={mediaSrc}
                        onLoad={() => setIsLoaded(true)}
                        onError={() => {setIsLoaded(true); setShowPlaceholder(true)}}
                    />
                )
            )}
            <div className="result-overlay">
                <h3 title={name}>{truncateString(name, 15)}</h3>
                {quantityWord && <p>{quantityWord}</p>}
                {!quantityWord && <p>Supply: {amount} </p>}
            </div>
        </div>
    );
};

export default ResultCard;


/*

                {isVideo ? (
                    <video
                        width="100%"
                        height="auto"
                        autoPlay
                        muted
                        loop
                        onCanPlayThrough={() => setIsLoaded(true)} // Remove spinner when video is ready
                        onError={() => setIsLoaded(true)} // Remove spinner on error
                    >
                        <source src={mediaSrc} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <img 
                        className="result-card-image"
                        src={mediaSrc}
                        alt={name}
                        onLoad={() => setIsLoaded(true)} // Remove spinner when image loads
                        onError={() => setIsLoaded(true)} // Remove spinner even on error
                    />
                )}
*/