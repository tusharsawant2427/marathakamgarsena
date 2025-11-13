import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { getPaymentHistory } from '../services/paymentService';
import { PaymentHistoryItem } from '../types/payment';
import { PAYMENT_STATUS } from '../config/paymentConfig';

interface PaymentHistoryScreenProps {
  route: {
    params?: {
      userId?: number;
    };
  };
  navigation: any;
}

const PaymentHistoryScreen: React.FC<PaymentHistoryScreenProps> = ({
  route,
  navigation,
}) => {
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const userId = route.params?.userId || 1; // Get from auth context in real app

  const fetchPaymentHistory = async () => {
    try {
      const history = await getPaymentHistory(userId);
      setPayments(history);
    } catch (error: any) {
      console.error('Error fetching payment history:', error);
      Alert.alert('Error', error.message || 'Failed to load payment history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPaymentHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case PAYMENT_STATUS.SUCCESS:
        return '#10b981';
      case PAYMENT_STATUS.FAILED:
        return '#ef4444';
      case PAYMENT_STATUS.PENDING:
        return '#f59e0b';
      case PAYMENT_STATUS.CANCELLED:
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case PAYMENT_STATUS.SUCCESS:
        return '#d1fae5';
      case PAYMENT_STATUS.FAILED:
        return '#fee2e2';
      case PAYMENT_STATUS.PENDING:
        return '#fef3c7';
      case PAYMENT_STATUS.CANCELLED:
        return '#f3f4f6';
      default:
        return '#f3f4f6';
    }
  };

  const handlePaymentPress = (payment: PaymentHistoryItem) => {
    // Navigate to appropriate status screen based on payment status
    switch (payment.status) {
      case PAYMENT_STATUS.SUCCESS:
        navigation.navigate('PaymentSuccess', {
          orderId: payment.order_id,
          amount: payment.amount,
          description: payment.description,
        });
        break;
      case PAYMENT_STATUS.FAILED:
        navigation.navigate('PaymentFailed', {
          orderId: payment.order_id,
          amount: payment.amount,
          description: payment.description,
        });
        break;
      case PAYMENT_STATUS.PENDING:
        navigation.navigate('PaymentPending', {
          orderId: payment.order_id,
          amount: payment.amount,
          description: payment.description,
        });
        break;
      default:
        Alert.alert('Payment Details', `Order ID: ${payment.order_id}\nStatus: ${payment.status}`);
    }
  };

  const renderPaymentItem = ({ item }: { item: PaymentHistoryItem }) => (
    <TouchableOpacity
      style={styles.paymentCard}
      onPress={() => handlePaymentPress(item)}
      activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.leftSection}>
          <Text style={styles.description} numberOfLines={1}>
            {item.description}
          </Text>
          <Text style={styles.orderId}>{item.order_id}</Text>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.amount}>₹{item.amount}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusBgColor(item.status) },
            ]}>
            <Text
              style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Payment Method:</Text>
          <Text style={styles.detailValue}>
            {item.payment_method?.toUpperCase() || 'N/A'}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>
            {formatDate(item.payment_time || item.created_at)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>💳</Text>
      <Text style={styles.emptyTitle}>No Payment History</Text>
      <Text style={styles.emptyText}>
        You haven't made any payments yet.{'\n'}
        Start by making your first payment!
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate('Dashboard')}
        activeOpacity={0.8}>
        <Text style={styles.emptyButtonText}>Go to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Loading payment history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment History</Text>
        <View style={styles.backButton} />
      </View>

      {/* Payment List */}
      <FlatList
        data={payments}
        renderItem={renderPaymentItem}
        keyExtractor={(item) => item.order_id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#667eea']}
            tintColor="#667eea"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#374151',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  leftSection: {
    flex: 1,
    marginRight: 12,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 12,
    color: '#6b7280',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardFooter: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 13,
    color: '#1f2937',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyButton: {
    backgroundColor: '#667eea',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentHistoryScreen;
