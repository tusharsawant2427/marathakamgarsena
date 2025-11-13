import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import PaymentButton from '../components/PaymentButton';

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
  const [amount, setAmount] = useState('100');
  const [description, setDescription] = useState('Membership fee payment');

  // Get user ID and phone from auth context
  const userId = userData?.id || 1;
  const phoneNumber = userData?.mobile || userData?.phone_number;

  const handlePaymentInitiated = () => {
    console.log('Payment initiated successfully');
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
  };

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
        <Text style={styles.headerTitle}>Make Payment</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('PaymentHistory', {})}
          style={styles.historyButton}>
          <Text style={styles.historyButtonText}>History</Text>
        </TouchableOpacity>
      </View>

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

          {/* Amount Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Amount (₹)</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="Enter amount"
              placeholderTextColor="#9ca3af"
            />
          </View>

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
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Amount:</Text>
              <Text style={styles.summaryValue}>₹{amount || '0'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Processing Fee:</Text>
              <Text style={styles.summaryValue}>₹0</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total Payable:</Text>
              <Text style={styles.totalValue}>₹{amount || '0'}</Text>
            </View>
          </View>

          {/* Payment Button */}
          <PaymentButton
            userId={userId}
            amount={parseFloat(amount) || 0}
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

        {/* Quick Amount Buttons */}
        <View style={styles.quickAmountCard}>
          <Text style={styles.quickAmountTitle}>Quick Amount Selection</Text>
          <View style={styles.quickAmountGrid}>
            {['100', '500', '1000', '2000'].map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={[
                  styles.quickAmountButton,
                  amount === quickAmount && styles.quickAmountButtonActive,
                ]}
                onPress={() => setAmount(quickAmount)}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.quickAmountText,
                    amount === quickAmount && styles.quickAmountTextActive,
                  ]}>
                  ₹{quickAmount}
                </Text>
              </TouchableOpacity>
            ))}
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
  historyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  historyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
  },
  scrollContent: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  infoIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#3b82f6',
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
    color: '#667eea',
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
    gap: 8,
  },
  methodItem: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  quickAmountCard: {
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
  quickAmountTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  quickAmountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAmountButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  quickAmountButtonActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  quickAmountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  quickAmountTextActive: {
    color: '#fff',
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  securityIcon: {
    fontSize: 20,
  },
  securityText: {
    fontSize: 13,
    color: '#166534',
    fontWeight: '500',
  },
});

export default ExamplePaymentScreen;
