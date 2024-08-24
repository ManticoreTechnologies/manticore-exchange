import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';
import zxcvbn from 'zxcvbn'; // Library for password strength checking
import './CreateListing.css';

interface CreateListingProps {
    onClose: () => void;
    onComplete: () => void;
}

const CreateListing: React.FC<CreateListingProps> = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [listingDetails, setListingDetails] = useState({
        assetName: '',
        description: '',
        unitPrice: '',
        quantity: '',
        password: '',
        payoutAddress: '',
    });
    const [listingResponse, setListingResponse] = useState<any>(null);
    //const [isSending, setIsSending] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderStatus, setOrderStatus] = useState<string | null>(null);
    //const [isChecking, setIsChecking] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [confirmPassword, setConfirmPassword] = useState<string>(''); // New state for confirmation password

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (step === 2 && listingResponse?.listing_id) {
            // Fetch the listing status every 5 seconds
            interval = setInterval(checkListingStatus, 5000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [step, listingResponse]);

    const handleNextStep = async () => {
        if (step === 1) {
            if (passwordStrength < 3) {
                alert('Please enter a stronger password.');
                return;
            }

            setIsSubmitting(true);
            setErrorMessage(null); // Clear any previous error messages

            try {
                const response = await axios.post('http://0.0.0.0:668/list', {
                    name: listingDetails.assetName,
                    description: listingDetails.description,
                    price: Number(listingDetails.unitPrice),
                    payout_address: listingDetails.payoutAddress,
                    password: listingDetails.password,
                    tags: []
                });
                console.log(response.data);
                setListingResponse(response.data);
                setStep(2);
            } catch (error: any) {
                console.error('Error creating listing:', error);
                if (error.response && error.response.data) {
                    setErrorMessage(error.response.data.error);
                } else {
                    setErrorMessage('Failed to create listing. Please try again.');
                }
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setStep(prev => prev + 1);
        }
    };

    const checkListingStatus = async () => {
        if (!listingResponse) return;
        //setIsChecking(true);
        try {
            const response = await axios.get(`http://0.0.0.0:668/listing/${listingResponse.listing_id}`);
            const { listing_status } = response.data;
            setOrderStatus(listing_status);

            if (listing_status === 'ACTIVE') {
    //            setIsChecking(false); // Stop the loading spinner when the status is ACTIVE
            }
        } catch (error) {
            console.error('Error fetching listing status:', error);
        } finally {
   //         setIsChecking(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setListingDetails(prevDetails => ({
            ...prevDetails,
            [name]: value,
        }));

        if (name === 'password') {
            const strength = zxcvbn(value).score;
            setPasswordStrength(strength);
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    };

    const handleFinalClose = () => {
        if (confirmPassword === listingDetails.password) {
            onClose();
        } else {
            alert('Passwords do not match. Please try again.');
        }
    };

    const getPasswordFeedback = () => {
        if (passwordStrength < 3) {
            return <p className="password-feedback insecure">Password is insecure. Please use a stronger password.</p>;
        } else {
            return <p className="password-feedback secure">Password is secure.</p>;
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="step-content">
                        <h2 className="step-title">Step 1: Specify Listing Details</h2>
                        <input
                            type="text"
                            name="assetName"
                            placeholder="Asset Name"
                            value={listingDetails.assetName}
                            onChange={handleInputChange}
                        />
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={listingDetails.description}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="unitPrice"
                            placeholder="Unit Price ($EVR)"
                            value={listingDetails.unitPrice}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="quantity"
                            placeholder="Quantity"
                            value={listingDetails.quantity}
                            onChange={handleInputChange}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter a Secure Password"
                            value={listingDetails.password}
                            onChange={handleInputChange}
                        />
                        {getPasswordFeedback()}
                        <input
                            type="text"
                            name="payoutAddress"
                            placeholder="Payout Address"
                            value={listingDetails.payoutAddress}
                            onChange={handleInputChange}
                        />
                        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
                        <button className="next-button" onClick={handleNextStep} disabled={isSubmitting || passwordStrength < 3 || listingDetails.payoutAddress.length !== 34 || listingDetails.payoutAddress[0].toUpperCase() !== "E"}>
                            {isSubmitting ? 'Submitting...' : 'Next'}
                        </button>
                    </div>
                );
            case 2:
                return (
                    <div className="step-content">
                        <h2 className="step-title">Step 2: Send Assets to Address</h2>
                        <p>{listingResponse?.message}</p>
                        <p><strong>Listing Address:</strong> {listingResponse?.listing_address}</p>
                        {listingResponse?.listing_address && (
                            <QRCode
                                value={listingResponse.listing_address}
                                size={128}
                                fgColor="#000000"
                                bgColor="#ffffff"
                            />
                        )}
                        <p><strong>Listing ID:</strong> {listingResponse?.listing_id}</p>
                        <p><strong>Status:</strong> {orderStatus || 'PENDING'}</p>
                        <div className="status-container">
                            {orderStatus === 'ACTIVE' ? (
                                <>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                    />
                                    <div className="checkmark" onClick={handleFinalClose}>&#10004;</div> {/* Clickable Green checkmark */}
                                </>
                            ) : (
                                <div className="loading-spinner"></div> // Loading spinner
                            )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="create-listing-popup">
            <div className="create-listing-content">
                <div className="close-button" onClick={onClose}>✕</div>
                {renderStepContent()}
            </div>
        </div>
    );
};

export default CreateListing;
