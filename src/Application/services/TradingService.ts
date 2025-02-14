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
    search_term?: string;
    seller_address?: string;
    asset_name?: string;
    min_price_evr?: string;
    max_price_evr?: string;
    status?: 'active' | 'inactive' | 'cancelled' | 'pending';
    tags?: string[];
    per_page?: number;
    page?: number;
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

// Order Types
export interface OrderItem {
    asset_name: string;
    amount: string;
    price_evr?: string;
    fee_evr?: string;
}

export interface CartOrderItem extends OrderItem {
    listing_id: string;
    listing_name?: string;
    seller_address?: string;
}

export interface CreateOrderRequest {
    buyer_address: string;
    items: OrderItem[];
}

export interface CartOrderRequest {
    buyer_address: string;
    items: CartOrderItem[];
}

export interface OrderBalance {
    asset_name: string;
    confirmed_balance: string;
    pending_balance: string;
}

export interface OrderHistoryEvent {
    timestamp: string;
    status: string;
    description: string;
    details?: Record<string, any>;
}

export interface DisputeRequest {
    reason: string;
    description: string;
    evidence?: Record<string, any>;
}

export interface OrderDispute {
    dispute_id: string;
    order_id: string;
    status: string;
    created_at: string;
    reason: string;
    description: string;
    evidence?: Record<string, any>;
}

export interface Order {
    id: string;
    listing_id: string;
    buyer_address: string;
    payment_address: string;
    status: OrderStatus;
    items: OrderItem[];
    balances?: OrderBalance[];
    total_price_evr: string;
    total_fee_evr: string;
    total_payment_evr: string;
    created_at: string;
    updated_at: string;
}

export interface CartOrder extends Omit<Order, 'listing_id'> {
    items: CartOrderItem[];
    required_payment: string;
}

export type OrderStatus = 
    | 'pending'
    | 'partially_paid'
    | 'paid'
    | 'sale_pending'
    | 'completed'
    | 'cancelled'
    | 'expired'
    | 'failed'
    | 'disputed';

export interface OrderSearchResponse {
    orders: Order[];
    total_count: number;
    total_pages: number;
    current_page: number;
}

export interface OrderSearchParams {
    buyer_address?: string;
    listing_id?: string;
    status?: OrderStatus;
    per_page?: number;
    page?: number;
}

// Order Error Types
export class OrderError extends Error {
    constructor(message: string, public code: string) {
        super(message);
        this.name = 'OrderError';
    }
}

export class InsufficientBalanceError extends OrderError {
    constructor(message: string) {
        super(message, 'INSUFFICIENT_BALANCE');
    }
}

export class ListingNotFoundError extends OrderError {
    constructor(message: string) {
        super(message, 'LISTING_NOT_FOUND');
    }
}

export interface OrderTracking {
    id: string;
    status: OrderStatus;
    payment_address: string;
    payment_amount: string;
    expiration_time: number;
    created_at: string;
    items: OrderItem[];
    total_price_evr: string;
    total_fee_evr: string;
    total_payment_evr: string;
    fulfillment_txid?: string[];
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
    private readonly ORDERS_STORAGE_KEY = 'manticore_orders';
    private readonly ORDER_EXPIRY_TIME = 15 * 60 * 1000; // 15 minutes

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
        const response = await this.api.post('/auth/signin', { address, signature });
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
        try {
            // Convert params to URLSearchParams
            const searchParams = new URLSearchParams();
            
            if (params.search_term) searchParams.append('search_term', params.search_term);
            if (params.seller_address) searchParams.append('seller_address', params.seller_address);
            if (params.asset_name) searchParams.append('asset_name', params.asset_name);
            if (params.min_price_evr) searchParams.append('min_price_evr', params.min_price_evr);
            if (params.max_price_evr) searchParams.append('max_price_evr', params.max_price_evr);
            if (params.status) searchParams.append('status', params.status);
            if (params.tags) {
                params.tags.forEach(tag => searchParams.append('tags', tag));
            }
            if (params.per_page) searchParams.append('per_page', params.per_page.toString());
            if (params.page) searchParams.append('page', params.page.toString());

            console.log(searchParams.toString());
            const response = await this.api.get('/listings/search', { params: searchParams });
            return response.data;
        } catch (error) {
            console.error('Error searching listings:', error);
            throw error;
        }
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

