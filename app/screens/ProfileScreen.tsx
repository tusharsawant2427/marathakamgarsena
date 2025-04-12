import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../components/Header';
import { RootStackParamList } from '../types/navigation';
import { useLanguage } from '../context/LanguageContext';

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const { language, translations } = useLanguage();

  const profileData = {
    name: 'Tushar',
    mobileNumber: '7977796967',
    emailAddress: 'tusharsawant242726@gmail.com',
    companyName: 'Target',
    designation: 'developer',
    registrationNumber: 'MKS-1068',
  };

  const EditButton = () => (
    <TouchableOpacity 
      style={styles.editButton}
      onPress={() => navigation.navigate('EditProfile')}
    >
      <Image
        source={require('../../assets/edit.png')}
        style={styles.editIcon}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={translations.profile[language]}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        showIcons={false}
        rightComponent={<EditButton />}
      />

      <View style={styles.content}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require('../../assets/profile.png')}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{profileData.name}</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Image
                source={require('../../assets/phone.png')}
                style={styles.icon}
              />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{translations.profileMobileNumber[language]}</Text>
              <Text style={styles.infoValue}>{profileData.mobileNumber}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Image
                source={require('../../assets/email.png')}
                style={styles.icon}
              />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{translations.profileEmail[language]}</Text>
              <Text style={styles.infoValue}>{profileData.emailAddress}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Image
                source={require('../../assets/ic_company.png')}
                style={styles.icon}
              />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{translations.profileCompanyName[language]}</Text>
              <Text style={styles.infoValue}>{profileData.companyName}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Image
                source={require('../../assets/job_profile.png')}
                style={styles.icon}
              />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{translations.profileDesignation[language]}</Text>
              <Text style={styles.infoValue}>{profileData.designation}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Image
                source={require('../../assets/img_registration_no.png')}
                style={styles.icon}
              />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{translations.profileRegistrationNumber[language]}</Text>
              <Text style={styles.infoValue}>{profileData.registrationNumber}</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  infoSection: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF4E0E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  editButton: {
    padding: 8,
  },
  editIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
});

export default ProfileScreen; 