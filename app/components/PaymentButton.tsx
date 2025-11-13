import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createPaymentOrder } from '../services/paymentService';
import { RootStackParamList } from '../types/navigation';

type NavigationType = NativeStackNavigationProp<RootStackParamList>;

interface PaymentButtonProps {
  userId: number;
  amount: number;
  description: string;
  phoneNumber?: string;
  metadata?: Record<string, any>;
  buttonText?: string;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  loadingColor?: string;
  onPaymentInitiated?: () => void;
  onPaymentError?: (error: string) => void;
}

/**
 * Reusable Payment Button Component
 *
 * Usage:
 * ```tsx
 * <PaymentButton
 *   userId={1}
 *   amount={100}
 *   description="Membership fee payment"
 *   phoneNumber="9876543210"
 *   buttonText="Pay Now"
 *   metadata={{ plan: 'monthly' }}
 * />
 * ```
 */
const PaymentButton: React.FC<PaymentButtonProps> = ({
  userId,
  amount,
  description,
  phoneNumber,
  metadata,
  buttonText = 'Pay Now',
  buttonStyle,
  textStyle,
  loadingColor = '#fff',
  onPaymentInitiated,
  onPaymentError,
}) => {
  const navigation = useNavigation<NavigationType>();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0');
      return;
    }

    setLoading(true);

    try {
      // Create payment order
      const orderData = await createPaymentOrder(
        userId,
        amount,
        description,
        phoneNumber,
        metadata
      );

      setLoading(false);

      // Callback on successful order creation
      if (onPaymentInitiated) {
        onPaymentInitiated();
      }

      // Navigate to WebView with payment URL
      navigation.navigate('PaymentWebView', {
        webviewUrl: orderData.webview_url,
        orderId: orderData.order_id,
        amount: orderData.amount,
        description: description,
      });
    } catch (error: any) {
      setLoading(false);
      const errorMessage = error.message || 'Failed to initiate payment';
      
      Alert.alert('Payment Error', errorMessage);
      
      // Callback on error
      if (onPaymentError) {
        onPaymentError(errorMessage);
      }
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={handlePayment}
      disabled={loading}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator size="small" color={loadingColor} />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{buttonText}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#667eea',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentButton;
