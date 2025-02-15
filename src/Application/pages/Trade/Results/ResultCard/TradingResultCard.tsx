import React, { useState, useEffect } from 'react';
import './TradingResultCard.css';
import placeholderImage from '@/Application/logos/white-manticore.png';
import { FiStar, FiKey } from 'react-icons/fi';
import { formatEvrAmount } from '@/utils/formatting';

interface TradingResultCardProps {
    id: string;
    name: string;
    description: string;
    seller: string;
    listingAddress: string;
    ipfsHash: string | null;
    status: string;
    createdAt: string;
    unitPrice: string;
    quantity: number;
    balances: Array<{asset_name: string; confirmed_balance: string}>;
    prices: Array<{asset_name: string; price_evr: string; ipfs_hash?: string}>;
    addToCart: () => void;
    buyNow: () => void;
    showDetails: () => void;
    tags: string[];
    isOwnedByUser?: boolean;
}

const TradingResultCard: React.FC<TradingResultCardProps> = ({
    id,
    name,
    description,
    seller,
    listingAddress,
    ipfsHash,
    status,
    createdAt,
    unitPrice,
    quantity,
    balances,
    prices,
    addToCart,
    buyNow,
    showDetails,
    tags,
    isOwnedByUser
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isVideo, setIsVideo] = useState(false);

    const getMediaSrc = (hash: string | null | undefined) => {
        // If listing has no main image, try to get the first asset's image
        if (!hash && prices.length > 0 && prices[0].ipfs_hash) {
            hash = prices[0].ipfs_hash;
        }
        if (!hash) return placeholderImage;
        return `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${hash}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO`;
    };

    useEffect(() => {
        const checkMedia = async () => {
            // Get the appropriate hash to check
            const hashToCheck = ipfsHash || (prices.length > 0 ? prices[0].ipfs_hash : null);
            
            if (hashToCheck) {
                try {
                    const response = await fetch(getMediaSrc(hashToCheck), { method: 'HEAD' });
                    const contentType = response.headers.get('Content-Type');
                    setIsVideo(contentType?.startsWith('video') || false);
                    setIsLoaded(true);
                } catch (error) {
                    console.error('Error checking media type:', error);
                    setIsVideo(false);
                    setIsLoaded(true);
                }
            } else {
                setIsLoaded(true);
            }
        };

        checkMedia();
    }, [ipfsHash, prices]);

    const renderPriceItem = (price: any, balance: any) => {
        const formattedPrice = formatEvrAmount(price.price_evr);
        const formattedBalance = balance ? Number(balance.confirmed_balance).toLocaleString() : '0';
        
        return (
            <div key={price.asset_name} className="trading-asset-item">
                {price.ipfs_hash && (
                    <div className="trading-asset-media">
                        <img 
                            src={getMediaSrc(price.ipfs_hash)}
                            alt={price.asset_name}
                            onError={(e) => {
                                e.currentTarget.src = placeholderImage;
                            }}
                        />
                    </div>
                )}
                <div className="trading-asset-info">
                    <div className="trading-asset-details">
                        <span className="trading-asset-name" title={price.asset_name}>
                            {price.asset_name}
                        </span>
                        <span className="trading-asset-price">
                            {formattedPrice}
                        </span>
                    </div>
                    {balance && (
                        <span className="trading-asset-balance">
                            {formattedBalance} available
                        </span>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div 
            className={`trading-result-card ${isOwnedByUser ? 'owned-by-user' : ''}`}
            onClick={showDetails}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    showDetails();
                }
            }}
        >
            <div className="trading-result-card__header">
                {isOwnedByUser && (
                    <div className="ownership-badge" title="Your Listing">
                        <FiKey />
                    </div>
                )}
                <div className="trading-result-card__status" data-status={status}>
                    {status}
                </div>
            </div>

            <div className="trading-result-card__media">
                {isVideo ? (
                    <video
                        className="trading-result-card__video"
                        autoPlay
                        muted
                        loop
                        playsInline
                    >
                        <source src={getMediaSrc(ipfsHash)} type="video/mp4" />
                    </video>
                ) : (
                    <img
                        src={getMediaSrc(ipfsHash)}
                        alt={name}
                        className="trading-result-card__image"
                        onLoad={() => setIsLoaded(true)}
                        onError={(e) => {
                            e.currentTarget.src = placeholderImage;
                            setIsLoaded(true);
                        }}
                    />
                )}
                {tags && tags.length > 0 && (
                    <div className="trading-result-card__tags">
                        {tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="tag">
                                {tag}
                            </span>
                        ))}
                        {tags.length > 3 && (
                            <span className="tag">+{tags.length - 3}</span>
                        )}
                    </div>
                )}
            </div>

            <div className="trading-result-card__content">
                <h3 className="trading-result-card__title">{name}</h3>
                <p className="trading-result-card__description">{description}</p>
                
                <div className="trading-result-card__prices">
                    <div className="trading-asset-container">
                        {prices.map(price => {
                            const balance = balances.find(b => b.asset_name === price.asset_name);
                            return renderPriceItem(price, balance);
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TradingResultCard;