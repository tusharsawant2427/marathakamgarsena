import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Login: undefined;
};

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const socialHandles = [
    {
      id: 1,
      title: 'Facebook',
      icon: require('../../assets/facebook.png'),
    },
    {
      id: 2,
      title: 'Instagram',
      icon: require('../../assets/instagram.png'),
    },
    {
      id: 3,
      title: 'Youtube',
      icon: require('../../assets/youtube.png'),
    },
    {
      id: 4,
      title: 'Twitter',
      icon: require('../../assets/twitter.png'),
    },
  ];

  const otherOptions = [
    {
      id: 1,
      title: 'Share This App',
      icon: require('../../assets/share.png'),
    },
    {
      id: 2,
      title: 'भाषा मराठी करा',
      icon: require('../../assets/language.png'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerPattern}>
          <Image 
            source={require('../../assets/header_small.png')}
            style={styles.headerImage}
            resizeMode="cover"
          />
          <Text style={styles.headerText}>Marathi Kamgar Sena</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity>
              <Image 
                source={require('../../assets/ic_notification.png')}
                style={styles.iconImage}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image 
                source={require('../../assets/ic_menu.png')}
                style={styles.iconImage}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Section */}
        <TouchableOpacity style={styles.profileCard}>
          <View style={styles.profileIconContainer}>
            <Image 
              source={require('../../assets/profile.png')}
              style={styles.profileIcon}
            />
          </View>
          <Text style={styles.sectionTitle}>Profile</Text>
        </TouchableOpacity>

        {/* Social Handles Section */}
        <Text style={styles.sectionHeader}>Social Handles</Text>
        <View style={styles.gridContainer}>
          {socialHandles.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.gridItem,
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

        {/* Other Section */}
        <Text style={styles.sectionHeader}>Other</Text>
        <View style={styles.gridContainer}>
          {otherOptions.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.gridItem,
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
    height: 93,
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
    height: 100,
  },
  headerText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'left',
    position: 'absolute',
    width: '100%',
    top: 35,
    left: 20,
  },
  headerIcons: {
    position: 'absolute',
    right: 15,
    top: 35,
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#FF5722',
  },
  profileIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileIcon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },
  sectionHeader: {
    fontSize: 24,
    color: '#FF5722',
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  gridItem: {
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ProfileScreen; 