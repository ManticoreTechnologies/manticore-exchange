import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from '@/images/Placeholder.webp';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from './EditProfileModal';
import AssetsCarousel from './AssetsCarousel';
import { FaEdit, FaHistory, FaSignOutAlt, FaCopy, FaStar, FaExclamationCircle, FaTrophy, FaMedal, FaChartLine } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

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
    status: 'active' | 'offline';
    favorite_assets: string[];
    achievements?: Achievement[];
    stats?: TradingStats;
    memberSince?: string;
}

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, userAddress, token, isLoading: authLoading, logout } = useAuth();
    const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
    const [balances, setBalances] = useState<Record<string, string> | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(logo);
    const [assetInfo, setAssetInfo] = useState<Record<string, Asset>>({});
    const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [stats, setStats] = useState<TradingStats | null>(null);

    const API_BASE = import.meta.env.VITE_API_BASE || 'http://10.0.0.2:8000';

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/signin', { replace: true });
        }
    }, [authLoading, isAuthenticated, navigate]);

    const fetchProfileData = async () => {
        if (!token) return;
        
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await axios.get(`${API_BASE}/profile`, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Cache-Control': 'no-cache'
                }
            });
            
            const profileData = response.data;
            setAccountInfo(profileData);
            setBalances(profileData.balances);
            setAchievements(profileData.achievements || []);
            setStats(profileData.stats || null);
            
            if (profileData.profile_ipfs) {
                setImageUrl(`https://rose-decent-prawn-420.mypinata.cloud/ipfs/${profileData.profile_ipfs}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO`);
            }
        } catch (error: any) {
            console.error('Error fetching profile:', error);
            const errorMessage = error.response?.data?.detail || 'Failed to load profile data';
            setError(errorMessage);
            
            if (error.response?.status === 401) {
                await logout();
                navigate('/signin', { replace: true });
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated && token && !authLoading) {
            fetchProfileData();
        }
    }, [isAuthenticated, token, authLoading]);

    const handleSave = async (updatedInfo: Partial<AccountInfo>) => {
        try {
            const response = await axios.patch(`${API_BASE}/profile`, updatedInfo, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setAccountInfo(prev => prev ? { ...prev, ...response.data } : null);
            
            if (response.data.profile_ipfs) {
                setImageUrl(`https://ipfs.io/ipfs/${response.data.profile_ipfs}`);
            }
            
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to update profile');
        }
    };

    const handleImageUpload = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(`${API_BASE}/profile/image`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.ipfs_hash) {
                await handleSave({ profile_ipfs: response.data.ipfs_hash });
                setImageUrl(`https://ipfs.io/ipfs/${response.data.ipfs_hash}`);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Failed to upload image');
        }
    };

    const handleAddToFavorites = async (asset: string) => {
        try {
            await axios.post(`${API_BASE}/profile/favorites`, 
                { asset_name: asset },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            setAccountInfo(prev => prev ? {
                ...prev,
                favorite_assets: [...prev.favorite_assets, asset]
            } : null);
        } catch (error) {
            console.error('Error adding favorite:', error);
            setError('Failed to add favorite');
        }
    };

    const handleRemoveFavorite = async (asset: string) => {
        try {
            await axios.delete(`${API_BASE}/profile/favorites/${asset}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAccountInfo(prev => prev ? {
                ...prev,
                favorite_assets: prev.favorite_assets.filter(a => a !== asset)
            } : null);
        } catch (error) {
            console.error('Error removing favorite:', error);
            setError('Failed to remove favorite');
        }
    };

    const handleImageClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                handleImageUpload(file);
            }
        };
        input.click();
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
            navigate('/signin', { replace: true });
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

    if (authLoading) {
        return (
            <div className="tradex-profile__loading">
                <div className="tradex-profile__spinner"></div>
                <p>Checking authentication...</p>
            </div>
        );
    }

    if (!isAuthenticated || !token) {
        return null;
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
                    <img 
                        src={imageUrl || ''} 
                        alt="Profile" 
                        className="tradex-profile__image"
                        onClick={handleImageClick}
                    />
                    <button 
                        className="tradex-profile__image-edit" 
                        onClick={handleImageClick}
                    >
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
                            accountInfo?.status !== 'active' ? 'tradex-profile__status-indicator--offline' : ''
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
                            onClick={fetchProfileData}
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










