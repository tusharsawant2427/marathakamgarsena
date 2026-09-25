# Cashfree Native SDK Implementation

This document describes the implementation of Cashfree's native SDK for React Native, replacing the previous WebView-based payment flow.

## Overview

The Cashfree Native SDK provides a better user experience with:
- **Native payment UI** instead of WebView
- **Real-time payment callbacks** without relying on webhooks
- **Better error handling** with specific error codes
- **Support for all payment methods**: UPI, Cards, NetBanking, Wallets
- **Faster payment processing** with native performance

## Architecture

### Flow Diagram
```
User clicks "Pay" 
  → PaymentButton creates order via API
  → Navigate to CashfreePaymentScreen with sessionId
  → Cashfree SDK opens native payment UI
  → User completes payment
  → onVerify callback → Navigate to PaymentSuccessScreen
  → PaymentSuccessScreen verifies with backend
```

## Files Changed/Created

### New Files
1. **`app/screens/CashfreePaymentScreen.tsx`** - Native payment screen using Cashfree SDK
2. **`CASHFREE_SDK_IMPLEMENTATION.md`** - This documentation

### Modified Files
1. **`android/build.gradle`** - Added Cashfree Maven repository
2. **`app/components/PaymentButton.tsx`** - Updated to use native SDK
3. **`app/services/paymentService.ts`** - Added `useNativeSDK` parameter
4. **`app/types/navigation.ts`** - Added `CashfreePayment` screen type
5. **`app/navigation/AppNavigator.tsx`** - Registered new payment screen
6. **`package.json`** - Added `react-native-cashfree-pg-sdk` dependency

## Installation

### 1. Install Package
```bash
npm install react-native-cashfree-pg-sdk --save
```

### 2. Android Configuration

#### Add Maven Repository
File: `android/build.gradle`
```gradle
repositories {
    google()
    mavenCentral()
    maven { url 'https://maven.cashfree.com/release' }
}
```

### 3. Link Native Modules
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

## Usage

### Payment Flow

#### 1. Create Payment Order
The backend API creates a payment order and returns:
- `order_id`: Unique order identifier
- `payment_session_id`: Cashfree session ID for SDK
- `webview_url`: Fallback WebView URL (if SDK fails)

#### 2. Initialize Payment
```tsx
import { PaymentButton } from '../components/PaymentButton';

<PaymentButton
  userId={userData.id}
  description="ID Card payment"
  phoneNumber={userData.mobileNumber}
  buttonText="Pay Now"
  metadata={{ source: 'mobile_app' }}
  onPaymentInitiated={() => console.log('Payment initiated')}
  onPaymentError={(error) => console.log('Error:', error)}
/>
```

#### 3. SDK Payment Screen
The `CashfreePaymentScreen` component:
- Receives `sessionId` and `orderId` as navigation params
- Creates `CFSession` with environment (SANDBOX/PRODUCTION)
- Calls `CFPaymentGatewayService.doWebPayment()` to open native UI
- Handles callbacks: `onVerify` (success) and `onError` (failure)

#### 4. Payment Callbacks

**Success Callback:**
```typescript
onVerify: (orderIdFromCallback: string) => {
  // Payment completed successfully
  // Navigate to success screen for backend verification
  navigation.replace('PaymentSuccess', { orderId });
}
```

**Error Callback:**
```typescript
onError: (error: any, orderIdFromCallback: string) => {
  // Payment failed or user cancelled
  const errorMessage = error?.message || 'Payment failed';
  const errorCode = error?.code;
  
  if (errorCode === 'USER_CANCELLED') {
    // User cancelled payment
  } else {
    // Payment error
    navigation.replace('PaymentFailed', { orderId, errorMessage });
  }
}
```

## Cashfree SDK API Reference

### CFSession
Creates a payment session:
```typescript
const cfSession = new CFSession(
  sessionId: string,        // From backend API
  orderId: string,          // From backend API
  environment: CFEnvironment // SANDBOX or PRODUCTION
);
```

### CFEnvironment
```typescript
CFEnvironment.SANDBOX     // For testing
CFEnvironment.PRODUCTION  // For live payments
```

### CFPaymentGatewayService
Main service for payment operations:
```typescript
CFPaymentGatewayService.doWebPayment(
  session: CFSession,
  callback: CFCallback,
  theme?: CFTheme
);
```

### CFThemeBuilder
Customize payment UI colors:
```typescript
const cfTheme = new CFThemeBuilder()
  .setNavigationBarBackgroundColor('#ff5e00')
  .setNavigationBarTextColor('#ffffff')
  .setButtonBackgroundColor('#ff5e00')
  .setButtonTextColor('#ffffff')
  .setPrimaryTextColor('#1f2937')
  .setSecondaryTextColor('#6b7280')
  .build();
```

