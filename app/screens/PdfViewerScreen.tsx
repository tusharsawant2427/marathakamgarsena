import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Pdf from 'react-native-pdf';
import Header from '../components/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import RNFetchBlob from 'react-native-blob-util';

type Props = NativeStackScreenProps<RootStackParamList, 'PdfViewer'>;

const PdfViewerScreen = ({ route, navigation }: Props) => {
  const { pdfUrl, title } = route.params;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [localPdfPath, setLocalPdfPath] = useState<string | null>(null);
  const downloadRef = useRef<string | null>(null);

  useEffect(() => {
    downloadPdf();

    return () => {
      if (downloadRef.current) {
        RNFetchBlob.fs
          .unlink(downloadRef.current)
          .then(() => console.log('PDF cleaned up'))
          .catch((err) => console.error('Cleanup error:', err));
      }
    };
  }, []);

  const downloadPdf = async () => {
    try {
      setIsLoading(true);
      const { config, fs } = RNFetchBlob;
      const filePath = `${fs.dirs.DocumentDir}/temp_${Date.now()}.pdf`;

      const fetchInstance = RNFetchBlob.config({
        path: filePath,
        fileCache: true,
        appendExt: 'pdf',
      })
        .fetch('GET', pdfUrl)
        .progress((received: string, total: string) => {
          const totalNum = parseInt(total, 10);
          if (totalNum > 0) {
            setLoadingProgress(parseInt(received, 10) / totalNum);
          }
        })
        .then((res) => {
          setLocalPdfPath(res.path());
          downloadRef.current = res.path();
          setIsLoading(false);
        })
        .catch((error: Error) => {
          console.error('PDF download error:', error);
          setPdfError('Failed to load PDF');
          setIsLoading(false);
        });
    } catch (err) {
      console.error('Unexpected error:', err);
      setPdfError('Unexpected error');
      setIsLoading(false);
    }
  };

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
        <Text style={styles.pageInfo}>
          {currentPage} / {totalPages || '...'}
        </Text>
      </View>

      <View style={styles.pdfContainer}>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#FF5722" />
            <Text style={styles.loaderText}>
              Loading... {Math.round(loadingProgress * 100)}%
            </Text>
          </View>
        ) : pdfError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error loading PDF.</Text>
            <Text style={styles.errorDetail}>{pdfError}</Text>
          </View>
        ) : localPdfPath ? (
          <Pdf
            source={{ uri: localPdfPath }}
            style={styles.pdf}
            onLoadComplete={(pages) => setTotalPages(pages)}
            onPageChanged={(page) => setCurrentPage(page)}
            onError={(error) => {
              console.error('PDF error:', error);
              setPdfError('Failed to display PDF');
            }}
          />
        ) : null}
      </View>

      <TouchableOpacity
        style={styles.downloadButton}
        onPress={handleDownloadToDevice}
        disabled={isDownloading || !localPdfPath}
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 8,
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
  },
  downloadText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default PdfViewerScreen;
