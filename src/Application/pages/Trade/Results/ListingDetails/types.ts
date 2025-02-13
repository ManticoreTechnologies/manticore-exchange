export interface Balance {
  asset_name: string;
  confirmed_balance: string;
  pending_balance: string;
  last_confirmed_tx_hash: string | null;
  last_confirmed_tx_time: string | null;
  units: number;
  created_at?: string;
  updated_at?: string;
}

export interface Price {
  asset_name: string;
  price_evr: string;
  price_asset_name: string | null;
  price_asset_amount: string | null;
  ipfs_hash: string | null;
  units: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  tx_hash: string;
  address: string;
  entry_type: 'receive' | 'send';
  amount: string;
  fee: string | null;
  confirmations: number;
  time: string | null;
  asset_type: string;
  asset_message: string | null;
  trusted: boolean;
  bip125_replaceable: boolean;
  abandoned: boolean;
}

export interface PriceHistoryEntry {
  time: string;
  asset_name: string;
  num_sales: number;
  min_price: string;
  max_price: string;
  avg_price: string;
  volume: string;
  price_evr?: string | null;
  price_asset_name?: string | null;
  price_asset_amount?: string | null;
  change_type?: string;
  timestamp?: string;
}

export interface AssetHistoryEntry {
  change_amount: string;
  change_type: string;
  tx_hash: string;
  timestamp: string;
}

export interface Listing {
  id: string;
  seller_address: string;
  listing_address: string;
  deposit_address: string;
  payout_address: string;
  name: string;
  description: string;
  image_ipfs_hash: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  prices: Price[];
  balances: Balance[];
  isOwnedByUser?: boolean;
} 