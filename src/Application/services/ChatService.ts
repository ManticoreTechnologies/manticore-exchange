import axios from 'axios';
import Cookies from 'js-cookie';

// Constants for API and WebSocket configuration
const API_BASE = import.meta.env.VITE_API_BASE || 'http://10.0.0.2:8000';
const WS_BASE = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}${API_BASE.replace(/^https?:/, '')}`;





export interface ChatMessage {
    id: string;
    text: string;
    sender: string;
    timestamp: string;
    channel?: string;
    type: 'global' | 'asset' | 'direct';
    ipfs_hash?: string;
    edited?: boolean;
    deleted?: boolean;
    reactions?: {
        [emoji: string]: string[];
    };
}

export interface ChatChannel {
    name: string;
    type: 'global' | 'asset' | 'direct';
    unreadCount?: number;
    lastMessage?: string;
    participants?: number;
    description?: string;
    rules?: string;
}

export interface UserPresence {
    address: string;
    status: 'online' | 'away' | 'offline';
}

export interface DirectMessageConversation {
    address: string;
    lastMessage: string;
    unreadCount: number;
    lastActivity: Date;
}

class ChatService {
    private ws: WebSocket | null = null;
    private messageHandlers: ((message: ChatMessage) => void)[] = [];
    private channelUpdateHandlers: ((channel: ChatChannel) => void)[] = [];
    private presenceHandlers: ((users: string[]) => void)[] = [];
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectTimeout: NodeJS.Timeout | null = null;

    constructor() {
        const token = Cookies.get('auth_token');
        if (token) {
            this.initializeWebSocket(token);
        }
    }

    private async initializeWebSocket(token: string) {
        try {
            if (this.ws) {
                this.ws.close();
                this.ws = null;
            }

            this.ws = new WebSocket(`${WS_BASE}/ws/chat`);

            this.ws.onopen = () => {
                console.log('WebSocket connected');
                // Send authentication message
                if (this.ws) {
                    this.ws.send(JSON.stringify({
                        type: 'auth',
                        data: { token }
                    }));
                }
                this.reconnectAttempts = 0;
            };

            this.ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    switch (message.type) {
                        case 'chat_message':
                            this.messageHandlers.forEach(handler => handler(message.data));
                            break;
                        case 'channel_update':
                            this.channelUpdateHandlers.forEach(handler => handler(message.data));
                            break;
                        case 'presence_update':
                            this.presenceHandlers.forEach(handler => handler(message.data));
                            break;
                    }
                } catch (error) {
                    console.error('Failed to parse WebSocket message:', error);
                }
            };

            this.ws.onclose = () => {
                console.log('WebSocket disconnected');
                this.handleReconnect(token);
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        } catch (error) {
            console.error('Failed to initialize WebSocket:', error);
            this.handleReconnect(token);
        }
    }

    private handleReconnect(token: string) {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
            return;
        }

        this.reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

        this.reconnectTimeout = setTimeout(() => {
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            this.initializeWebSocket(token);
        }, delay);
    }

    // Channel Methods
    public async getChannels(): Promise<ChatChannel[]> {
        const response = await axios.get(`${API_BASE}/chat/channels`);
        return response.data.channels;
    }

    public async getChannelInfo(channelName: string): Promise<ChatChannel> {
        const response = await axios.get(`${API_BASE}/chat/channels/${channelName}`);
        return response.data;
    }

    public async getAssetChannels(): Promise<ChatChannel[]> {
        const response = await axios.get(`${API_BASE}/chat/assets/channels`);
        return response.data.channels;
    }

    // Message Methods
    public async getGlobalMessages(limit = 20, before?: string): Promise<ChatMessage[]> {
        const params = new URLSearchParams();
        if (limit) params.append('limit', limit.toString());
        if (before) params.append('before', before);

        const response = await axios.get(`${API_BASE}/chat/global?${params.toString()}`);
        return response.data;
    }

    public async getAssetMessages(assetName: string, limit = 20, before?: string): Promise<ChatMessage[]> {
        const params = new URLSearchParams();
        if (limit) params.append('limit', limit.toString());
        if (before) params.append('before', before);

        const response = await axios.get(`${API_BASE}/chat/assets/${assetName}/messages?${params.toString()}`);
        return response.data;
    }

    public async sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>) {
        const payload = {
            text: message.text,
            ipfs_hash: message.ipfs_hash
        };

        if (message.type === 'global') {
            await axios.post(`${API_BASE}/chat/global`, payload);
        } else if (message.type === 'asset' && message.channel) {
            await axios.post(`${API_BASE}/chat/assets/${message.channel}/messages`, payload);
        }
    }

    public async editMessage(messageId: string, text: string) {
        await axios.patch(`${API_BASE}/chat/messages/${messageId}`, { text });
    }

    public async deleteMessage(messageId: string) {
        await axios.delete(`${API_BASE}/chat/messages/${messageId}`);
    }

    public async reportMessage(messageId: string, reason: string) {
        await axios.post(`${API_BASE}/chat/messages/${messageId}/report`, { reason });
    }

    // Asset Channel Subscription
    public async subscribeToAssetChannel(assetName: string) {
        await axios.post(`${API_BASE}/chat/assets/${assetName}/subscribe`);
    }

    public async unsubscribeFromAssetChannel(assetName: string) {
        await axios.post(`${API_BASE}/chat/assets/${assetName}/unsubscribe`);
    }

    // Presence Methods
    public async getChannelPresence(channelName: string): Promise<string[]> {
        const response = await axios.get(`${API_BASE}/chat/channels/${channelName}/presence`);
        return response.data.online_users;
    }

    public async updatePresence(status: 'online' | 'away' | 'offline') {
        await axios.post(`${API_BASE}/chat/presence`, { status });
    }

    // File Attachment Methods
    public async uploadAttachment(file: File): Promise<{ ipfs_hash: string; url: string }> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${API_BASE}/chat/attachments`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }

    public async getAttachmentInfo(ipfsHash: string) {
        const response = await axios.get(`${API_BASE}/chat/attachments/${ipfsHash}`);
        return response.data;
    }

    // Event Handlers
    public onMessage(handler: (message: ChatMessage) => void) {
        this.messageHandlers.push(handler);
        return () => {
            this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
        };
    }

    public onChannelUpdate(handler: (channel: ChatChannel) => void) {
        this.channelUpdateHandlers.push(handler);
        return () => {
            this.channelUpdateHandlers = this.channelUpdateHandlers.filter(h => h !== handler);
        };
    }

    public onPresenceUpdate(handler: (users: string[]) => void) {
        this.presenceHandlers.push(handler);
        return () => {
            this.presenceHandlers = this.presenceHandlers.filter(h => h !== handler);
        };
    }

    public disconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.messageHandlers = [];
        this.channelUpdateHandlers = [];
        this.presenceHandlers = [];
        this.reconnectAttempts = 0;
    }

    public reconnect() {
        const token = Cookies.get('auth_token');
        if (token) {
            this.disconnect();
            this.initializeWebSocket(token);
        }
    }
}

export const chatService = new ChatService();

// Helper function to check auth status
export const checkAuthStatus = async (): Promise<{ isAuthenticated: boolean; userAddress: string | null }> => {
    const token = Cookies.get('auth_token');
    const storedAddress = Cookies.get('user_address');

    if (!token || !storedAddress) {
        return { isAuthenticated: false, userAddress: null };
    }

    try {
        const response = await axios.get(`${API_BASE}/auth/verify`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.valid && response.data.address === storedAddress) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return { isAuthenticated: true, userAddress: storedAddress };
        }
    } catch (error) {
        console.error('Auth verification failed:', error);
        Cookies.remove('auth_token');
        Cookies.remove('user_address');
    }

    return { isAuthenticated: false, userAddress: null };
}; 