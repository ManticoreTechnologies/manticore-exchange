import React, { useState } from 'react';
import { ChatMessage } from '../../../services/ChatService';
import { formatDistanceToNow } from 'date-fns';

interface MessageItemProps {
    message: ChatMessage;
    currentUserAddress: string;
    onEdit: (messageId: string, text: string) => void;
    onDelete: (messageId: string) => void;
    onReport: (messageId: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
    message,
    currentUserAddress,
    onEdit,
    onDelete,
    onReport
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(message.text);
    const [showActions, setShowActions] = useState(false);

    const isOwnMessage = message.sender === currentUserAddress;
    const timeAgo = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true });

    const handleEdit = () => {
        if (editText.trim() !== message.text) {
            onEdit(message.id, editText);
        }
        setIsEditing(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleEdit();
        }
    };

    if (message.deleted) {
        return (
            <div className="message-deleted">
                <em>This message has been deleted</em>
            </div>
        );
    }

    return (
        <div
            className={`message ${isOwnMessage ? 'sent' : 'received'}`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div className="message-content">
                {isEditing ? (
                    <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        autoFocus
                        className="message-edit-input"
                    />
                ) : (
                    <>
                        <p>{message.text}</p>
                        {message.ipfs_hash && (
                            <div className="message-attachment">
                                <a href={`/ipfs/${message.ipfs_hash}`} target="_blank" rel="noopener noreferrer">
                                    📎 Attachment
                                </a>
                            </div>
                        )}
                    </>
                )}
                
                {showActions && (
                    <div className="message-actions">
                        {isOwnMessage ? (
                            <>
                                {isEditing ? (
                                    <>
                                        <button onClick={handleEdit}>Save</button>
                                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => setIsEditing(true)}>Edit</button>
                                        <button onClick={() => onDelete(message.id)}>Delete</button>
                                    </>
                                )}
                            </>
                        ) : (
                            <button onClick={() => onReport(message.id)}>Report</button>
                        )}
                    </div>
                )}

                <div className="message-meta">
                    <span className="message-timestamp">{timeAgo}</span>
                    {message.edited && <span className="message-edited">(edited)</span>}
                </div>
            </div>
            
            <div className="message-sender">
                {message.sender === currentUserAddress 
                    ? 'You'
                    : `${message.sender.slice(0, 6)}...${message.sender.slice(-4)}`}
            </div>

            {message.reactions && Object.keys(message.reactions).length > 0 && (
                <div className="message-reactions">
                    {Object.entries(message.reactions).map(([emoji, users]) => (
                        <span key={emoji} className="reaction">
                            {emoji} {users.length}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MessageItem; 