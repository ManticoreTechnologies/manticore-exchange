import { Listing as ServiceListing, Balance as ServiceBalance, Price as ServicePrice } from '../../services/TradingService';

export type Listing = ServiceListing;
export type Balance = ServiceBalance;
export type Price = ServicePrice;

export interface SelectedListing extends Listing {
    units?: number;
    isOwnedByUser?: boolean;
}

export interface CartItem {
    id: string;
    listingId: string;
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    asset_name: string;
    image_ipfs_hash: string | null;
    seller_address: string;
}

export interface CheckoutItem extends CartItem {
    totalPrice: number;
}

export interface CartOrder {
    id: string;
    buyer_address: string;
    payment_address: string;
    status: string;
    items: Array<{
        listing_id: string;
        asset_name: string;
        amount: string;
        price_evr: string;
        fee_evr: string;
        listing_name?: string;
        seller_address?: string;
    }>;
    total_price_evr: string;
    total_fee_evr: string;
    required_payment: string;
    created_at: string;
    updated_at: string;
}

export interface FeaturedListing {
    id: string;
    title: string;
    store_name: string;
    asset_name: string;
    price: string;
    highlight?: string;
    image_hash: string | null;
}

export interface ListingsResponse {
    listings: Listing[];
    total_count: number;
    total_pages: number;
    current_page: number;
    limit: number;
    offset: number;
}

export interface WebSocketMessage {
    type: string;
    data: ListingUpdate | OrderUpdate | BalanceUpdate | MarketUpdate;
}

export interface ListingUpdate {
    id: string;
    [key: string]: any;
}

export interface OrderUpdate {
    listing_id: string;
    [key: string]: any;
}

export interface BalanceUpdate {
    listing_id: string;
    asset_name: string;
    [key: string]: any;
}

export interface MarketUpdate {
    trending?: FeaturedListing[];
    [key: string]: any;
}

export interface WebSocketEvent {
    data: string;
}

export interface WebSocketCloseEvent extends Event {
    code: number;
    reason: string;
    wasClean: boolean;
} 