# 💳 → 🆔 Payment to ID Card Download Flow

## Overview

This document explains the complete flow from payment to ID card download in the Maratha Kamgar Sena app.

---

## 🔄 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    PAYMENT + ID CARD FLOW                        │
└─────────────────────────────────────────────────────────────────┘

1️⃣  User wants to download ID card
    └── Navigates to "Apply ID Card" screen

2️⃣  App checks user's premium status
    ├── If isPremium = false → Show "Premium Required" message
    └── If isPremium = true → Show ID card with download buttons

3️⃣  User clicks "Activate Premium Membership"
    └── Navigates to Payment screen

4️⃣  User enters amount and clicks "Pay Now"
    └── Creates payment order via backend API

5️⃣  Backend creates Cashfree order
    └── Returns webview_url to app

6️⃣  App opens PaymentWebView
    └── User completes payment in Cashfree

7️⃣  Payment successful
    └── Cashfree sends webhook to backend

8️⃣  Backend updates payment status
    └── Stores payment details in database

9️⃣  App navigates to PaymentSuccess screen
    └── Automatically starts ID card activation

🔟 ID Card Activation Process:
    ├── API call 1: POST /api/request-for-id
    │   └── Backend creates ID card request
    │       └── Returns order_id & transaction_id
    │
    ├── API call 2: POST /api/update-for-id
    │   └── Backend updates ID card status
    │   └── Sets subscription_end_date
    │   └── Activates premium membership
    │
    └── App updates user context:
        ├── isPremium = true
        └── expiryDate = subscription_end_date

1️⃣1️⃣ PaymentSuccess screen shows:
    ├── ✓ Payment successful message
    ├── 💳 Payment details
    ├── ✓ "ID Card Activated!" notification
    └── 📥 "Download ID Card" button

1️⃣2️⃣ User clicks "Download ID Card"
    └── Navigates to ApplyIDCard screen

1️⃣3️⃣ ApplyIDCard screen:
    ├── Checks isPremium = true ✓
    ├── Displays user's ID card
    ├── Shows "Download ID Card" button
    └── Shows "Share to Social Media" button

1️⃣4️⃣ User downloads or shares ID card 🎉
```

---

## 📱 Implementation Details

### 1. AuthContext Updates

The AuthContext now includes:

```typescript
type AuthContextType = {
  isAuthenticated: boolean;
  userData: any | null;  // Contains isPremium, expiryDate
  needsRegistration: boolean;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  setNeedsRegistration: (needs: boolean) => void;
  updateUserData: (data: any) => Promise<void>;  // NEW
};
```

**User Data Structure:**
```typescript
{
  name: string;
  mobileNumber: string;
  token: string;
  uniqueId: string;
  isPremium: boolean;       // NEW: Premium status
  expiryDate: string;       // NEW: Subscription end date
  // ... other fields
}
```

### 2. PaymentSuccessScreen Logic

**Automatic ID Card Activation:**

```typescript
const activateIDCard = async () => {
  // Step 1: Request ID card
  const response1 = await fetch('/api/request-for-id', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ id_card_id: 1 }),
  });
  
  const data1 = await response1.json();
  // Returns: { order_id, transaction_id }

  // Step 2: Update ID card status
  const response2 = await fetch('/api/update-for-id', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      id_card_id: 1,
      order_id: data1.order_id,
      transaction_id: data1.transaction_id,
    }),
  });

  const data2 = await response2.json();
  // Returns: { subscription_end_date }

  // Step 3: Update user context
  await updateUserData({
    isPremium: true,
    expiryDate: data2.subscription_end_date,
  });
};
```

**Trigger:**
- Runs automatically when payment is successful
- Shows loading indicator during activation
- Displays success message when complete
- Reveals "Download ID Card" button

### 3. ApplyIDCardScreen Logic

**Premium Status Check:**

```typescript
if (!userData?.isPremium) {
  // Show premium required message
  return (
    <View>
      <Text>🔒 Premium Membership Required</Text>
      <Button onPress={navigateToPayment}>
        Activate Premium Membership
      </Button>
    </View>
  );
}

