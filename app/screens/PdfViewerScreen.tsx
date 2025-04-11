import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Pdf from 'react-native-pdf';
import Header from '../components/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import RNFetchBlob from 'react-native-blob-util';

type Props = NativeStackScreenProps<RootStackParamList, 'PdfViewer'>;

const PdfViewerScreen = ({ route, navigation }: Props) => {
  const { pdfUrl, title } = route.params;
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const pdfPathRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      // Cleanup downloaded PDF file
      if (pdfPathRef.current) {
        RNFetchBlob.fs.unlink(pdfPathRef.current)
          .then(() => {
            console.log('PDF file cleaned up successfully');
          })
          .catch((err: Error) => console.error('Error cleaning up PDF file:', err));
      }
    };
  }, []);

  const handleLoadComplete = (numberOfPages: number) => {
    setTotalPages(numberOfPages);
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setLoadingProgress(1);
    }, 500);
  };

  const handleLoadProgress = (percent: number) => {
    setLoadingProgress(percent);
    if (percent >= 1) {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      loadingTimeoutRef.current = setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const handleError = (error: any) => {
    console.error('PDF Error:', error);
    setPdfError(error.message || 'Unknown error occurred');
    setIsLoading(false);
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const { config } = RNFetchBlob;
      const date = new Date();
      const fileName = `${title}_${Math.floor(date.getTime() + date.getSeconds() / 2)}.pdf`;
      
      const response = await config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title: fileName,
          description: 'Downloading PDF',
          mime: 'application/pdf',
          mediaScannable: true,
          path: `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}`
        }
      }).fetch('GET', pdfUrl);

      if (response.info().status === 200) {
        console.log('File downloaded successfully');
        pdfPathRef.current = `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}`;
      }
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title=""
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        showIcons={false}
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.pageInfo}>{currentPage} / {totalPages}</Text>
      </View>
      <View style={styles.pdfContainer}>
        {isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#FF5722" />
            <Text style={styles.loaderText}>
              Loading PDF... {loadingProgress > 0 ? `${Math.round(loadingProgress * 100)}%` : ''}
            </Text>
          </View>
        )}
        {pdfError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load PDF. Please try again.</Text>
            <Text style={styles.errorDetail}>{pdfError}</Text>
          </View>
        ) : (
          <Pdf
            trustAllCerts={false}
            source={{
              uri: pdfUrl,
              cache: true,
              headers: {
                Accept: 'application/pdf',
                'Cache-Control': 'no-cache',
              },
              expiration: 0,
            }}
            style={[styles.pdf, isLoading && styles.hiddenPdf]}
            onLoadProgress={handleLoadProgress}
            onLoadComplete={handleLoadComplete}
            onPageChanged={(page: number) => setCurrentPage(page)}
            onError={handleError}
            horizontal={true}
            scale={1.2}
            spacing={10}
            minScale={1.0}
            maxScale={4.0}
            enableAnnotationRendering={true}
            enablePaging={false}
          />
        )}
      </View>
      <TouchableOpacity 
        style={styles.downloadButton} 
        onPress={handleDownload}
        disabled={isDownloading || isLoading}
      >
        {isDownloading ? (
          <ActivityIndicator color="#fff" size="small" />
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
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  pageInfo: {
    fontSize: 14,
    color: '#666',
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
    zIndex: 1,
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF5722',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDetail: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#fff',
  },
  hiddenPdf: {
    opacity: 0,
  },
  downloadButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  downloadText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default PdfViewerScreen;
