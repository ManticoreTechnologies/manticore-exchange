import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';
import zxcvbn from 'zxcvbn'; // Library for password strength checking
import './CreateListing.css';
import './NumberInput.css';

interface CreateListingProps {
    onClose: () => void;
    onComplete: () => void;
}

const CreateListing: React.FC<CreateListingProps> = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [listingDetails, setListingDetails] = useState({
        assetName: '',
        description: '',
        unitPrice: '', // EVR as string input
        password: '',
        payoutAddress: '',
    });
    const [tags, setTags] = useState<string[]>([]); // Store tags as an array
    const [tagInput, setTagInput] = useState(''); // For managing tag input
    const [listingResponse, setListingResponse] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderStatus, setOrderStatus] = useState<string | null>(null);
    const [passwordStrength, setPasswordStrength] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [confirmPassword, setConfirmPassword] = useState<string>(''); // New state for confirmation password
    const [confirmPasswordClose, setConfirmPasswordClose] = useState<string>(''); // New state for confirmation password 
    const [confirmPasswordComplete, setConfirmPasswordComplete] = useState<string>(''); // New state for confirmation password
    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false); // For showing the confirmation popup

    const trading_api_host = 'localhost'; //'api.manticore.exchange';
    const trading_api_port = 668;
    const trading_api_url = `http://${trading_api_host}:${trading_api_port}`;

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

            if (confirmPassword !== listingDetails.password) {
                alert('Passwords do not match. Please confirm the password.');
                return;
            }

            setIsSubmitting(true);
            setErrorMessage(null); // Clear any previous error messages

            try {
                // Convert the unit price from EVR to satoshis
                const unitPriceInSatoshis = Math.floor(Number(listingDetails.unitPrice) * 100000000);

                const response = await axios.post(`${trading_api_url}/list`, {
                    name: listingDetails.assetName,
                    description: listingDetails.description,
                    price: unitPriceInSatoshis, // Send the price in satoshis
                    payout_address: listingDetails.payoutAddress,
                    password: listingDetails.password,
                    tags
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
        try {
            const response = await axios.get(`${trading_api_url}/listing/${listingResponse.listing_id}`);
            const { listing_status } = response.data;
            setOrderStatus(listing_status);

            if (listing_status === 'ACTIVE') {
                // Stop the loading spinner when the status is ACTIVE
            }
        } catch (error) {
            console.error('Error fetching listing status:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'unitPrice') {
            // Allow only numbers and up to one decimal point
            if (/^\d*\.?\d*$/.test(value)) {
                setListingDetails(prevDetails => ({
                    ...prevDetails,
                    [name]: value,
                }));
            }
        } else if (name === 'assetName') {
            // Allow lowercase but convert them to uppercase and ensure only A-Z 0-9 . _
            const uppercasedValue = value.toUpperCase();
            if (/^[A-Z0-9._]*$/.test(uppercasedValue)) {
                setListingDetails(prevDetails => ({
                    ...prevDetails,
                    [name]: uppercasedValue, // Automatically convert to uppercase
                }));
            }
        } else {
            setListingDetails(prevDetails => ({
                ...prevDetails,
                [name]: value,
            }));
        }

        if (name === 'password') {
            const strength = zxcvbn(value).score;
            setPasswordStrength(strength);
        }
    };

    // Handle tag input and prevent spaces
    const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (!value.includes(' ')) {
            setTagInput(value); // Prevent space characters
        }
    };

    // Handle tag addition when the user presses 'Enter'
    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim() !== '' && tags.length < 5) {
            setTags([...tags, tagInput.trim()]);
            setTagInput(''); // Clear the input after adding
            e.preventDefault(); // Prevent form submission
        }
    };

    // Remove tag when clicked
    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove)); // Filter out the clicked tag
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    };

    const handleConfirmPasswordCloseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPasswordClose(e.target.value);
    };
    const handleConfirmPasswordCompleteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPasswordComplete(e.target.value);
    };
    const handleFinalClose = () => {
        setShowConfirmationPopup(true); // Show confirmation popup on close attempt
    };
    const handleCompleteClose = () => {
        if (confirmPasswordComplete === listingDetails.password) {
            onClose(); // Close if password matches
        } else {
            alert('Password does not match. Please try again.');
        }
    };
    const handlePopupConfirm = () => {
        if (confirmPasswordClose === listingDetails.password) {
            onClose(); // Close if password matches
        } else {
            alert('Password does not match. Please try again.');
        }
    };

    const handlePopupCancel = async() => {
        // Close the confirmation popup and cancel the listing process
        const response = await axios.get(`${trading_api_url}/delete/${listingResponse.listing_id}`);
        alert(response);
        onClose();
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
                            name="tags"
                            placeholder="Enter a tag and press Enter"
                            value={tagInput}
                            onChange={handleTagInputChange}
                            onKeyDown={handleTagKeyDown}
                        />
                        <div className="tags-container">
                            {tags.map((tag, index) => (
                                <span key={index} className="tag" onClick={() => handleRemoveTag(tag)}>
                                    {tag} &#10005; {/* 'X' to remove */}
                                </span>
                            ))}
                        </div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter a Secure Password"
                            value={listingDetails.password}
                            onChange={handleInputChange}
                        />
                        {getPasswordFeedback()}
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                        />
                        {confirmPassword !== listingDetails.password && confirmPassword.length > 0 && <p className="password-feedback" style={{ color: 'red' }}>Passwords don't match</p>}
                        <input
                            type="text"
                            name="payoutAddress"
                            placeholder="Payout Address"
                            value={listingDetails.payoutAddress}
                            onChange={handleInputChange}
                        />
                        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
                        <button 
                            className="next-button" 
                            onClick={handleNextStep} 
                            disabled={isSubmitting || passwordStrength < 3 || confirmPassword !== listingDetails.password || listingDetails.payoutAddress.length !== 34 || listingDetails.payoutAddress[0].toUpperCase() !== "E"}
                        >
                            {isSubmitting ? 'Submitting...' : 'Next'}
                        </button>
                    </div>
                );
            case 2:
                return (
                    <div className="step-content step-qr">
                        <h2 className="step-title">Step 2: Send Assets to Address</h2>
                        <p className="warning-message"><strong>Important:</strong> Please save your <strong>Listing ID</strong> and <strong>Password</strong>. You will need them to manage this listing. Failure to do so will result in losing access to the listing.</p>
                        <p className="listing-message">{listingResponse?.message}</p>
                        <div className="qr-code-container">
                            <strong>Listing Address:</strong>
                            <p className="listing-address">{listingResponse?.listing_address}</p>
                            {listingResponse?.listing_address && (
                                <QRCode
                                    value={listingResponse.listing_address}
                                    size={160}
                                    fgColor="#000000"
                                    bgColor="#ffffff"
                                />
                            )}
                        </div>
                        <p><strong>Listing ID:</strong> {listingResponse?.listing_id}</p>
                        <p className="listing-status">
                            <strong>Status:</strong> {orderStatus || 'PENDING'}
                        </p>
                        <div className="status-container">
                            {orderStatus === 'ACTIVE' ? (
                                <>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        value={confirmPasswordComplete}
                                        onChange={handleConfirmPasswordCompleteChange}
                                    />
                                    <div className="checkmark" onClick={handleCompleteClose}>&#10004;</div> {/* Clickable Green checkmark */}
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
                <div className="close-button-create" onClick={handleFinalClose}>✕</div>
                {renderStepContent()}

                {/* Confirmation Popup */}
                {showConfirmationPopup && (
                    <div className="confirmation-popup">
                        <div className="popup-content">
                            <h3>Confirm Close</h3>
                            <p>Are you sure you want to close? You will lose access to the listing if you haven't saved the password and listing ID.</p>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Enter Password to Confirm"
                                value={confirmPasswordClose}
                                onChange={handleConfirmPasswordCloseChange}
                            />
                            <button className="confirm-button" onClick={handlePopupConfirm}>Confirm</button>
                            <button className="cancel-button" onClick={handlePopupCancel}>Cancel Listing</button>
                            <button className="cancel-button" onClick={() => setShowConfirmationPopup(false)}>Back</button>
                            </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateListing;
