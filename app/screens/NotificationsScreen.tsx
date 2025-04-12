import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../components/Header';

type RootStackParamList = {
  Dashboard: undefined;
  Notifications: undefined;
};

type NotificationsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Notifications'>;
};

const NotificationsScreen = ({ navigation }: NotificationsScreenProps) => {
  const notifications = [
    {
      id: '1',
      title: '8369519408',
      message: 'जय महाराष्ट्र - आपले अॅप अपडेट करा ! व जास्तीत जास्त लोकांपर्यंत अॅप शेअर करा',
    },
    {
      id: '2',
      title: 'संपर्क साधा 8369519408',
      message: 'कामगार किंवा कर्मचारी म्हणुन आपल्याला काही अडचण असेल तर मराठी कामगार सेनेशी संपर्क साधा.',
    },
    {
      id: '3',
      title: 'संपर्क साधा',
      message: 'कामगार किंवा कर्मचारी म्हणुन आपल्याला काही अडचण असेल तर मराठी कामगार सेनेशी संपर्क साधा 8369519408',
    },
    {
      id: '4',
      title: 'NEW NEWS',
      message: 'News: आता मनुचे ते टास्क्स बना ऑनलाइन प्रणाली द्वारे !',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header
        title="Notifications"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        showIcons={false}
      />


      <ScrollView style={styles.content}>
        {notifications.map((notification) => (
          <View key={notification.id} style={styles.notificationCard}>
            <View style={styles.bellIconContainer}>
              <Image
                source={require('../../assets/bell.png')}
                style={styles.bellIcon}
              />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FF4E0E',
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 16,
  },
  pattern: {
    height: 20,
    backgroundColor: '#FF4E0E',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bellIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF4E0E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bellIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
  },
});

export default NotificationsScreen; 