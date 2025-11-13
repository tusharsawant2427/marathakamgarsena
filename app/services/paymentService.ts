import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PAYMENT_CONFIG } from '../config/paymentConfig';
import {
  CreatePaymentOrderRequest,
  CreatePaymentOrderResponse,
  PaymentStatusRequest,
  PaymentStatusResponse,
  PaymentHistoryRequest,
  PaymentHistoryItem,
  PaymentApiResponse,
} from '../types/payment';

// Create axios instance for payment API
const paymentApi = axios.create({
  baseURL: PAYMENT_CONFIG.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
paymentApi.interceptors.request.use(
  async (config) => {
    // Always add Bearer token for all requests
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Also add API key for payment-specific endpoints
    if (!config.url?.includes('/payment/history')) {
      config.headers['x-api-key'] = PAYMENT_CONFIG.API_KEY;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
paymentApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Payment API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Create a payment order
 * @param userId - User ID
 * @param amount - Payment amount
 * @param description - Payment description
 * @param phoneNumber - User's phone number (required for card payments OTP)
 * @param metadata - Additional metadata (optional)
 * @returns Payment order data with webview URL
 */
export const createPaymentOrder = async (
  userId: number,
  amount: number,
  description: string,
  phoneNumber?: string,
  metadata?: Record<string, any>
): Promise<CreatePaymentOrderResponse> => {
  try {
    const requestData: CreatePaymentOrderRequest = {
      user_id: userId,
      amount,
      currency: 'INR',
      description,
      phone_number: phoneNumber,
      metadata,
    };

    const response = await paymentApi.post<PaymentApiResponse<CreatePaymentOrderResponse>>(
      '/payment/create-order',
      requestData
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to create payment order');
    }
  } catch (error: any) {
    if (error.response?.data?.errors) {
      // Validation errors
      const validationErrors = error.response.data.errors;
      const errorMessages = Object.values(validationErrors).flat().join(', ');
      throw new Error(errorMessages);
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Failed to create payment order. Please try again.');
    }
  }
};

/**
 * Get payment status by order ID
 * @param orderId - Order ID
 * @returns Payment status details
 */
export const getPaymentStatus = async (
  orderId: string
): Promise<PaymentStatusResponse> => {
  try {
    const requestData: PaymentStatusRequest = {
      order_id: orderId,
    };

    const response = await paymentApi.post<PaymentApiResponse<PaymentStatusResponse>>(
      '/payment/status',
      requestData
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to get payment status');
    }
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Failed to get payment status. Please try again.');
    }
  }
};

/**
 * Get payment history for a user
 * @param userId - User ID
 * @returns List of payment history items
 */
export const getPaymentHistory = async (
  userId: number
): Promise<PaymentHistoryItem[]> => {
  try {
    const requestData: PaymentHistoryRequest = {
      user_id: userId,
    };

    const response = await paymentApi.post<PaymentApiResponse<PaymentHistoryItem[]>>(
      '/payment/history',
      requestData
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to get payment history');
    }
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Failed to get payment history. Please try again.');
    }
  }
};

/**
 * Verify payment status after completion
 * This is a helper function to verify payment after WebView completes
 * @param orderId - Order ID
 * @returns Payment status response
 */
export const verifyPayment = async (
  orderId: string
): Promise<PaymentStatusResponse> => {
  try {
    // Wait a bit to ensure webhook processing is complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const paymentStatus = await getPaymentStatus(orderId);
    return paymentStatus;
  } catch (error) {
    throw error;
  }
};

export default {
  createPaymentOrder,
  getPaymentStatus,
  getPaymentHistory,
  verifyPayment,
};
