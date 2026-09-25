import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { getPaymentStatus } from '../services/paymentService';
import { getSubscriptionStatus } from '../services/subscriptionService';
import { PaymentStatusResponse } from '../types/payment';
import { SubscriptionStatus } from '../types/subscription';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

interface PaymentSuccessScreenProps {
  route: {
    params: {
      orderId: string;
      amount?: string;
      description?: string;
    };
  };
  navigation: any;
}

const PaymentSuccessScreen: React.FC<PaymentSuccessScreenProps> = ({
  route,
  navigation,
}) => {
  const { orderId, amount, description } = route.params;
  const { userData, updateUserData } = useAuth();
  const [paymentDetails, setPaymentDetails] = useState<PaymentStatusResponse | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingSubscription, setCheckingSubscription] = useState(false);

  const fetchPaymentDetails = async () => {
    try {
      const details = await getPaymentStatus(orderId);
      setPaymentDetails(details);
      
      // If payment is successful, check subscription status
      if (details.status === 'SUCCESS' && userData?.id) {
        await checkSubscriptionStatus();
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSubscriptionStatus = async () => {
    if (!userData?.id || checkingSubscription) {
      return;
    }

    setCheckingSubscription(true);
    try {
      const subscriptionStatus = await getSubscriptionStatus(userData.id);
      
      if (subscriptionStatus) {
        setSubscription(subscriptionStatus);
        
        // Update user's premium status if subscription is active
        if (subscriptionStatus.status === 'active' && subscriptionStatus.is_active) {
          // Force update the user data with premium status
          await updateUserData({
            isPremium: true,
            is_premium: true,
            expiryDate: subscriptionStatus.subscription_end_date,
            subscription_end_date: subscriptionStatus.subscription_end_date,
            days_remaining: subscriptionStatus.days_remaining,
          });

          console.log('Premium status updated successfully');
          
          Alert.alert(
            'Subscription Active!',
            `Your subscription has been activated successfully. Valid until ${formatDate(subscriptionStatus.subscription_end_date)}`,
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error: any) {
      console.error('Error checking subscription status:', error);
      // Don't show error alert as this is automatic check
    } finally {
      setCheckingSubscription(false);
    }
  };

  useEffect(() => {
    fetchPaymentDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) {
      return 'N/A';
    }
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

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Payment Success"
        showBackButton={false}
        showIcons={false}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.successCircle}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        </View>

        {/* Success Message */}
        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.subtitle}>Thank you for your payment</Text>
        <Text style={styles.subtitleSecondary}>
          Your transaction has been completed successfully
        </Text>

        {/* Payment Details Card */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff5e00" />
            <Text style={styles.loadingText}>Loading payment details...</Text>
          </View>
        ) : (
          <View style={styles.detailsCard}>
            <Text style={styles.cardTitle}>Payment Details</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Order ID</Text>
              <Text style={styles.detailValue}>{orderId}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount</Text>
              <Text style={styles.detailAmountValue}>
                ₹{paymentDetails?.amount || amount || '0.00'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>SUCCESS</Text>
              </View>
            </View>

            {paymentDetails?.payment_method && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Method</Text>
                <Text style={styles.detailValue}>
                  {paymentDetails.payment_method.toUpperCase()}
                </Text>
              </View>
            )}

            {paymentDetails?.payment_time && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Time</Text>
                <Text style={styles.detailValue}>
                  {formatDate(paymentDetails.payment_time)}
                </Text>
              </View>
            )}

            {(paymentDetails?.description || description) && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Description</Text>
                <Text style={styles.detailValue}>
                  {paymentDetails?.description || description}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Info Message */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            A confirmation has been sent to your registered email address.
          </Text>
        </View>

        {/* Subscription Status */}
        {checkingSubscription && (
          <View style={styles.activationBox}>
            <ActivityIndicator size="small" color="#ff5e00" />
            <Text style={styles.activationText}>Checking subscription status...</Text>
          </View>
        )}

        {subscription && subscription.status === 'active' && (
          <View style={styles.successBox}>
            <Text style={styles.successBoxIcon}>✓</Text>
            <View>
              <Text style={styles.successBoxText}>Subscription Active!</Text>
              <Text style={styles.successBoxSubtext}>
                Valid until {formatDate(subscription.subscription_end_date)}
              </Text>
              {subscription.days_remaining <= 30 && (
                <Text style={styles.expiryWarning}>
                  ⚠️ {subscription.days_remaining} days remaining
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {subscription && subscription.status === 'active' && subscription.is_active && (
            <TouchableOpacity
              style={styles.idCardButton}
              onPress={() => navigation.navigate('ApplyIDCard')}
              activeOpacity={0.8}>
              <Text style={styles.idCardButtonText}>📥 View ID Card</Text>
            </TouchableOpacity>
          )}
{/* 
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('PaymentHistory', {})}
            activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>View Payment History</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Dashboard')}
            activeOpacity={0.8}>
            <Text style={styles.secondaryButtonText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  checkmark: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#ff5e00',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitleSecondary: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#6b7280',
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  detailAmountValue: {
    fontSize: 18,
    color: '#ff5e00',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  statusBadge: {
    backgroundColor: '#fff5f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff5e00',
  },
  statusText: {
    fontSize: 12,
    color: '#ff5e00',
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#fff5f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#ff5e00',
  },
  infoText: {
    fontSize: 14,
    color: '#d94e00',
    lineHeight: 20,
  },
  activationBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activationText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginLeft: 12,
  },
  successBox: {
    backgroundColor: '#d1fae5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#10b981',
  },
  successBoxIcon: {
    fontSize: 20,
    color: '#10b981',
    fontWeight: 'bold',
    marginRight: 12,
    marginTop: 2,
  },
  successBoxText: {
    fontSize: 15,
    color: '#065f46',
    fontWeight: '600',
    marginBottom: 4,
  },
  successBoxSubtext: {
    fontSize: 13,
    color: '#047857',
    marginTop: 2,
  },
  expiryWarning: {
    fontSize: 12,
    color: '#d97706',
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingTop: 20,
  },
  idCardButton: {
    backgroundColor: '#ff5e00',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#ff5e00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  idCardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#ff5e00',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#ff5e00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentSuccessScreen;
