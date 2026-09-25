# Release Notes — v0.0.1 (2025-09-28)

These notes cover the latest changes to the Maratha Kamgar Sena app, focusing on Android platform compliance, build updates, UI improvements, and fixes.

## Overview
- Android 15+ 16 KB page-size support enabled (NDK r28, packaging tweaks, ABI filters)
- Google Play Billing Library updated to 7.1.1 (Play Store compliance)
- API integration and UI refinements
- PDF viewing stability fix

App version in `package.json`: 0.0.1

## Highlights
- 16 KB page-size compatibility for modern Android devices (Android 15+)
- Play Store compliance via Billing Library 7.1.1
- Future-proof native packaging configuration (compressed JNI libs)
- UI and navigation polish; refined Contacts UI

## Android build and tooling changes
To ensure compatibility with devices using a 16 KB page size and maintain Play Store compliance:
- NDK updated to r28 (28.0.12674087) — compiles with 16 KB ELF alignment by default
- Packaging options updated to use compressed native libraries
- ABI filters set for: armeabi-v7a, arm64-v8a, x86, x86_64
- Google Play Billing Library dependency added/updated to 7.1.1
- Gradle wrapper updated to 8.13

References:
- `16KB_SUPPORT_README.md`
- `UPDATE_SUMMARY.md`
- Android config changes in `android/build.gradle`, `android/app/build.gradle`, and Gradle wrapper properties

## Features and improvements
- API integration updates and wiring for data flows
- UI refinements across multiple screens; improved Contacts UI
- General design iteration toward the current visual system

## Fixes
- PDF view rendering issue resolved

## Verification and build
Validation helpers are available for the 16 KB support work. From the repository root on Windows (PowerShell):
- Run: `.\android\check_16kb_support.ps1`
- Optional: `.\android\verify_16kb_support.ps1` or `.\android\verify_16kb_simple.ps1`

Build (from `android\\` folder):
- Clean: `.\gradlew clean`
- APK: `.\gradlew assembleRelease`
- AAB: `.\gradlew bundleRelease`

No breaking changes expected; updates are primarily build and packaging.

## Commit summary (recent)
- 9881c5a (2025-09-28) Bumps 4.1.3, adds 16KB check, refines Contacts UI
- c118756 (2025-09-27) Adds 16KB page support and Billing 7.1.1
- e7fcb7d (2025-09-27) Merge branch 'api-integration' into 'main'
- 813a3c2 (2025-09-27) Api integration
- 3d0399e (2025-04-12) UI changes done
- 55b1845 (2025-04-12) feature: UI design
- a4b9ac8 (2025-04-12) fix: PDF view issue
- 3d8a2ff (2025-04-12) wip: UI design
- 8788448 (2025-04-11) Initial commit

---
If you’d like these notes tailored for a Play Store listing or tagged to a specific version (e.g., v0.1.0), I can adjust and bump versions accordingly.