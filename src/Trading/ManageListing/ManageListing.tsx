import React, { useState } from 'react';
import axios from 'axios';
import { FiTool } from 'react-icons/fi';
import './ManageListing.css';

const ManageListing: React.FC = () => {
    const [isManagingListing, setIsManagingListing] = useState<boolean>(false); 
    const [isClosing, setIsClosing] = useState<boolean>(false);
    const [listingId, setListingId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>(''); 
    const [listingData, setListingData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null); 
    const [showCancelConfirmation, setShowCancelConfirmation] = useState<boolean>(false); 

    const trading_api_host = 'localhost';//'api.manticore.exchange';
    const trading_api_port = 668;
    const trading_api_url = `https://${trading_api_host}:${trading_api_port}`;
    const handleFetchListing = async () => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const response = await axios.post(`${trading_api_url}/manage`, {
                listing_id: listingId,
                password,
                action: 'fetch',
            });
            const fetchedListingData = response.data;

            // Convert unit price from satoshis to EVR for display
            fetchedListingData.unit_price = (fetchedListingData.unit_price / 100000000).toFixed(8);

            setListingData(fetchedListingData);
        } catch (error: any) {
            console.error('Error fetching listing:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Failed to fetch listing.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateListing = async () => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            // Convert the unit price from EVR back to satoshis before sending
            const unitPriceInSatoshis = Math.floor(Number(listingData.unit_price) * 100000000);

            const response = await axios.post(`${trading_api_url}/manage`, {
                listing_id: listingId,
                password,
                action: 'update',
                unit_price: unitPriceInSatoshis, 
                description: listingData.description,
            });
            setSuccessMessage(response.data.message);
        } catch (error: any) {
            console.error('Error updating listing:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Failed to update listing.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelListing = async () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match. Please confirm your password.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const response = await axios.post(`${trading_api_url}manage`, {
                listing_id: listingId,
                password,
                action: 'cancel',
            });
            setSuccessMessage(response.data.message);
            setShowCancelConfirmation(false); 
            setListingData(null); 
        } catch (error: any) {
            console.error('Error canceling listing:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Failed to cancel listing.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefundSurplus = async () => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const response = await axios.post(`${trading_api_url}/manage`, {
                listing_id: listingId,
                password,
                action: 'refund',
            });
            setSuccessMessage(`Surplus refunded successfully! TXID: ${response.data.refund_txid}`);
        } catch (error: any) {
            console.error('Error refunding surplus:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Failed to refund surplus.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setListingData((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleOpenPopup = () => {
        setIsClosing(false);
        setIsManagingListing(true);
    };

    const handleClosePopup = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsManagingListing(false);
            setShowCancelConfirmation(false); 
            setError(null); 
            setSuccessMessage(null); 
        }, 300); 
    };

    const openCancelConfirmation = () => {
        setShowCancelConfirmation(true);
    };

    return (
        <div>
            <button className="manage-listing-button" onClick={handleOpenPopup}>
                <FiTool size={20} />
            </button>
            {isManagingListing && (
                <div className={`manage-listing-popup ${isClosing ? 'closing' : ''}`}>
                    <div className="manage-listing-content">
                        <button className="close-button" onClick={handleClosePopup}>✕</button>
                        {listingData ? (
                            <div>
                                <h2>Manage Listing</h2>
                                <label htmlFor="unit_price">Unit Price</label>
                                <input
                                    id="unit_price"
                                    type="text"
                                    name="unit_price"
                                    placeholder="Update Unit Price"
                                    value={listingData.unit_price}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="Update Description"
                                    value={listingData.description}
                                    onChange={handleInputChange}
                                />
                                <button onClick={handleUpdateListing} disabled={isLoading}>
                                    {isLoading ? 'Updating...' : 'Update Listing'}
                                </button>
                                <button onClick={openCancelConfirmation} className="cancel-button" disabled={isLoading}>
                                    {isLoading ? 'Canceling...' : 'Cancel Listing'}
                                </button>
                                <button onClick={handleRefundSurplus} className="refund-button" disabled={isLoading}>
                                    {isLoading ? 'Refunding...' : 'Refund Assets'}
                                </button>
                                <div className="listing-address">
                                    <h3>Refill Address</h3>
                                    <p>{listingData.listing_address}</p>
                                </div>
                                {successMessage && <p className="success-message">{successMessage}</p>}
                                {error && <p className="error-message">{error}</p>}
                            </div>
                        ) : (
                            <div>
                                <h2>Enter Listing ID and Password</h2>
                                <label htmlFor="listingId">Listing ID</label>
                                <input
                                    id="listingId"
                                    type="text"
                                    name="listingId"
                                    placeholder="Listing ID"
                                    value={listingId}
                                    onChange={(e) => setListingId(e.target.value)}
                                />
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button onClick={handleFetchListing} disabled={isLoading}>
                                    {isLoading ? 'Loading...' : 'Fetch Listing'}
                                </button>
                                {successMessage && <p className="success-message">{successMessage}</p>}
                                {error && <p className="error-message">{error}</p>}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showCancelConfirmation && (
                <div className={`manage-listing-popup ${isClosing ? 'closing' : ''}`}>
                    <div className="manage-listing-content">
                        <h2>Confirm Cancelation</h2>
                        <p>All assets will be refunded to the payout address. Please confirm your password to proceed.</p>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button onClick={handleCancelListing} disabled={isLoading}>
                            {isLoading ? 'Canceling...' : 'Confirm Cancelation'}
                        </button>
                        <button onClick={() => setShowCancelConfirmation(false)} className="cancel-button">
                            Back
                        </button>
                        {successMessage && <p className="success-message">{successMessage}</p>}
                        {error && <p className="error-message">{error}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageListing;
