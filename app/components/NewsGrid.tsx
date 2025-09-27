import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

interface NewsItem {
  id: number;
  name: string;
  content: string;
  file_name: string;
  doc_url?: string;
  news_link?: string;
  created_at: string;
}

interface NewsGridProps {
  news: NewsItem[];
  onEndReached?: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

const NewsGrid: React.FC<NewsGridProps> = ({
  news,
  onEndReached,
  refreshing = false,
  onRefresh,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <TouchableOpacity
      style={styles.newsItem}
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
        <Text style={styles.newsDate}>
          {format(new Date(item.created_at), 'dd MMM yyyy')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={news}
      renderItem={renderNewsItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.container}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  columnWrapper: {
    gap: 16,
  },
  newsItem: {
    width: COLUMN_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  newsImage: {
    width: '100%',
    height: COLUMN_WIDTH,
  },
  newsContent: {
    padding: 12,
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  newsDate: {
    fontSize: 12,
    color: '#666666',
  },
});

export default NewsGrid; 