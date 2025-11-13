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

interface PaymentFailedScreenProps {
  route: {
    params: {
      orderId: string;
      amount?: string;
      description?: string;
      errorMessage?: string;
    };
  };
  navigation: any;
}

const PaymentFailedScreen: React.FC<PaymentFailedScreenProps> = ({
  route,
  navigation,
}) => {
  const { orderId, amount, description, errorMessage } = route.params;
  const [paymentDetails, setPaymentDetails] = useState<PaymentStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPaymentDetails = async () => {
    try {
      const details = await getPaymentStatus(orderId);
      setPaymentDetails(details);
    } catch (error) {
      console.error('Error fetching payment details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = () => {
    // Navigate back to payment initiation screen
    navigation.navigate('Dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Error Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.errorCircle}>
            <Text style={styles.crossmark}>✕</Text>
          </View>
        </View>

        {/* Error Message */}
        <Text style={styles.title}>Payment Failed</Text>
        <Text style={styles.subtitle}>
          {errorMessage || 'Your payment could not be processed'}
        </Text>

        {/* Payment Details Card */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ef4444" />
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
                <Text style={styles.statusText}>FAILED</Text>
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

        {/* Help Information */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Why did this happen?</Text>
          <Text style={styles.infoText}>
            • Insufficient balance{'\n'}
            • Card/bank declined the transaction{'\n'}
            • Network connectivity issues{'\n'}
            • Transaction timeout{'\n'}
            • Invalid payment details
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleRetry}
            activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('PaymentHistory')}
            activeOpacity={0.8}>
            <Text style={styles.secondaryButtonText}>View Payment History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tertiaryButton}
            onPress={() => navigation.navigate('ContactUs')}
            activeOpacity={0.8}>
            <Text style={styles.tertiaryButtonText}>Contact Support</Text>
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
  errorCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  crossmark: {
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
    color: '#ef4444',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  statusBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#991b1b',
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#92400e',
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

export default PaymentFailedScreen;
