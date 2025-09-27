import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../components/Header';
import { issueService, Issue, ListIssuesParams } from '../services/issueService';
import { ApiError } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

type RootStackParamList = {
  Dashboard: undefined;
  Issues: undefined;
  AddIssue: undefined;
};

type IssuesScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Issues'>;
};

const { width } = Dimensions.get('window');

const IssuesScreen = ({ navigation }: IssuesScreenProps) => {
  const { language } = useLanguage();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchIssues = async (pageNum: number = 1, isRefreshing: boolean = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const params: ListIssuesParams = {
        page: pageNum,
        limit: 10,
        search: searchText,
      };

      const response = await issueService.listIssues(params);
      console.log('API Response:', response);
      const newIssues = Array.isArray(response.data) ? response.data : [];

      if (isRefreshing) {
        setIssues(newIssues);
      } else {
        setIssues(prev => pageNum === 1 ? newIssues : [...prev, ...newIssues]);
      }

      setHasMore(newIssues.length === 10);
    } catch (err) {
      const error = err as ApiError;
      setError(error.message);
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchIssues(1);
  }, [searchText]);

  const handleRefresh = () => {
    setPage(1);
    fetchIssues(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchIssues(nextPage);
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    setPage(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={language === 'mr' ? 'तुमच्या समस्या' : 'Your Issues'}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        showIcons={false}
      />

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#ff5e00']}
          />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const paddingToBottom = 20;
          const isCloseToBottom = layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
          
          if (isCloseToBottom && !loading && hasMore) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        {loading && issues.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff5e00" />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={handleRefresh}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {issues.map((issue) => (
              <View key={issue.id} style={styles.issueCard}>
                <Text style={styles.issueTitle}>{issue.description}</Text>
                <View style={styles.issueFooter}>
                  <Text style={[
                    styles.issueStatus,
                    { color: issue.status === 'pending' ? '#ff5e00' : 
                      issue.status === 'inprogress' ? '#2196F3' : 
                      issue.status === 'duplicate' ? '#9E9E9E' : '#4CAF50' }
                  ]}>
                    {language === 'mr' ? 'स्थिती' : 'Status'} : {language === 'mr' ? 
                      issue.status === 'pending' ? 'प्रलंबित' :
                      issue.status === 'inprogress' ? 'प्रगतीत' :
                      issue.status === 'duplicate' ? 'नक्कल' : 'पूर्ण' 
                    : issue.status}
                  </Text>
                  <Text style={styles.issueDate}>{issue.created_at}</Text>
                </View>
              </View>
            ))}
            {loading && issues.length > 0 && (
              <View style={styles.loadingMoreContainer}>
                <ActivityIndicator size="small" color="#ff5e00" />
              </View>
            )}
            {issues.length === 0 && !loading && (
              <>
                <Text style={styles.noIssuesText}>
                  {language === 'mr' ? 'कोणतीही समस्या आढळली नाही' : 'No Issues Found'}
                </Text>
                <Text style={styles.noIssuesText2}>
                  {language === 'mr' ? 'भगवा अधिक (प्लस) बटन दाबा आणि आपली समस्या इथे नोंद करा !' : 'Press the plus button on bottom right to add an issue !'}
                </Text>
              </>
            )}
          </>
        )}
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => {
          navigation.navigate('AddIssue');
        }}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    padding: 16,
    top: 50,
  },
  searchInput: {
    backgroundColor: '#FFE0D9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
    top: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  loadingMoreContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 50,
    padding: 16,
  },
  errorText: {
    color: '#ff5e00',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#ff5e00',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  issueCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  issueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  issueStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  issueDate: {
    color: '#666',
    fontSize: 14,
  },
  issueDetails: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  issueDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  noIssuesText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 18,
    fontStyle: 'italic',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noIssuesText2: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  fab: {
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default IssuesScreen; 