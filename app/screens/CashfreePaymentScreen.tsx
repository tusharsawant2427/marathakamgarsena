import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { CFPaymentGatewayService } from 'react-native-cashfree-pg-sdk';
import { CFEnvironment, CFSession } from 'cashfree-pg-api-contract';
import type { CFCallback, CFErrorResponse } from 'react-native-cashfree-pg-sdk';
import Header from '../components/Header';

interface CashfreePaymentScreenProps {
  route: {
    params: {
      sessionId: string;
      orderId: string;
      amount: string;
      description?: string;
      environment?: string;
    };
  };
  navigation: any;
}

const CashfreePaymentScreen: React.FC<CashfreePaymentScreenProps> = ({
  route,
  navigation,
}) => {
  const { sessionId, orderId, amount, description, environment } = route.params;

  useEffect(() => {
    console.log('Cashfree Payment Screen - Session ID:', sessionId);
    console.log('Cashfree Payment Screen - Order ID:', orderId);

    // Validate session ID
    if (!sessionId || sessionId.trim() === '') {
      console.error('Invalid or missing payment_session_id, falling back to WebView');
      Alert.alert(
        'Payment Setup Error',
        'Unable to initialize native payment. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
      return;
    }

    const initiatePayment = async () => {
      try {
        // Create payment session
        const cfSession = new CFSession(
          sessionId,
          orderId,
          environment === 'PRODUCTION' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX
        );

        console.log('CFSession created:', { sessionId, orderId, environment });

        // Create payment callback handler
        const cfCallback: CFCallback = {
          onVerify: (orderIdFromCallback: string) => {
            console.log('Payment verification initiated for order:', orderIdFromCallback);
            handlePaymentVerification(orderIdFromCallback);
          },
          onError: (error: CFErrorResponse, orderIdFromCallback: string) => {
            console.error('Payment error:', error);
            console.error('Error code:', error?.getCode());
            console.error('Error message:', error?.getMessage());
            console.error('Order ID:', orderIdFromCallback);
            handlePaymentError(error, orderIdFromCallback);
          },
        };

        // Set callback first
        CFPaymentGatewayService.setCallback(cfCallback);

        // Start payment using Web Checkout (UPI, Cards, NetBanking, Wallets)
        CFPaymentGatewayService.doWebPayment(cfSession);

      } catch (error: any) {
        console.error('Error initiating payment:', error);
        Alert.alert(
          'Payment Error',
          'Failed to initiate payment. Please try again.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    };

    initiatePayment();

    // Cleanup callback on unmount
    return () => {
      CFPaymentGatewayService.removeCallback();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, orderId]);

  /**
   * Handle payment verification
   */
  const handlePaymentVerification = async (orderIdFromCallback: string) => {
    console.log('Payment completed, verifying order:', orderIdFromCallback);

    // Navigate to success screen for backend verification
    navigation.replace('PaymentSuccess', {
      orderId: orderIdFromCallback || orderId,
      amount,
      description,
    });
  };

  /**
   * Handle payment error
   */
  const handlePaymentError = (error: CFErrorResponse, orderIdFromCallback: string) => {
    const errorMessage = error?.getMessage() || 'Payment failed';
    const errorCode = error?.getCode();

    console.error('Payment failed with code:', errorCode);
    console.error('Payment error message:', errorMessage);

    // Check if user cancelled the payment
    if (errorCode === 'user_cancelled' || errorMessage.toLowerCase().includes('cancel')) {
      Alert.alert(
        'Payment Cancelled',
        'You have cancelled the payment.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
      return;
    }

    // Navigate to failure screen
    navigation.replace('PaymentFailed', {
      orderId: orderIdFromCallback || orderId,
      amount,
      description,
      errorMessage,
    });
  };

  /**
   * Handle back button press
   */
  const handleGoBack = () => {
    Alert.alert(
      'Cancel Payment',
      'Are you sure you want to cancel this payment?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Complete Payment"
        showBackButton={true}
        onBackPress={handleGoBack}
        showIcons={false}
      />

      {/* Loading/Processing Overlay */}
      <View style={styles.loaderContainer}>
        <View style={styles.loaderContent}>
          <ActivityIndicator size="large" color="#ff5e00" />
          <Text style={styles.loadingText}>
            Initializing payment...
          </Text>
          <Text style={styles.loadingSubtext}>
            Please wait, do not close this page
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  loaderContent: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    minWidth: 280,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default CashfreePaymentScreen;
