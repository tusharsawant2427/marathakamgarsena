# 💳 Cashfree Payment Gateway Integration - React Native

## Overview

This React Native app is now fully integrated with **Cashfree Payment Gateway** to accept secure online payments. The integration includes complete payment flow management, status tracking, and payment history features.

---

## 🎯 Features Implemented

✅ **Payment Order Creation** - Create payment orders via backend API  
✅ **WebView Payment Flow** - Seamless payment experience in app  
✅ **Payment Status Screens** - Success, Failed, and Pending screens  
✅ **Payment History** - View all past transactions  
✅ **Reusable Components** - PaymentButton component for easy integration  
✅ **Type Safety** - Full TypeScript support  
✅ **Error Handling** - Comprehensive error management  
✅ **Webhook Support** - Backend webhook integration for payment verification  

---

## 📁 Project Structure

```
app/
├── components/
│   └── PaymentButton.tsx          # Reusable payment button component
├── config/
│   └── paymentConfig.ts           # Payment configuration & constants
├── screens/
│   ├── PaymentWebViewScreen.tsx   # WebView for payment processing
│   ├── PaymentSuccessScreen.tsx   # Payment success screen
│   ├── PaymentFailedScreen.tsx    # Payment failure screen
│   ├── PaymentPendingScreen.tsx   # Payment pending screen
│   ├── PaymentHistoryScreen.tsx   # Payment history list
│   └── ExamplePaymentScreen.tsx   # Example implementation
├── services/
│   └── paymentService.ts          # Payment API service
└── types/
    ├── payment.ts                 # Payment type definitions
    └── navigation.ts              # Navigation type definitions
```

---

## 🚀 Quick Start

### 1. Update Backend Configuration

Edit `app/config/paymentConfig.ts`:

```typescript
export const PAYMENT_CONFIG = {
  API_BASE_URL: 'https://marathikamgarsena.com/api', // Your backend URL
  API_KEY: 'KAMGARUNION_API_KEY', // Your API key
};
```

### 2. Add Payment Button to Any Screen

```typescript
import PaymentButton from '../components/PaymentButton';

// In your component:
<PaymentButton
  userId={userId}
  amount={100}
  description="Membership fee payment"
  buttonText="Pay Now"
  metadata={{ plan: 'monthly' }}
/>
```

### 3. Navigate to Payment History

```typescript
navigation.navigate('PaymentHistory', { userId: 1 });
```

---

## 📱 Usage Examples

### Example 1: Simple Payment Button

```typescript
import React from 'react';
import { View } from 'react-native';
import PaymentButton from '../components/PaymentButton';

const MyScreen = () => {
  const userId = 1; // Get from auth context

  return (
    <View>
      <PaymentButton
        userId={userId}
        amount={500}
        description="Annual subscription"
        buttonText="Subscribe Now"
      />
    </View>
  );
};
```

### Example 2: Custom Payment Flow

```typescript
import React, { useState } from 'react';
import { View, TextInput, Alert } from 'react-native';
import { createPaymentOrder } from '../services/paymentService';

const CustomPaymentScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');

  const handlePayment = async () => {
    try {
      const orderData = await createPaymentOrder(
        userId,
        parseFloat(amount),
        'Custom payment'
      );

      navigation.navigate('PaymentWebView', {
        webviewUrl: orderData.webview_url,
        orderId: orderData.order_id,
        amount: orderData.amount,
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="Enter amount"
      />
      {/* Add your custom button that calls handlePayment */}
    </View>
  );
};
```

### Example 3: Check Payment Status

```typescript
import { getPaymentStatus } from '../services/paymentService';

const checkStatus = async (orderId) => {
  try {
    const status = await getPaymentStatus(orderId);
    console.log('Payment Status:', status);
    // status.status can be: SUCCESS, FAILED, PENDING, CANCELLED
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Example 4: View Payment History

```typescript
import { getPaymentHistory } from '../services/paymentService';

