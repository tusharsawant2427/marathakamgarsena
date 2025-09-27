# 16 KB Page Size Support and Google Play Billing Library Update

This document outlines the changes made to support 16 KB page size devices and update the Google Play Billing Library.

## Changes Made

### 1. Android Gradle Plugin (AGP) and Build Tools
- **Keep AGP at React Native 0.79 compatible version** in `android/build.gradle`
- **Updated Gradle wrapper to 8.13** in `android/gradle/wrapper/gradle-wrapper.properties`
- **Added compressed native library packaging** for 16 KB compatibility

### 2. NDK Version Update
- **Updated NDK from 27.1.12297006 to 28.0.12674087** in `android/build.gradle`
- NDK r28+ compiles with 16 KB ELF alignment by default
- No manual linker flags needed with this version

### 3. Google Play Billing Library
- **Added Google Play Billing Library 7.1.1** to `android/app/build.gradle`
- This is the latest version that prevents Play Store rejections
- Implementation: `com.android.billingclient:billing:7.1.1`

### 4. Packaging Configuration
- **Configured compressed shared libraries** in `android/app/build.gradle`  
- Set `useLegacyPackaging false` for 16 KB compatibility
- This avoids installation issues with unaligned libraries on older AGP versions

### 5. NDK Configuration
- **Added ABI filters** to ensure all architectures are supported
- Includes: armeabi-v7a, arm64-v8a, x86, x86_64

## What This Means

### 16 KB Page Size Support
- Your app will now work on devices with 16 KB page sizes
- Android 15+ devices may use 16 KB page sizes for better performance
- Apps without this support may be rejected by Google Play Store

### Google Play Billing Library
- Updated to latest version (7.1.1) to prevent Play Store rejections
- Ensures compatibility with current Play Store requirements
- Provides bug fixes and security improvements

## No Code Changes Required

Since your React Native app doesn't use custom native C/C++ code:
- No Application.mk or Android.mk files needed
- No manual linker flag configuration required
- React Native's native modules are handled automatically

## Testing

### Before Release
1. **Test on Android 15 emulator** with 16 KB page size enabled
2. **Run the validation script**: `.\android\check_16kb_support.ps1`
3. **Build and test**: Ensure no crashes related to page size assumptions

### Validation Commands
```bash
# Build release APK
cd android
.\gradlew assembleRelease

# Build release AAB (for Play Store)
.\gradlew bundleRelease

# Run validation script
.\check_16kb_support.ps1
```

## Potential Issues to Watch For

### Runtime Issues
- Memory allocation patterns that assume 4 KB pages
- Buffer sizes based on PAGE_SIZE constants
- mmap() calls with hardcoded alignment values

### Library Compatibility
- Some third-party native libraries may not be 16 KB compatible
- Check with library maintainers if you encounter issues
- Most React Native community libraries should work fine

## Next Steps

1. **Clean and rebuild** your project
2. **Test thoroughly** on various Android versions
3. **Test on 16 KB page size emulator** if available
4. **Monitor crash reports** after release for any page size related issues

## Build Commands

```bash
# Clean project
cd android
.\gradlew clean

# Build debug APK
.\gradlew assembleDebug

# Build release APK
.\gradlew assembleRelease

# Build release AAB for Play Store
.\gradlew bundleRelease
```

The changes are backward compatible and your app will work on both 4 KB and 16 KB page size devices.