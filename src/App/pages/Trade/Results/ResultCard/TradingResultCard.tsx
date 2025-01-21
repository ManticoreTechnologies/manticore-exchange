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
    name: string;
    description: string;
    offerings: any[];
    ipfsHash: string;
    tags?: string;
    seller_address: string;
    addToCart: (listing: any) => void;
    buyNow: (listing: any) => void;
    showDetails: (listing: any) => void; // New prop to show details
}

const TradingResultCard: React.FC<TradingResultCardProps> = ({
    name,
    description,
    offerings,
    ipfsHash,
    tags,
    seller_address,
    addToCart,
    buyNow,
    showDetails
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isVideo, setIsVideo] = useState(false);
    const [offeringImages, setOfferingImages] = useState<string[]>([]);

    const convertToEVR = (satoshis: number): string => {
        return (satoshis / 100000000).toFixed(8).replace(/\.?0+$/, '');
    };

    const listing = {
        name,
        description,
        offerings,
        tags,
        seller_address,
        units: 0, // Assuming default value
        listingID: '', // Assuming default value
        seller: '' // Assuming default value
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

    useEffect(() => {
        // Validate each offering's IPFS hash and check if it's an image
        const validateOfferings = async () => {
            const validImages = await Promise.all(
                offerings.map(async (offering) => {
                    if (!offering.ipfs_hash) return null;
                    const url = `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${offering.ipfs_hash}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO`;
                    try {
                        const response = await fetch(url, { method: 'HEAD' });
                        const contentType = response.headers.get('Content-Type');
                        return contentType?.startsWith('image') ? url : null;
                    } catch {
                        return null;
                    }
                })
            );
            setOfferingImages(validImages.filter(Boolean) as string[]);
        };

        validateOfferings();
    }, [offerings]);

    return (
        <div 
            className="trading-result-card"
            onClick={() => showDetails(listing)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    showDetails(listing);
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
                        <source src={mediaSrc} type="video/mp4" />
                    </video>
                ) : (
                    <img
                        src={mediaSrc}
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
                {tags && tags.length > 0 && (
                    <div className="trading-result-card__tags">
                        {tags.split(',').map((tag, index) => (
                            <span key={index} className="tag">#{tag}</span>
                        ))}
                    </div>
                )}
                <p className="trading-result-card__description">{description}</p>

                <div className="trading-result-card__offerings">
                    <div className={`offerings-count ${offerings.length === 0 ? 'offerings-count--empty' : 'offerings-count--has-offerings'}`}>
                        {offerings.length} Offering{offerings.length !== 1 ? 's' : ''}
                    </div>

                    <div className="offerings-images">
                        {offeringImages.slice(0, 5).map((imgUrl, index) => (
                            <img
                                key={index}
                                src={imgUrl}
                                alt={`Offering ${index + 1}`}
                                className="offering-image"
                                data-remaining={offeringImages.length > 5 ? `+${offeringImages.length - 5}` : ''}
                                onError={(e) => {
                                    e.currentTarget.src = placeholderImage;
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TradingResultCard;