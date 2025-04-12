import React from 'react';
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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import DashboardGridItem from '../components/DashboardGridItem';

type RootStackParamList = {
  Dashboard: undefined;
  Login: undefined;
  Profile: undefined;
  ContactUs: undefined;
  Issues: undefined;
  LaborLaws: undefined;
  Notifications: undefined;
  ApplyIDCard: undefined;
};

type DashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
};

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }: DashboardScreenProps) => {

  const menuItems = [
    {
      id: 1,
      title: 'Contact Us',
      icon: require('../../assets/phone.png'),
      onPress: () => navigation.navigate('ContactUs'),
    },
    {
      id: 2,
      title: 'Apply for ID Card',
      icon: require('../../assets/id-card.png'),
      onPress: () => navigation.navigate('ApplyIDCard'),
    },
    {
      id: 3,
      title: 'Issues and Help',
      icon: require('../../assets/ic_issues.png'),
      onPress: () => navigation.navigate('Issues'),
    },
    {
      id: 4,
      title: 'Labour Laws',
      icon: require('../../assets/law.png'),
      onPress: () => navigation.navigate('LaborLaws'),
    },
  ];

  const socialHandles = [
    {
      id: 1,
      title: 'Facebook',
      icon: require('../../assets/ic_facebook.png'),
      url: 'https://m.facebook.com/Marathikamgarsena/',
    },
    {
      id: 2,
      title: 'Instagram',
      icon: require('../../assets/ic_instagram.png'),
      url: 'https://www.instagram.com/marathikamgarsena?igsh=d3g0YjVneWt1ZzZr',
    },
    {
      id: 3,
      title: 'Youtube',
      icon: require('../../assets/ic_youtube.png'),
      url: 'https://youtube.com/@marathikamgarsena?si=R0TIVw2Njdwo_w_W',
    },
    {
      id: 4,
      title: 'Twitter',
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
      title: 'Share This App',
      icon: require('../../assets/share.png'),
      onPress: handleShareApp,
    },
    {
      id: 2,
      title: 'भाषा मराठी करा',
      icon: require('../../assets/world.png'),
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.headerContainer, { height: 93 }]}>
        <View style={styles.headerPattern}>
          <Image 
            source={require('../../assets/header_small.png')}
            style={[styles.headerImage, { height: 100 }]}
            resizeMode="cover"
          />
          <Text style={[styles.headerText, { fontSize: 17 }]}>Marathi Kamgar Sena</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <Image 
                source={require('../../assets/bell.png')}
                style={[styles.iconImage, { width: 20, height: 20 }]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              Alert.alert(
                "Logout",
                "Are you sure you want to logout?",
                [
                  {
                    text: "Cancel",
                    style: "cancel"
                  },
                  {
                    text: "Logout",
                    onPress: () => {
                      navigation.navigate('Login');
                    }
                  }
                ]
              );
            }}>
              <Image 
                source={require('../../assets/logout.png')}
                style={[styles.iconImage, { width: 20, height: 20 }]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Contact and Support</Text>
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
            <Text style={styles.newsTitle}>News and New Information</Text>
          </View>
          <View style={styles.newsContent}>
            <Text style={styles.noDataText}>No Data</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.profileSection}
          onPress={() => navigation.navigate('Profile')}
        >
          <Image 
            source={require('../../assets/profile.png')}
            style={styles.profileIcon}
          />
          <Text style={styles.profileText}>Profile</Text>
        </TouchableOpacity>

        {/* Social Handles Section */}
        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Social Handles</Text>
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

        {/* Other Section */}
        <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Other</Text>
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
    backgroundColor: '#FF5722',
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
    fontSize: 19,
    fontWeight: 'bold',
    color: '#FF5722',
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
    borderColor: '#FF5722',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF5722',
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
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  newsSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FF5722',
  },
  newsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  newsIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: '#FF5722',
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  newsContent: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderColor: '#FF5722',
  },
  profileIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
    tintColor: '#FF5722',
  },
  profileText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default DashboardScreen; 