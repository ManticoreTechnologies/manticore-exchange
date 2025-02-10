export interface FeaturedPlan {
    name: string;
    duration_days: number;
    priority_level: number;
    amount_evr: string;
}

export interface FeaturedPayment {
    id: string;
    listing_id: string;
    plan_name: string;
    amount_evr: string;
    payment_address: string;
    status: 'pending' | 'completed' | 'expired';
    expires_at: string;
    created_at: string;
    updated_at: string;
} 