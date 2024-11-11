import React, { useEffect, useState } from 'react';
import useWebSocket from '../../../hooks/useWebSocket';
import logo from '../../../images/Placeholder.webp'; // Default profile image
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import UnAuthenticated from '../UnAuthenticated/UnAuthenticated';
import EditProfileModal from './EditProfileModal';
import AssetsCarousel from './AssetsCarousel';

const Profile: React.FC = () => {
    const [accountInfo, setAccountInfo] = useState<any>(null);
    const [balances, setBalances] = useState<any>(null); // State to store balances (all assets)
    const [isEditing, setIsEditing] = useState(false);
    const { sendMessage, message, isConnected, isAuthenticated } = useWebSocket("ws://localhost:8765");
    const [imageUrl, setImageUrl] = useState<string | null>(logo); // Set default image initially
    const navigate = useNavigate();

    // Handle received messages from WebSocket
    useEffect(() => {
        if (message) {
            console.log("Received message:", message);

            if (message.startsWith('account_info')) {
                try {
                    const jsonString = message.replace('account_info ', '').replace(/'/g, '"');
                    const accountInfo = JSON.parse(jsonString);
                    
                    const profileImageUrl = accountInfo.profile_ipfs 
                        ? `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${accountInfo.profile_ipfs}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO` 
                        : logo;
                    
                    setImageUrl(profileImageUrl);
                    setAccountInfo(accountInfo);
                } catch (error) {
                    console.error("Failed to parse account info JSON:", error);
                }
            }

            else if (message.startsWith('all_balances')) {
                const balanceString = message.replace('all_balances ', '').trim()
                    .replace(/'/g, '"')  // Replace single quotes with double quotes
                    .replace(/([{,]\s*)(\w+):/g, '$1"$2":');  // Add quotes around keys
                try {
                    const balancesData = JSON.parse(balanceString);
                    setBalances(balancesData);
                } catch (error) {
                    console.error("Failed to parse balances JSON:", error);
                    console.error("Received balances data:", balanceString);
                }
            }

            else if (message.startsWith('favorite_added')) {
                const asset = message.replace('favorite_added ', '').trim();
                setAccountInfo((prevInfo) => ({
                    ...prevInfo,
                    favorite_assets: [...(prevInfo.favorite_assets || []), asset],
                }));
            }
        }
    }, [message]);

    // Request account info and balances when connected and authenticated
    useEffect(() => {
        if (isConnected && isAuthenticated) {
            sendMessage("get_account_info");
            sendMessage("get_all_balances"); // Request balances data (all assets)
        }
    }, [isConnected, isAuthenticated]);

    const handleSave = (updatedInfo) => {
        setAccountInfo({ ...accountInfo, ...updatedInfo });
        const updatedImageUrl = updatedInfo.profile_ipfs 
            ? `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${updatedInfo.profile_ipfs}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO` 
            : logo;
        setImageUrl(updatedImageUrl);
    
        // Send updated profile data to the backend
        if (updatedInfo.friendlyUsername) {
            console.log(`Sending friendly name update: ${updatedInfo.friendlyUsername}`);
            sendMessage(`set_friendly_name ${updatedInfo.friendlyUsername}`);
        }
        if (updatedInfo.bio) {
            console.log(`Sending bio update: ${updatedInfo.bio}`);
            sendMessage(`set_bio ${updatedInfo.bio}`);
        }
        if (updatedInfo.profile_ipfs) {
            console.log(`Sending profile IPFS hash update: ${updatedInfo.profile_ipfs}`);
            sendMessage(`set_profile_ipfs ${updatedInfo.profile_ipfs}`);
        }
    };
    
    const handleAddToFavorites = (asset: string) => {
        console.log(`Adding asset to favorites: ${asset}`);
        sendMessage(`favorite_market ${asset}`);
    };

    return (
        <div className="profile-page">
            {!isAuthenticated ? (
                <UnAuthenticated />
            ) : (
                <>
                    <div className="profile-header">
                        <img src={imageUrl} alt="Profile" className="profile-image" />
                        <h1>{accountInfo?.friendly_name || 'User Profile'}</h1>
                    </div>
                    <div className="profile-info">
                        <div><strong>Username:</strong> {accountInfo?.friendly_name || 'Username not set'}</div>
                        <div><strong>Address:</strong> {accountInfo?.address}</div>
                        <div><strong>Birthday:</strong> {accountInfo?.created}</div>
                        <div><strong>Bio:</strong> {accountInfo?.bio || 'Bio not provided'}</div>
                        <div><strong>Trading Volume:</strong> {accountInfo?.trading_volume || '0'}</div>
                        <div><strong>Status:</strong> {accountInfo?.status || 'offline'}</div>
                        <div><strong>Favorite Markets:</strong> {accountInfo?.favorite_markets || 'No favorite markets'}</div>
                    </div>

                    {/* Featured Assets Carousel */}
                    <AssetsCarousel featuredAssets={accountInfo?.favorite_assets || []} />

                    {/* All Assets List and Balances */}
                    <div className="all-assets">
                        <h2>All Assets and Balances</h2>
                        {balances ? (
                            <ul>
                                {Object.entries(balances).map(([asset, balance], index) => (
                                    <li key={index} className="asset-item">
                                        <span><strong>{asset.toUpperCase()}:</strong> {balance}</span>
                                        <button 
                                            className="add-favorite-button" 
                                            onClick={() => handleAddToFavorites(asset)}
                                        >
                                            Add to Favorites
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Loading assets and balances...</p>
                        )}
                    </div>

                    <div className="profile-actions">
                        <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                        <button onClick={() => alert('View Trading History clicked')}>View Trading History</button>
                        <button onClick={() => alert('Logout clicked')}>Logout</button>
                    </div>

                    {isEditing && (
                        <EditProfileModal
                            accountInfo={accountInfo}
                            onSave={handleSave}
                            onClose={() => setIsEditing(false)}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Profile;







