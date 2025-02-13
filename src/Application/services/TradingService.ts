import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

// Base Types
export interface Balance {
    asset_name: string;
    confirmed_balance: string;
    units: number;
}

export interface Price {
    asset_name: string;
    price_evr: string;
    ipfs_hash?: string;
}

export interface Listing {
    id: string;
    name: string;
    description: string;
    seller_address: string;
    listing_address: string;
    image_ipfs_hash: string | null;
    status: string;
    created_at: string;
    balances: Balance[];
    prices: Price[];
    tags: string[];
    isOwnedByUser?: boolean;
}

// New Types for Featured Listings
export interface FeaturedListingPlan {
    name: string;
    amount_evr: string;
    duration_days: number;
    priority_level: number;
}

export interface FeaturedPayment {
    id: string;
    listing_id: string;
    payment_address: string;
    amount_evr: string;
    duration_days: number;
    priority_level: number;
    status: string;
    created_at: string;
    expires_at: string | null;
}

// Analytics Types
export interface ListingAnalytics {
    views: number;
    unique_views: number;
    sales_count: number;
    total_revenue: string;
    conversion_rate: number;
    avg_time_to_sale?: number;
    popular_payment_methods: Record<string, number>;
    sales_by_day: Record<string, number>;
}

export interface PriceHistory {
    price_evr: string | null;
    price_asset_name: string | null;
    price_asset_amount: string | null;
    change_type: string;
    timestamp: string;
}

export interface AssetHistory {
    change_amount: string;
    change_type: string;
    tx_hash: string;
    timestamp: string;
}

export interface Transaction {
    tx_hash: string;
    address: string;
    entry_type: string;
    amount: string;
    fee: string | null;
    confirmations: number;
    time: string | null;
    asset_type: string;
    asset_message: string;
    trusted: boolean;
    bip125_replaceable: boolean;
    abandoned: boolean;
}

// Request/Response Types
export interface CreateListingRequest {
    seller_address: string;
    name: string;
    description?: string;
    image_ipfs_hash?: string;
    prices: Price[];
    tags?: string[];
}

export interface UpdateListingRequest {
    name?: string;
    description?: string;
    image_ipfs_hash?: string;
    tags?: string[];
    payout_address?: string;
    prices?: Price[];
}

export interface WithdrawRequest {
    asset_name: string;
    amount: string;
}

export interface ListingsResponse {
    listings: Listing[];
    total_count: number;
    total_pages: number;
    current_page: number;
}

export interface HomeListingsResponse {
    featured: {
        listings: Listing[];
        total: number;
    };
    trending: {
        listings: Listing[];
        total: number;
        timeframe: string;
    };
    new: {
        listings: Listing[];
        total: number;
        time_window_hours: number;
    };
}

export interface SearchParams {
    search?: string;
    seller_address?: string;
    asset_name?: string;
    tags?: string[];
    min_price?: string;
    max_price?: string;
    limit?: number;
    offset?: number;
}

export interface HomeListingsParams {
    featured_count?: number;
    trending_count?: number;
    new_count?: number;
    trending_timeframe?: string;
    new_hours?: number;
}

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

// API Configuration
interface ApiConfig {
    baseUrl?: string;
}

// Service Class
export class TradingService {
    private readonly baseUrl: string;
    private token: string | null = null;
    private api: AxiosInstance;

