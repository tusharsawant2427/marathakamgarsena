/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LanguageProvider } from './app/context/LanguageContext';
import AppNavigator from './app/navigation/AppNavigator';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <LanguageProvider>
      <AppNavigator />
    </LanguageProvider>
  );
}

export default App;
