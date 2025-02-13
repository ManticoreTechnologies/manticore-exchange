import React, { useState, useEffect } from 'react';
import './TradingResultCard.css';
import placeholderImage from '@/Application/logos/white-manticore.png';
import { FiStar, FiKey } from 'react-icons/fi';

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
    const [priceMediaStates, setPriceMediaStates] = useState<Record<string, { isVideo: boolean, isLoaded: boolean }>>({});

    const getMediaSrc = (hash: string | null | undefined) => {
        if (!hash) return placeholderImage;
        return `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${hash}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO`;
    };

    useEffect(() => {
        if (ipfsHash) {
            fetch(getMediaSrc(ipfsHash), { method: 'HEAD' })
                .then((response) => {
                    const contentType = response.headers.get('Content-Type');
                    setIsVideo(contentType?.startsWith('video') || false);
                    setIsLoaded(true);
                })
                .catch(() => setIsLoaded(true));
        }

        // Check media type for each price's IPFS hash
        prices.forEach(price => {
            if (price.ipfs_hash) {
                fetch(getMediaSrc(price.ipfs_hash), { method: 'HEAD' })
                    .then((response) => {
                        const contentType = response.headers.get('Content-Type');
                        setPriceMediaStates(prev => ({
                            ...prev,
                            [price.asset_name]: {
                                isVideo: contentType?.startsWith('video') || false,
                                isLoaded: true
                            }
                        }));
                    })
                    .catch(() => {
                        setPriceMediaStates(prev => ({
                            ...prev,
                            [price.asset_name]: {
                                isVideo: false,
                                isLoaded: true
                            }
                        }));
                    });
            }
        });
    }, [ipfsHash, prices]);

    const renderPriceItem = (price: any) => {
        const mediaState = priceMediaStates[price.asset_name];
        const balance = balances.find(b => b.asset_name === price.asset_name);
        
        return (
            <div key={price.asset_name} className="trading-asset-item">
                <div className="trading-asset-info">
                    <span className="trading-asset-name" title={price.asset_name}>
                        {price.asset_name}
                    </span>
                    <span className="trading-asset-amount">
                        {Number(price.price_evr).toLocaleString()} EVR
                    </span>
                    {balance && (
                        <span className="trading-asset-balance" title={`${Number(balance.confirmed_balance)} available`}>
                            {Number(balance.confirmed_balance).toLocaleString()} available
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
            </div>

            <div className="trading-result-card__content">
                <h3 className="trading-result-card__title">{name}</h3>
                <p className="trading-result-card__description">{description}</p>
                
                <div className="trading-result-card__prices">
                    <div className="trading-asset-container">
                        {prices.map(price => renderPriceItem(price))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TradingResultCard;