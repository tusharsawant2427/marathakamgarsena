/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './app/navigation/AppNavigator';
import { LanguageProvider } from './app/context/LanguageContext';
import { AuthProvider } from './app/context/AuthContext';
import SplashScreen from 'react-native-splash-screen';
import { requestUserPermission, onMessageReceived } from './app/config/firebase';
import firebase from '@react-native-firebase/app';
import { firebaseConfig } from './app/config/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkForUpdates, showRateUsDialog } from './app/utils/appUpdates';

const APP_LAUNCH_COUNT_KEY = 'app_launch_count';
const RATE_US_SHOWN_KEY = 'rate_us_shown';
const LAST_UPDATE_CHECK_KEY = 'last_update_check';

const App = () => {
  useEffect(() => {
    const setupApp = async () => {
      try {
        // Initialize Firebase
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
        }
        
        // Request notification permissions
        await requestUserPermission();
        
        // Set up notification listeners
        onMessageReceived();

        // Check for updates (only once per day)
        const lastUpdateCheck = "";//await AsyncStorage.getItem(LAST_UPDATE_CHECK_KEY);
        const today = new Date().toISOString().split('T')[0];
        
        if (lastUpdateCheck !== today) {
          await checkForUpdates();
          await AsyncStorage.setItem(LAST_UPDATE_CHECK_KEY, today);
        }

        // Handle app launch count and rate us dialog
        const launchCount = await AsyncStorage.getItem(APP_LAUNCH_COUNT_KEY);
        const rateUsShown = await AsyncStorage.getItem(RATE_US_SHOWN_KEY);
        
        const newLaunchCount = (parseInt(launchCount || '0', 10) + 1).toString();
        await AsyncStorage.setItem(APP_LAUNCH_COUNT_KEY, newLaunchCount);

        // Show rate us dialog after 5 launches if not shown before
        // Wait for 2 seconds after app launch to show the dialog
        if (parseInt(newLaunchCount, 10) >= 5 && !rateUsShown) {
          setTimeout(() => {
            showRateUsDialog();
            AsyncStorage.setItem(RATE_US_SHOWN_KEY, 'true');
          }, 2000);
        }
        
        // Hide splash screen
        SplashScreen.hide();
      } catch (error) {
        console.error('Error setting up app:', error);
        SplashScreen.hide();
      }
    };

    setupApp();
  }, []);

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
};

export default App;
