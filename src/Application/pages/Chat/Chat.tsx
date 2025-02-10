import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { chatService, type ChatMessage, type ChatChannel } from '../../services/ChatService';
import ChannelList from './components/ChannelList';
import MessageItem from './components/MessageItem';
import MessageInput from './components/MessageInput';
import ChannelHeader from './components/ChannelHeader';
import { Navigate, useLocation } from 'react-router-dom';
import './Chat.css';

const Chat: React.FC = () => {
    const { userAddress, isAuthenticated, token } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [channels, setChannels] = useState<ChatChannel[]>([]);
    const [selectedChannel, setSelectedChannel] = useState<ChatChannel | null>(null);
    const [showChannelList, setShowChannelList] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isLoadingChannels, setIsLoadingChannels] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    const scrollToBottom = (smooth = true) => {
        messagesEndRef.current?.scrollIntoView({ 
            behavior: smooth ? "smooth" : "auto" 
        });
    };

    // Load available channels
    useEffect(() => {
        const loadChannels = async () => {
            if (!isAuthenticated) return;
            
            setIsLoadingChannels(true);
            try {
                const [globalChannel, assetChannels] = await Promise.all([
                    { name: 'Global', type: 'global' as const },
                    chatService.getAssetChannels()
                ]);
                
                setChannels([globalChannel, ...assetChannels]);
                
                // Set global channel as default if none selected
                if (!selectedChannel) {
                    setSelectedChannel(globalChannel);
                }
            } catch (error) {
                console.error('Failed to load channels:', error);
            } finally {
                setIsLoadingChannels(false);
            }
        };

        loadChannels();
    }, [isAuthenticated]);

    // Handle incoming messages
    useEffect(() => {
        if (!isAuthenticated || !token) return;

        const unsubscribeMessage = chatService.onMessage((message: ChatMessage) => {
            if (message.channel === selectedChannel?.name || 
                (selectedChannel?.type === 'global' && !message.channel)) {
                setMessages(prev => [...prev, message]);
                scrollToBottom();
            }
        });

        const unsubscribeChannel = chatService.onChannelUpdate((channel: ChatChannel) => {
            setChannels(prev => 
                prev.map(ch => ch.name === channel.name ? { ...ch, ...channel } : ch)
            );
        });

        return () => {
            unsubscribeMessage();
            unsubscribeChannel();
        };
    }, [selectedChannel, isAuthenticated, token]);

    // Load channel messages
    const loadChannelMessages = useCallback(async (channel: ChatChannel) => {
        setIsLoadingMessages(true);
        try {
            let channelMessages: ChatMessage[];
            if (channel.type === 'global') {
                channelMessages = await chatService.getGlobalMessages();
            } else if (channel.type === 'asset') {
                channelMessages = await chatService.getAssetMessages(channel.name);
            } else {
                channelMessages = [];
            }
            setMessages(channelMessages);
            scrollToBottom(false);
        } catch (error) {
            console.error('Failed to load messages:', error);
        } finally {
            setIsLoadingMessages(false);
        }
    }, []);

    // Load messages when channel changes
    useEffect(() => {
        if (selectedChannel && isAuthenticated) {
            loadChannelMessages(selectedChannel);
        }
    }, [selectedChannel, loadChannelMessages, isAuthenticated]);

    const handleSendMessage = async (text: string, ipfsHash?: string) => {
        if (!userAddress || !selectedChannel) return;

        try {
            await chatService.sendMessage({
                text,
                sender: userAddress,
                channel: selectedChannel.name,
                type: selectedChannel.type,
                ipfs_hash: ipfsHash
            });
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleEditMessage = async (messageId: string, newText: string) => {
        try {
            await chatService.editMessage(messageId, newText);
            setMessages(prev => 
                prev.map(msg => 
                    msg.id === messageId 
                        ? { ...msg, text: newText, edited: true }
                        : msg
                )
            );
        } catch (error) {
            console.error('Failed to edit message:', error);
        }
    };

    const handleDeleteMessage = async (messageId: string) => {
        try {
            await chatService.deleteMessage(messageId);
            setMessages(prev => 
                prev.map(msg => 
                    msg.id === messageId 
                        ? { ...msg, deleted: true }
                        : msg
                )
            );
        } catch (error) {
            console.error('Failed to delete message:', error);
        }
    };

    const handleReportMessage = async (messageId: string) => {
        try {
            await chatService.reportMessage(messageId, 'Inappropriate content');
        } catch (error) {
            console.error('Failed to report message:', error);
        }
    };

    const handleChannelSelect = async (channel: ChatChannel) => {
        setSelectedChannel(channel);
        if (window.innerWidth <= 768) {
            setShowChannelList(false);
        }
        
        // Subscribe to asset channel if needed
        if (channel.type === 'asset') {
            try {
                await chatService.subscribeToAssetChannel(channel.name);
            } catch (error) {
                console.error('Failed to subscribe to channel:', error);
            }
        }
    };

    const handleAddChannel = () => {
        // TODO: Implement channel creation modal
        console.log('Add channel clicked');
    };

    const toggleChannelList = () => {
        setShowChannelList(!showChannelList);
    };

    if (!isAuthenticated) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    if (isLoadingChannels) {
        return (
            <div className="chat-container">
                <div className="chat-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading channels...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-container">
            <div className="chat-layout">
                <button className="mobile-toggle" onClick={toggleChannelList}>
                    {showChannelList ? '✕' : '☰'}
                </button>
                
                {showChannelList && (
                    <ChannelList
                        channels={channels}
                        selectedChannel={selectedChannel}
                        onChannelSelect={handleChannelSelect}
                        onAddChannel={handleAddChannel}
                    />
                )}

                {selectedChannel ? (
                    <div className="chat-main">
                        <ChannelHeader
                            channel={selectedChannel}
                            userAddress={userAddress || ''}
                        />
                        
                        <div className="messages-container" ref={messageContainerRef}>
                            {isLoadingMessages ? (
                                <div className="loading-messages">Loading messages...</div>
                            ) : (
                                messages.map((message) => (
                                    <MessageItem
                                        key={message.id}
                                        message={message}
                                        currentUserAddress={userAddress || ''}
                                        onEdit={handleEditMessage}
                                        onDelete={handleDeleteMessage}
                                        onReport={handleReportMessage}
                                    />
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <MessageInput
                            channelName={selectedChannel.name}
                            channelType={selectedChannel.type}
                            onSend={handleSendMessage}
                        />
                    </div>
                ) : (
                    <div className="chat-no-channel">
                        <p>Select a channel to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat; 