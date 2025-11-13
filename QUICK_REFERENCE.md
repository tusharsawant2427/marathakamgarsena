# 🚀 Payment Integration Quick Reference

## One-Line Integration

```typescript
import PaymentButton from './app/components/PaymentButton';

<PaymentButton userId={1} amount={100} description="Payment" />
```

## API Functions

```typescript
import { createPaymentOrder, getPaymentStatus, getPaymentHistory } from './app/services/paymentService';

// Create payment
const order = await createPaymentOrder(userId, amount, description);

// Check status  
const status = await getPaymentStatus(orderId);

// Get history
const history = await getPaymentHistory(userId);
```

## Navigation

```typescript
// Payment screens
navigation.navigate('PaymentWebView', { webviewUrl, orderId });
navigation.navigate('PaymentSuccess', { orderId });
navigation.navigate('PaymentFailed', { orderId });
navigation.navigate('PaymentPending', { orderId });
navigation.navigate('PaymentHistory', { userId });
```

## Configuration

```typescript
// app/config/paymentConfig.ts
export const PAYMENT_CONFIG = {
  API_BASE_URL: 'https://your-backend.com/api',
  API_KEY: 'YOUR_API_KEY',
};
```

## Test Cards (Sandbox)

```
Success: 4111 1111 1111 1111
Failed:  4111 1111 1111 2222
CVV: 123, Expiry: 12/25
```

## Files Created

- `app/components/PaymentButton.tsx`
- `app/screens/PaymentWebViewScreen.tsx`
- `app/screens/Payment{Success|Failed|Pending}Screen.tsx`
- `app/screens/PaymentHistoryScreen.tsx`
- `app/services/paymentService.ts`
- `app/config/paymentConfig.ts`
- `app/types/payment.ts`

## Status: ✅ READY TO USE
