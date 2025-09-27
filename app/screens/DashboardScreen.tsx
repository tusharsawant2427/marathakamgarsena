import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Alert,
  Linking,
  Share,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import DashboardGridItem from '../components/DashboardGridItem';
import { RootStackParamList } from '../types/navigation';
import NewsGrid from '../components/NewsGrid';
import { fetchNews, readNotification } from '../services/api';
import NewsHorizontalList from '../components/NewsHorizontalList';
import { NewsItem } from '../types/news';
import Header from '../components/Header';

type DashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
};

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }: DashboardScreenProps) => {
  const { language, setLanguage, translations } = useLanguage();
  const { logout, userData, setNeedsRegistration } = useAuth();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const menuItems = [
    {
      id: 1,
      title: translations.contactUsMenu[language],
      icon: require('../../assets/phone.png'),
      onPress: () => navigation.navigate('ContactUs'),
    },
    {
      id: 2,
      title: translations.applyIdCard[language],
      icon: require('../../assets/id-card.png'),
      onPress: () => navigation.navigate('ApplyIDCard'),
    },
    {
      id: 3,
      title: translations.issuesAndHelp[language],
      icon: require('../../assets/ic_issues.png'),
      onPress: () => navigation.navigate('Issues'),
    },
    {
      id: 4,
      title: translations.labourLaws[language],
      icon: require('../../assets/law.png'),
      onPress: () => navigation.navigate('LaborLaws'),
    },
  ];

  const socialHandles = [
    {
      id: 1,
      title: language === 'mr' ? 'फेसबुक' : 'Facebook',
      icon: require('../../assets/ic_facebook.png'),
      url: 'https://m.facebook.com/Marathikamgarsena/',
    },
    {
      id: 2,
      title: language === 'mr' ? 'इंस्टाग्राम' : 'Instagram',
      icon: require('../../assets/ic_instagram.png'),
      url: 'https://www.instagram.com/marathikamgarsena?igsh=d3g0YjVneWt1ZzZr',
    },
    {
      id: 3,
      title: language === 'mr' ? 'युट्यूब' : 'Youtube',
      icon: require('../../assets/ic_youtube.png'),
      url: 'https://youtube.com/@marathikamgarsena?si=R0TIVw2Njdwo_w_W',
    },
    {
      id: 4,
      title: language === 'mr' ? 'ट्विटर' : 'Twitter',
      icon: require('../../assets/ic_twitter.png'),
      url: 'https://x.com/MarathiSena?t=23Dr208jA9gEhyUOdPS1AQ&s=09',
    },
  ];

  const handleShareApp = async () => {
    try {
      const shareMessage = `https://play.google.com/store/apps/details?id=comm.mks.india

जय महाराष्ट्र...

मराठी कामगार सेनेचे सभासद होण्यासाठी वरील लिंक वरून मराठी कामगार सेनाचा मोबाईल ॲप डाऊनलोड करा व मराठी कामगार सेनेचे सभासद बना...
धन्यवाद.

आपला,
महेश जाधव
अध्यक्ष - मराठी कामगार सेना.
प्रदेश उपाध्यक्ष -राष्ट्रवादी काँग्रेस पार्टी
088503 51106
083695 19408`;

      await Share.share({
        message: shareMessage,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share the app. Please try again later.');
    }
  };

  const otherOptions = [
    {
      id: 1,
      title: translations.shareApp[language],
      icon: require('../../assets/share.png'),
      onPress: handleShareApp,
    },
    {
      id: 2,
      title: translations.changeLanguage[language],
      icon: require('../../assets/world.png'),
      onPress: () => setLanguage(language === 'en' ? 'mr' : 'en'),
    },
  ];

  const handleSocialPress = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        // If URL is not supported, try opening in browser
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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert(
        translations.error[language],
        translations.somethingWentWrong[language]
      );
    }
  };

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
      } else {
        setHasMore(false);  
      }
    } catch (error: any) {
      console.error('Error loading news:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNews(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userData && !userData.uniqueId) {
      setNeedsRegistration(true);
      navigation.replace('Registration', {
        phoneNumber: userData.mobileNumber,
        token: userData.token,
      });
    }
  }, [userData, setNeedsRegistration, navigation]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      loadNews(page + 1);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadNews(1, true);
  };

  const handleViewAllNews = () => {
    navigation.navigate('News');
  };

  const handleNotificationClick = async (notificationId: number) => {
    if (!userData?.token) return;
    
    try {
      await readNotification(notificationId, userData.token);
      // Optionally refresh notifications list or update UI
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
    navigation.navigate('Notifications')
  };

  return (
    <SafeAreaView style={styles.container}>
        <Header
        title={language === 'mr' ? 'मराठी कामगार सेना' : 'Marathi Kamgar Sena'}
        showBackButton={false}
        onBackPress={() => navigation.goBack()}
        showIcons={true}
        onNotificationPress={() => handleNotificationClick(1)}
        onLogoutPress={handleLogout}
        titleStyleCenter={false}
      />
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>{translations.contactUs[language]}</Text>
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index % 2 === 0 ? { marginRight: 10 } : { marginLeft: 10 }
              ]}
              onPress={item.onPress}
            >
              <View style={styles.iconContainer}>
                <Image source={item.icon} style={styles.menuIcon} />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.newsSection}>
          <View style={styles.newsTitleContainer}>
            <Image
              source={require('../../assets/ic_news.png')}
              style={styles.newsIcon}
            />
              <Text style={styles.newsTitle}>{translations.news[language]}</Text>
            <TouchableOpacity onPress={handleViewAllNews}>
              <Text style={styles.viewAll}>{language === 'mr' ? 'सर्व पाहणे' : 'View All'}</Text>
            </TouchableOpacity>
          </View>
          {news.length === 0 ? (
            <Text style={styles.noNewsText}>
              {translations.noData[language]}
            </Text>
          ) : (
            <NewsHorizontalList
              news={news}
              onViewAllPress={handleViewAllNews}
            />
          )}
        </View>

        <TouchableOpacity
          style={styles.profileSection}
          onPress={() => navigation.navigate('Profile')}
        >
          <Image
            source={require('../../assets/profile.png')}
            style={styles.profileIcon}
          />
          <Text style={styles.profileText}>{translations.profile[language]}</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>{translations.socialHandles[language]}</Text>
        <View style={styles.menuGrid}>
          {socialHandles.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index % 2 === 0 ? { marginRight: 10 } : { marginLeft: 10 }
              ]}
              onPress={() => handleSocialPress(item.url)}
            >
              <View style={styles.iconContainer}>
                <Image source={item.icon} style={styles.menuIcon} />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 10 }]}>{translations.other[language]}</Text>
        <View style={styles.menuGrid}>
          {otherOptions.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index % 2 === 0 ? { marginRight: 10 } : { marginLeft: 10 }
              ]}
              onPress={item.onPress}
            >
              <View style={styles.iconContainer}>
                <Image source={item.icon} style={styles.menuIcon} />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: '#ff5e00',
    paddingTop: 20,
    overflow: 'hidden',
  },
  headerPattern: {
    width: width,
    height: 45,
    marginTop: -10,
  },
  headerImage: {
    width: width,
    height: 50,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 0,
    position: 'absolute',
    width: '100%',
    top: 35,
    left: 20,
  },
  headerIcons: {
    position: 'absolute',
    right: 15,
    top: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconImage: {
    width: 24,
    height: 24,
    marginLeft: 15,
    tintColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff5e00',
    marginBottom: 13,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  gridItem: {
    width: '50%',
    aspectRatio: 1,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  menuItem: {
    width: (width - 60) / 2,
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff5e00',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ff5e00',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuIcon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontWeight: '600',
  },
  newsSection: {
    marginBottom: 20,
  },
  newsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
   
  },
  newsIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: '#ff5e00',
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff5e00',
    flex: 1,
  },
  viewAll: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    marginLeft: 16,
  },
  noDataText: {
    color: '#999',
    fontSize: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ff5e00',
  },
  profileIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
    tintColor: '#ff5e00',
  },
  profileText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  noNewsText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default DashboardScreen; 