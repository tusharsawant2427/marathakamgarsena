import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../components/Header';
import { RootStackParamList } from '../types/navigation';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getUniqueId } from 'react-native-device-info';

type EditProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;
};

const EditProfileScreen = ({ navigation }: EditProfileScreenProps) => {
  const { language, translations } = useLanguage();
  const { userData, login } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    companyName: '',
    designation: '',
    location: '',
    device_id: '',
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Ensure we have valid translations and language
  const safeLanguage = language || 'en';
  const safeTranslations = translations || {};

  useEffect(() => {
    if (userData && typeof userData === 'object') {
      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        companyName: userData.company || '',
        designation: userData.designation || '',
        location: userData.location || '',
        device_id: userData.device_id || '',
      });
      setProfileImage(userData.profileImage || null);
    }
  }, [userData]);

  const handleImagePicker = () => {
    Alert.alert(
      safeTranslations.editProfileSelectPicture?.[safeLanguage] || 'Select Picture',
      safeTranslations.editProfileChooseGallery?.[safeLanguage] || 'Choose from Gallery',
      [
        {
          text: safeTranslations.editProfileChooseGallery?.[safeLanguage] || 'Choose from Gallery',
          onPress: () => {
            launchImageLibrary({
              mediaType: 'photo',
              quality: 0.8,
            }, (response) => {
              if (response.didCancel) {
                console.log('User cancelled image picker');
              } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
              } else if (response.assets && response.assets[0].uri) {
                setProfileImage(response.assets[0].uri);
              }
            });
          },
        },
        {
          text: safeTranslations.editProfileCancel?.[safeLanguage] || 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleSave = async () => {
    try {
      if (!userData || typeof userData !== 'object') {
        Alert.alert(
          safeTranslations.error?.[safeLanguage] || 'Error',
          safeTranslations.somethingWentWrong?.[safeLanguage] || 'Something went wrong'
        );
        return;
      }

      setLoading(true);
      const formData = new FormData();
      
      // Add all fields to formData
      formData.append('name', profileData.name.trim());
      formData.append('company', profileData.companyName.trim());
      formData.append('designation', profileData.designation.trim());
      formData.append('location', profileData.location.trim());
      formData.append('device_id', profileData.device_id || await getUniqueId());
      formData.append('email', profileData.email.trim());

      // Handle profile image
      if (profileImage && profileImage.startsWith('file://')) {
        const fileExtension = profileImage.split('.').pop()?.toLowerCase();
        const mimeType = `image/${fileExtension}`;
        
        // Create a proper file object for Laravel
        formData.append('user_profile', {
          uri: profileImage,
          type: mimeType,
          name: `profile_${Date.now()}.${fileExtension}`,
        } as any);
      }

      const response = await fetch('https://marathikamgarsena.com/api/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error('Invalid response from server');
      }


      if (data.success) {
        const updatedUserData = {
          ...userData,
          name: data.data.name,
          company: data.data.company,
          designation: data.data.designation,
          location: data.data.location,
          device_id: data.data.device_id,
          profileImage: data.data.user_profile,
          email: data.data.email,
        };
        await login(updatedUserData);
        Alert.alert(
          safeTranslations.success?.[safeLanguage] || 'Success',
          data.message || safeTranslations.profileUpdated?.[safeLanguage] || 'Profile updated successfully'
        );
        navigation.goBack();
      } else {
        console.error('API Error:', data);
        Alert.alert(
          safeTranslations.error?.[safeLanguage] || 'Error',
          data.message || safeTranslations.somethingWentWrong?.[safeLanguage] || 'Something went wrong'
        );
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(
        safeTranslations.error?.[safeLanguage] || 'Error',
        (error as Error).message || safeTranslations.somethingWentWrong?.[safeLanguage] || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={safeTranslations.editProfileTitle?.[safeLanguage] || 'Edit Profile'}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        showIcons={false}
      />

      <ScrollView style={styles.content}>
        <View style={styles.profileImageContainer}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../../assets/profile.png')}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.cameraButton} onPress={handleImagePicker}>
            <Image
              source={require('../../assets/camera.png')}
              style={styles.cameraIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputSection}>
          <View style={styles.inputGroup}>
            <Image
              source={require('../../assets/profile.png')}
              style={styles.inputIcon}
            />
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{safeTranslations.editProfileName?.[safeLanguage] || 'Name'}</Text>
              <TextInput
                style={styles.input}
                value={profileData.name}
                onChangeText={(text) => setProfileData({ ...profileData, name: text })}
                placeholder={safeTranslations.editProfileName?.[safeLanguage] || 'Name'}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Image
              source={require('../../assets/ic_company.png')}
              style={styles.inputIcon}
            />
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{safeTranslations.editProfileCompanyName?.[safeLanguage] || 'Company Name'}</Text>
              <TextInput
                style={styles.input}
                value={profileData.companyName}
                onChangeText={(text) => setProfileData({ ...profileData, companyName: text })}
                placeholder={safeTranslations.editProfileCompanyName?.[safeLanguage] || 'Company Name'}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Image
              source={require('../../assets/job_profile.png')}
              style={styles.inputIcon}
            />
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{safeTranslations.editProfileDesignation?.[safeLanguage] || 'Designation'}</Text>
              <TextInput
                style={styles.input}
                value={profileData.designation}
                onChangeText={(text) => setProfileData({ ...profileData, designation: text })}
                placeholder={safeTranslations.editProfileDesignation?.[safeLanguage] || 'Designation'}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Image
              source={require('../../assets/email.png')}
              style={styles.inputIcon}
            />
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{safeTranslations.editProfileEmail?.[safeLanguage] || 'Email'}</Text>
              <TextInput
                style={styles.input}
                value={profileData.email}
                onChangeText={(text) => setProfileData({ ...profileData, email: text })}
                placeholder={safeTranslations.editProfileEmail?.[safeLanguage] || 'Email'}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Image
              source={require('../../assets/home-address.png')}
              style={styles.inputIcon}
            />
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{safeTranslations.editProfileLocation?.[safeLanguage] || 'Location'}</Text>
              <TextInput
                style={styles.input}
                value={profileData.location}
                onChangeText={(text) => setProfileData({ ...profileData, location: text })}
                placeholder={safeTranslations.editProfileLocation?.[safeLanguage] || 'Location'}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>{safeTranslations.editProfileSave?.[safeLanguage] || 'Save'}</Text>
          )}
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
  content: {
    flex: 1,
    padding: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 8,
  },
  cameraIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  inputSection: {
    marginBottom: 20,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
  },
  inputIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    tintColor: '#666',
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    fontSize: 16,
    color: '#000',
    padding: 0,
  },
  saveButton: {
    backgroundColor: '#37474F',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen; 