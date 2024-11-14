import React, { useState, useEffect, useRef } from 'react';
import './ResultCard.css';
import placeholderImage from '../../../../images/Placeholder.png'
import ResultPopup from '../ResultPopup/ResultPopup';
import LoadingSpinner from '../../../../components/Spinners/LoadingSpinner'; // Import the loading spinner
import GraphemeSplitter from 'grapheme-splitter'; // Import the library

interface ResultCardProps {
    assetName: string;
    description: string;
    unitPrice: number; // Unit price in satoshis
    listingAddress: string;
    orderStatus: string;
    ipfsHash?: string;
    quantity?: number; // Quantity in satoshis
    sold?: number; // Sold quantity in satoshis
    listingID: string;
    addToCart: (listing: any) => void;
    buyNow: (listing: any) => void;
    units: string;
}

const ResultCard: React.FC<ResultCardProps> = ({
    assetName,
    description,
    unitPrice,
    listingAddress,
    orderStatus,
    ipfsHash,
    quantity = 0, // Default to 0 if undefined
    sold = 0, // Default to 0 if undefined
    listingID,
    units,
    addToCart,
    buyNow
}) => {
    const [showPopup, setShowPopup] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false); // Track loading state
    const [isVideo, setIsVideo] = useState(false); // Track if the file is a video
    const popupRef = useRef<HTMLDivElement>(null); // To reference the popup container

    // Helper function to convert satoshis to EVR
    const convertToEVR = (satoshis: number): string => {
        return (satoshis / 100000000).toFixed(8).replace(/\.?0+$/, ''); // Removes trailing zeros
    };

    const listing = {
        assetName,
        description,
        unitPrice,
        listingAddress,
        orderStatus,
        ipfsHash,
        quantity,
        units,
        listingID
    };

    // IPFS image source handling
    const mediaSrc = ipfsHash 
        ? `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${ipfsHash}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO` 
        : placeholderImage;

    // Fetch the content type to determine if the file is a video or image
    useEffect(() => {
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

    const truncateDescription = (text: string, maxLength: number): string => {
        const splitter = new GraphemeSplitter();
        const graphemes = splitter.splitGraphemes(text);
        if (graphemes.length <= maxLength) return text;
        return graphemes.slice(0, maxLength).join('') + '...';
    };

    return (
        <>
            <div className="result-card" onClick={() => setShowPopup(true)}>
                {!isLoaded && (
                    <div className="loading-spinner-container"><LoadingSpinner/></div> // Display spinner while loading
                )}

                {/* Render video if it's a video file, otherwise render an image */}
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
                        src={mediaSrc}
                        alt={assetName}
                        onLoad={() => setIsLoaded(true)} // Remove spinner when image loads
                        onError={() => setIsLoaded(true)} // Remove spinner even on error
                    />
                )}

                <div className="content-container">
                    <h3 className="asset-name" title={assetName}>{assetName}</h3>
                    <p dangerouslySetInnerHTML={{ __html: truncateDescription(description, 100).replace(/\n/g, '<br />') }} />
                    {orderStatus === 'ACTIVE' ? (
                        <>
                            <div className="action-buttons">
                                <button onClick={(e) => { e.stopPropagation(); buyNow(listing); }} disabled={quantity === 0}>Buy Now</button>
                                <button className="add-to-cart-button" onClick={(e) => { e.stopPropagation(); addToCart(listing); }}>
                                    Add to Cart
                                </button>
                            </div>
                            <div className="price-quantity">
                                <p className="unit-price"><strong>Price: </strong> {convertToEVR(unitPrice)} EVR</p>
                                <p className="quantity-available"><strong>Available:</strong> {convertToEVR(quantity)} {assetName}</p>
                                <p className="quantity-sold"><strong>Sold:</strong> {convertToEVR(sold)} {assetName}</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="listing-status"><strong>Status:</strong> {orderStatus}</p>
                            <p className="quantity-sold"><strong>Sold:</strong> {convertToEVR(sold)} {assetName}</p>
                        </>
                    )}
                </div>
            </div>

            {showPopup && (
                <div className="popup-overlay">
                    <div ref={popupRef} className="popup-container">
                        <ResultPopup
                            assetName={assetName}
                            description={description}
                            unitPrice={unitPrice}
                            listingAddress={listingAddress}
                            orderStatus={orderStatus}
                            ipfsHash={ipfsHash}
                            quantity={quantity}
                            sold={sold}
                            listingID={listingID}
                            closePopup={() => setShowPopup(false)}
                            addToCart={addToCart}
                            buyNow={buyNow}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ResultCard;
