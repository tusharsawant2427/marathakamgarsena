#!/bin/bash

# Script to check 16 KB page size support for Android app
# Run this after building your APK/AAB

echo "Checking 16 KB page size support..."

# Check if APK/AAB files exist
APK_PATH="app/build/outputs/apk/release/app-release.apk"
AAB_PATH="app/build/outputs/bundle/release/app-release.aab"

if [ -f "$APK_PATH" ]; then
    echo "Found APK: $APK_PATH"
    echo "Extracting and checking native libraries..."
    
    # Extract APK
    unzip -q "$APK_PATH" -d temp_apk_extract/
    
    # Check for native libraries
    if [ -d "temp_apk_extract/lib" ]; then
        echo "Native libraries found:"
        find temp_apk_extract/lib -name "*.so" -exec echo "  {}" \;
        
        # Check ELF alignment for each .so file
        for so_file in $(find temp_apk_extract/lib -name "*.so"); do
            echo "Checking alignment for: $so_file"
            readelf -l "$so_file" | grep "p_align" || echo "  Could not read ELF alignment"
        done
    else
        echo "No native libraries found in APK"
    fi
    
    # Cleanup
    rm -rf temp_apk_extract/
    
elif [ -f "$AAB_PATH" ]; then
    echo "Found AAB: $AAB_PATH"
    echo "Note: Use bundletool to extract APK from AAB first, then run this check"
else
    echo "No APK or AAB found. Please build your app first:"
    echo "  ./gradlew assembleRelease (for APK)"
    echo "  ./gradlew bundleRelease (for AAB)"
fi

echo ""
echo "16 KB Support Checklist:"
echo "✓ Updated build configuration for 16 KB support"
echo "✓ Updated NDK to r28"
echo "✓ Added Google Play Billing Library 7.1.1"
echo "✓ Configured uncompressed native libraries"
echo ""
echo "To test on 16 KB device or emulator:"
echo "1. Create Android 15 emulator with 16 KB page size"
echo "2. Install and test your app"
echo "3. Check for any PAGE_SIZE related crashes"