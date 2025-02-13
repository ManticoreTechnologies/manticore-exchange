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
    totalPrice: number;
    asset_name: string;
    image_ipfs_hash?: string | null;
    seller_address: string;
}

export interface CheckoutItem {
    id: string;
    listingId: string;
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    asset_name: string;
    image_ipfs_hash?: string | null;
    seller_address: string;
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