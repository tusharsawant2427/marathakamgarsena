import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ContactUsScreen from '../screens/ContactUsScreen';
import IssuesScreen from '../screens/IssuesScreen';
import LaborLawsScreen from '../screens/LaborLawsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ApplyIDCardScreen from '../screens/ApplyIDCardScreen';
import OtpScreen from '../screens/OtpScreen';
import AddIssueScreen from '../screens/AddIssueScreen';
import PdfViewerScreen from '../screens/PdfViewerScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import NewsDetailScreen from '../screens/NewsDetailScreen';
import NewsScreen from '../screens/NewsScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isAuthenticated, needsRegistration } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator 
        key={`${isAuthenticated}-${needsRegistration}`}
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="OtpScreen" component={OtpScreen} />
            {/* <Stack.Screen name="Registration" component={RegistrationScreen} /> */}
          </>
        ) : (needsRegistration) ? (
          <>
            <Stack.Screen name="Registration" component={RegistrationScreen} />
          </>
        ) : (
          <>
            {/* <Stack.Screen name="Registration" component={RegistrationScreen} /> */}
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="News" component={NewsScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="ContactUs" component={ContactUsScreen} />
            <Stack.Screen name="Issues" component={IssuesScreen} />
            <Stack.Screen name="AddIssue" component={AddIssueScreen} />
            <Stack.Screen name="LaborLaws" component={LaborLawsScreen} />
            <Stack.Screen name="PdfViewer" component={PdfViewerScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="ApplyIDCard" component={ApplyIDCardScreen} />
            <Stack.Screen name="NewsDetail" component={NewsDetailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 