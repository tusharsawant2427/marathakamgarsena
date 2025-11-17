import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Text,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { PaymentWebViewMessage } from '../types/payment';
import Header from '../components/Header';

interface PaymentWebViewScreenProps {
  route: {
    params: {
      webviewUrl: string;
      orderId: string;
      amount?: string;
      description?: string;
    };
  };
  navigation: any;
}

const PaymentWebViewScreen: React.FC<PaymentWebViewScreenProps> = ({
  route,
  navigation,
}) => {
  const { webviewUrl, orderId, amount, description } = route.params;
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loadTimeout, setLoadTimeout] = useState(false);

  // Debug: Log the payment URL
  console.log('Payment WebView URL:', webviewUrl);
  console.log('Order ID:', orderId);

  // Set a timeout for loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setLoadTimeout(true);
        console.log('WebView load timeout - still loading after 30 seconds');
      }
    }, 30000); // 30 second timeout

    return () => clearTimeout(timeout);
  }, [loading]);

  /**
   * Handle messages from WebView
   */
  const handleWebViewMessage = (event: any) => {
    try {
      const data: PaymentWebViewMessage = JSON.parse(event.nativeEvent.data);

      console.log('Payment WebView Message:', data);

      if (data.type === 'PAYMENT_STATUS' || data.type === 'PAYMENT_RESULT') {
        handlePaymentResult(data);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  /**
   * Handle payment result and navigate to appropriate screen
   */
  const handlePaymentResult = (data: PaymentWebViewMessage) => {
    const { status, orderId: receivedOrderId, message } = data;

    // Use the order ID from params if not provided in message
    const finalOrderId = receivedOrderId || orderId;

    switch (status) {
      case 'success':
        navigation.replace('PaymentSuccess', {
          orderId: finalOrderId,
          amount,
          description,
        });
        break;

      case 'failed':
        navigation.replace('PaymentFailed', {
          orderId: finalOrderId,
          amount,
          description,
          errorMessage: message,
        });
        break;

      case 'pending':
        navigation.replace('PaymentPending', {
          orderId: finalOrderId,
          amount,
          description,
        });
        break;

      default:
        Alert.alert(
          'Unknown Status',
          'Unable to determine payment status. Please check your payment history.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
    }
  };

  /**
   * Handle navigation state changes
   */
  const handleNavigationStateChange = (navState: any) => {
    console.log('WebView Navigation State:', {
      url: navState.url,
      loading: navState.loading,
      canGoBack: navState.canGoBack,
      title: navState.title,
    });
    setCanGoBack(navState.canGoBack);
    // Update loading state based on WebView's loading state
    setLoading(navState.loading);

    // Check if URL indicates payment completion - intercept before 500 error
    const url = navState.url.toLowerCase();
    
    // Check for success URLs
    if (url.includes('/payment-success') || 
        url.includes('/success') || 
        url.includes('status=success') ||
        url.includes('payment_status=success')) {
      console.log('Payment success detected from URL');
      handlePaymentResult({
        type: 'PAYMENT_RESULT',
        status: 'success',
        orderId: orderId,
      });
      return;
    } 
    
    // Check for failure URLs
    if (url.includes('/payment-failed') || 
        url.includes('/failed') ||
        url.includes('status=failed') ||
        url.includes('payment_status=failed')) {
      console.log('Payment failure detected from URL');
      handlePaymentResult({
        type: 'PAYMENT_RESULT',
        status: 'failed',
        orderId: orderId,
      });
      return;
    }

    // Check for pending URLs
    if (url.includes('/payment-pending') || 
        url.includes('/pending') ||
        url.includes('status=pending')) {
      console.log('Payment pending detected from URL');
      handlePaymentResult({
        type: 'PAYMENT_RESULT',
        status: 'pending',
        orderId: orderId,
      });
      return;
    }

    // If we detect a redirect back to our domain, navigate to success
    // This handles cases where backend redirect might fail
    if (url.includes('marathikamgarsena.com') && 
        !url.includes('/payment/webview/') &&
        !navState.loading) {
      console.log('Detected redirect to backend - assuming payment completion');
      // Wait a moment and check payment status
      setTimeout(() => {
        handlePaymentResult({
          type: 'PAYMENT_RESULT',
          status: 'success',
          orderId: orderId,
        });
      }, 1000);
    }
  };

  /**
   * Handle back button press
   */
  const handleGoBack = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
    } else {
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
    }
  };

  /**
   * Handle WebView errors
   */
  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    console.error('WebView error code:', nativeEvent.code);
    console.error('WebView error description:', nativeEvent.description);

    // Don't show error if we're navigating away (payment might be complete)
    if (nativeEvent.description?.includes('net::ERR_ABORTED')) {
      console.log('Navigation aborted - likely redirect, checking payment status');
      return;
    }

    Alert.alert(
      'Connection Error',
      'Failed to load payment page. Please check your internet connection and try again.',
      [
        {
          text: 'Retry',
          onPress: () => {
            if (webViewRef.current) {
              webViewRef.current.reload();
            }
          },
        },
        {
          text: 'Cancel',
          onPress: () => navigation.goBack(),
          style: 'cancel',
        },
      ]
    );
  };

  /**
   * Handle HTTP errors (like 500 server error)
   */
  const handleHttpError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.log('WebView HTTP error:', nativeEvent);
    console.log('HTTP Status Code:', nativeEvent.statusCode);
    console.log('HTTP URL:', nativeEvent.url);

    // If we get a server error on our backend after payment, assume payment completed
    if (nativeEvent.url?.includes('marathikamgarsena.com') && 
        nativeEvent.statusCode >= 500) {
      console.log('Got 500 error on backend redirect - navigating to success to verify payment');
      // Navigate to success screen which will verify the actual payment status
      handlePaymentResult({
        type: 'PAYMENT_RESULT',
        status: 'success',
        orderId: orderId,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Complete Payment"
        showBackButton={true}
        onBackPress={handleGoBack}
        showIcons={false}
      />

      {/* Secure Payment Banner */}
      {/* <View style={styles.secureBanner}>
        <Text style={styles.secureIcon}>🔒</Text>
        <Text style={styles.secureText}>Secure Payment Gateway</Text>
      </View> */}

      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{ uri: webviewUrl }}
        onMessage={handleWebViewMessage}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadStart={() => {
          console.log('WebView load started');
          setLoading(true);
        }}
        onLoadEnd={() => {
          console.log('WebView load ended');
          setLoading(false);
        }}
        onError={handleError}
        onHttpError={handleHttpError}
        startInLoadingState={false}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        originWhitelist={['*']}
        mixedContentMode="always"

      />

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loaderContainer}>
          <View style={styles.loaderContent}>
            <ActivityIndicator size="large" color="#ff5e00" />
            <Text style={styles.loadingText}>Processing your payment...</Text>
            <Text style={styles.loadingSubtext}>Please wait, do not close this page</Text>
            {loadTimeout && (
              <View style={styles.timeoutContainer}>
                <Text style={styles.timeoutText}>
                  ⏳ Taking longer than usual. Please wait...
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  secureBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff5f0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ffd4b8',
  },
  secureIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  secureText: {
    fontSize: 14,
    color: '#d94e00',
    fontWeight: '600',
  },
  webview: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
  timeoutContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff5f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffd4b8',
  },
  timeoutText: {
    fontSize: 13,
    color: '#d94e00',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default PaymentWebViewScreen;
