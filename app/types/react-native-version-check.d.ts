declare module 'react-native-version-check' {
  interface VersionCheckResult {
    isNeeded: boolean;
    currentVersion: string;
    latestVersion: string;
    storeUrl: string;
  }

  const VersionCheck: {
    needUpdate(): Promise<VersionCheckResult>;
  };

  export default VersionCheck;
} 