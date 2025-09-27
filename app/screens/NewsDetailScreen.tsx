import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Header from '../components/Header';
import { format } from 'date-fns';

type Props = NativeStackScreenProps<RootStackParamList, 'NewsDetail'>;

const { width } = Dimensions.get('window');

const NewsDetailScreen = ({ route, navigation }: Props) => {
  const { news } = route.params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDocPress = async () => {
    if (!news.doc_url) return;
    
    try {
      navigation.navigate('PdfViewer', {
        pdfUrl: news.doc_url,
        title: news.name,
      });
    } catch (err) {
      console.error('Error opening document:', err);
      Alert.alert('Error', 'Failed to open document');
    }
  };

  const handleNewsLinkPress = async () => {
    if (!news.news_link) return;
    
    try {
      const url = news.news_link.startsWith('http') ? news.news_link : `https://${news.news_link}`;
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        const browserUrl = url.startsWith('https://') ? url : `https://${url}`;
        await Linking.openURL(browserUrl).catch(() => {
          Alert.alert('Error', 'Could not open the URL. Please try again later.');
        });
      }
    } catch (error) {
      console.error('Error opening URL:', error);
      Alert.alert('Error', 'An error occurred while trying to open the URL. Please try again later.');
    }
  };

  const handleImagePress = () => {
    if (news.file_name) {
      navigation.navigate('ImageViewer', {
        imageUrl: news.file_name,
        title: news.name,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="News Detail"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        showIcons={false}
      />
      <ScrollView style={styles.content}>
        {news.file_name ? (
          <TouchableOpacity onPress={handleImagePress} activeOpacity={0.7}>
            <Image
              source={{ uri: news.file_name }}
              style={styles.image}
              resizeMode="contain"
              onError={() => Alert.alert('Error', 'Failed to load image')}
            />
          </TouchableOpacity>
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>No Image Available</Text>
          </View>
        )}
        <View style={styles.textContent}>
          <Text style={styles.title}>{news.name || 'Untitled'}</Text>
          {news.created_at && (
            <Text style={styles.date}>
              {format(new Date(news.created_at), 'dd MMM yyyy')}
            </Text>
          )}
          <Text style={styles.description}>{news.content || 'No content available'}</Text>

          <View style={styles.actions}>
            {news.doc_url && (
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleDocPress}
                disabled={loading}
                activeOpacity={0.7}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.buttonText}>View Document</Text>
                )}
              </TouchableOpacity>
            )}
            {news.news_link && (
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleNewsLinkPress}
                disabled={loading}
                activeOpacity={0.7}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Read More</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  image: {
    width: width,
    height: 250,
    backgroundColor: '#F5F5F5',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666666',
    fontSize: 16,
  },
  textContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#444444',
    lineHeight: 24,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    backgroundColor: '#ff5e00',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    height: 45,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default NewsDetailScreen; 