### CFCallback Interface
```typescript
interface CFCallback {
  onVerify: (orderId: string) => void;
  onError: (error: any, orderId: string) => void;
}
```

## Backend Requirements

Your backend API must return a `payment_session_id` when creating an order:

### Request
```json
POST /payment/create-order
{
  "user_id": 1,
  "amount": 500,
  "currency": "INR",
  "description": "ID Card payment",
  "phone_number": "9876543210"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "order_id": "order_123456",
    "cf_order_id": "cf_order_789",
    "payment_session_id": "session_abc123xyz", // Required for SDK
    "webview_url": "https://...",
    "amount": "500.00",
    "currency": "INR"
  }
}
```

## Error Handling

### Common Error Codes
- `USER_CANCELLED`: User cancelled the payment
- `NETWORK_ERROR`: Network connectivity issue
- `PAYMENT_FAILED`: Payment processing failed
- `INVALID_SESSION`: Session expired or invalid

### Error Handling in Code
```typescript
const handlePaymentError = (error: any, orderId: string) => {
  const errorCode = error?.code || error?.error?.code;
  const errorMessage = error?.message || 'Payment failed';
  
  switch (errorCode) {
    case 'USER_CANCELLED':
      Alert.alert('Cancelled', 'Payment was cancelled');
      break;
    case 'NETWORK_ERROR':
      Alert.alert('Network Error', 'Check your internet connection');
      break;
    default:
      navigation.replace('PaymentFailed', { orderId, errorMessage });
  }
};
```

## Testing

### Test Mode
Set environment to SANDBOX in `paymentConfig.ts`:
```typescript
export const PAYMENT_CONFIG = {
  ENVIRONMENT: 'sandbox', // Change to 'production' for live
  API_BASE_URL: 'https://marathikamgarsena.com/api',
  API_KEY: 'KAMGARUNION_API_KEY',
};
```

### Test Cards (Sandbox)
Use these test cards in SANDBOX mode:
- **Success**: 4111111111111111
- **Failure**: 4007000000027
- **CVV**: Any 3 digits
- **Expiry**: Any future date

### Test UPI (Sandbox)
- **UPI ID**: success@paytm
- **UPI ID (fail)**: failure@paytm

## Fallback to WebView

If `payment_session_id` is not available, the system automatically falls back to WebView:

```typescript
if (orderData.payment_session_id) {
  // Use native SDK
  navigation.navigate('CashfreePayment', { sessionId, orderId });
} else {
  // Fallback to WebView
  navigation.navigate('PaymentWebView', { webviewUrl, orderId });
}
```

## Migration from WebView

### Before (WebView)
```typescript
navigation.navigate('PaymentWebView', {
  webviewUrl: orderData.webview_url,
  orderId: orderData.order_id
});
```

### After (Native SDK)
```typescript
navigation.navigate('CashfreePayment', {
  sessionId: orderData.payment_session_id,
  orderId: orderData.order_id
});
```

## Benefits Over WebView

| Feature | WebView | Native SDK |
|---------|---------|------------|
| Performance | Slower | Faster |
| UI/UX | Browser-like | Native |
| Error Handling | Limited | Detailed |
| Callbacks | Webhook-dependent | Real-time |
| User Experience | Average | Excellent |
| Payment Methods | All | All |
| 3DS/OTP | Supported | Supported |

## Security

- All payment data is handled by Cashfree's secure SDK
- No sensitive card/UPI data is stored in the app
- Payment session tokens expire after use
- SSL/TLS encryption for all API calls

## Troubleshooting

### Issue: "CFPaymentGatewayService is not defined"
**Solution**: Make sure the package is installed and linked properly. Run:
```bash
npm install react-native-cashfree-pg-sdk
cd android && ./gradlew clean
npx react-native run-android
```

### Issue: "Invalid payment session"
**Solution**: Ensure your backend is returning a valid `payment_session_id` from Cashfree's API.

### Issue: Payment UI not opening
**Solution**: Check that the environment is set correctly (SANDBOX/PRODUCTION) and matches your Cashfree account mode.

### Issue: "Maven repository not found"
**Solution**: Verify `maven { url 'https://maven.cashfree.com/release' }` is added to `android/build.gradle`.

## Support

- **Cashfree Docs**: https://docs.cashfree.com/docs/mobile-sdk-react-native
- **API Reference**: https://docs.cashfree.com/reference
- **Support**: support@cashfree.com

## Version Info

- **Package**: react-native-cashfree-pg-sdk
- **Minimum Android SDK**: 24
- **Target Android SDK**: 35
- **React Native**: 0.79.0
