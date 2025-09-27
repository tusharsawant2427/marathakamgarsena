import VersionCheck from 'react-native-version-check';
import { Alert, Linking, Platform } from 'react-native';
import Rate, { AndroidMarket } from 'react-native-rate';

export const checkForUpdates = async () => {
  try {
    const updateNeeded = await VersionCheck.needUpdate();
    if (updateNeeded && updateNeeded.isNeeded) {
      Alert.alert(
        'Update Available',
        `A new version (${updateNeeded.latestVersion}) is available. Your current version is ${updateNeeded.currentVersion}. Would you like to update now?`,
        [
          {
            text: 'Update Now',
            onPress: () => {
              Linking.openURL(updateNeeded.storeUrl);
            },
          },
          {
            text: 'Later',
            style: 'cancel',
          },
        ],
        { cancelable: false }
      );
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
  }
};

export const showRateUsDialog = () => {
  Alert.alert(
    'Enjoying the App?',
    'Would you like to rate our app? Your feedback helps us improve!',
    [
      {
        text: 'Rate Now',
        onPress: () => {
          const options = {
            AppleAppID: '1663354983',
            GooglePackageName: 'comm.mks.india',
            preferredAndroidMarket: AndroidMarket.Google,
            preferInApp: false,
            openAppStoreIfInAppFails: true,
            fallbackPlatformURL: 'https://play.google.com/store/apps/details?id=comm.mks.india',
          };

          Rate.rate(options, (success) => {
            if (success) {
              console.log('User rated the app');
            }
          });
        },
      },
      {
        text: 'Maybe Later',
        style: 'cancel',
      },
    ],
    { cancelable: false }
  );
}; 