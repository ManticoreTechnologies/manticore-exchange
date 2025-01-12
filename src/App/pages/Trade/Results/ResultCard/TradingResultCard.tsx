import React, { useState, useEffect, 
// @ts-ignore
useRef } from 'react';
import './TradingResultCard.css';
import placeholderImage from '@/images/Placeholder.png'
// @ts-ignore
import ResultPopup from '../ResultPopup/ResultPopup';
//@ts-ignore
import LoadingSpinner from '@/components/Spinners/LoadingSpinner'; // Import the loading spinner
// @ts-ignore
import GraphemeSplitter from 'grapheme-splitter'; // Import the library

//@ts-ignore
import SearchResultCard from '../Search/ResultCard/ResultCard';
//@ts-ignore
import ResultCard from '@/App/pages/Search/Results/ResultCard/ResultCard';
// @ts-ignore
import ManageListing from '@/App/pages/Trade/ManageListing/ManageListing';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
interface TradingResultCardProps {
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
    showDetails: (listing: any) => void; // New prop to show details
    seller: string;
}

const TradingResultCard: React.FC<TradingResultCardProps> = ({
    assetName,
    description,
    unitPrice,
    listingAddress,
    orderStatus,
    ipfsHash,
    quantity = 0,
    //@ts-ignore
    sold = 0,
    listingID,
    units,
    addToCart,
    buyNow,
    showDetails,
    seller
}) => {
    // @ts-ignore
    const [isLoaded, setIsLoaded] = useState(false);
    const [isVideo, setIsVideo] = useState(false);

    const convertToEVR = (satoshis: number): string => {
        return (satoshis / 100000000).toFixed(8).replace(/\.?0+$/, '');
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
        listingID,
        seller
    };

    const mediaSrc = ipfsHash 
        ? `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${ipfsHash}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO` 
        : placeholderImage;

    useEffect(() => {
        if (ipfsHash) {
            fetch(mediaSrc, { method: 'HEAD' })
                .then((response) => {
                    const contentType = response.headers.get('Content-Type');
                    if (contentType && contentType.startsWith('video')) {
                        setIsVideo(true);
                    }
                })
                .catch(() => setIsLoaded(true));
        }
    }, [ipfsHash, mediaSrc]);

    return (
        <div className="trading-result-card">
            <div className="trading-result-card__media">
                {isVideo ? (
                    <video
                        className="trading-result-card__video"
                        autoPlay
                        muted
                        loop
                        playsInline
                    >
                        <source src={mediaSrc} type="video/mp4" />
                    </video>
                ) : (
                    <img
                        src={mediaSrc}
                        alt={assetName}
                        className="trading-result-card__image"
                        onLoad={() => setIsLoaded(true)}
                    />
                )}
            </div>
            <div className="trading-result-card__content">
                <h3 className="trading-result-card__title">{assetName}</h3>
                <div className="trading-result-card__info">
                    <div className="trading-result-card__status" data-status={orderStatus}>
                        {orderStatus}
                    </div>
                    <div className="trading-result-card__price">
                        {convertToEVR(unitPrice)} EVR
                    </div>
                </div>
                <p className="trading-result-card__description">{description}</p>
                <div className="trading-result-card__actions">
                    <button 
                        className="trading-result-card__button"
                        onClick={() => buyNow(listing)}
                        disabled={orderStatus !== 'ACTIVE'}
                    >
                        Buy Now
                    </button>
                    <button 
                        className="trading-result-card__button trading-result-card__button--secondary"
                        onClick={() => addToCart(listing)}
                        disabled={orderStatus !== 'ACTIVE'}
                    >
                        Add to Cart
                    </button>
                    <button 
                        className="trading-result-card__button trading-result-card__button--secondary"
                        onClick={() => showDetails(listing)}
                    >
                        Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TradingResultCard;