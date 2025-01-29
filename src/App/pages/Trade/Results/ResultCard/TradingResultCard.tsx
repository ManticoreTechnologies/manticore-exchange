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
    const [scrollPaused, setScrollPaused] = useState(false);
    const pricesRef = useRef<HTMLDivElement>(null);

    const convertToEVR = (satoshis: number): string => {
        return (satoshis / 100000000).toFixed(8).replace(/\.?0+$/, '');
    };

    const getMediaSrc = (hash: string | null | undefined) => {
        return hash
            ? `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${hash}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO`
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

    const renderPriceItem = (price: any, index: number) => {
        const mediaState = priceMediaStates[price.asset_name];
        const balance = balances.find(b => b.asset_name === price.asset_name);
        
        return (
            <div key={index} className="trading-asset-item">
                <div className="trading-asset-media">
                    {mediaState?.isVideo ? (
                        <video
                            className="trading-asset-video"
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
                            className="trading-asset-image"
                            onError={(e) => {
                                e.currentTarget.src = placeholderImage;
                            }}
                        />
                    )}
                </div>
                <div className="trading-asset-details">
                    <div className="trading-asset-info">
                        <span className="trading-asset-name" title={price.asset_name}>{price.asset_name}</span>
                        <span className="trading-asset-amount">{Number(price.price_evr)} EVR</span>
                    </div>
                    {balance && (
                        <span className="trading-asset-balance" title={`${Number(balance.confirmed_balance)} available`}>
                            {Number(balance.confirmed_balance)}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    const renderPriceItems = () => {
        // Only duplicate prices if there's more than one asset
        const displayPrices = prices.length > 1 ? [...prices, ...prices] : prices;
        
        return (
            <div 
                className="trading-asset-container"
                onMouseEnter={() => setScrollPaused(true)}
                onMouseLeave={() => setScrollPaused(false)}
                style={{ 
                    animationPlayState: scrollPaused ? 'paused' : 'running',
                    // Only apply animation if there's more than one asset
                    animation: prices.length > 1 ? `scrollAssets linear infinite ${Math.max(prices.length * 4, 10)}s` : 'none'
                }}
            >
                {displayPrices.map((price, index) => renderPriceItem(price, index))}
            </div>
        );
    };

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
                {prices.length > 1 && (
                    <div className="trading-result-card__assets-count">
                        {prices.length} assets
                    </div>
                )}
            </div>
            <div className="trading-result-card__content">
                <h3 className="trading-result-card__title">{name}</h3>
                <p className="trading-result-card__description">{description}</p>
                <div className="trading-result-card__prices" ref={pricesRef}>
                    {renderPriceItems()}
                </div>
            </div>
        </div>
    );
};

export default TradingResultCard;