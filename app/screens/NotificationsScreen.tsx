import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { fetchNotifications } from '../services/api';

type RootStackParamList = {
  Dashboard: undefined;
  Notifications: undefined;
};

type NotificationsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Notifications'>;
};

const NotificationsScreen = ({ navigation }: NotificationsScreenProps) => {
  const { userData, login } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadNotifications = async (pageNum: number, refresh = false) => {
    if (loading || (!hasMore && !refresh) || !userData.token) return;

    try {
      setLoading(true);
      const response = await fetchNotifications(pageNum, userData.token);
      
      if (response.success) {
        if (refresh || pageNum === 1) {
          setNotifications(response.data.notifications);
        } else {
          setNotifications(prev => [...prev, ...response.data.notifications]);
        }
        setHasMore(response.data.notifications.length > 0);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotifications(1);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadNotifications(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      loadNotifications(page + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header
        title="Notifications"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        showIcons={false}
      />

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const paddingToBottom = 20;
          const isCloseToBottom = layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
          
          if (isCloseToBottom && !loading && hasMore) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        {notifications.map((notification) => (
          <View key={notification.id} style={styles.notificationCard}>
            <View style={styles.bellIconContainer}>
              <Image
                source={require('../../assets/bell.png')}
                style={styles.bellIcon}
              />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{notification.name}</Text>
              <Text style={styles.notificationMessage}>{notification.description}</Text>
              <Text style={styles.notificationDate}>
                {new Date(notification.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>
        ))}
        {loading && !refreshing && (
          <ActivityIndicator size="large" color="#FF4E0E" style={styles.loader} />
        )}
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
    marginBottom: 4,
  },
  notificationDate: {
    fontSize: 12,
    color: '#999',
  },
  loader: {
    marginVertical: 16,
  },
});

export default NotificationsScreen; 