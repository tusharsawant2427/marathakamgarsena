import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  OtpScreen: undefined;
};

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleContinue = () => {
    if (phoneNumber.length === 10) {
      if (navigation) {
        navigation.navigate('OtpScreen');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Welcome Text */}
      <View style={[styles.headerContainer, { height: 85 }]}>
        <View style={styles.headerPattern}>
          <Image 
            source={require('../../assets/header_small.png')}
            style={[styles.headerImage, { height: 90 }]}
            resizeMode="cover"
          />
          <Text style={[styles.welcomeText, { fontSize: 24 }]}>Welcome !</Text>
        </View>
      </View>

      {/* Banner Image */}
      <View style={[styles.bannerContainer, { height: 220 }]}>
        <Image
          source={require('../../assets/banner.jpg')}
          style={[styles.bannerImage, { height: 220 }]}
          resizeMode="cover"
        />
      </View>

      {/* Verify Text */}
      <Text style={styles.verifyTitle}>Verify Your Number</Text>
      <Text style={styles.verifySubtitle}>
        Please enter your mobile number to receive a verification code.
      </Text>

      {/* Language Selection */}
      <View style={styles.languageContainer}>
        <TouchableOpacity
          style={[
            styles.languageButton,
            selectedLanguage === 'marathi' && styles.selectedLanguage,
          ]}
          onPress={() => setSelectedLanguage('marathi')}>
          <Text style={[
            styles.languageText,
            selectedLanguage === 'marathi' && styles.selectedLanguageText
          ]}>मराठी</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.languageButton,
            selectedLanguage === 'english' && styles.selectedLanguage,
          ]}
          onPress={() => setSelectedLanguage('english')}>
          <Text style={[
            styles.languageText,
            selectedLanguage === 'english' && styles.selectedLanguageText
          ]}>English</Text>
        </TouchableOpacity>
      </View>

      {/* Phone Number Input */}
      <View style={styles.inputContainer}>
        <View style={styles.countryCode}>
          <Text style={styles.countryCodeText}>+91</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          maxLength={10}
        />
      </View>

      {/* Continue Button */}
      <TouchableOpacity 
        style={[
          styles.continueButton,
          phoneNumber.length !== 10 && styles.continueButtonDisabled
        ]}
        onPress={handleContinue}
        disabled={phoneNumber.length !== 10}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
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
  welcomeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 0,
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
  bannerContainer: {
    width: width - 40,
    height: 200,
    alignSelf: 'center',
    marginVertical: 20,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  verifyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  verifySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginHorizontal: 40,
    marginBottom: 20,
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    paddingHorizontal: 40,
  },
  languageButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FF5722',
    marginHorizontal: 5,
  },
  selectedLanguage: {
    backgroundColor: '#FF5722',
  },
  languageText: {
    color: '#FF5722',
    fontSize: 16,
  },
  selectedLanguageText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    marginHorizontal: 40,
    marginBottom: 30,
  },
  countryCode: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  countryCodeText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    fontSize: 16,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: '#ddd',
  },
  continueButton: {
    backgroundColor: '#FF5722',
    marginHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 2,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default LoginScreen; 