    // Order Methods
    private saveOrderToStorage(order: OrderTracking): void {
        try {
            const savedOrders = this.getSavedOrders();
            const updatedOrders = [...savedOrders, order];
            localStorage.setItem(this.ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
            window.dispatchEvent(new CustomEvent('orderUpdate', { detail: { orders: updatedOrders } }));
        } catch (error) {
            console.error('Error saving order:', error);
        }
    }

    private getSavedOrders(): OrderTracking[] {
        try {
            const savedOrders = localStorage.getItem(this.ORDERS_STORAGE_KEY);
            return savedOrders ? JSON.parse(savedOrders) : [];
        } catch (error) {
            console.error('Error getting saved orders:', error);
            return [];
        }
    }

    private removeExpiredOrders(): void {
        const savedOrders = this.getSavedOrders();
        const currentTime = Date.now();
        const validOrders = savedOrders.filter(order => {
            const expiryTime = new Date(order.created_at).getTime() + this.ORDER_EXPIRY_TIME;
            return currentTime < expiryTime || order.status !== 'pending';
        });

        if (validOrders.length !== savedOrders.length) {
            localStorage.setItem(this.ORDERS_STORAGE_KEY, JSON.stringify(validOrders));
            window.dispatchEvent(new CustomEvent('orderUpdate', { detail: { orders: validOrders } }));
        }
    }

    async createOrder(listingId: string, request: CreateOrderRequest): Promise<Order> {
        try {
            const response = await this.api.post(`/orders/create/${listingId}`, request);
            const order = response.data;
            this.saveOrderToStorage(order);
            return order;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new ListingNotFoundError(`Listing ${listingId} not found`);
            }
            if (error.response?.data?.detail?.includes('insufficient balance')) {
                throw new InsufficientBalanceError(error.response.data.detail);
            }
            throw error;
        }
    }

    async createCartOrder(request: CartOrderRequest): Promise<CartOrder> {
        try {
            const response = await this.api.post('/orders/cart', request);
            const order = response.data;
            this.saveOrderToStorage(order);
            return order;
        } catch (error: any) {
            if (error.response?.data?.detail?.includes('insufficient balance')) {
                throw new InsufficientBalanceError(error.response.data.detail);
            }
            throw error;
        }
    }

    async getCartOrder(cartOrderId: string): Promise<CartOrder> {
        const response = await this.api.get(`/orders/cart/${cartOrderId}`);
        return response.data;
    }

    async getCartOrderBalances(cartOrderId: string): Promise<Record<string, OrderBalance>> {
        const response = await this.api.get(`/orders/cart/${cartOrderId}/balances`);
        return response.data;
    }

    async cancelOrder(orderId: string): Promise<{
        order_id: string;
        status: OrderStatus;
        cancelled_at: string;
    }> {
        const response = await this.api.post(`/orders/${orderId}/cancel`);
        return response.data;
    }

    async createDispute(orderId: string, dispute: DisputeRequest): Promise<OrderDispute> {
        const response = await this.api.post(`/orders/${orderId}/dispute`, dispute);
        return response.data;
    }

    async getOrderBalances(orderId: string): Promise<Record<string, OrderBalance>> {
        const response = await this.api.get(`/orders/${orderId}/balances`);
        return response.data;
    }

    async getOrder(orderId: string): Promise<Order> {
        const response = await this.api.get(`/orders/${orderId}`);
        return response.data;
    }

    async getOrderHistory(orderId: string): Promise<OrderHistoryEvent[]> {
        const response = await this.api.get(`/orders/${orderId}/history`);
        return response.data;
    }

    async searchOrders(params: OrderSearchParams): Promise<OrderSearchResponse> {
        const response = await this.api.get('/orders', { params });
        return response.data;
    }

