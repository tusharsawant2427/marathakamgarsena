import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import OtpScreen from '../screens/OtpScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ContactUsScreen from '../screens/ContactUsScreen';
import IssuesScreen from '../screens/IssuesScreen';
import AddIssueScreen from '../screens/AddIssueScreen';
import LaborLawsScreen from '../screens/LaborLawsScreen';
import PdfViewerScreen from '../screens/PdfViewerScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="ContactUs" component={ContactUsScreen} />
        <Stack.Screen name="Issues" component={IssuesScreen} />
        <Stack.Screen name="AddIssue" component={AddIssueScreen} />
        <Stack.Screen name="LaborLaws" component={LaborLawsScreen} />
        <Stack.Screen name="PdfViewer" component={PdfViewerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 