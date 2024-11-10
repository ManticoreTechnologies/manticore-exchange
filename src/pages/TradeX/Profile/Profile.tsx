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

            // Process account info
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

            // Process balances
            else if (message.startsWith('all_balances')) {
                const balanceString = message.replace('all_balances ', '').trim()
                    .replace(/'/g, '"'); // Convert single quotes to double quotes
                try {
                    // Ensure the balances are valid JSON
                    const balancesData = JSON.parse(balanceString);
                    setBalances(balancesData);
                } catch (error) {
                    console.error("Failed to parse balances JSON:", error);
                    console.error("Received balances data:", balanceString);
                }
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
            ? `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${updatedInfo.profile_ipfs}?pinataGatewayToken=YOUR_TOKEN_HERE` 
            : logo;
        setImageUrl(updatedImageUrl);

        // Send updated profile data to the backend
        sendMessage(`update_account_info ${JSON.stringify(updatedInfo)}`);
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
                                    <li key={index}><strong>{asset.toUpperCase()}:</strong> {balance}</li>
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





