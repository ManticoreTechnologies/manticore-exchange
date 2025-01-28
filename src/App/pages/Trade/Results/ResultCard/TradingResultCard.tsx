import React, {
    useState, useEffect,
    // @ts-ignore
    useRef
} from 'react';
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
    showDetails
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isVideo, setIsVideo] = useState(false);
    const [priceMediaStates, setPriceMediaStates] = useState<Record<string, { isVideo: boolean, isLoaded: boolean }>>({});

    const convertToEVR = (satoshis: number): string => {
        return (satoshis / 100000000).toFixed(8).replace(/\.?0+$/, '');
    };

    const getMediaSrc = (hash: string | null | undefined) => {
        return hash
            ? `https://ipfs.manticore.exchange/ipfs/${hash}`
            : placeholderImage;
    };

    useEffect(() => {
        if (ipfsHash) {
            fetch(getMediaSrc(ipfsHash), { method: 'HEAD' })
                .then((response) => {
                    const contentType = response.headers.get('Content-Type');
                    if (contentType && contentType.startsWith('video')) {
                        setIsVideo(true);
                    }
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

    return (
        <div 
            className="trading-result-card"
            onClick={() => showDetails()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    showDetails();
                }
            }}
        >
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
                        }}
                    />
                )}
            </div>
            <div className="trading-result-card__content">
                <h3 className="trading-result-card__title">{name}</h3>
                <p className="trading-result-card__description">{description}</p>

                <div className="trading-result-card__prices">
                    {prices.map((price, index) => {
                        const mediaState = priceMediaStates[price.asset_name];
                        const balance = balances.find(b => b.asset_name === price.asset_name);
                        
                        return (
                            <div key={index} className="price-item">
                                {price.ipfs_hash && (
                                    <div className="price-media">
                                        {mediaState?.isVideo ? (
                                            <video
                                                className="price-video"
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                            >
                                                <source src={getMediaSrc(price.ipfs_hash)} type="video/mp4" />
                                            </video>
                                        ) : (
                                            <img
                                                src={getMediaSrc(price.ipfs_hash)}
                                                alt={`${price.asset_name} media`}
                                                className="price-image"
                                                onError={(e) => {
                                                    e.currentTarget.src = placeholderImage;
                                                }}
                                            />
                                        )}
                                    </div>
                                )}
                                <div className="price-details">
                                    <span className="price-asset-name">{price.asset_name}</span>
                                    <span className="price-amount">{Number(price.price_evr) / 100000000} EVR</span>
                                    {balance && (
                                        <span className="price-balance">
                                            {Number(balance.confirmed_balance)} available
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TradingResultCard;