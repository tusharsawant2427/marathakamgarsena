import { PaymentStatus } from '../config/paymentConfig';

export interface CreatePaymentOrderRequest {
  user_id: number;
  amount: number;
  currency?: string;
  description: string;
  phone_number?: string;
  metadata?: Record<string, any>;
}

export interface CreatePaymentOrderResponse {
  order_id: string;
  cf_order_id: string;
  payment_session_id: string;
  webview_url: string;
  amount: string;
  currency: string;
  environment: string;
}

export interface PaymentStatusRequest {
  order_id: string;
}

export interface PaymentStatusResponse {
  order_id: string;
  status: PaymentStatus;
  amount: string;
  currency: string;
  payment_method?: string;
  payment_time?: string;
  description: string;
}

export interface PaymentHistoryRequest {
  user_id: number;
}

export interface PaymentHistoryItem {
  order_id: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
  payment_method?: string | null;
  payment_time?: string | null;
  description: string;
  created_at: string;
}

export interface PaymentApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaymentWebViewMessage {
  type: 'PAYMENT_STATUS' | 'PAYMENT_RESULT';
  status: 'success' | 'failed' | 'pending';
  orderId: string;
  message?: string;
}
