import React, { useState, useRef } from 'react';
import { chatService } from '../../../services/ChatService';

interface MessageInputProps {
    channelName: string;
    channelType: 'global' | 'asset' | 'direct';
    onSend: (text: string, ipfsHash?: string) => Promise<void>;
}

const MessageInput: React.FC<MessageInputProps> = ({ channelName, channelType, onSend }) => {
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [attachment, setAttachment] = useState<{ name: string; ipfsHash: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() && !attachment) return;

        try {
            await onSend(message, attachment?.ipfsHash);
            setMessage('');
            setAttachment(null);
        } catch (error) {
            console.error('Failed to send message:', error);
            // TODO: Show error notification
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const result = await chatService.uploadAttachment(file);
            setAttachment({
                name: file.name,
                ipfsHash: result.ipfs_hash
            });
        } catch (error) {
            console.error('Failed to upload file:', error);
            // TODO: Show error notification
        } finally {
            setIsUploading(false);
        }
    };

    const handlePaste = async (e: React.ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    e.preventDefault();
                    setIsUploading(true);
                    try {
                        const result = await chatService.uploadAttachment(file);
                        setAttachment({
                            name: 'Pasted image',
                            ipfsHash: result.ipfs_hash
                        });
                    } catch (error) {
                        console.error('Failed to upload pasted image:', error);
                        // TODO: Show error notification
                    } finally {
                        setIsUploading(false);
                    }
                    break;
                }
            }
        }
    };

    const removeAttachment = () => {
        setAttachment(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <form onSubmit={handleSubmit} className="message-input-form">
            {attachment && (
                <div className="attachment-preview">
                    <span>{attachment.name}</span>
                    <button type="button" onClick={removeAttachment} className="remove-attachment">
                        ✕
                    </button>
                </div>
            )}
            
            <div className="message-input-container">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onPaste={handlePaste}
                    placeholder={`Message ${channelName}...`}
                    className="message-input"
                    disabled={isUploading}
                />
                
                <div className="message-input-actions">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="attach-button"
                        disabled={isUploading}
                    >
                        📎
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                        accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                    <button
                        type="submit"
                        className="send-button"
                        disabled={isUploading || (!message.trim() && !attachment)}
                    >
                        {isUploading ? 'Uploading...' : 'Send'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default MessageInput; 