    constructor(config: ApiConfig) {
        this.baseUrl = config.baseUrl || 'http://10.0.0.2:8000';
        this.api = axios.create({
            baseURL: this.baseUrl,
            timeout: 10000
        });

        // Add request interceptor for auth token
        this.api.interceptors.request.use(
            (config) => {
                if (this.token) {
                    config.headers.Authorization = `Bearer ${this.token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Add response interceptor for token handling
        this.api.interceptors.response.use(
            (response) => {
                if (response.data.token) {
                    this.token = response.data.token;
                    localStorage.setItem('auth_token', response.data.token);
                }
                return response;
            },
            (error) => {
                if (error.response?.status === 401) {
                    this.token = null;
                    localStorage.removeItem('auth_token');
                }
                return Promise.reject(error);
            }
        );
    }

    // Auth Methods
    async login(address: string, signature: string): Promise<void> {
        const response = await this.api.post('/auth/login', { address, signature });
        if (response.data.token) {
            this.token = response.data.token;
            localStorage.setItem('auth_token', response.data.token);
        }
    }

    async logout(): Promise<void> {
        try {
            await this.api.post('/auth/logout');
            this.token = null;
            localStorage.removeItem('auth_token');
        } catch (error) {
            throw error;
        }
    }

    getToken(): string | null {
        return this.token || localStorage.getItem('auth_token');
    }

    // Listing Methods
    async getListings(page: number = 1, perPage: number = 50): Promise<ListingsResponse> {
        const response = await this.api.get('/listings/', {
            params: { page, per_page: perPage }
        });
        return response.data;
    }

    async searchListings(params: SearchParams): Promise<ListingsResponse> {
        const response = await this.api.get('/listings/search', {
            params: {
                search_term: params.search,
                seller_address: params.seller_address,
                asset_name: params.asset_name,
                min_price_evr: params.min_price,
                max_price_evr: params.max_price,
                tags: params.tags?.join(','),
                per_page: params.limit || 50,
                page: Math.floor((params.offset || 0) / (params.limit || 50)) + 1
            }
        });
        return response.data;
    }

    async getListingById(id: string): Promise<Listing> {
        const response = await this.api.get(`/listings/by-id/${id}`);
        return response.data;
    }

    async getListingByDepositAddress(address: string): Promise<Listing> {
        const response = await this.api.get(`/listings/by-deposit-address/${address}`);
        return response.data;
    }

    async getSellerListings(address: string): Promise<ListingsResponse> {
        const response = await this.api.get(`/listings/by-seller-address/${address}`);
        return response.data;
    }

    async getAssetListings(assetName: string): Promise<ListingsResponse> {
        const response = await this.api.get(`/listings/by-asset-name/${assetName}`);
        return response.data;
    }

    async getTagListings(tag: string, page: number = 1, perPage: number = 50): Promise<ListingsResponse> {
        const response = await this.api.get(`/listings/by-tag/${tag}`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }

    async getHomeListings(params?: HomeListingsParams): Promise<HomeListingsResponse> {
        const response = await this.api.get('/listings/home', { params });
        return response.data;
    }

    async getFeaturedListings(page: number = 1, perPage: number = 10): Promise<ListingsResponse> {
        const response = await this.api.get('/listings/featured', {
            params: { page, per_page: perPage }
        });
        return response.data;
    }

    async getTrendingListings(timeframe: '1h' | '24h' | '7d' | '30d' = '24h', page: number = 1, perPage: number = 10): Promise<ListingsResponse> {
        const response = await this.api.get('/listings/trending', {
            params: { timeframe, page, per_page: perPage }
        });
        return response.data;
    }

    async getNewListings(hours: number = 24, page: number = 1, perPage: number = 10): Promise<ListingsResponse> {
        const response = await this.api.get('/listings/new', {
            params: { hours, page, per_page: perPage }
        });
        return response.data;
    }

    // Protected Listing Methods (require authentication)
    async createListing(request: CreateListingRequest): Promise<Listing> {
        const response = await this.api.post('/listings/', request);
        return response.data;
    }

    async updateListing(id: string, request: UpdateListingRequest): Promise<Listing> {
        const response = await this.api.patch(`/listings/${id}`, request);
        return response.data;
    }

    async deleteListing(id: string): Promise<void> {
        await this.api.delete(`/listings/by-id/${id}`);
    }

    async withdrawFromListing(id: string, request: WithdrawRequest): Promise<any> {
        const response = await this.api.post(`/listings/${id}/withdraw`, request);
        return response.data;
    }

    async rescanListingBalance(id: string): Promise<any> {
        const response = await this.api.post(`/listings/${id}/rescan`, null);
        return response.data;
    }

    // Analytics Methods
    async getListingAnalytics(id: string, startDate?: Date, endDate?: Date): Promise<ListingAnalytics> {
        const params: any = {};
        if (startDate) params.start_date = startDate.toISOString();
        if (endDate) params.end_date = endDate.toISOString();

        const response = await this.api.get(`/listings/${id}/analytics`, { params });
        return response.data;
    }

    async getListingPriceHistory(id: string, asset: string, range: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL' = '1M'): Promise<PriceHistory[]> {
        const response = await this.api.get(`/listings/${id}/prices`, {
            params: { asset, range }
        });
        return response.data.history;
    }

    async getListingAssetHistory(id: string, asset: string, startDate?: Date, endDate?: Date): Promise<AssetHistory[]> {
        const params: any = { asset };
        if (startDate) params.start_date = startDate.toISOString();
        if (endDate) params.end_date = endDate.toISOString();

        const response = await this.api.get(`/listings/${id}/asset-history`, { params });
        return response.data.history;
    }

    async getListingTransactions(id: string, params: {
        asset: string;
        entry_type?: 'receive' | 'send';
        min_confirmations?: number;
        page?: number;
        per_page?: number;
    }): Promise<{ transactions: Transaction[]; total_count: number; }> {
        const response = await this.api.get(`/listings/${id}/transactions`, { params });
        return response.data;
    }

    // Featured Listing Methods
    async getFeaturedPlans(): Promise<Record<string, FeaturedListingPlan>> {
        const response = await this.api.get('/listings/featured/plans');
        return response.data;
    }

    async createFeaturedPayment(listingId: string, planName: string): Promise<FeaturedPayment> {
        const response = await this.api.post('/listings/featured/payments', {
            listing_id: listingId,
            plan_name: planName
        });
        return response.data;
    }

    async getFeaturedPayment(paymentId: string): Promise<FeaturedPayment> {
        const response = await this.api.get(`/listings/featured/payments/${paymentId}`);
        return response.data;
    }

    async listFeaturedPayments(listingId?: string): Promise<FeaturedPayment[]> {
        const params = listingId ? { listing_id: listingId } : undefined;
        const response = await this.api.get('/listings/featured/payments', { params });
        return response.data;
    }

    // Listing Management Methods
    async pauseListing(id: string): Promise<{ listing_id: string; status: string; paused_at: string; }> {
        const response = await this.api.post(`/listings/${id}/pause`, null);
        return response.data;
    }

    async resumeListing(id: string): Promise<{ listing_id: string; status: string; resumed_at: string; }> {
        const response = await this.api.post(`/listings/${id}/resume`, null);
        return response.data;
    }

    async batchUpdateListings(listingIds: string[], updates: any): Promise<{
        total: number;
        successful: number;
        failed: number;
        results: Record<string, { success: boolean; updated_at?: string; error?: string; }>;
    }> {
        const response = await this.api.post('/listings/batch-update', {
            listing_ids: listingIds,
            updates
        });
        return response.data;
    }
}

export default new TradingService({ baseUrl: 'http://10.0.0.2:8000' });
