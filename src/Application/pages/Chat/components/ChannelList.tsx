import React, { useState } from 'react';
import { ChatChannel } from '../../../services/ChatService';

interface ChannelListProps {
    channels: ChatChannel[];
    selectedChannel: ChatChannel | null;
    onChannelSelect: (channel: ChatChannel) => void;
    onAddChannel: () => void;
}

const ChannelList: React.FC<ChannelListProps> = ({
    channels,
    selectedChannel,
    onChannelSelect,
    onAddChannel
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredChannels = channels.filter(channel => 
        channel.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedChannels = filteredChannels.reduce((acc, channel) => {
        if (!acc[channel.type]) {
            acc[channel.type] = [];
        }
        acc[channel.type].push(channel);
        return acc;
    }, {} as Record<string, ChatChannel[]>);

    const getChannelIcon = (type: string) => {
        switch (type) {
            case 'global':
                return '🌐';
            case 'asset':
                return '🪙';
            case 'direct':
                return '👤';
            default:
                return '📢';
        }
    };

    const getGroupTitle = (type: string) => {
        switch (type) {
            case 'global':
                return 'Global';
            case 'asset':
                return 'Asset Channels';
            case 'direct':
                return 'Direct Messages';
            default:
                return type.charAt(0).toUpperCase() + type.slice(1);
        }
    };

    return (
        <div className="channels-sidebar">
            <div className="channels-header">
                <h3>Channels</h3>
                <button className="add-channel-btn" onClick={onAddChannel}>+</button>
            </div>

            <div className="channel-search">
                <input
                    type="text"
                    placeholder="Search channels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="channel-search-input"
                />
            </div>

            <div className="channel-list">
                {Object.entries(groupedChannels).map(([type, channels]) => (
                    <div key={type} className="channel-group">
                        <div className="channel-group-header">
                            {getGroupTitle(type)}
                        </div>
                        {channels.map((channel) => (
                            <div
                                key={`${channel.type}-${channel.name}`}
                                className={`channel-item ${selectedChannel?.name === channel.name ? 'active' : ''}`}
                                onClick={() => onChannelSelect(channel)}
                            >
                                <span className="channel-icon">
                                    {getChannelIcon(channel.type)}
                                </span>
                                <span className="channel-name">
                                    {channel.name}
                                    {channel.participants && (
                                        <span className="channel-participants">
                                            {channel.participants}
                                        </span>
                                    )}
                                </span>
                                {channel.unreadCount ? (
                                    <span className="unread-count">{channel.unreadCount}</span>
                                ) : null}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChannelList; 