import React, { useState, useEffect } from 'react';
import './AssetsCarousel.css';
import { FaChevronLeft, FaChevronRight, FaLock, FaUnlock } from 'react-icons/fa';
import placeholder from '@/images/Placeholder.webp';
import evrLogo from '@/images/evr_logo.svg';

interface Asset {
    name: string;
    amount: number;
    units: number;
    reissuable: number;
    has_ipfs: number;
    ipfs_hash?: string;
}

interface AssetsCarouselProps {
    favoriteAssets: string[];
    getAssetInfo: (asset: string) => Asset;
}

const AssetsCarousel: React.FC<AssetsCarouselProps> = ({ favoriteAssets, getAssetInfo }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMediaLoading, setIsMediaLoading] = useState(true);
    const [mediaError, setMediaError] = useState<string | null>(null);
    const [isVideo, setIsVideo] = useState(false);

    const nextSlide = () => {
        if (favoriteAssets?.length > 0) {
            setCurrentIndex((prevIndex) => 
                prevIndex === favoriteAssets.length - 1 ? 0 : prevIndex + 1
            );
        }
    };

    const prevSlide = () => {
        if (favoriteAssets?.length > 0) {
            setCurrentIndex((prevIndex) => 
                prevIndex === 0 ? favoriteAssets.length - 1 : prevIndex - 1
            );
        }
    };

    const getAssetMedia = (asset: string): string => {
        if (!asset) return placeholder;
        
        const assetInfo = getAssetInfo(asset);
        if (!assetInfo) return placeholder;
        
        if (assetInfo.has_ipfs && assetInfo.ipfs_hash) {
            return `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${assetInfo.ipfs_hash}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO`;
        }
        
        // Use EVR logo for EVR assets
        if (asset.toUpperCase() === 'EVR') {
            return evrLogo;
        }
        return placeholder;
    };

    useEffect(() => {
        // Reset states when asset changes
        setIsMediaLoading(true);
        setMediaError(null);
        setIsVideo(false);

        if (!favoriteAssets?.length || currentIndex >= favoriteAssets.length) {
            setIsMediaLoading(false);
            return;
        }

        const currentAsset = favoriteAssets[currentIndex];
        if (!currentAsset) {
            setIsMediaLoading(false);
            return;
        }

        const mediaSrc = getAssetMedia(currentAsset);

        // Check if media is video
        if (getAssetInfo(currentAsset)?.has_ipfs) {
            fetch(mediaSrc, { method: 'HEAD' })
                .then((response) => {
                    const contentType = response.headers.get('Content-Type');
                    if (contentType && contentType.startsWith('video')) {
                        setIsVideo(true);
                    }
                    setIsMediaLoading(false);
                })
                .catch(() => {
                    setMediaError('Failed to load media');
                    setIsMediaLoading(false);
                });
        } else {
            setIsMediaLoading(false);
        }
    }, [currentIndex, favoriteAssets]);

    // @ts-ignore
    const formatSupply = (amount: number, units: number): string => {
        const actualNumber = amount;
        
        // Format based on size
        if (actualNumber >= 1_000_000_000_000) {
            const trillions = actualNumber / 1_000_000_000_000;
            if (trillions % 1 === 0) {
                return Math.round(trillions) + 'T';
            }
            return trillions.toFixed(2) + 'T';
        } else if (actualNumber >= 1_000_000_000) {
            const billions = actualNumber / 1_000_000_000;
            if (billions % 1 === 0) {
                return Math.round(billions) + 'B';
            }
            return billions.toFixed(2) + 'B';
        } else if (actualNumber >= 1_000_000) {
            const millions = actualNumber / 1_000_000;
            if (millions % 1 === 0) {
                return Math.round(millions) + 'M';
            }
            return millions.toFixed(2) + 'M';
        } else if (actualNumber >= 1_000) {
            const thousands = actualNumber / 1_000;
            if (thousands % 1 === 0) {
                return Math.round(thousands) + 'K';
            }
            return thousands.toFixed(2) + 'K';
        }
        return actualNumber.toLocaleString(undefined, { maximumFractionDigits: 2 });
    };

    const handleMediaLoad = () => {
        setIsMediaLoading(false);
        setMediaError(null);
    };

    const handleMediaError = () => {
        setMediaError('Failed to load media');
        setIsMediaLoading(false);
    };

    if (!favoriteAssets?.length) {
        return (
            <div className="tradex-profile-carousel">
                <div className="tradex-profile-carousel__empty-state">
                    <img src={placeholder} alt="No favorites" className="tradex-profile-carousel__empty-placeholder" />
                    <h3>No Favorite Assets</h3>
                    <p>Add assets to your favorites to see them here</p>
                </div>
            </div>
        );
    }

    const currentAsset = favoriteAssets[currentIndex];
    if (!currentAsset) {
        return (
            <div className="tradex-profile-carousel">
                <div className="tradex-profile-carousel__empty-state">
                    <img src={placeholder} alt="Error" className="tradex-profile-carousel__empty-placeholder" />
                    <h3>Error Loading Asset</h3>
                    <p>Unable to load the current asset</p>
                </div>
            </div>
        );
    }

    const assetInfo = getAssetInfo(currentAsset);
    if (!assetInfo) {
        return (
            <div className="tradex-profile-carousel">
                <div className="tradex-profile-carousel__empty-state">
                    <img src={placeholder} alt="Loading" className="tradex-profile-carousel__empty-placeholder" />
                    <h3>Loading Asset Information</h3>
                    <p>Please wait while we load the asset details</p>
                </div>
            </div>
        );
    }

    const mediaSrc = getAssetMedia(currentAsset);

    return (
        <div className="tradex-profile-carousel">
            <button 
                className="tradex-profile-carousel__button" 
                onClick={prevSlide}
                disabled={favoriteAssets.length <= 1}
                aria-label="Previous asset"
            >
                <FaChevronLeft />
            </button>

            <div className="tradex-profile-carousel__content">
                <div className="tradex-profile-carousel__asset">
                    <div className="tradex-profile-carousel__asset-image-container">
                        {isMediaLoading ? (
                            <div className="tradex-profile-carousel__media-loader">Loading...</div>
                        ) : mediaError ? (
                            <div className="tradex-profile-carousel__media-error">{mediaError}</div>
                        ) : isVideo ? (
                            <video
                                key={mediaSrc}
                                src={mediaSrc}
                                className="tradex-profile-carousel__asset-video"
                                autoPlay
                                loop
                                muted
                                playsInline
                                onError={handleMediaError}
                                onLoadedData={handleMediaLoad}
                                poster={placeholder}
                            />
                        ) : (
                            <img
                                src={mediaSrc}
                                alt={assetInfo.name}
                                className="tradex-profile-carousel__asset-image"
                                onError={handleMediaError}
                                onLoad={handleMediaLoad}
                            />
                        )}
                    </div>
                    <div className="tradex-profile-carousel__asset-info">
                        <div className="tradex-profile-carousel__asset-header">
                            <h3 className="tradex-profile-carousel__asset-title">{assetInfo.name}</h3>
                            <div className="tradex-profile-carousel__asset-status">
                                {assetInfo.reissuable ? (
                                    <span className="tradex-profile-carousel__asset-status--reissuable" title="Reissuable supply">
                                        <FaUnlock /> REISSUABLE
                                    </span>
                                ) : (
                                    <span className="tradex-profile-carousel__asset-status--fixed" title="Fixed supply">
                                        <FaLock /> FIXED
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="tradex-profile-carousel__asset-details">
                            <div className="tradex-profile-carousel__detail-item">
                                <span className="tradex-profile-carousel__detail-label">Total Supply</span>
                                <span className="tradex-profile-carousel__detail-value">
                                    {formatSupply(assetInfo.amount, assetInfo.units)}
                                </span>
                            </div>
                            <div className="tradex-profile-carousel__detail-item">
                                <span className="tradex-profile-carousel__detail-label">Decimals</span>
                                <span className="tradex-profile-carousel__detail-value">{assetInfo.units}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="tradex-profile-carousel__indicators">
                    {favoriteAssets.map((_, index) => (
                        <button 
                            key={index}
                            className={`tradex-profile-carousel__dot ${index === currentIndex ? 'tradex-profile-carousel__dot--active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`Go to asset ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            <button 
                className="tradex-profile-carousel__button" 
                onClick={nextSlide}
                disabled={favoriteAssets.length <= 1}
                aria-label="Next asset"
            >
                <FaChevronRight />
            </button>
        </div>
    );
};

export default AssetsCarousel;



