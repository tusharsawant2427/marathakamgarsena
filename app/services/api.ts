import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewsItem } from '../types/news';

const API_BASE_URL = 'https://marathikamgarsena.com/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      await AsyncStorage.removeItem('authToken');
      // You might want to navigate to login screen here
    }
    return Promise.reject(error);
  }
);

// Generic API response type
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface NewsResponse {
  id: number;
  name: string;
  content: string;
  file_name: string;
  doc_url?: string;
  news_link?: string;
  created_at: string;
}

// Generic API error type
export interface ApiError {
  message: string;
  status?: number;
}

// Generic API service functions
export const apiService = {
  get: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    try {
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'An error occurred',
        status: error.response?.status,
      } as ApiError;
    }
  },

  post: async <T>(endpoint: string, data: any): Promise<ApiResponse<T>> => {
    try {
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'An error occurred',
        status: error.response?.status,
      } as ApiError;
    }
  },

  put: async <T>(endpoint: string, data: any): Promise<ApiResponse<T>> => {
    try {
      const response = await api.put(endpoint, data);
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'An error occurred',
        status: error.response?.status,
      } as ApiError;
    }
  },

  delete: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    try {
      const response = await api.delete(endpoint);
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'An error occurred',
        status: error.response?.status,
      } as ApiError;
    }
  },
};

export const fetchNews = async (page: number) => {
  try {
    const response = await apiService.post<NewsItem[]>('/news', { page });
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchNotifications = async (pageNum: number, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ page: pageNum }),
    });

    const responseText = await response.text();
    console.log('API Response:', responseText); // Log raw response

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const fetchActiveSubscription = async (token: string) => {
  try {
   const response = await fetch(`${API_BASE_URL}/check-subscription-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const responseText = await response.text();
    console.log('API Response:', responseText); // Log raw response

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return JSON.parse(responseText);
  } catch (error) {
    throw error;
  }
};

export const readNotification = async (notificationId: number, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/read-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ notification_id: notificationId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error reading notification:', error);
    throw error;
  }
};

export const fetchUserDetails = async (token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user-details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const responseText = await response.text();
    console.log('User Details API Response:', responseText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

export default api;