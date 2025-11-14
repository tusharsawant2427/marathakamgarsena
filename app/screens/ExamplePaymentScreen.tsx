import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import PaymentButton from '../components/PaymentButton';
import Header from '../components/Header';

type NavigationType = NativeStackNavigationProp<RootStackParamList>;

/**
 * Example Payment Screen
 * This demonstrates how to integrate Cashfree payments in your app
 *
 * You can add a payment button to any screen:
 * 1. Import PaymentButton component
 * 2. Add it to your screen with required props
 * 3. Handle payment success in PaymentSuccess screen
 */
const ExamplePaymentScreen: React.FC = () => {
  const navigation = useNavigation<NavigationType>();
  const { userData } = useAuth();
  const [description, setDescription] = useState('ID Card payment');
  const [amount, setAmount] = useState<number>(0);
  const [loadingAmount, setLoadingAmount] = useState(true);

  // Get user ID and phone from auth context
  const userId = userData?.id || 1;
  const phoneNumber = userData?.mobile || userData?.phone_number;

  useEffect(() => {
    // Fetch amount from config API
    const loadAmount = async () => {
      try {
        const { fetchConfigAmount } = await import('../services/paymentService');
        const configAmount = await fetchConfigAmount();
        setAmount(configAmount);
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to load payment amount');
      } finally {
        setLoadingAmount(false);
      }
    };

    loadAmount();
  }, []);

  const handlePaymentInitiated = () => {
    console.log('Payment initiated successfully');
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Make Payment"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        showIcons={false}
      
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>💳</Text>
          <Text style={styles.infoTitle}>Secure Payment Gateway</Text>
          <Text style={styles.infoText}>
            Powered by Cashfree - India's leading payment gateway
          </Text>
        </View>

        {/* Payment Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Payment Details</Text>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter payment description"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Payment Summary */}
          <View style={styles.summaryCard}>
            {loadingAmount ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#667eea" />
                <Text style={styles.loadingText}>Loading amount...</Text>
              </View>
            ) : (
              <>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Amount:</Text>
                  <Text style={styles.summaryValue}>₹{amount.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Processing Fee:</Text>
                  <Text style={styles.summaryValue}>₹0</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>Total Payable:</Text>
                  <Text style={styles.totalValue}>₹{amount.toFixed(2)}</Text>
                </View>
              </>
            )}
          </View>

          {/* Payment Button */}
          <PaymentButton
            userId={userId}
            description={description}
            phoneNumber={phoneNumber}
            buttonText="Proceed to Payment"
            metadata={{
              source: 'mobile_app',
              timestamp: new Date().toISOString(),
            }}
            onPaymentInitiated={handlePaymentInitiated}
            onPaymentError={handlePaymentError}
          />

          {/* Alternative Payment Methods Info */}
          <View style={styles.methodsCard}>
            <Text style={styles.methodsTitle}>Accepted Payment Methods</Text>
            <View style={styles.methodsList}>
              <Text style={styles.methodItem}>💳 Credit/Debit Cards</Text>
              <Text style={styles.methodItem}>📱 UPI</Text>
              <Text style={styles.methodItem}>🏦 Net Banking</Text>
              <Text style={styles.methodItem}>💰 Wallets</Text>
            </View>
          </View>
        </View>

       {/* Security Info */}
        <View style={styles.securityCard}>
          <Text style={styles.securityIcon}>🔒</Text>
          <Text style={styles.securityText}>
            Your payment is secured with 256-bit SSL encryption
          </Text>
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
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#fff5f0',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffd4b8',
  },
  infoIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#d94e00',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#ff5e00',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  summaryCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  historyButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 5,
  },
  historyButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff5e00',
  },
  methodsCard: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  methodsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  methodsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  methodItem: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    padding: 16,
  },
  securityIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  securityText: {
    fontSize: 13,
    color: '#166534',
    fontWeight: '500',
  },
});

export default ExamplePaymentScreen;
