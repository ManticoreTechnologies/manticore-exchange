import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { chatService, type ChatMessage, type ChatChannel } from '../../services/ChatService';
import ChannelList from './components/ChannelList';
import MessageItem from './components/MessageItem';
import MessageInput from './components/MessageInput';
import ChannelHeader from './components/ChannelHeader';
import './Chat.css';

const Chat: React.FC = () => {
    const { userAddress, isAuthenticated } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [channels, setChannels] = useState<ChatChannel[]>([
        { name: 'Global', type: 'global' },
        { name: 'EVR', type: 'asset' },
        { name: 'NFT', type: 'asset' },
    ]);
    const [selectedChannel, setSelectedChannel] = useState<ChatChannel>({ name: 'Global', type: 'global' });
    const [showChannelList, setShowChannelList] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messageContainerRef = useRef<HTMLDivElement>(null);

    // Initialize chat service when authenticated
    useEffect(() => {
        if (isAuthenticated && userAddress) {
            chatService.initialize();
        }
    }, [isAuthenticated, userAddress]);

    const scrollToBottom = (smooth = true) => {
        messagesEndRef.current?.scrollIntoView({ 
            behavior: smooth ? "smooth" : "auto" 
        });
    };

    // Load available channels
    useEffect(() => {
        const loadChannels = async () => {
            try {
                const availableChannels = await chatService.getChannels();
                setChannels(availableChannels);
            } catch (error) {
                console.error('Failed to load channels:', error);
            }
        };

        if (isAuthenticated) {
            loadChannels();
        }
    }, [isAuthenticated]);

    // Handle incoming messages
    useEffect(() => {
        if (!isAuthenticated) return;

        const unsubscribeMessage = chatService.onMessage((message: ChatMessage) => {
            if (message.channel === selectedChannel.name || 
                (selectedChannel.type === 'global' && !message.channel)) {
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
    }, [selectedChannel, isAuthenticated]);

    // Load channel messages
    const loadChannelMessages = useCallback(async (channel: ChatChannel) => {
        setIsLoading(true);
        try {
            const channelMessages = await chatService.getChannelMessages(channel);
            setMessages(channelMessages);
            scrollToBottom(false);
        } catch (error) {
            console.error('Failed to load messages:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load messages when channel changes
    useEffect(() => {
        if (selectedChannel && isAuthenticated) {
            loadChannelMessages(selectedChannel);
        }
    }, [selectedChannel, loadChannelMessages, isAuthenticated]);

    const handleSendMessage = async (text: string, ipfsHash?: string) => {
        if (!userAddress) return;

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
            // TODO: Show error notification
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
            // TODO: Show success notification
        } catch (error) {
            console.error('Failed to report message:', error);
        }
    };

    const handleChannelSelect = (channel: ChatChannel) => {
        setSelectedChannel(channel);
        if (window.innerWidth <= 768) {
            setShowChannelList(false);
        }
    };

    const handleAddChannel = () => {
        // TODO: Implement channel creation modal
        console.log('Add channel clicked');
    };

    const toggleChannelList = () => {
        setShowChannelList(!showChannelList);
    };

    // Show sign in message if not authenticated
    if (!isAuthenticated || !userAddress) {
        return (
            <div className="chat-container">
                <div className="chat-auth-message">
                    Please sign in with your wallet to access the chat.
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

                <div className="chat-main">
                    <ChannelHeader
                        channel={selectedChannel}
                        userAddress={userAddress}
                    />
                    
                    <div className="messages-container" ref={messageContainerRef}>
                        {isLoading ? (
                            <div className="loading-messages">Loading messages...</div>
                        ) : (
                            messages.map((message) => (
                                <MessageItem
                                    key={message.id}
                                    message={message}
                                    currentUserAddress={userAddress}
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
                        onSend={handleSendMessage}
                    />
                </div>
            </div>
        </div>
    );
};

export default Chat; 