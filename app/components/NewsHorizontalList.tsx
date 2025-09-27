import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { NewsItem } from '../types/news';

interface Props {
  news: NewsItem[];
  onViewAllPress: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

const NewsHorizontalList: React.FC<Props> = ({ news, onViewAllPress }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        pagingEnabled={true}
        snapToInterval={CARD_WIDTH + 20}
        snapToAlignment="start"
        decelerationRate="fast"
      >
        {news.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => navigation.navigate('NewsDetail', { news: item })}
          >
            <Image
              source={{ uri: item.file_name }}
              style={styles.image}
              resizeMode="contain"
            />
            <View style={styles.content}>
              <Text style={styles.newsTitle} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.newsDescription} numberOfLines={2}>
                {item.content}
              </Text>
              <View style={styles.bottomRow}>
                <Text style={styles.date}>
                  {format(new Date(item.created_at), 'dd MMM yyyy')}
                </Text>
                {(item.doc_url || item.news_link) && (
                  <View style={styles.badges}>
                    {item.doc_url && <View style={styles.badge}><Text style={styles.badgeText}>DOC</Text></View>}
                    {item.news_link && <View style={styles.badge}><Text style={styles.badgeText}>LINK</Text></View>}
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  viewAll: {
    fontSize: 14,
    color: '#ff5e00',
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 0,
  },
  card: {
    width: CARD_WIDTH,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    marginRight: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    margin: 5,
    flexDirection: 'row',
  },
  image: {
    width: 120,
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  newsDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
    marginBottom: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 10,
    color: '#999999',
  },
  badges: {
    flexDirection: 'row',
    gap: 4,
  },
  badge: {
    backgroundColor: '#ff5e00',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
});

export default NewsHorizontalList; 