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
} from 'react-native';
import { getPaymentStatus } from '../services/paymentService';
import { PaymentStatusResponse } from '../types/payment';

interface PaymentPendingScreenProps {
  route: {
    params: {
      orderId: string;
      amount?: string;
      description?: string;
    };
  };
  navigation: any;
}

const PaymentPendingScreen: React.FC<PaymentPendingScreenProps> = ({
  route,
  navigation,
}) => {
  const { orderId, amount, description } = route.params;
  const [paymentDetails, setPaymentDetails] = useState<PaymentStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const fetchPaymentDetails = async () => {
    try {
      const details = await getPaymentStatus(orderId);
      setPaymentDetails(details);
      
      // If status changed from PENDING, navigate to appropriate screen
      if (details.status === 'SUCCESS') {
        navigation.replace('PaymentSuccess', {
          orderId,
          amount,
          description,
        });
      } else if (details.status === 'FAILED') {
        navigation.replace('PaymentFailed', {
          orderId,
          amount,
          description,
        });
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

  useEffect(() => {
    fetchPaymentDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckStatus = () => {
    setChecking(true);
    fetchPaymentDetails();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Pending Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.pendingCircle}>
            <Text style={styles.clockIcon}>⏱</Text>
          </View>
        </View>

        {/* Pending Message */}
        <Text style={styles.title}>Payment Pending</Text>
        <Text style={styles.subtitle}>
          Your payment is being processed. This may take a few moments.
        </Text>

        {/* Payment Details Card */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#f59e0b" />
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
                <Text style={styles.statusText}>PENDING</Text>
              </View>
            </View>

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

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>What's next?</Text>
          <Text style={styles.infoText}>
            • Your payment is being verified{'\n'}
            • You'll receive a confirmation shortly{'\n'}
            • Check back in a few minutes{'\n'}
            • Contact support if it takes too long
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleCheckStatus}
            disabled={checking}
            activeOpacity={0.8}>
            {checking ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Check Status</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('PaymentHistory')}
            activeOpacity={0.8}>
            <Text style={styles.secondaryButtonText}>View Payment History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tertiaryButton}
            onPress={() => navigation.navigate('Dashboard')}
            activeOpacity={0.8}>
            <Text style={styles.tertiaryButtonText}>Go to Dashboard</Text>
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
  pendingCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  clockIcon: {
    fontSize: 48,
    color: '#fff',
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
    paddingHorizontal: 20,
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
    color: '#f59e0b',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  statusBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#92400e',
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
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingTop: 20,
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
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  tertiaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  tertiaryButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentPendingScreen;
