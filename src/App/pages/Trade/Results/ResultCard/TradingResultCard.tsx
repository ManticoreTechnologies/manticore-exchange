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
    prices: Array<{asset_name: string; price_evr: string}>;
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
    const [offeringImages, setOfferingImages] = useState<string[]>([]);

    const convertToEVR = (satoshis: number): string => {
        return (satoshis / 100000000).toFixed(8).replace(/\.?0+$/, '');
    };

    const listing = {
        name,
        description,
        offerings: [],
        tags: '',
        seller_address: seller,
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
                [] // No offerings in the new interface
            );
            setOfferingImages(validImages.filter(Boolean) as string[]);
        };

        validateOfferings();
    }, []);

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
                <p className="trading-result-card__description">{description}</p>

                <div className="trading-result-card__offerings">
                    <div className={`offerings-count ${[] === 0 ? 'offerings-count--empty' : 'offerings-count--has-offerings'}`}>
                        {[]} Offering{[] !== 1 ? 's' : ''}
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