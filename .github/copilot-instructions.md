# Copilot Instructions for Marathakamgarsena

## Project Overview
Marathakamgarsena is a React Native mobile app for a labor union/organization in India. It provides news, labor law information, issue reporting, ID card registration, and member services with bilingual support (English/Marathi).

## Architecture & Key Patterns

### Context-Based State Management
- **AuthContext** (`app/context/AuthContext.tsx`): Manages authentication state and user data persisted in AsyncStorage
  - `isAuthenticated`: Determines if user is logged in
  - `needsRegistration`: Tracks if user needs to complete membership registration
  - Stores auth token and user data in AsyncStorage for persistence
- **LanguageContext** (`app/context/LanguageContext.tsx`): Manages bilingual translation system (English/Marathi)
  - All UI strings are stored in centralized translations object
  - Use `useLanguage()` hook to access current language and translate strings

### Navigation Stack Architecture
File: `app/navigation/AppNavigator.tsx`
- **Three-tier navigation flow** based on auth state:
  1. **Unauthenticated**: Login → OTP screens only
  2. **Authenticated but unregistered** (`needsRegistration=true`): Registration screen enforced
  3. **Fully authenticated**: Full app access (Dashboard, Profile, News, Issues, etc.)
- Uses React Navigation native stack with `RootStackParamList` type definitions in `app/types/navigation.ts`
- Add new screens by:
  1. Creating component in `app/screens/`
  2. Adding type definition in `RootStackParamList`
  3. Adding `<Stack.Screen>` entry in appropriate auth state block

### API Integration Pattern
File: `app/services/api.ts`
- Centralized axios instance with `API_BASE_URL = 'https://marathikamgarsena.com/api'`
- **Request interceptor**: Automatically adds Bearer token from AsyncStorage
- **Response interceptor**: Handles 401 unauthorized errors by clearing auth token
- Generic ApiResponse<T> wrapper: `{ success: boolean, message: string, data: T }`
- All API calls use generic `apiService.get/post/put/delete` methods
- **Do not** create separate axios instances; use `apiService` from `app/services/api.ts`

### Firebase & Notifications
File: `app/config/firebase.ts`
- Uses Firebase Cloud Messaging (FCM) and Notifee for push notifications
- Flow: App init → `requestUserPermission()` → stores FCM token → `onMessageReceived()` handles foreground/background/quit states
- Notifications have high importance with vibration pattern `[300, 500]`
- FCM token stored in AsyncStorage for backend registration

### App Initialization Flow
File: `App.tsx`
- Initialization sequence on app start:
  1. Firebase initialization with `firebaseConfig`
  2. Request notification permission and set up listeners
  3. Check for updates (once per day, uses AsyncStorage to track)
  4. Handle app launch counting and "rate us" dialog (after 5 launches, 2s delay)
  5. Hide splash screen
- Uses nested providers: `SafeAreaProvider` → `LanguageProvider` → `AuthProvider` → `AppNavigator`

## Developer Workflows

### Build & Run Commands
```bash
npm start              # Start Metro bundler (first terminal)
npm run android       # Build and run on Android (second terminal)
npm run ios           # Build and run on iOS (after pod install)
```

### iOS Setup (First Time Only)
```bash
bundle install                    # Install Ruby bundler
bundle exec pod install           # Install CocoaPods dependencies
npm run ios                       # Build and run
```

### Testing & Linting
```bash
npm test              # Run Jest tests
npm run lint          # Run ESLint checks
```

### TypeScript Configuration
- Uses `@react-native/typescript-config` as base
- Strict mode enabled; all new code should be typed
- Navigation types in `app/types/navigation.ts` are strict — add param types before using `navigation.navigate()`

## Project-Specific Conventions

### Bilingual String Handling
**Do not hardcode UI strings.** All strings must go through the translation system:
```tsx
const { language, translations } = useLanguage();
const text = translations.key[language]; // 'en' or 'mr'
```
Update `app/context/LanguageContext.tsx` when adding new strings.

### Screen Patterns
- Screens are in `app/screens/` and **must** follow the `<Stack.Screen>` convention
- Import `useNavigation` and type as `NavigationProp` from `app/types/navigation`
- Use `Header` component from `app/components/Header.tsx` for consistent top bars
- Handle loading states with `ActivityIndicator` for all API calls

### Component Organization
- Reusable UI components in `app/components/` (e.g., `Header.tsx`, `NewsGrid.tsx`, `DashboardGridItem.tsx`)
- Screen-specific logic stays in `app/screens/`
- Utility functions in `app/utils/` (e.g., `appUpdates.ts` for version checking)
- Service layer in `app/services/` (API calls, business logic)

### AsyncStorage Keys Convention
Common keys: `authToken`, `userData`, `fcmToken`, `app_launch_count`, `rate_us_shown`, `last_update_check`
- Always check `AsyncStorage.getItem()` before using stored data (can return null)
- Use consistent key naming across all files

## Critical Integration Points

### Authentication Flow
1. User enters phone → calls `/send-otp` endpoint
2. Receives OTP → calls verification endpoint
3. Backend returns auth token + user data
4. `AuthContext.login()` persists both in AsyncStorage and updates `isAuthenticated`
5. If `uniqueId` missing in user data, app forces registration screen
6. After registration, `setNeedsRegistration(false)` unlocks main app

### External Dependencies & API Endpoints
- Backend: `https://marathikamgarsena.com/api` (requires `x-api-key: KAMGARUNION_API_KEY` header)
- Firebase: Config in `app/config/firebaseConfig.ts` (keys not in repo)
- Notifee channels: Created with `importance: AndroidImportance.HIGH`
- Image picker: Uses `react-native-image-picker` for profile/document uploads

## Testing Checklist for Common Tasks

- **Adding new screen**: Update `RootStackParamList`, create screen component, add to Navigator
- **Changing strings**: Add to `LanguageContext.tsx` translations object under both language keys
- **Making API call**: Use `apiService.get/post()` from `app/services/api.ts`, auth token auto-injected
- **Handling logged-out state**: Clear AsyncStorage and log error in response interceptor
- **Building for Android/iOS**: Ensure Metro is running in separate terminal before `npm run android/ios`