const loadHistory = async (userId) => {
  try {
    const history = await getPaymentHistory(userId);
    console.log('Payment History:', history);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 🔄 Payment Flow

```
1. User clicks "Pay Now" button
   ↓
2. App calls createPaymentOrder()
   ↓
3. Backend creates order with Cashfree
   ↓
4. App receives webview_url
   ↓
5. App opens PaymentWebView
   ↓
6. User completes payment in Cashfree
   ↓
7. Cashfree sends webhook to backend
   ↓
8. Backend updates payment status
   ↓
9. WebView sends message to React Native
   ↓
10. App navigates to Success/Failed screen
    ↓
11. App verifies status with backend
```

---

## 🎨 UI Screens

### PaymentWebViewScreen
- Loads Cashfree payment page
- Shows loading indicator
- Handles back button (with confirmation)
- Receives payment result messages
- Auto-navigates to result screen

### PaymentSuccessScreen
- Shows success animation
- Displays payment details
- Shows order ID, amount, payment method
- Links to payment history
- Option to return to dashboard

### PaymentFailedScreen
- Shows error message
- Displays failure reason
- Retry option
- Contact support button
- Links to help resources

### PaymentPendingScreen
- Shows pending status
- Displays order details
- Check status button
- Auto-refreshes status
- Links to payment history

### PaymentHistoryScreen
- Lists all payments
- Shows status badges
- Pull-to-refresh
- Tap to view details
- Filters by status

---

## 🔧 API Services

### `createPaymentOrder(userId, amount, description, metadata?)`
Creates a new payment order and returns webview URL.

**Parameters:**
- `userId` (number) - User ID
- `amount` (number) - Payment amount
- `description` (string) - Payment description
- `metadata` (object, optional) - Additional data

**Returns:**
```typescript
{
  order_id: string;
  cf_order_id: string;
  payment_session_id: string;
  webview_url: string;
  amount: string;
  currency: string;
}
```

### `getPaymentStatus(orderId)`
Retrieves payment status for an order.

**Parameters:**
- `orderId` (string) - Order ID

**Returns:**
```typescript
{
  order_id: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'CANCELLED';
  amount: string;
  currency: string;
  payment_method?: string;
  payment_time?: string;
  description: string;
}
```

### `getPaymentHistory(userId)`
Retrieves payment history for a user.

**Parameters:**
- `userId` (number) - User ID

**Returns:**
```typescript
Array<{
  order_id: string;
  amount: string;
  currency: string;
  status: string;
  payment_method?: string;
  payment_time?: string;
  description: string;
  created_at: string;
}>
```

---

## 🎯 Payment Status Types

```typescript
PENDING    // Payment initiated, not completed
SUCCESS    // Payment successful
FAILED     // Payment failed
CANCELLED  // Payment cancelled by user
```

---

## 🔐 Security

- ✅ API keys stored in config file (move to env variables for production)
- ✅ Backend handles all sensitive operations
- ✅ Secret keys never exposed to mobile app
- ✅ Webhook signature verification on backend
- ✅ Payment verification after completion
- ✅ HTTPS for all API calls

---

## 🧪 Testing

### Test Credentials (Sandbox)
```
AppID: TEST108331441b77e330bc1df802693d44133801
Secret Key: REDACTED
Environment: sandbox
```

### Test Payment Flow

1. Use `ExamplePaymentScreen.tsx` as reference
2. Set amount to any value (e.g., ₹100)
3. Click "Proceed to Payment"
4. Use Cashfree test credentials in WebView
5. Verify payment status in PaymentHistory

### Test Cards (Cashfree Sandbox)
```
Success:
Card: 4111 1111 1111 1111
CVV: 123
Expiry: Any future date

Failure:
Card: 4111 1111 1111 2222
CVV: 123
Expiry: Any future date
```

---

## 🚨 Troubleshooting

### Payment Order Creation Fails
- ✅ Check API_BASE_URL in `paymentConfig.ts`
- ✅ Verify API_KEY is correct
- ✅ Ensure backend is running
- ✅ Check network connectivity
- ✅ Review backend logs

### WebView Not Loading
- ✅ Verify webview_url is valid
- ✅ Check internet connection
- ✅ Ensure `react-native-webview` is installed
- ✅ Clear app cache and restart

### Payment Status Not Updating
- ✅ Check webhook URL in Cashfree dashboard
- ✅ Verify webhook signature on backend
- ✅ Ensure backend webhook endpoint is accessible
- ✅ Check backend logs for webhook errors

### Navigation Errors
- ✅ Ensure all payment screens are registered in `AppNavigator.tsx`
- ✅ Verify navigation types in `navigation.ts`
- ✅ Check route params match type definitions

---

## 📦 Dependencies

All required dependencies are already in `package.json`:

```json
{
  "react-native-webview": "^13.13.5",
  "axios": "^1.8.4",
  "@react-navigation/native": "^7.1.6",
  "@react-navigation/native-stack": "^7.3.10"
}
```

---

## 🔄 Migration to Production

### 1. Update Environment
```typescript
// In paymentConfig.ts
export const PAYMENT_CONFIG = {
  API_BASE_URL: 'https://your-production-domain.com/api',
  API_KEY: 'YOUR_PRODUCTION_API_KEY',
};
```

### 2. Backend Configuration
- Update Cashfree credentials to production keys
- Configure production webhook URL
- Enable webhook signature verification
- Set up proper error logging
- Configure payment notifications

### 3. Testing Checklist
- [ ] Test payment creation
- [ ] Test successful payment flow
- [ ] Test failed payment handling
- [ ] Test pending payment status
- [ ] Test payment history
- [ ] Test webhook processing
- [ ] Test payment verification
- [ ] Test error scenarios
- [ ] Test network failures
- [ ] Verify security measures

---

## 📞 Support

### Backend API Documentation
Refer to the backend implementation documentation for:
- API endpoints
- Request/response formats
- Webhook configuration
- Error codes
- Rate limiting

### Cashfree Documentation
- [Payment Gateway API](https://docs.cashfree.com/docs/payment-gateway)
- [WebView Integration](https://docs.cashfree.com/docs/web-integration)
- [Webhooks](https://docs.cashfree.com/docs/webhooks)

---

## 📝 Notes

- All payment credentials should be stored securely in environment variables
- Never commit API keys or secret keys to version control
- Backend webhook URL must be HTTPS in production
- Test thoroughly in sandbox before going live
- Keep Cashfree SDK/API versions updated
- Monitor payment failures and errors
- Set up proper analytics and tracking
- Implement payment retry logic for failed transactions

---

## ✅ Implementation Checklist

- [x] Payment service created
- [x] WebView screen implemented
- [x] Success/Failed/Pending screens created
- [x] Payment history screen implemented
- [x] Navigation configured
- [x] TypeScript types defined
- [x] Payment button component created
- [x] Example screen created
- [x] Error handling implemented
- [x] Loading states added
- [ ] Environment variables setup
- [ ] Production testing
- [ ] Payment analytics
- [ ] Push notifications for payment status

---

**Last Updated:** November 12, 2025  
**Version:** 1.0.0  
**Status:** ✅ Ready for Integration
