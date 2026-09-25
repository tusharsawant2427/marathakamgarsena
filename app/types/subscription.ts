// Subscription Types

export interface SubscriptionStatus {
  id: number;
  user_id: number;
  id_card_id: number | null;
  subscription_start_date: string;
  subscription_end_date: string;
  status: 'active' | 'expired' | 'cancelled';
  is_free: boolean;
  payment_id: number | null;
  amount: string;
  days_remaining: number;
  is_active: boolean;
  is_expired: boolean;
}

export interface SubscriptionHistoryItem {
  id: number;
  subscription_start_date: string;
  subscription_end_date: string;
  status: 'active' | 'expired' | 'cancelled';
  is_free: boolean;
  amount: string;
  payment_id: number | null;
  payment?: {
    id: number;
    order_id: string;
    amount: string;
    status: string;
    payment_time: string;
  } | null;
}

export interface IDCard {
  id: number;
  name: string;
  price: string;
  validity_years: number;
  features: string[];
}

export interface SubscriptionApiResponse<T> {
  success: boolean;
  message?: string;
  subscription?: T;
  subscriptions?: T[];
  id_cards?: IDCard[];
  total_count?: number;
  errors?: Record<string, string[]>;
}

export interface InitiateRenewalRequest {
  user_id: number;
  id_card_id?: number;
  amount: number;
}

export interface InitiateRenewalResponse {
  order_id: string;
  cf_order_id: string;
  payment_session_id: string;
  amount: number;
  currency: string;
  status: string;
  webview_url: string;
}
