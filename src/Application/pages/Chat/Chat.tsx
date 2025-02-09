import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Chat.css';

interface Message {
    id: string;
    text: string;
    sender: string;
    timestamp: Date;
}

const Chat: React.FC = () => {
    const { userAddress, isAuthenticated } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !userAddress) return;

        const message: Message = {
            id: Date.now().toString(),
            text: newMessage,
            sender: userAddress,
            timestamp: new Date(),
        };

        setMessages([...messages, message]);
        setNewMessage('');
    };

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
            <div className="chat-header">
                <h2>Chat Room</h2>
                <div className="user-info">
                    Connected: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                </div>
            </div>
            
            <div className="messages-container">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`message ${message.sender === userAddress ? 'sent' : 'received'}`}
                    >
                        <div className="message-content">
                            <p>{message.text}</p>
                            <span className="message-timestamp">
                                {message.timestamp.toLocaleTimeString()}
                            </span>
                        </div>
                        <div className="message-sender">
                            {message.sender === userAddress 
                                ? 'You'
                                : `${message.sender.slice(0, 6)}...${message.sender.slice(-4)}`}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="message-input-form">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="message-input"
                />
                <button type="submit" className="send-button">
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat; 