import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import QRCode from 'qrcode.react';
import './CreateListing.css';
import './NumberInput.css';

interface CreateListingProps {
    onClose: () => void;
    onComplete: () => void;
    userAddress: string;
}

interface PriceSpec {
    asset_name: string;
    price_evr?: number;
    price_asset_name?: string;
    price_asset_amount?: number;
    ipfs_hash?: string;
}

interface AssetPrice {
    asset_name: string;
    price_evr: string;
    ipfs_hash: string;
}

interface ValidationError {
    loc: string[];
    msg: string;
    type: string;
}

const STEPS = [
    { number: 1, label: 'Info' },
    { number: 2, label: 'Assets' },
    { number: 3, label: 'Review' }
];

const CreateListing: React.FC<CreateListingProps> = ({ onClose, userAddress }) => {
    const [step, setStep] = useState(1);
    const [listingDetails, setListingDetails] = useState({
        name: '',
        description: '',
        image_ipfs_hash: '',
        seller_address: userAddress,
        tags: [] as string[],
    });
    const [assetPrices, setAssetPrices] = useState<AssetPrice[]>([{ 
        asset_name: '', 
        price_evr: '',
        ipfs_hash: '' 
    }]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [listingResponse, setListingResponse] = useState<any>(null);
    const [slideDirection, setSlideDirection] = useState<'in' | 'out'>('in');
    const [notification, setNotification] = useState<{ show: boolean; type: string; message: string }>({ show: false, type: '', message: '' });
    const [tagInput, setTagInput] = useState('');

    const trading_api_host = import.meta.env.VITE_TRADING_API_HOST || 'api.manticore.exchange';
    const trading_api_port = import.meta.env.VITE_TRADING_API_PORT || '668';
    const trading_api_proto = import.meta.env.VITE_TRADING_API_PROTO || 'https';
    const trading_api_url = `${trading_api_proto}://${trading_api_host}:${trading_api_port}`;

    const handleNextStep = async () => {
        if (step === 3) {
            await submitListing();
        } else {
            setSlideDirection('out');
            setTimeout(() => {
                setStep(prev => prev + 1);
                setSlideDirection('in');
            }, 300);
        }
    };

    const handlePrevStep = () => {
        setSlideDirection('out');
        setTimeout(() => {
            setStep(prev => prev - 1);
            setSlideDirection('in');
        }, 300);
    };

    const submitListing = async () => {
        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            const prices: PriceSpec[] = assetPrices.map(ap => ({
                asset_name: ap.asset_name.trim(),
                price_evr: Number(ap.price_evr),
                ipfs_hash: ap.ipfs_hash.trim() || undefined
            }));

            const response = await axios.post(`${trading_api_url}/listings/`, {
                seller_address: listingDetails.seller_address,
                name: listingDetails.name.trim(),
                description: listingDetails.description.trim(),
                image_ipfs_hash: listingDetails.image_ipfs_hash.trim() || undefined,
                tags: listingDetails.tags,
                prices
            });

            setListingResponse(response.data);
            setStep(4);
        } catch (error) {
            console.error('Error creating listing:', error);
            
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<any>;
                
                if (axiosError.response?.status === 422) {
                    const validationErrors = axiosError.response.data?.detail;
                    if (Array.isArray(validationErrors)) {
                        const errorMessages = validationErrors.map((err: ValidationError) => {
                            const field = err.loc[err.loc.length - 1];
                            return `${field}: ${err.msg}`;
                        });
                        setErrorMessage(errorMessages.join('\n'));
                    } else {
                        setErrorMessage(axiosError.response.data?.detail || 'Invalid input data');
                    }
                } else if (axiosError.response?.data?.detail) {
                    setErrorMessage(axiosError.response.data.detail);
                } else {
                    setErrorMessage(axiosError.message || 'Failed to create listing. Please try again.');
                }
            } else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setListingDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAssetPriceChange = (index: number, field: keyof AssetPrice, value: string) => {
        setAssetPrices(prevPrices => {
            const newPrices = [...prevPrices];
            if (field === 'asset_name') {
                const uppercasedValue = value.toUpperCase();
                if (/^[A-Z0-9._/#]*$/.test(uppercasedValue)) {
                    newPrices[index] = {
                        ...newPrices[index],
                        [field]: uppercasedValue
                    };
                }
            } else if (field === 'price_evr') {
                if (/^\d*\.?\d{0,8}$/.test(value)) {
                    newPrices[index] = {
                        ...newPrices[index],
                        [field]: value
                    };
                }
            } else {
                newPrices[index] = {
                    ...newPrices[index],
                    [field]: value
                };
            }
            return newPrices;
        });
    };

    const addAssetPrice = () => {
        setAssetPrices(prev => [...prev, { asset_name: '', price_evr: '', ipfs_hash: '' }]);
    };

    const removeAssetPrice = (index: number) => {
        if (assetPrices.length > 1) {
            setAssetPrices(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim().toLowerCase();
            if (!listingDetails.tags.includes(newTag)) {
                setListingDetails(prev => ({
                    ...prev,
                    tags: [...prev.tags, newTag]
                }));
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setListingDetails(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const renderErrorMessage = () => {
        if (!errorMessage) return null;
        
        return (
            <div className="error-message">
                {errorMessage.split('\n').map((error, index) => (
                    <p key={index}>{error}</p>
                ))}
            </div>
        );
    };

    const renderStepProgress = () => {
        const progress = ((step - 1) / (STEPS.length - 1)) * 100;
        
        return (
            <div className="step-progress">
                <div className="step-progress-bar" style={{ width: `${progress}%` }} />
                {STEPS.map((s) => (
                    <div 
                        key={s.number}
                        className={`step-circle ${step === s.number ? 'active' : ''} ${step > s.number ? 'completed' : ''}`}
                    >
                        {step > s.number ? '✓' : s.number}
                        <span className="step-label">{s.label}</span>
                    </div>
                ))}
            </div>
        );
    };

    const renderBasicInfo = () => (
        <>
            <h2 className="step-title">Basic Information</h2>
            <input
                type="text"
                name="name"
                placeholder="Listing Name"
                value={listingDetails.name}
                onChange={handleInputChange}
            />
            <textarea
                name="description"
                placeholder="Description"
                value={listingDetails.description}
                onChange={handleInputChange}
                rows={3}
            />
            <input
                type="text"
                name="image_ipfs_hash"
                placeholder="IPFS Image Hash (optional)"
                value={listingDetails.image_ipfs_hash}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="seller_address"
                placeholder="Seller Address (EVR)"
                value={listingDetails.seller_address}
                onChange={handleInputChange}
                className="evr-address-input"
            />
            <div className="tags-input-container">
                <input
                    type="text"
                    placeholder="Add tags (press Enter)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInput}
                    className="tag-input"
                />
                <div className="tags-container">
                    {listingDetails.tags.map((tag) => (
                        <span key={tag} className="tag">
                            {tag}
                            <button 
                                onClick={() => removeTag(tag)}
                                className="remove-tag"
                                type="button"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>
        </>
    );

    const renderAssetPrices = () => (
        <>
            <h2 className="step-title">Asset Prices</h2>
            <div className="asset-prices-container">
                {assetPrices.map((assetPrice, index) => (
                    <div key={index} className="asset-price-row">
                        <input
                            type="text"
                            placeholder="Asset Name"
                            value={assetPrice.asset_name}
                            onChange={(e) => handleAssetPriceChange(index, 'asset_name', e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Price (EVR)"
                            value={assetPrice.price_evr}
                            onChange={(e) => handleAssetPriceChange(index, 'price_evr', e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="IPFS Hash"
                            value={assetPrice.ipfs_hash}
                            onChange={(e) => handleAssetPriceChange(index, 'ipfs_hash', e.target.value)}
                        />
                        {assetPrices.length > 1 && (
                            <button 
                                className="remove-asset-button"
                                onClick={() => removeAssetPrice(index)}
                                type="button"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
                <button 
                    className="add-asset-button"
                    onClick={addAssetPrice}
                    type="button"
                >
                    + Add Asset
                </button>
            </div>
        </>
    );

    const renderReview = () => (
        <>
            <h2 className="step-title">Review</h2>
            <div className="listing-details">
                <p><strong>Name:</strong> {listingDetails.name}</p>
                <p><strong>Description:</strong> {listingDetails.description}</p>
                {listingDetails.tags.length > 0 && (
                    <div className="tags-list">
                        <strong>Tags:</strong>
                        <div className="tags-container">
                            {listingDetails.tags.map((tag) => (
                                <span key={tag} className="tag">{tag}</span>
                            ))}
                        </div>
                    </div>
                )}
                <div className="asset-prices-list">
                    <strong>Assets and Prices:</strong>
                    {assetPrices.map((ap, index) => (
                        <div key={index} className="review-asset-item">
                            <p>{ap.asset_name}: {ap.price_evr} EVR</p>
                            {ap.ipfs_hash && (
                                <p className="review-ipfs-hash">{ap.ipfs_hash}</p>
                            )}
                        </div>
                    ))}
                </div>
                <p><strong>Address:</strong> {listingDetails.seller_address}</p>
            </div>
        </>
    );

    const renderSuccess = () => (
        <div className="success-step">
            <h2 className="step-title">Listing Created Successfully</h2>
            <div className="listing-details">
                <p><strong>Listing ID:</strong></p>
                <div className="listing-id">{listingResponse?.listing_id}</div>
                <div className="asset-prices-list">
                    <strong>Assets and Prices:</strong>
                    {assetPrices.map((ap, index) => (
                        <p key={index}>
                            <span>{ap.asset_name}</span>
                            <span>{ap.price_evr} EVR</span>
                        </p>
                    ))}
                </div>
                {listingResponse?.deposit_address && (
                    <div className="deposit-address-container">
                        <div className="deposit-address-label">Deposit Address</div>
                        <div className="qr-container">
                            <QRCode
                                value={listingResponse.deposit_address}
                                size={180}
                                level="H"
                                includeMargin={false}
                                fgColor="#000000"
                                bgColor="#ffffff"
                            />
                        </div>
                        <div 
                            className="deposit-address"
                            onClick={() => {
                                navigator.clipboard.writeText(listingResponse.deposit_address);
                                setNotification({
                                    show: true,
                                    type: 'success',
                                    message: 'Address copied to clipboard!'
                                });
                            }}
                            title="Click to copy address"
                        >
                            {listingResponse.deposit_address}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderStepContent = () => {
        const content = (() => {
            switch (step) {
                case 1:
                    return renderBasicInfo();
                case 2:
                    return renderAssetPrices();
                case 3:
                    return renderReview();
                case 4:
                    return renderSuccess();
                default:
                    return null;
            }
        })();

        return (
            <div className={`step-content ${slideDirection === 'out' ? 'slide-out' : ''}`}>
                {content}
                {renderErrorMessage()}
                <div className="step-navigation">
                    <button 
                        className="cancel-button"
                        onClick={onClose}
                        type="button"
                    >
                        Cancel
                    </button>
                    {step < 4 ? (
                        <div className="action-buttons">
                            {step > 1 && (
                                <button 
                                    className="prev-button"
                                    onClick={handlePrevStep}
                                    disabled={isSubmitting}
                                    type="button"
                                >
                                    Previous
                                </button>
                            )}
                            <button 
                                className="next-button"
                                onClick={handleNextStep}
                                disabled={
                                    isSubmitting || 
                                    (step === 1 && (!listingDetails.name || !listingDetails.seller_address || listingDetails.seller_address.length !== 34 || !listingDetails.seller_address.toUpperCase().startsWith('E'))) ||
                                    (step === 2 && assetPrices.some(ap => !ap.asset_name || !ap.price_evr))
                                }
                                type="button"
                            >
                                {step === 3 ? (isSubmitting ? 'Creating...' : 'Create Listing') : 'Next'}
                            </button>
                        </div>
                    ) : (
                        <button 
                            className="done-button"
                            onClick={onClose}
                            type="button"
                        >
                            Done
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="create-listing-popup">
            <div className="create-listing-content">
                {renderStepProgress()}
                {renderStepContent()}
            </div>
        </div>
    );
};

export default CreateListing;