import React, { useState } from 'react';
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
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../components/Header';
import { RootStackParamList } from '../types/navigation';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

type EditProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;
};

const EditProfileScreen = ({ navigation }: EditProfileScreenProps) => {
  const [profileData, setProfileData] = useState({
    name: 'Tushar',
    email: 'tusharsawant242726@gmail.com',
    companyName: 'Target',
    designation: 'developer',
    address: '',
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImagePicker = () => {
    Alert.alert(
      'Select Profile Picture',
      'Choose an option',
      [
        {
          text: 'Choose from Gallery',
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
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleSave = () => {
    // TODO: Implement save functionality with profile image
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Edit Profile"
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
              <Text style={styles.inputLabel}>Enter User Name</Text>
              <TextInput
                style={styles.input}
                value={profileData.name}
                onChangeText={(text) => setProfileData({ ...profileData, name: text })}
                placeholder="Enter your name"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Image
              source={require('../../assets/email.png')}
              style={styles.inputIcon}
            />
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Please Enter Email Address</Text>
              <TextInput
                style={styles.input}
                value={profileData.email}
                onChangeText={(text) => setProfileData({ ...profileData, email: text })}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Image
              source={require('../../assets/ic_company.png')}
              style={styles.inputIcon}
            />
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Please Enter Company Name</Text>
              <TextInput
                style={styles.input}
                value={profileData.companyName}
                onChangeText={(text) => setProfileData({ ...profileData, companyName: text })}
                placeholder="Enter company name"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Image
              source={require('../../assets/job_profile.png')}
              style={styles.inputIcon}
            />
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Please Enter Designation</Text>
              <TextInput
                style={styles.input}
                value={profileData.designation}
                onChangeText={(text) => setProfileData({ ...profileData, designation: text })}
                placeholder="Enter your designation"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Image
              source={require('../../assets/home-address.png')}
              style={styles.inputIcon}
            />
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Enter an address</Text>
              <TextInput
                style={styles.input}
                value={profileData.address}
                onChangeText={(text) => setProfileData({ ...profileData, address: text })}
                placeholder="Enter your address"
                multiline
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>SAVE PROFILE</Text>
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
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen; 