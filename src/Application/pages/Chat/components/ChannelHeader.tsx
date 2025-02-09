import React, { useState, useEffect } from 'react';
import { ChatChannel, UserPresence, chatService } from '../../../services/ChatService';

interface ChannelHeaderProps {
    channel: ChatChannel;
    userAddress: string;
}

const ChannelHeader: React.FC<ChannelHeaderProps> = ({ channel, userAddress }) => {
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [showParticipants, setShowParticipants] = useState(false);

    useEffect(() => {
        const fetchOnlineUsers = async () => {
            try {
                const users = await chatService.getChannelPresence(channel.name);
                setOnlineUsers(users);
            } catch (error) {
                console.error('Failed to fetch online users:', error);
            }
        };

        fetchOnlineUsers();
        const interval = setInterval(fetchOnlineUsers, 30000); // Refresh every 30 seconds

        return () => clearInterval(interval);
    }, [channel.name]);

    const formatParticipants = () => {
        if (!onlineUsers.length) return 'No users online';
        return `${onlineUsers.length} online`;
    };

    return (
        <div className="chat-header">
            <div className="chat-header-main">
                <div className="chat-header-title">
                    <span className="channel-icon">
                        {channel.type === 'global' ? '🌐' : 
                         channel.type === 'asset' ? '🪙' : '👤'}
                    </span>
                    <h2>{channel.name}</h2>
                </div>
                
                {channel.description && (
                    <div className="channel-description">
                        {channel.description}
                    </div>
                )}
            </div>

            <div className="chat-header-info">
                <div 
                    className="participants-info"
                    onClick={() => setShowParticipants(!showParticipants)}
                >
                    <span className="online-count">
                        {formatParticipants()}
                    </span>
                    {showParticipants && onlineUsers.length > 0 && (
                        <div className="participants-dropdown">
                            {onlineUsers.map(address => (
                                <div key={address} className="participant-item">
                                    {address === userAddress ? 'You' : 
                                     `${address.slice(0, 6)}...${address.slice(-4)}`}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="user-info">
                    Connected: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                </div>
            </div>
        </div>
    );
};

export default ChannelHeader; 