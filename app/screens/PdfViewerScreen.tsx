import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Header from '../components/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import RNFetchBlob from 'react-native-blob-util';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'PdfViewer'>;

const PdfViewerScreen = ({ route, navigation }: Props) => {
  const { pdfUrl, title } = route.params;
  const [language, setLanguage] = useState('en');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const webViewRef = useRef<any>(null);

  useEffect(() => {
    AsyncStorage.getItem('language').then(lang => setLanguage(lang || 'en'));
  }, []);

  const handleDownloadToDevice = async () => {
    try {
      setIsDownloading(true);
      const { config, fs } = RNFetchBlob;
      const fileName = `${title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.pdf`;
      const destPath = `${fs.dirs.DownloadDir}/${fileName}`;

      const res = await config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title: fileName,
          description: 'Downloading PDF',
          mime: 'application/pdf',
          mediaScannable: true,
          path: destPath,
        },
      }).fetch('GET', pdfUrl);

      console.log('File downloaded to:', res.path());
    } catch (error) {
      console.error('Download to device failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={title}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        showIcons={false}
      />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.pdfContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}` }}
          style={styles.pdf}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#ff5e00" />
              <Text style={styles.loaderText}>Loading PDF...</Text>
            </View>
          )}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView error:', nativeEvent);
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={true}
          mixedContentMode="always"
        />
      </View>

      <TouchableOpacity
        style={styles.downloadButton}
        onPress={handleDownloadToDevice}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.downloadText}>↓</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  pdfContainer: {
    flex: 1,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loaderText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#fff',
  },
  downloadButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ff5e00',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  downloadText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default PdfViewerScreen;