    // Order Management Methods
    async rescanOrderBalances(orderId: string): Promise<{
        order_id: string;
        status: string;
        balances: Record<string, OrderBalance>;
    }> {
        const response = await this.api.post(`/orders/${orderId}/rescan`);
        return response.data;
    }

    async refundOrder(orderId: string): Promise<{
        order_id: string;
        status: string;
        refund_tx: string;
        refunded_at: string;
    }> {
        const response = await this.api.post(`/orders/${orderId}/refund`);
        return response.data;
    }

    async resolveDispute(
        orderId: string,
        disputeId: string,
        resolution: {
            outcome: 'refund' | 'complete' | 'cancel';
            notes?: string;
        }
    ): Promise<{
        order_id: string;
        dispute_id: string;
        status: string;
        resolution: string;
        resolved_at: string;
    }> {
        const response = await this.api.post(`/orders/${orderId}/disputes/${disputeId}/resolve`, resolution);
        return response.data;
    }

    async getDisputeDetails(orderId: string, disputeId: string): Promise<OrderDispute & {
        resolution?: {
            outcome: string;
            notes: string;
            resolved_at: string;
            resolved_by: string;
        };
    }> {
        const response = await this.api.get(`/orders/${orderId}/disputes/${disputeId}`);
        return response.data;
    }

    async listDisputes(params?: {
        status?: 'opened' | 'resolved';
        order_id?: string;
        buyer_address?: string;
        per_page?: number;
        page?: number;
    }): Promise<{
        disputes: OrderDispute[];
        total_count: number;
        total_pages: number;
        current_page: number;
    }> {
        const response = await this.api.get('/orders/disputes', { params });
        return response.data;
    }

    async getOrderStats(params?: {
        timeframe?: '24h' | '7d' | '30d' | 'all';
        buyer_address?: string;
        listing_id?: string;
    }): Promise<{
        total_orders: number;
        total_volume_evr: string;
        completed_orders: number;
        cancelled_orders: number;
        disputed_orders: number;
        avg_order_value_evr: string;
        stats_by_status: Record<OrderStatus, number>;
    }> {
        const response = await this.api.get('/orders/stats', { params });
        return response.data;
    }

    // Enhanced Order Methods
    async pollOrderStatus(orderId: string, callback: (order: Order) => void): Promise<void> {
        const pollInterval = setInterval(async () => {
            try {
                const order = await this.getOrder(orderId);
                callback(order);

                if (['completed', 'failed', 'cancelled', 'expired'].includes(order.status)) {
                    clearInterval(pollInterval);
                }

                // Update order in storage
                const savedOrders = this.getSavedOrders();
                const updatedOrders = savedOrders.map(savedOrder => 
                    savedOrder.id === orderId ? { ...savedOrder, ...order } : savedOrder
                );
                localStorage.setItem(this.ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
                window.dispatchEvent(new CustomEvent('orderUpdate', { detail: { orders: updatedOrders } }));

            } catch (error) {
                console.error('Error polling order status:', error);
                clearInterval(pollInterval);
            }
        }, 5000); // Poll every 5 seconds

        // Stop polling after 15 minutes
        setTimeout(() => {
            clearInterval(pollInterval);
        }, this.ORDER_EXPIRY_TIME);

        return () => clearInterval(pollInterval);
    }

    // Order Management Methods
    async getActiveOrders(): Promise<Order[]> {
        this.removeExpiredOrders();
        const savedOrders = this.getSavedOrders();
        return savedOrders.filter(order => 
            !['completed', 'failed', 'cancelled', 'expired'].includes(order.status)
        );
    }

    async getOrderHistory(): Promise<Order[]> {
        this.removeExpiredOrders();
        const savedOrders = this.getSavedOrders();
        return savedOrders.filter(order => 
            ['completed', 'failed', 'cancelled', 'expired'].includes(order.status)
        );
    }
}

export default new TradingService({ baseUrl: 'http://10.0.0.2:8000' });
