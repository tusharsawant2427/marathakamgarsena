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
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Dashboard: undefined;
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
    },
    {
      id: 2,
      title: 'Apply for ID Card',
      icon: require('../../assets/id-card.png'),
    },
    {
      id: 3,
      title: 'Issues and Help',
      icon: require('../../assets/ic_issues.png'),
    },
    {
      id: 4,
      title: 'Labour Laws',
      icon: require('../../assets/law.png'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.headerContainer, { height: 85 }]}>
        <View style={styles.headerPattern}>
          <Image 
            source={require('../../assets/header_small.png')}
            style={[styles.headerImage, { height: 90 }]}
            resizeMode="cover"
          />
          <Text style={[styles.headerText, { fontSize: 24 }]}>Marathi Kamgar Sena</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity>
              <Image 
                source={require('../../assets/ic_notification.png')}
                style={styles.iconImage}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image 
                source={require('../../assets/ic_notification.png')}
                style={styles.iconImage}
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

        <TouchableOpacity style={styles.profileSection}>
          <Image 
            source={require('../../assets/profile.png')}
            style={styles.profileIcon}
          />
          <Text style={styles.profileText}>Profile</Text>
        </TouchableOpacity>
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
    textAlign: 'center',
    marginBottom: 0,
    position: 'absolute',
    width: '100%',
    top: 20,
  },
  headerIcons: {
    position: 'absolute',
    right: 15,
    top: 20,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF5722',
    marginBottom: 20,
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
    fontSize: 16,
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