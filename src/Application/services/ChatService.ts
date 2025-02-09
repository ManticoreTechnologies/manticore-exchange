import axios from 'axios';
import Cookies from 'js-cookie';

// Constants for API and WebSocket configuration
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
const WS_BASE = API_BASE.replace(/^http/, 'ws');

export interface ChatMessage {
    id: string;
    text: string;
    sender: string;
    timestamp: Date;
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
}

export interface UserPresence {
    address: string;
    status: 'online' | 'away' | 'offline';
    lastSeen?: Date;
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
    private presenceHandlers: ((presence: UserPresence[]) => void)[] = [];
    private channelUpdateHandlers: ((channel: ChatChannel) => void)[] = [];
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectTimeout: NodeJS.Timeout | null = null;
    private authVerified: boolean = false;
    private verifiedAddress: string | null = null;
    private authToken: string | null = null;

    constructor() {
        // Check for existing auth on instantiation
        const token = Cookies.get('auth_token');
        const address = Cookies.get('user_address');
        
        if (token && address) {
            this.authToken = token;
            this.verifiedAddress = address;
            this.authVerified = true;
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            this.initializeWebSocket();
        }
    }

    private async verifyExistingAuth(): Promise<boolean> {
        const token = Cookies.get('auth_token');
        const storedAddress = Cookies.get('user_address');

        if (!token || !storedAddress) {
            this.resetAuth();
            return false;
        }

        try {
            const response = await axios.get(`${API_BASE}/auth/verify`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.valid && response.data.address === storedAddress) {
                this.authToken = token;
                this.verifiedAddress = storedAddress;
                this.authVerified = true;
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                return true;
            }
        } catch (error) {
            console.error('Auth verification failed:', error);
            this.resetAuth();
        }

        return false;
    }

    private resetAuth() {
        this.authToken = null;
        this.verifiedAddress = null;
        this.authVerified = false;
        delete axios.defaults.headers.common['Authorization'];
        Cookies.remove('auth_token');
        Cookies.remove('user_address');
        this.disconnect();
    }

    public isAuthenticated(): boolean {
        return this.authVerified && !!this.authToken && !!this.verifiedAddress;
    }

    public getVerifiedAddress(): string | null {
        return this.verifiedAddress;
    }

    private async initializeWebSocket() {
        if (!this.isAuthenticated()) {
            console.error('Cannot initialize WebSocket: Not authenticated');
            return;
        }

        const wsUrl = `${WS_BASE}/ws/chat`;
        
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('WebSocket connected to', wsUrl);
            this.reconnectAttempts = 0;
            
            // Send authentication immediately after connection
            if (this.authToken) {
                this.ws?.send(JSON.stringify({
                    type: 'auth',
                    token: this.authToken
                }));
            }
        };

        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                switch (message.type) {
                    case 'auth_success':
                        console.log('WebSocket authentication successful');
                        break;
                    case 'auth_error':
                        console.error('WebSocket authentication failed:', message.error);
                        this.resetAuth();
                        break;
                    case 'chat_message':
                        this.messageHandlers.forEach(handler => handler(message.data));
                        break;
                    case 'presence_update':
                        this.presenceHandlers.forEach(handler => handler(message.data));
                        break;
                    case 'channel_update':
                        this.channelUpdateHandlers.forEach(handler => handler(message.data));
                        break;
                }
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        };

        this.ws.onclose = () => {
            console.log('WebSocket disconnected');
            if (this.isAuthenticated()) {
                this.handleReconnect();
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    private handleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
            return;
        }

        this.reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

        this.reconnectTimeout = setTimeout(() => {
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            this.initializeWebSocket();
        }, delay);
    }

    // Message Methods
    public async sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>) {
        if (message.type === 'asset') {
            return this.sendAssetMessage(message.channel!, message.text);
        } else if (message.type === 'direct') {
            return this.sendDirectMessage(message.channel!, message.text);
        } else {
            return this.sendGlobalMessage(message.text);
        }
    }

    private async sendGlobalMessage(text: string) {
        await axios.post(`${API_BASE}/chat/global`, { text });
    }

    private async sendAssetMessage(assetName: string, text: string) {
        await axios.post(`${API_BASE}/chat/assets/${assetName}/messages`, { text });
    }

    private async sendDirectMessage(address: string, text: string) {
        await axios.post(`${API_BASE}/chat/direct/${address}`, { text });
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

    // Channel Methods
    public async getChannels(): Promise<ChatChannel[]> {
        const response = await axios.get(`${API_BASE}/chat/channels`);
        return response.data.channels;
    }

    public async getChannelInfo(channelName: string): Promise<ChatChannel> {
        const response = await axios.get(`${API_BASE}/chat/channels/${channelName}`);
        return response.data;
    }

    public async subscribeToAssetChannel(assetName: string) {
        await axios.post(`${API_BASE}/chat/assets/${assetName}/subscribe`);
    }

    public async unsubscribeFromAssetChannel(assetName: string) {
        await axios.post(`${API_BASE}/chat/assets/${assetName}/unsubscribe`);
    }

    // Direct Message Methods
    public async getDirectMessageConversations(): Promise<DirectMessageConversation[]> {
        const response = await axios.get(`${API_BASE}/chat/direct`);
        return response.data.conversations;
    }

    public async markConversationAsRead(address: string) {
        await axios.post(`${API_BASE}/chat/direct/${address}/read`);
    }

    // Message History Methods
    public async getChannelMessages(channel: ChatChannel, limit = 20, before?: string): Promise<ChatMessage[]> {
        let url = '';
        const params = new URLSearchParams();
        if (limit) params.append('limit', limit.toString());
        if (before) params.append('before', before);

        if (channel.type === 'asset') {
            url = `${API_BASE}/chat/assets/${channel.name}/messages`;
        } else if (channel.type === 'direct') {
            url = `${API_BASE}/chat/direct/${channel.name}`;
        } else {
            url = `${API_BASE}/chat/global`;
        }

        const response = await axios.get(`${url}?${params.toString()}`);
        return response.data;
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

    // Presence Methods
    public async updatePresence(status: 'online' | 'away' | 'offline') {
        await axios.post(`${API_BASE}/chat/presence`, { status });
    }

    public async getChannelPresence(channelName: string): Promise<string[]> {
        const response = await axios.get(`${API_BASE}/chat/channels/${channelName}/presence`);
        return response.data.online_users;
    }

    // Event Handlers
    public onMessage(handler: (message: ChatMessage) => void) {
        this.messageHandlers.push(handler);
        return () => {
            this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
        };
    }

    public onPresenceUpdate(handler: (presence: UserPresence[]) => void) {
        this.presenceHandlers.push(handler);
        return () => {
            this.presenceHandlers = this.presenceHandlers.filter(h => h !== handler);
        };
    }

    public onChannelUpdate(handler: (channel: ChatChannel) => void) {
        this.channelUpdateHandlers.push(handler);
        return () => {
            this.channelUpdateHandlers = this.channelUpdateHandlers.filter(h => h !== handler);
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
        this.presenceHandlers = [];
        this.channelUpdateHandlers = [];
        this.reconnectAttempts = 0;
    }

    public async initialize() {
        if (this.ws) {
            return; // Already initialized
        }

        const isValid = await this.verifyExistingAuth();
        if (isValid) {
            await this.initializeWebSocket();
        } else {
            console.error('Cannot initialize chat: Not authenticated');
        }
    }

    public async reconnect() {
        this.disconnect();
        await this.initialize();
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