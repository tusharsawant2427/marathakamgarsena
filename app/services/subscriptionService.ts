import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PAYMENT_CONFIG } from '../config/paymentConfig';
import {
  SubscriptionStatus,
  SubscriptionHistoryItem,
  IDCard,
  InitiateRenewalRequest,
  InitiateRenewalResponse,
} from '../types/subscription';

// Create axios instance for subscription API
const subscriptionApi = axios.create({
  baseURL: PAYMENT_CONFIG.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
subscriptionApi.interceptors.request.use(
  async (config) => {
    // Add Bearer token for all requests
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add API key
    config.headers['x-api-key'] = PAYMENT_CONFIG.API_KEY;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
subscriptionApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Subscription API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Get subscription status for a user
 * @param userId - User ID
 * @returns Current subscription status
 */
export const getSubscriptionStatus = async (
  userId: number
): Promise<SubscriptionStatus | null> => {
  try {
    const response = await subscriptionApi.post<{
      success: boolean;
      message?: string;
      subscription?: SubscriptionStatus;
    }>(
      '/subscription/status',
      { user_id: userId }
    );

    if (response.data.success && response.data.subscription) {
      return response.data.subscription;
    } else {
      return null;
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      // No subscription found
      return null;
    }
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Failed to get subscription status. Please try again.');
    }
  }
};

/**
 * Get subscription history for a user
 * @param userId - User ID
 * @returns List of subscription history items
 */
export const getSubscriptionHistory = async (
  userId: number
): Promise<{ subscriptions: SubscriptionHistoryItem[]; total_count: number }> => {
  try {
    const response = await subscriptionApi.post<{
      success: boolean;
      message?: string;
      subscriptions?: SubscriptionHistoryItem[];
      total_count?: number;
    }>(
      '/subscription/history',
      { user_id: userId }
    );

    if (response.data.success && response.data.subscriptions) {
      return {
        subscriptions: response.data.subscriptions,
        total_count: response.data.total_count || response.data.subscriptions.length,
      };
    } else {
      throw new Error(response.data.message || 'Failed to get subscription history');
    }
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Failed to get subscription history. Please try again.');
    }
  }
};

/**
 * Get available ID cards
 * @returns List of available ID cards
 */
export const getAvailableIDCards = async (): Promise<IDCard[]> => {
  try {
    const response = await subscriptionApi.post<{
      success: boolean;
      message?: string;
      id_cards?: IDCard[];
    }>(
      '/subscription/available-cards',
      {}
    );

    if (response.data.success && response.data.id_cards) {
      return response.data.id_cards;
    } else {
      throw new Error(response.data.message || 'Failed to get available ID cards');
    }
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Failed to get available ID cards. Please try again.');
    }
  }
};

/**
 * Initiate subscription renewal
 * @param userId - User ID
 * @param amount - Renewal amount
 * @param idCardId - Optional ID card type
 * @returns Renewal payment details with webview URL
 */
export const initiateSubscriptionRenewal = async (
  userId: number,
  amount: number,
  idCardId?: number
): Promise<{ payment: InitiateRenewalResponse; webview_url: string }> => {
  try {
    const requestData: InitiateRenewalRequest = {
      user_id: userId,
      amount,
    };

    if (idCardId) {
      requestData.id_card_id = idCardId;
    }

    const response = await subscriptionApi.post<{
      success: boolean;
      message: string;
      payment: InitiateRenewalResponse;
      webview_url: string;
    }>('/subscription/initiate-renewal', requestData);

    if (response.data.success && response.data.payment) {
      return {
        payment: response.data.payment,
        webview_url: response.data.webview_url,
      };
    } else {
      throw new Error(response.data.message || 'Failed to initiate subscription renewal');
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
      throw new Error('Failed to initiate subscription renewal. Please try again.');
    }
  }
};

/**
 * Cancel subscription
 * @param userId - User ID
 * @returns Cancelled subscription details
 */
export const cancelSubscription = async (
  userId: number
): Promise<SubscriptionStatus> => {
  try {
    const response = await subscriptionApi.post<{
      success: boolean;
      message?: string;
      subscription?: SubscriptionStatus;
    }>(
      '/subscription/cancel',
      { user_id: userId }
    );

    if (response.data.success && response.data.subscription) {
      return response.data.subscription;
    } else {
      throw new Error(response.data.message || 'Failed to cancel subscription');
    }
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Failed to cancel subscription. Please try again.');
    }
  }
};

/**
 * Check if user can access ID card
 * @param subscription - Subscription status
 * @returns True if user can access ID card
 */
export const canAccessIDCard = (subscription: SubscriptionStatus | null): boolean => {
  return subscription !== null && subscription.status === 'active' && subscription.is_active;
};

export default {
  getSubscriptionStatus,
  getSubscriptionHistory,
  getAvailableIDCards,
  initiateSubscriptionRenewal,
  cancelSubscription,
  canAccessIDCard,
};
