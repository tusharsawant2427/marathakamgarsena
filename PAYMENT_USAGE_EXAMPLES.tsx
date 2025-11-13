/**
 * 💳 CASHFREE PAYMENT INTEGRATION - QUICK START GUIDE
 * 
 * This file shows simple examples of how to use the payment integration
 */

// ============================================================================
// EXAMPLE 1: Add Payment Button to Your Screen
// ============================================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PaymentButton from './app/components/PaymentButton';

const MyMembershipScreen = () => {
  const userId = 1; // Get from your auth context

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Plan</Text>
      
      {/* Monthly Plan */}
      <PaymentButton
        userId={userId}
        amount={100}
        description="Monthly Membership Fee"
        buttonText="Pay ₹100/month"
        metadata={{ plan: 'monthly' }}
      />
      
      {/* Annual Plan */}
      <PaymentButton
        userId={userId}
        amount={1000}
        description="Annual Membership Fee"
        buttonText="Pay ₹1000/year"
        metadata={{ plan: 'annual', discount: 200 }}
      />
    </View>
  );
};

// ============================================================================
// EXAMPLE 2: Custom Payment Flow with Input
// ============================================================================

import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createPaymentOrder } from './app/services/paymentService';

const DonationScreen = () => {
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const userId = 1;

  const handleDonation = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const orderData = await createPaymentOrder(
        userId,
        parseFloat(amount),
        'Donation to Kamgar Union',
        { type: 'donation', date: new Date().toISOString() }
      );

      navigation.navigate('PaymentWebView', {
        webviewUrl: orderData.webview_url,
        orderId: orderData.order_id,
        amount: orderData.amount,
        description: 'Donation',
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter donation amount"
        keyboardType="numeric"
      />
      <Button
        title={loading ? 'Processing...' : 'Donate Now'}
        onPress={handleDonation}
        disabled={loading}
      />
    </View>
  );
};

// ============================================================================
// EXAMPLE 3: Check Payment Status
// ============================================================================

import { getPaymentStatus } from './app/services/paymentService';

const checkMyPaymentStatus = async (orderId) => {
  try {
    const status = await getPaymentStatus(orderId);
    
    console.log('Order ID:', status.order_id);
    console.log('Status:', status.status); // SUCCESS, FAILED, PENDING, CANCELLED
    console.log('Amount:', status.amount);
    console.log('Payment Method:', status.payment_method);
    console.log('Payment Time:', status.payment_time);
    
    if (status.status === 'SUCCESS') {
      Alert.alert('Success', 'Payment completed successfully!');
    } else if (status.status === 'FAILED') {
      Alert.alert('Failed', 'Payment failed. Please try again.');
    } else if (status.status === 'PENDING') {
      Alert.alert('Pending', 'Payment is being processed...');
    }
  } catch (error) {
    console.error('Error checking status:', error);
  }
};

// Usage:
// checkMyPaymentStatus('ORDER_1731434567_1');

// ============================================================================
// EXAMPLE 4: View Payment History
// ============================================================================

import { getPaymentHistory } from './app/services/paymentService';

const MyPaymentsScreen = () => {
  const [payments, setPayments] = useState([]);
  const userId = 1;

  useEffect(() => {
    loadPaymentHistory();
  }, []);

  const loadPaymentHistory = async () => {
    try {
      const history = await getPaymentHistory(userId);
      setPayments(history);
      
      // history is an array of payment objects:
      // [{
      //   order_id: "ORDER_123",
      //   amount: "100.00",
      //   currency: "INR",
      //   status: "SUCCESS",
      //   payment_method: "upi",
      //   payment_time: "2025-11-12T14:30:45",
      //   description: "Membership fee",
      //   created_at: "2025-11-12T14:25:30"
      // }]
      
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  return (
    <FlatList
      data={payments}
      keyExtractor={(item) => item.order_id}
      renderItem={({ item }) => (
        <View>
          <Text>{item.description}</Text>
          <Text>₹{item.amount}</Text>
          <Text>{item.status}</Text>
        </View>
      )}
    />
  );
};

// ============================================================================
// EXAMPLE 5: Navigate to Payment History Screen (Already Built!)
// ============================================================================

import { useNavigation } from '@react-navigation/native';

const SomeScreen = () => {
  const navigation = useNavigation();
  const userId = 1;

  return (
    <Button
      title="View My Payments"
      onPress={() => navigation.navigate('PaymentHistory', { userId })}
    />
  );
};

// ============================================================================
// EXAMPLE 6: Add to Your Dashboard
// ============================================================================

const DashboardScreen = () => {
  const navigation = useNavigation();

  return (
    <View>
      {/* Other dashboard content */}
      
      {/* Add Payment History Button */}
      <TouchableOpacity
        style={styles.paymentHistoryButton}
        onPress={() => navigation.navigate('PaymentHistory', {})}>
        <Text>💳 Payment History</Text>
      </TouchableOpacity>

      {/* Quick Payment Options */}
      <View style={styles.quickPay}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <PaymentButton
          userId={1}
          amount={100}
          description="Monthly Dues"
          buttonText="Pay Monthly Dues"
        />
      </View>
    </View>
  );
};

// ============================================================================
// EXAMPLE 7: Handle Payment Callbacks (Advanced)
// ============================================================================

const AdvancedPaymentScreen = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handlePaymentInitiated = () => {
    console.log('Payment started!');
    // Track analytics
    // Show loading state
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    // Log error to analytics
    // Show error message to user
  };

  return (
    <PaymentButton
      userId={1}
      amount={500}
      description="Service Fee"
      buttonText="Pay Now"
      onPaymentInitiated={handlePaymentInitiated}
      onPaymentError={handlePaymentError}
    />
  );
};

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * To configure the payment gateway, edit:
 * app/config/paymentConfig.ts
 * 
 * Change these values:
 * - API_BASE_URL: Your backend API URL
 * - API_KEY: Your API authentication key
 */

// ============================================================================
// AVAILABLE SCREENS (Already Created!)
// ============================================================================

/**
 * 1. PaymentWebView - Shows Cashfree payment page
 *    Navigate: navigation.navigate('PaymentWebView', { webviewUrl, orderId })
 * 
 * 2. PaymentSuccess - Shows payment success
 *    Navigate: navigation.navigate('PaymentSuccess', { orderId })
 * 
 * 3. PaymentFailed - Shows payment failure
 *    Navigate: navigation.navigate('PaymentFailed', { orderId })
 * 
 * 4. PaymentPending - Shows payment pending
 *    Navigate: navigation.navigate('PaymentPending', { orderId })
 * 
 * 5. PaymentHistory - Shows all payments
 *    Navigate: navigation.navigate('PaymentHistory', { userId })
 * 
 * 6. ExamplePaymentScreen - Complete example implementation
 *    Use as reference for your own screens
 */

// ============================================================================
// STYLING THE PAYMENT BUTTON
// ============================================================================

const CustomStyledButton = () => {
  return (
    <PaymentButton
      userId={1}
      amount={200}
      description="Custom Payment"
      buttonText="Pay ₹200"
      buttonStyle={{
        backgroundColor: '#10b981', // Custom color
        paddingVertical: 20,
        borderRadius: 8,
      }}
      textStyle={{
        fontSize: 18,
        fontWeight: 'bold',
      }}
      loadingColor="#fff"
    />
  );
};

// ============================================================================
// TESTING
// ============================================================================

/**
 * Test Cards (Sandbox):
 * 
 * Success:
 * Card: 4111 1111 1111 1111
 * CVV: 123
 * Expiry: 12/25
 * 
 * Failure:
 * Card: 4111 1111 1111 2222
 * CVV: 123
 * Expiry: 12/25
 * 
 * Test UPI:
 * UPI ID: success@razorpay
 */

// ============================================================================
// THAT'S IT! 🎉
// ============================================================================

/**
 * The payment integration is now complete!
 * 
 * Quick Checklist:
 * ✅ Update paymentConfig.ts with your API details
 * ✅ Add PaymentButton to your screens
 * ✅ Test in sandbox mode
 * ✅ Move to production when ready
 * 
 * For detailed documentation, see: PAYMENT_INTEGRATION_GUIDE.md
 */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paymentHistoryButton: {
    backgroundColor: '#667eea',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
  },
  quickPay: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
});
