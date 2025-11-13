import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestUserPermission } from '../config/firebase';

type AuthContextType = {
  isAuthenticated: boolean;
  userData: any | null;
  needsRegistration: boolean;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  setNeedsRegistration: (needs: boolean) => void;
  updateUserData: (data: any) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any | null>(null);
  const [needsRegistration, setNeedsRegistration] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('userData');
      const storedToken = await AsyncStorage.getItem('authToken');
      
      if (storedUserData && storedToken) {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
        setIsAuthenticated(true);
        
        // Check if user needs registration
        if (!parsedUserData.uniqueId) {
          setNeedsRegistration(true);
        } else {
          setNeedsRegistration(false);
        }
        
        // Request notification permission when user is already logged in
        await requestUserPermission();
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  };

  const updateUserData = async (data: any) => {
    try {
      const updatedData = { ...userData, ...data };
      await AsyncStorage.setItem('userData', JSON.stringify(updatedData));
      setUserData(updatedData);
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  };

  const login = async (data: any) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(data));
      await AsyncStorage.setItem('authToken', data.token);
      setUserData(data);
      setIsAuthenticated(true);
      
      // Check if user needs registration (no unique_id means registration is required)
      if (!data.uniqueId) {
        setNeedsRegistration(true);
      } else {
        setNeedsRegistration(false);
      }
      
      // Request notification permission after successful login
      await requestUserPermission();
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('authToken');
      setUserData(null);
      setIsAuthenticated(false);
      setNeedsRegistration(false);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userData, needsRegistration, login, logout, setNeedsRegistration, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
