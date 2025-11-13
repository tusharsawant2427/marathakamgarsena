import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { getPaymentStatus } from '../services/paymentService';
import { PaymentStatusResponse } from '../types/payment';
import { useAuth } from '../context/AuthContext';

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
  const [loading, setLoading] = useState(true);
  const [activatingIDCard, setActivatingIDCard] = useState(false);
  const [idCardActivated, setIdCardActivated] = useState(false);

  const fetchPaymentDetails = async () => {
    try {
      const details = await getPaymentStatus(orderId);
      setPaymentDetails(details);
      
      // If payment is successful and ID card not yet activated, activate it
      if (details.status === 'SUCCESS' && !idCardActivated) {
        await activateIDCard();
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
    } finally {
      setLoading(false);
    }
  };

  const activateIDCard = async () => {
    if (!userData?.token || activatingIDCard) {
      return;
    }

    setActivatingIDCard(true);
    try {
      // First API call to request ID card
      const requestResponse = await fetch('https://marathikamgarsena.com/api/request-for-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
        },
        body: JSON.stringify({
          id_card_id: 1,
        }),
      });

      const requestData = await requestResponse.json();

      if (!requestData.success) {
        console.error('ID card request failed:', requestData.message);
        setActivatingIDCard(false);
        return;
      }

      // Second API call to update ID card status
      const updateResponse = await fetch('https://marathikamgarsena.com/api/update-for-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
        },
        body: JSON.stringify({
          id_card_id: 1,
          order_id: requestData.data.order_id,
          transaction_id: requestData.data.transaction_id,
        }),
      });

      const updateData = await updateResponse.json();

      if (updateData.success) {
        const subscriptionEndDate = updateData.data.subscription_end_date;
        
        // Update user's premium status
        await updateUserData({
          isPremium: true,
          expiryDate: subscriptionEndDate,
        });

        setIdCardActivated(true);
        Alert.alert(
          'ID Card Activated!',
          'Your ID card has been activated successfully. You can now download it.',
          [{ text: 'OK' }]
        );
      } else {
        console.error('ID card update failed:', updateData.message);
      }
    } catch (error) {
      console.error('Error activating ID card:', error);
    } finally {
      setActivatingIDCard(false);
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
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.successCircle}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        </View>

        {/* Success Message */}
        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.subtitle}>
          Your payment has been processed successfully
        </Text>

        {/* Payment Details Card */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#667eea" />
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

        {/* ID Card Activation Status */}
        {activatingIDCard && (
          <View style={styles.activationBox}>
            <ActivityIndicator size="small" color="#667eea" />
            <Text style={styles.activationText}>Activating your ID card...</Text>
          </View>
        )}

        {idCardActivated && (
          <View style={styles.successBox}>
            <Text style={styles.successBoxIcon}>✓</Text>
            <Text style={styles.successBoxText}>ID Card Activated Successfully!</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {idCardActivated && (
            <TouchableOpacity
              style={styles.idCardButton}
              onPress={() => navigation.navigate('ApplyIDCard')}
              activeOpacity={0.8}>
              <Text style={styles.idCardButtonText}>📥 Download ID Card</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('PaymentHistory', {})}
            activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>View Payment History</Text>
          </TouchableOpacity>

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
    marginTop: 40,
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
    fontSize: 16,
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
    color: '#10b981',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  statusBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#065f46',
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af',
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
    gap: 12,
  },
  activationText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  successBox: {
    backgroundColor: '#d1fae5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  successBoxIcon: {
    fontSize: 20,
    color: '#10b981',
    fontWeight: 'bold',
  },
  successBoxText: {
    fontSize: 15,
    color: '#065f46',
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingTop: 20,
  },
  idCardButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#10b981',
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
    backgroundColor: '#667eea',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#667eea',
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
