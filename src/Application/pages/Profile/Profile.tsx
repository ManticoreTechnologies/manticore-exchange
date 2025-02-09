import React, { useEffect, useState } from 'react';
import useWebSocket from '@/hooks/useWebSocket';
import logo from '@/images/Placeholder.webp';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import UnAuthenticated from '../../components/UnAuthenticated/UnAuthenticated';
import EditProfileModal from './EditProfileModal';
import AssetsCarousel from './AssetsCarousel';
import { FaEdit, FaHistory, FaSignOutAlt, FaCopy, FaStar, FaExclamationCircle, FaTrophy, FaMedal, FaChartLine } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const wsUrl = `${process.env.VITE_TRADING_WS_HOST === 'localhost' ? 'ws' : 'wss'}://${process.env.VITE_TRADING_WS_HOST}:${process.env.VITE_TRADING_WS_PORT}`;

interface Asset {
    name: string;
    amount: number;
    units: number;
    reissuable: number;
    has_ipfs: number;
    ipfs_hash?: string;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    dateEarned: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface TradingStats {
    totalTrades: number;
    successfulTrades: number;
    tradingVolume: string;
    reputation: number;
    level: number;
    experience: number;
    experienceToNextLevel: number;
}

interface AccountInfo {
    address: string;
    friendly_name: string;
    bio?: string;
    profile_ipfs?: string;
    status: 'online' | 'offline';
    favorite_assets: string[];
    achievements?: Achievement[];
    stats?: TradingStats;
    memberSince?: string;
}

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
    const [balances, setBalances] = useState<Record<string, string> | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { sendMessage, message, isConnected } = useWebSocket(wsUrl);
    const [imageUrl, setImageUrl] = useState<string | null>(logo);
    const [assetInfo, setAssetInfo] = useState<Record<string, Asset>>({});
    const { isAuthenticated, userAddress, logout } = useAuth();
    const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [stats, setStats] = useState<TradingStats | null>(null);

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
            try {
                if (message.startsWith('account_info')) {
                    const jsonString = message.replace('account_info ', '').replace(/'/g, '"');
                    const accountData = JSON.parse(jsonString);
                    
                    const profileImageUrl = accountData.profile_ipfs 
                        ? `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${accountData.profile_ipfs}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO` 
                        : logo;
                    
                    setImageUrl(profileImageUrl);
                    setAccountInfo(accountData);
                    setIsLoading(false);

                    // Set achievements and stats if available
                    if (accountData.achievements) {
                        setAchievements(accountData.achievements);
                    }
                    if (accountData.stats) {
                        setStats(accountData.stats);
                    }
                }
                else if (message.startsWith('all_balances')) {
                    const balanceString = message.replace('all_balances ', '').trim()
                        .replace(/'/g, '"')
                        .replace(/([{,]\s*)(\w+):/g, '$1"$2":');
                    const balancesData = JSON.parse(balanceString);
                    setBalances(balancesData);
                }
                else if (message.startsWith('favorite_added')) {
                    const asset = message.replace('favorite_added ', '').trim();
                    setAccountInfo(prev => prev ? {
                        ...prev,
                        favorite_assets: [...prev.favorite_assets, asset]
                    } : null);
                }
                else if (message.startsWith('asset_info')) {
                    const infoString = message.replace('asset_info ', '').trim()
                        .replace(/'/g, '"')
                        .replace(/([{,]\s*)(\w+):/g, '$1"$2":');
                    const info = JSON.parse(infoString);
                    setAssetInfo(prev => ({
                        ...prev,
                        ...info
                    }));
                }
            } catch (error) {
                console.error('Error processing WebSocket message:', error);
                setError('Failed to process server response');
            }
        }
    }, [message]);

    // Request account info when connected and authenticated
    useEffect(() => {
        if (isConnected && isAuthenticated) {
            setIsLoading(true);
            setError(null);
            sendMessage("get_account_info");
        }
    }, [isConnected, isAuthenticated]);

    const handleSave = (updatedInfo: Partial<AccountInfo>) => {
        setAccountInfo(prev => prev ? { ...prev, ...updatedInfo } : null);
        
        if (updatedInfo.profile_ipfs) {
            const updatedImageUrl = `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${updatedInfo.profile_ipfs}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO`;
            setImageUrl(updatedImageUrl);
            sendMessage(`set_profile_ipfs ${updatedInfo.profile_ipfs}`);
        }
        
        if (updatedInfo.friendly_name) {
            sendMessage(`set_friendly_name ${updatedInfo.friendly_name}`);
        }
        
        if (updatedInfo.bio) {
            sendMessage(`set_bio "${updatedInfo.bio}"`);
        }
        
        setIsEditing(false);
    };
    
    const handleAddToFavorites = (asset: string) => {
        sendMessage(`favorite_market ${asset}`);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setShowCopiedTooltip(true);
                setTimeout(() => setShowCopiedTooltip(false), 2000);
            })
            .catch(err => {
                console.error('Failed to copy:', err);
                setError('Failed to copy to clipboard');
            });
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/signin');
        } catch (error) {
            console.error('Logout error:', error);
            setError('Failed to logout. Please try again.');
        }
    };

    const getAssetInfo = (asset: string): Asset => {
        return assetInfo[asset.toUpperCase()] || {
            name: asset.toUpperCase(),
            amount: 0,
            units: 8,
            reissuable: 0,
            has_ipfs: 0
        };
    };

    const renderAchievements = () => (
        <div className="tradex-profile__section">
            <div className="tradex-profile__section-header">
                <h2><FaTrophy /> Achievements</h2>
            </div>
            <div className="tradex-profile__achievements-grid">
                {achievements.length > 0 ? (
                    achievements.map((achievement) => (
                        <div key={achievement.id} className={`tradex-profile__achievement-card tradex-profile__achievement-card--${achievement.rarity}`}>
                            <div className="tradex-profile__achievement-icon">
                                <FaMedal />
                            </div>
                            <div className="tradex-profile__achievement-info">
                                <h3>{achievement.title}</h3>
                                <p>{achievement.description}</p>
                                <span className="tradex-profile__achievement-date">
                                    Earned on {new Date(achievement.dateEarned).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="tradex-profile__no-achievements">
                        <p>No achievements yet. Start trading to earn achievements!</p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderExperienceBar = () => {
        if (!stats) return null;
        const progressPercentage = (stats.experience / stats.experienceToNextLevel) * 100;
        
        return (
            <div className="tradex-profile__experience">
                <div className="tradex-profile__level">
                    Level {stats.level}
                </div>
                <div className="tradex-profile__experience-bar">
                    <div 
                        className="tradex-profile__experience-progress"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
                <div className="tradex-profile__experience-text">
                    {stats.experience} / {stats.experienceToNextLevel} XP
                </div>
            </div>
        );
    };

    const renderTradingStats = () => {
        if (!stats) return null;

        return (
            <div className="tradex-profile__section">
                <div className="tradex-profile__section-header">
                    <h2><FaChartLine /> Trading Statistics</h2>
                </div>
                <div className="tradex-profile__stats-grid">
                    <div className="tradex-profile__stat-card">
                        <h3>Total Trades</h3>
                        <p>{stats.totalTrades}</p>
                    </div>
                    <div className="tradex-profile__stat-card">
                        <h3>Success Rate</h3>
                        <p>{((stats.successfulTrades / stats.totalTrades) * 100).toFixed(1)}%</p>
                    </div>
                    <div className="tradex-profile__stat-card">
                        <h3>Volume</h3>
                        <p>{stats.tradingVolume} EVR</p>
                    </div>
                    <div className="tradex-profile__stat-card">
                        <h3>Reputation</h3>
                        <div className="tradex-profile__reputation">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <FaStar 
                                    key={index}
                                    className={index < Math.floor(stats.reputation) ? 'active' : ''}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (!isAuthenticated) {
        return <UnAuthenticated />;
    }

    if (isLoading) {
        return (
            <div className="tradex-profile__loading">
                <div className="tradex-profile__spinner"></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="tradex-profile__error">
                <FaExclamationCircle />
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="tradex-profile">
            <div className="tradex-profile__header">
                <div className="tradex-profile__image-container">
                    <img src={imageUrl || ''} alt="Profile" className="tradex-profile__image" />
                    <button className="tradex-profile__image-edit" onClick={() => setIsEditing(true)}>
                        <FaEdit />
                    </button>
                </div>

                <div className="tradex-profile__header-info">
                    <h1 className="tradex-profile__name">
                        {accountInfo?.friendly_name || 'User Profile'}
                    </h1>
                    <div className="tradex-profile__address-container">
                        <div 
                            className="tradex-profile__address" 
                            onClick={() => copyToClipboard(userAddress || '')}
                        >
                            {userAddress}
                            <FaCopy />
                        </div>
                        {showCopiedTooltip && (
                            <div className="tradex-profile__copied-tooltip">
                                Copied!
                            </div>
                        )}
                    </div>
                    <div className="tradex-profile__status">
                        <div className={`tradex-profile__status-indicator ${
                            accountInfo?.status !== 'online' ? 'tradex-profile__status-indicator--offline' : ''
                        }`} />
                        {accountInfo?.status || 'offline'}
                    </div>
                </div>

                <div className="tradex-profile__actions">
                    <button 
                        className="tradex-profile__action-button" 
                        onClick={() => setIsEditing(true)}
                    >
                        <FaEdit /> Edit Profile
                    </button>
                    <button className="tradex-profile__action-button">
                        <FaHistory /> History
                    </button>
                    <button 
                        className="tradex-profile__action-button tradex-profile__action-button--danger"
                        onClick={handleLogout}
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </div>

            <div className="tradex-profile__content">
                {renderExperienceBar()}
                
                {accountInfo?.bio && (
                    <div className="tradex-profile__bio">
                        <h2>About</h2>
                        <p>{accountInfo.bio}</p>
                        {accountInfo.memberSince && (
                            <p className="tradex-profile__member-since">
                                Member since {new Date(accountInfo.memberSince).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                )}

                {renderTradingStats()}
                {renderAchievements()}

                <div className="tradex-profile__section">
                    <div className="tradex-profile__section-header">
                        <h2>Assets & Balances</h2>
                        <button 
                            className="tradex-profile__refresh-button"
                            onClick={() => sendMessage("get_account_info")}
                        >
                            Refresh
                        </button>
                    </div>
                    <div className="tradex-profile__assets-grid">
                        {balances && Object.entries(balances).length > 0 ? (
                            Object.entries(balances).map(([asset, balance], index) => {
                                const info = assetInfo[asset.toUpperCase()];
                                return (
                                    <div key={index} className="tradex-profile__asset-card">
                                        <div className="tradex-profile__asset-card-header">
                                            <span className="tradex-profile__asset-name">
                                                {asset.toUpperCase()}
                                            </span>
                                            <span className="tradex-profile__asset-balance">
                                                {balance}
                                            </span>
                                        </div>
                                        <div className="tradex-profile__asset-info">
                                            {info && (
                                                <>
                                                    <p>Supply: {info.amount / Math.pow(10, info.units)}</p>
                                                    <p>Reissuable: {info.reissuable ? 'Yes' : 'No'}</p>
                                                </>
                                            )}
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
                            <div className="tradex-profile__no-assets">
                                <h3>No Assets Found</h3>
                                <p>Start trading to build your portfolio.</p>
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
                        <h2>Favorite Assets</h2>
                    </div>
                    <AssetsCarousel 
                        favoriteAssets={accountInfo?.favorite_assets || []}
                        getAssetInfo={getAssetInfo}
                    />
                </div>
            </div>

            {isEditing && accountInfo && (
                <EditProfileModal
                    accountInfo={accountInfo}
                    onSave={handleSave}
                    onClose={() => setIsEditing(false)}
                />
            )}
        </div>
    );
};

export default Profile;










