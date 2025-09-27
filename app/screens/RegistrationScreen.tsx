import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Image } from 'react-native';
import Header from '../components/Header';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList, NavigationProp } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import DeviceInfo from 'react-native-device-info';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const RegistrationScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Registration'>>();
  const navigation = useNavigation<NavigationProp>();
  const { userData, login, setNeedsRegistration, needsRegistration, isAuthenticated, logout } = useAuth();
  const { language, translations } = useLanguage();
  const initialPhone = userData?.mobileNumber || '';
  const token = (route.params as any)?.token || '';
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState(initialPhone);
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [designation, setDesignation] = useState('');
  const [profileImage, setProfileImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const handlePickImage = async () => {
    try {
      setImageLoading(true);
      const result = await launchImageLibrary({ 
        mediaType: 'photo', 
        quality: 0.7,
        includeBase64: false,
        maxWidth: 800,
        maxHeight: 800,
      });
      
      if (result.didCancel) {
        return;
      }
      
      if (result.errorCode) {
        Alert.alert('Error', 'Failed to pick image. Please try again.');
        return;
      }
      
      if (result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    } finally {
      setImageLoading(false);
    }
  };

  const handlePickCamera = async () => {
    try {
      setImageLoading(true);
      const result = await launchCamera({ 
        mediaType: 'photo', 
        quality: 0.7,
        includeBase64: false,
        maxWidth: 800,
        maxHeight: 800,
      });
      
      if (result.didCancel) {
        return;
      }
      
      if (result.errorCode) {
        Alert.alert('Error', 'Failed to take photo. Please try again.');
        return;
      }
      
      if (result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    } finally {
      setImageLoading(false);
    }
  };

  useEffect(() => {
    if (userData && typeof userData === 'object') {
      setName(userData.name || '');
      setEmail(userData.email || '');
      setCompany(userData.company || '');
      setDesignation(userData.designation || '');
      setMobile(userData.mobileNumber || '');
      setProfileImage(userData.profileImage || null);
    }
  }, [userData]);

  const handleRegister = async () => {

    if (!name || !company || !designation) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }
    try {

      setLoading(true);
      const deviceId = DeviceInfo.getUniqueIdSync();
      const formData = new FormData();
      formData.append('name', name);
      formData.append('company', company);
      formData.append('designation', designation);
      formData.append('device_id', deviceId);
      if (email) formData.append('email', email);
      if (profileImage) {
        formData.append('user_profile', {
          uri: profileImage.uri,
          type: profileImage.type,
          name: profileImage.fileName || 'profile.jpg',
        });
      }
      // Optionally add location, latitude, longitude if available
      // formData.append('location', ...);
      // formData.append('latitude', ...);
      // formData.append('longitude', ...);

      const response = await fetch('https://marathikamgarsena.com/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${userData.token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const updatedUserData = {
            ...userData,
            name: data.data.name,
            company: data.data.company,
            designation: data.data.designation,
            location: (data.data.location || ''),
            device_id: (data.data.device_id || ''),
            profileImage: (data.data.user_profile || ''),
            email: (data.data.email || ''),
            uniqueId: (data.data.unique_id || ''),
          };
        await login(updatedUserData);
        // Set needsRegistration to false since registration is complete
        setNeedsRegistration(false);
      } else {
        Alert.alert('Error', data.message || 'Registration failed');
      }
    } catch (error) {
        console.log(error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    Alert.alert(
      translations.removeImageTitle[language],
      translations.removeImage[language],
      [
        {
          text: translations.cancel[language],
          style: 'cancel',
        },
        {
          text: translations.remove[language],
          style: 'destructive',
          onPress: () => setProfileImage(null),
        },
      ]
    );
  };

  useEffect(() => {
    if (userData && userData.uniqueId) {
        setNeedsRegistration(false);
    }
    if (isAuthenticated && !needsRegistration) {
      console.log('Navigating to Dashboard');
      navigation.replace('Dashboard');
    }
  }, [isAuthenticated, needsRegistration, navigation]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <Header 
        title={translations.membershipRegistration[language]} 
        showBackButton={true} 
        onBackPress={() => {
          if (navigation.canGoBack()) {
            console.log('canGoBack');
            navigation.goBack();
          } else {
            logout();
          }
        }}
      />
      <ScrollView 
        contentContainerStyle={styles.container} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.formGroup}>
          <Text style={styles.label}>{translations.name[language]}</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder=""
            placeholderTextColor="#bdbdbd"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>{translations.profileMobileNumber[language]}</Text>
          <TextInput
            style={styles.input}
            value={mobile}
            onChangeText={setMobile}
            placeholder=""
            placeholderTextColor="#bdbdbd"
            keyboardType="phone-pad"
            maxLength={10}
            editable={false}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>{translations.profileEmail[language]}</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Optional"
            placeholderTextColor="#e0a899"
            keyboardType="email-address"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>{translations.profileCompanyName[language]}</Text>
          <TextInput
            style={styles.input}
            value={company}
            onChangeText={setCompany}
            placeholder=""
            placeholderTextColor="#bdbdbd"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>{translations.profileDesignation[language]}</Text>
          <TextInput
            style={styles.input}
            value={designation}
            onChangeText={setDesignation}
            placeholder=""
            placeholderTextColor="#bdbdbd"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>{translations.editProfileSelectPicture[language]}</Text>
          
          {profileImage ? (
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: profileImage.uri }} 
                style={styles.profileImage} 
                resizeMode="cover"
              />
              <View style={styles.imageActions}>
                <TouchableOpacity 
                  style={[styles.imageActionButton, imageLoading && styles.disabledButton]} 
                  onPress={handlePickImage}
                  disabled={imageLoading}
                >
                  <Text style={styles.imageActionText}>{translations.change[language]}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.imageActionButton, styles.removeButton, imageLoading && styles.disabledButton]} 
                  onPress={handleRemoveImage}
                  disabled={imageLoading}
                >
                  <Text style={[styles.imageActionText, styles.removeButtonText]}>{translations.remove[language]}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.imagePickerContainer}>
              <TouchableOpacity 
                style={[styles.imagePickerButton, imageLoading && styles.disabledButton]} 
                onPress={handlePickImage}
                disabled={imageLoading}
              >
                {imageLoading ? (
                  <ActivityIndicator size="small" color="#757575" />
                ) : (
                  <>
                    <Image 
                      source={require('../../assets/camera.png')} 
                      style={styles.cameraIcon} 
                    />
                    <Text style={styles.imagePickerText}>{translations.chooseFromGallery[language]}</Text>
                  </>
                )}
              </TouchableOpacity>
              {/* <TouchableOpacity 
                style={[styles.imagePickerButton, styles.cameraButton, imageLoading && styles.disabledButton]} 
                onPress={handlePickCamera}
                disabled={imageLoading}
              >
                {imageLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Image 
                      source={require('../../assets/camera.png')} 
                      style={[styles.cameraIcon, styles.cameraButtonIcon]} 
                    />
                    <Text style={[styles.imagePickerText, styles.cameraButtonText]}>Take Photo</Text>
                  </>
                )}
              </TouchableOpacity> */}
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 100,
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 18,
    color: '#757575',
    marginBottom: 6,
    fontWeight: '400',
  },
  input: {
    backgroundColor: '#ffd2c2',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    color: '#222',
    borderWidth: 0,
  },
  button: {
    backgroundColor: '#ff7a3c',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
    shadowColor: '#ff7a3c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#ff7a3c',
    marginBottom: 15,
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  imageActionButton: {
    backgroundColor: '#ffd2c2',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  imageActionText: {
    color: '#757575',
    fontSize: 16,
    fontWeight: '500',
  },
  removeButton: {
    backgroundColor: '#ff4444',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  imagePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  imagePickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffd2c2',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ffb3a3',
  },
  cameraIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    tintColor: '#757575',
  },
  imagePickerText: {
    color: '#757575',
    fontSize: 16,
    fontWeight: '500',
  },
  cameraButton: {
    backgroundColor: '#ff7a3c',
    borderColor: '#ff7a3c',
  },
  cameraButtonIcon: {
    tintColor: '#fff',
  },
  cameraButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#e0e0e0',
    borderColor: '#e0e0e0',
  },
});

export default RegistrationScreen; 