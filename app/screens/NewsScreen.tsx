import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { format } from 'date-fns';
import { fetchNews } from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Header from '../components/Header';
import { NewsItem } from '../types/news';
import { useLanguage } from '../context/LanguageContext';

const NewsScreen = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { language, translations } = useLanguage();

  const loadNews = async (pageNum: number, refresh = false) => {
    if (loading || (!hasMore && !refresh)) return;

    try {
      setLoading(true);
      const response = await fetchNews(pageNum);
      
      if (response.success) {
        if (refresh || pageNum === 1) {
          setNews(response.data);
        } else {
          setNews(prev => [...prev, ...response.data]);
        }
        setHasMore(response.data.length > 0);
      }
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNews(1);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadNews(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      loadNews(page + 1);
    }
  };

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <TouchableOpacity
      style={styles.newsCard}
      onPress={() => navigation.navigate('NewsDetail', { news: item })}
    >
      <Image
        source={{ uri: item.file_name }}
        style={styles.newsImage}
        resizeMode="cover"
      />
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.newsDescription} numberOfLines={3}>
          {item.content}
        </Text>
        <Text style={styles.newsDate}>
          {format(new Date(item.created_at), 'dd MMM yyyy')}
        </Text>
        {(item.doc_url || item.news_link) && (
          <View style={styles.badges}>
            {item.doc_url && <View style={styles.badge}><Text style={styles.badgeText}>DOC</Text></View>}
            {item.news_link && <View style={styles.badge}><Text style={styles.badgeText}>LINK</Text></View>}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const noNewsText = language === 'mr' ? 'कोणतीही बातमी आढळली नाही' : 'No latest news available yet';

  return (
    <View style={styles.container}>
      <Header
        title={translations.news[language]}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      <FlatList
        data={news}
        renderItem={renderNewsItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={
          loading && !refreshing ? (
            <ActivityIndicator size="large" color="#ff5e00" style={styles.loader} />
          ) : null
        }
        ListEmptyComponent={
          <Text style={styles.noNewsText}>
            {noNewsText}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    padding: 12,
  },
  newsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  newsImage: {
    width: '100%',
    height: 160,
  },
  newsContent: {
    padding: 12,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 6,
  },
  newsDescription: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
    marginBottom: 6,
  },
  newsDate: {
    fontSize: 11,
    color: '#999999',
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  badge: {
    backgroundColor: '#ff5e00',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500',
  },
  loader: {
    marginVertical: 12,
  },
  noNewsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginVertical: 12,
    textAlign: 'center',
  },
});

export default NewsScreen; 