// If premium, show ID card
return (
  <View>
    {/* ID Card Display */}
    <Button onPress={downloadIDCard}>Download ID Card</Button>
    <Button onPress={shareIDCard}>Share to Social Media</Button>
  </View>
);
```

---

## 🎯 User Journey Scenarios

### Scenario 1: New User (No Premium)

```
Dashboard → Apply ID Card → Premium Required Screen
→ Click "Activate Premium"
→ Payment Screen → Enter Amount → Pay Now
→ PaymentWebView → Complete Payment
→ PaymentSuccess (Auto-activates ID card)
→ Click "Download ID Card"
→ ApplyIDCard Screen → Download/Share
```

### Scenario 2: Existing Premium User

```
Dashboard → Apply ID Card
→ ID Card Ready → Download/Share Immediately
```

### Scenario 3: Payment Failed

```
Payment Screen → PaymentWebView → Payment Fails
→ PaymentFailed Screen
→ Retry Payment → Success
→ Auto-activates ID card
→ Download ID Card
```

---

## 🔌 API Endpoints Used

### 1. Create Payment Order
```
POST /api/payment/create-order
Headers: x-api-key: KAMGARUNION_API_KEY
Body: { user_id, amount, description }
Response: { webview_url, order_id }
```

### 2. Check Payment Status
```
POST /api/payment/status
Headers: x-api-key: KAMGARUNION_API_KEY
Body: { order_id }
Response: { status, amount, payment_method }
```

### 3. Request ID Card
```
POST /api/request-for-id
Headers: Authorization: Bearer {token}
Body: { id_card_id: 1 }
Response: { order_id, transaction_id }
```

### 4. Update ID Card Status
```
POST /api/update-for-id
Headers: Authorization: Bearer {token}
Body: { id_card_id, order_id, transaction_id }
Response: { subscription_end_date }
```

---

## 🎨 UI Components

### PaymentSuccessScreen

**New Elements:**
- **Activation Status Box** - Shows "Activating your ID card..."
- **Success Notification** - Shows "ID Card Activated Successfully!"
- **Download Button** - Green button "📥 Download ID Card"

**States:**
- `activatingIDCard` - Shows loading spinner
- `idCardActivated` - Shows success message and download button

### ApplyIDCardScreen

**Two States:**

1. **Not Premium:**
   - 🔒 Lock icon
   - "Premium Membership Required" title
   - Description text
   - "Activate Premium Membership" button (blue)
   - "Back to Dashboard" button (text only)

2. **Premium Active:**
   - ID card preview
   - "Download ID Card" button
   - "Share to Social Media" button

---

## 🔐 Security & Data Flow

### User Context Updates

```typescript
// After successful payment
updateUserData({
  isPremium: true,
  expiryDate: '2026-11-12',
});

// Stored in AsyncStorage
{
  "userData": {
    "name": "John Doe",
    "isPremium": true,
    "expiryDate": "2026-11-12",
    "token": "..."
  }
}

// Persists across app restarts
```

### Backend Responsibilities

1. **Validate Payment:**
   - Verify webhook signature
   - Update payment status in database
   - Return payment confirmation

2. **Activate ID Card:**
   - Create ID card request
   - Generate order & transaction IDs
   - Set subscription end date
   - Update user's premium status

3. **Security:**
   - All sensitive operations on backend
   - API keys never in mobile app
   - Token-based authentication
   - Webhook signature verification

---

## 🧪 Testing Checklist

### Test Payment to ID Card Flow

- [ ] New user sees "Premium Required" in ApplyIDCard screen
- [ ] Click "Activate Premium" navigates to payment
- [ ] Complete payment successfully
- [ ] PaymentSuccess shows "Activating ID card..." message
- [ ] PaymentSuccess shows "ID Card Activated!" notification
- [ ] "Download ID Card" button appears
- [ ] Click button navigates to ApplyIDCard screen
- [ ] ID card is now visible and downloadable
- [ ] Download button works
- [ ] Share button works
- [ ] User context updated (isPremium = true)
- [ ] Restart app - premium status persists
- [ ] Go to ApplyIDCard - shows ID card immediately

### Test Edge Cases

- [ ] Payment fails - no ID card activation
- [ ] Network error during activation - shows error
- [ ] Already premium user - skip activation
- [ ] Expired premium - show premium required
- [ ] Multiple payments - only activate once

---

## 📊 State Management

### Key States to Track

```typescript
// PaymentSuccessScreen
const [activatingIDCard, setActivatingIDCard] = useState(false);
const [idCardActivated, setIdCardActivated] = useState(false);

// ApplyIDCardScreen  
const [loading, setLoading] = useState(false);

// AuthContext
userData: {
  isPremium: boolean;
  expiryDate: string;
}
```

### State Flow

```
Payment Success
↓
activatingIDCard = true
↓
API Calls (request + update)
↓
updateUserData({ isPremium: true })
↓
activatingIDCard = false
idCardActivated = true
↓
Show "Download ID Card" button
```

---

## 🚀 Deployment Notes

### Before Going Live

1. **Update Payment Config:**
   ```typescript
   // app/config/paymentConfig.ts
   API_KEY: 'YOUR_PRODUCTION_API_KEY'
   ```

2. **Backend Configuration:**
   - Set production Cashfree credentials
   - Configure webhook URL
   - Test ID card APIs in production

3. **Test Complete Flow:**
   - Real payment with small amount
   - Verify ID card activation
   - Check data persistence
   - Test on multiple devices

4. **Monitor:**
   - Payment success rate
   - ID card activation rate
   - Error logs
   - User feedback

---

## 📞 Support

### If ID Card Not Activating

1. Check payment status: `POST /api/payment/status`
2. Verify backend logs for `/api/request-for-id`
3. Check user's isPremium status in AsyncStorage
4. Manual activation via backend admin panel

### If Download Not Working

1. Verify isPremium = true in userData
2. Check expiryDate is valid
3. Ensure profile image is loaded
4. Check file permissions on device

---

## ✅ Success Criteria

The integration is successful when:

✅ User can complete payment  
✅ ID card auto-activates after payment  
✅ "Download ID Card" button appears  
✅ User can download ID card  
✅ User can share ID card  
✅ Premium status persists across app restarts  
✅ Existing premium users have immediate access  
✅ Non-premium users see activation prompt  

---

**Implementation Date:** November 13, 2025  
**Version:** 2.0.0  
**Status:** ✅ COMPLETE  
**Integration:** Payment Gateway + ID Card System
