import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import notifee, { AndroidImportance, AndroidStyle } from '@notifee/react-native';

// Firebase Cloud Messaging (FCM) is used for push notifications
// This file handles FCM token management and notification handling

export const requestUserPermission = async () => {
  try {
    // Request permission from user to receive push notifications
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      // Get FCM token after permission is granted
      const fcmToken = await getFCMToken();
      if (fcmToken) {
        console.log('FCM Token obtained successfully');
      }
    } else {
      console.log('User has declined notification permissions');
      // You might want to show a message to the user about enabling notifications
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
  }
};

export const getFCMToken = async () => {
  try {
    // Get the FCM token which is used to send push notifications to this device
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('FCM Token:', fcmToken);
      // Store the token locally for future use
      await AsyncStorage.setItem('fcmToken', fcmToken);
      return fcmToken;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
  return null;
};

export const onMessageReceived = () => {
  // Handle notifications when app is in foreground
  messaging().onMessage(async remoteMessage => {
    console.log('A new FCM message arrived!', remoteMessage);
    
    // Display notification in system tray
    if (remoteMessage.notification) {
      // Create a channel (required for Android)
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
        vibrationPattern: [300, 500],
      });

      // Display a notification
      await notifee.displayNotification({
        title: remoteMessage.notification.title || 'New Notification',
        body: remoteMessage.notification.body || '',
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
          style: {
            type: AndroidStyle.BIGTEXT,
            text: remoteMessage.notification.body || '',
          },
          sound: 'default',
          vibrationPattern: [300, 500],
        },
      });
    }
  });

  // Handle notifications when app is in background
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notification caused app to open from background state:', remoteMessage);
    // You can add navigation logic here if needed
  });

  // Handle notifications when app is closed
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage);
        // You can add navigation logic here if needed
      }
    });

  // Set background message handler
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    if (remoteMessage.notification) {
      // Create a channel (required for Android)
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
        vibrationPattern: [300, 500],
      });

      // Display a notification
      await notifee.displayNotification({
        title: remoteMessage.notification.title || 'New Notification',
        body: remoteMessage.notification.body || '',
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
          style: {
            type: AndroidStyle.BIGTEXT,
            text: remoteMessage.notification.body || '',
          },
          sound: 'default',
          vibrationPattern: [300, 500],
        },
      });
    }
  });
};