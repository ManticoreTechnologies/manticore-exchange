import React, { useEffect, useState } from 'react';
import useWebSocket from '@/hooks/useWebSocket';
import logo from '@/images/Placeholder.webp';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import UnAuthenticated from '../../components/UnAuthenticated/UnAuthenticated';
import EditProfileModal from './EditProfileModal';
import AssetsCarousel from './AssetsCarousel';
import Debug from '@/App/components/Debug/Debug';
import { FaEdit, FaHistory, FaSignOutAlt, FaCopy, FaStar } from 'react-icons/fa';
import Cookies from 'js-cookie';

const wsUrl = `${process.env.VITE_TRADING_WS_HOST === 'localhost' ? 'ws' : 'wss'}://${process.env.VITE_TRADING_WS_HOST}:${process.env.VITE_TRADING_WS_PORT}`;

interface Asset {
    name: string;
    amount: number;
    units: number;
    reissuable: number;
    has_ipfs: number;
    ipfs_hash?: string;
}

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [accountInfo, setAccountInfo] = useState<any>(null);
    const [balances, setBalances] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const { sendMessage, message, isConnected, isAuthenticated } = useWebSocket(wsUrl);
    const [imageUrl, setImageUrl] = useState<string | null>(logo);
    const [assetInfo, setAssetInfo] = useState<Record<string, Asset>>({});

    // Function to fetch asset info in batch
    const fetchAssetInfo = (assets: string[]) => {
        if (assets.length > 0) {
            const assetsString = assets.join(',');
            sendMessage(`get_asset_info ${assetsString}`);
        }
    };

    // Effect to fetch info for favorite assets
    useEffect(() => {
        if (accountInfo?.favorite_assets) {
            const favorites = Array.isArray(accountInfo.favorite_assets) 
                ? accountInfo.favorite_assets 
                : JSON.parse(accountInfo.favorite_assets);
            
            fetchAssetInfo(favorites);
        }
    }, [accountInfo?.favorite_assets]);

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
                    .replace(/'/g, '"')  
                    .replace(/([{,]\s*)(\w+):/g, '$1"$2":');  
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
                setAccountInfo((prevInfo: any) => ({
                    ...prevInfo,
                    favorite_assets: [...(prevInfo.favorite_assets || []), asset],
                }));
            }
            else if (message.startsWith('asset_info')) {
                try {
                    const infoString = message.replace('asset_info ', '').trim()
                        .replace(/'/g, '"')
                        .replace(/([{,]\s*)(\w+):/g, '$1"$2":');
                    const info = JSON.parse(infoString);
                    setAssetInfo(prev => ({
                        ...prev,
                        ...info
                    }));
                } catch (error) {
                    console.error("Failed to parse asset info:", error);
                }
            }
        }
    }, [message, isConnected]);

    // Request account info when connected and authenticated
    useEffect(() => {
        if (isConnected && isAuthenticated) {
            sendMessage("get_account_info");
        }
    }, [isConnected, isAuthenticated]);

    const handleSave = (updatedInfo: any) => {
        setAccountInfo({ ...accountInfo, ...updatedInfo });
        const updatedImageUrl = updatedInfo.profile_ipfs 
            ? `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${updatedInfo.profile_ipfs}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO` 
            : logo;
        setImageUrl(updatedImageUrl);
    
        if (updatedInfo.friendlyUsername) {
            sendMessage(`set_friendly_name ${updatedInfo.friendlyUsername}`);
        }
        if (updatedInfo.bio) {
            sendMessage(`set_bio "${updatedInfo.bio}"`);
        }
        if (updatedInfo.profile_ipfs) {
            sendMessage(`set_profile_ipfs ${updatedInfo.profile_ipfs}`);
        }
    };
    
    const handleAddToFavorites = (asset: string) => {
        sendMessage(`favorite_market ${asset}`);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('Copied to clipboard');
            })
            .catch(err => {
                console.error('Failed to copy:', err);
            });
    };

    const handleLogout = () => {
        // Remove authentication cookies
        Cookies.remove('userSession', { sameSite: 'None', secure: true });
        Cookies.remove('address', { sameSite: 'None', secure: true });
        
        // Refresh the page to reset the application state
        window.location.reload();
    };

    // Function to get asset info for carousel
    const getAssetInfo = (asset: string): Asset => {
        return assetInfo[asset.toUpperCase()] || {
            name: asset.toUpperCase(),
            amount: 0,
            units: 8,
            reissuable: 0,
            has_ipfs: 0
        };
    };

    return (
        <>
            {!isAuthenticated ? (
                <UnAuthenticated />
            ) : (
                <div className="tradex-profile">
                    <Debug sections={[
                        { title: 'Asset Info', data: assetInfo }
                    ]} />
                    
                    <div className="tradex-profile__header">
                        <div className="tradex-profile__image-container">
                            <img src={imageUrl || ''} alt="Profile" className="tradex-profile__image" />
                            <button className="tradex-profile__image-edit" onClick={() => setIsEditing(true)}>
                                <FaEdit />
                            </button>
                        </div>

                        <div className="tradex-profile__header-info">
                            <h1 className="tradex-profile__name">{accountInfo?.friendly_name || 'User Profile'}</h1>
                            <div 
                                className="tradex-profile__address" 
                                onClick={() => copyToClipboard(accountInfo?.address)}
                            >
                                {accountInfo?.address}
                                <FaCopy />
                            </div>
                            <div className="tradex-profile__status">
                                <div className={`tradex-profile__status-indicator ${accountInfo?.status !== 'online' ? 'tradex-profile__status-indicator--offline' : ''}`} />
                                {accountInfo?.status || 'offline'}
                            </div>
                        </div>

                        <div className="tradex-profile__actions">
                            <button className="tradex-profile__action-button" onClick={() => setIsEditing(true)}>
                                <FaEdit /> Edit Profile
                            </button>
                            <button className="tradex-profile__action-button">
                                <FaHistory /> History
                            </button>
                            <button className="tradex-profile__action-button" onClick={handleLogout}>
                                <FaSignOutAlt /> Logout
                            </button>
                        </div>
                    </div>

                    <div className="tradex-profile__content">
                        <div className="tradex-profile__section">
                            <div className="tradex-profile__section-header">
                                <h2 className="tradex-profile__section-title">Assets & Balances</h2>
                            </div>
                            <div className="tradex-profile__assets-grid">
                                {balances ? (
                                    Object.entries(balances).map(([asset, balance]: any, index) => {
                                        const info = assetInfo[asset.toUpperCase()];
                                        return (
                                            <div key={index} className="tradex-profile__asset-card">
                                                <div className="tradex-profile__asset-card-header">
                                                    <span className="tradex-profile__asset-name">{asset.toUpperCase()}</span>
                                                    <span className="tradex-profile__asset-balance">{balance}</span>
                                                </div>
                                                <div className="tradex-profile__asset-description">
                                                    {info ? `Supply: ${info.amount / Math.pow(10, info.units)}` : 'Loading...'}
                                                </div>
                                                <div className="tradex-profile__asset-actions">
                                                    <button 
                                                        className="tradex-profile__asset-button"
                                                        onClick={() => navigate(`/trade/${asset}`)}
                                                    >
                                                        Trade
                                                    </button>
                                                    <button 
                                                        className="tradex-profile__asset-button tradex-profile__asset-button--favorite"
                                                        onClick={() => handleAddToFavorites(asset)}
                                                    >
                                                        <FaStar />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="tradex-profile__coming-soon">
                                        <h3>Coming Soon</h3>
                                        <p>While you enjoy our accountless trading platform, we're building additional account-based features for enhanced trading capabilities.</p>
                                        <button 
                                            className="tradex-profile__action-button tradex-profile__action-button--primary"
                                            onClick={() => navigate('/trade')}
                                        >
                                            Trade Now
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="tradex-profile__section">
                            <div className="tradex-profile__section-header">
                                <h2 className="tradex-profile__section-title">Favorite Assets</h2>
                            </div>
                            <AssetsCarousel 
                                favoriteAssets={
                                    accountInfo?.favorite_assets 
                                        ? Array.isArray(accountInfo.favorite_assets)
                                            ? accountInfo.favorite_assets
                                            : JSON.parse(accountInfo.favorite_assets)
                                        : []
                                }
                                getAssetInfo={getAssetInfo}
                            />
                        </div>
                    </div>

                    {isEditing && (
                        <EditProfileModal
                            accountInfo={accountInfo}
                            onSave={handleSave}
                            onClose={() => setIsEditing(false)}
                        />
                    )}
                </div>
            )}
        </>
    );
};

export default Profile;










