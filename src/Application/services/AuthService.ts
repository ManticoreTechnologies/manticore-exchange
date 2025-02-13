import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

// Auth Types
export interface ChallengeRequest {
    address: string;
}

export interface ChallengeResponse {
    challenge_id: string;
    message: string;
}

export interface VerifyRequest {
    challenge_id: string;
    address: string;
    signature: string;
}

export interface LoginResponse {
    token: string;
}

export interface VerifyTokenResponse {
    valid: boolean;
    address: string;
}

interface ApiConfig {
    host: string;
    port: number;
    protocol: string;
}

export class AuthService {
    private api: AxiosInstance;
    private baseUrl: string;
    private readonly TOKEN_KEY = 'auth_token';
    private readonly TOKEN_EXPIRY_KEY = 'auth_token_expiry';
    private readonly ADDRESS_KEY = 'auth_address';

    constructor(config: ApiConfig) {
        this.baseUrl = `${config.protocol}://${config.host}:${config.port}`;
        this.api = axios.create({
            baseURL: this.baseUrl,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add response interceptor for error handling
        this.api.interceptors.response.use(
            (response) => response,
            (error) => this.handleApiError(error)
        );

        // Add request interceptor for auth token
        this.api.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    private handleApiError(error: any): Promise<never> {
        let message = 'An error occurred during authentication';

        if (error.response) {
            message = error.response.data?.detail || `Error: ${error.response.status}`;
            
            // Handle auth errors
            if (error.response.status === 401) {
                this.clearAuth();
                window.location.href = '/signin';
            }
        } else if (error.request) {
            message = 'No response received from server';
        } else {
            message = error.message;
        }

        toast.error(message);
        return Promise.reject(error);
    }

    // Token Management
    private setToken(token: string, address: string, expiryInHours: number = 24): void {
        localStorage.setItem(this.TOKEN_KEY, token);
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + expiryInHours);
        localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiry.toISOString());
        localStorage.setItem(this.ADDRESS_KEY, address);
    }

    public getToken(): string | null {
        const token = localStorage.getItem(this.TOKEN_KEY);
        const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);

        if (!token || !expiry) {
            return null;
        }

        // Check if token has expired
        if (new Date(expiry) < new Date()) {
            this.clearAuth();
            return null;
        }

        return token;
    }

    public getAddress(): string | null {
        return localStorage.getItem(this.ADDRESS_KEY);
    }

    private clearAuth(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
        localStorage.removeItem(this.ADDRESS_KEY);
    }

    // Auth Flow Methods
    async createChallenge(address: string): Promise<ChallengeResponse> {
        try {
            const response: AxiosResponse<ChallengeResponse> = await this.api.post(
                '/auth/challenge',
                { address }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async verifyChallenge(verifyRequest: VerifyRequest): Promise<LoginResponse> {
        try {
            const response: AxiosResponse<LoginResponse> = await this.api.post(
                '/auth/signin',
                verifyRequest
            );
            
            if (response.data.token) {
                this.setToken(response.data.token, verifyRequest.address);
            }
            
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async logout(): Promise<void> {
        try {
            if (this.getToken()) {
                await this.api.post('/auth/logout');
            }
            this.clearAuth();
        } catch (error) {
            this.clearAuth();
            throw error;
        }
    }

    async verifyToken(): Promise<VerifyTokenResponse> {
        try {
            const response: AxiosResponse<VerifyTokenResponse> = await this.api.get(
                '/auth/verify'
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Helper Methods
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    async refreshToken(): Promise<void> {
        // Implement token refresh logic if your backend supports it
        // This is a placeholder for future implementation
    }

    decodeToken(): any {
        const token = this.getToken();
        if (!token) return null;

        try {
            // Decode JWT token (this is safe as it's just base64 decoding)
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(window.atob(base64));
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }
}

// Create and export default instance
const defaultConfig: ApiConfig = {
    host: '10.0.0.2',
    port: 8000,
    protocol: 'http'
};

export default new AuthService(defaultConfig); 