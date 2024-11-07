// This is the profile page for a user
// It shows the user's profile information and their trading activity
// It will use the websocket to get the user's account information
// We shall sendmessage("get_account_info") to the websocket to get the user's account information
// The response will be a "account_info data"

import React, { useEffect, useState } from 'react';
import useWebSocket from '../../../hooks/useWebSocket';
import logo from '../../../images/Placeholder.webp';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import UnAuthenticated from '../UnAuthenticated/UnAuthenticated';

const Profile: React.FC = () => {
    const [accountInfo, setAccountInfo] = useState<any>(null);
    const { sendMessage, message, isConnected, isAuthenticated } = useWebSocket("ws://localhost:8765");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (message) {
            console.log(message);
            if (message.startsWith('account_info')) {
                const jsonString = message.replace('account_info ', '').replace(/'/g, '"');
                const accountInfo = JSON.parse(jsonString);
                const imageUrl = accountInfo.profile_ipfs ? 
                `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${accountInfo.profile_ipfs}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO` : 
                logo;
                setImageUrl(imageUrl);
                setAccountInfo(accountInfo);
            }
        }
    }, [message]);

    useEffect(() => {
        if (isConnected && isAuthenticated) {
            sendMessage("get_account_info");
        }
    }, [isConnected, isAuthenticated]);

    return (
        <div className="profile-page">
            {!isAuthenticated ? (
                <UnAuthenticated />
            ) : (
                <>
                    <div className="profile-header">
                        <img src={imageUrl} alt="Profile" className="profile-image" />
                        <h1>User Profile</h1>
                    </div>
                    <div className="profile-info">
                        <div><strong>Address:</strong> {accountInfo?.address}</div>
                        <div><strong>Birthday:</strong> {accountInfo?.created}</div>
                        {/* Placeholder for additional profile information */}
                        <div><strong>Trading Volume:</strong> [Placeholder]</div>
                        <div><strong>Account Status:</strong> [Placeholder]</div>
                    </div>
                    <div className="profile-actions">
                        <button onClick={() => alert('Edit Profile clicked')}>Edit Profile</button>
                        <button onClick={() => alert('View Trading History clicked')}>View Trading History</button>
                        <button onClick={() => alert('Logout clicked')}>Logout</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Profile;