import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  BackHandler,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { RootStackParamList, NavigationProp } from '../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { getFCMToken } from '../config/firebase';
import Header from '../components/Header';
import DeviceInfo from 'react-native-device-info';

type OtpScreenRouteProp = RouteProp<RootStackParamList, 'OtpScreen'>;

const { width } = Dimensions.get('window');

const OtpScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<OtpScreenRouteProp>();
  const { language, translations } = useLanguage();
  const { login } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const phoneNumber = route.params.phoneNumber;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      setOtp(['', '', '', '']);
      navigation.goBack();
      return true;
    });

    return () => backHandler.remove();
  }, [navigation]);


  const handleOtpChange = (text: string, index: number) => {
    const numericValue = text.replace(/[^0-9]/g, '');
  
    // If user pastes multiple digits (like 1234)
    if (numericValue.length > 1) {
      const digits = numericValue.split('').slice(0, 4);
      const newOtp = ['', '', '', ''];
      digits.forEach((digit, i) => {
        newOtp[i] = digit;
      });
      setOtp(newOtp);
      const nextIndex = digits.length === 4 ? 3 : digits.length;
      inputRefs.current[nextIndex]?.focus();
      return;
    }
  
    // Replace current digit with typed value
    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);
  
    // Move focus to next if input is filled
    if (numericValue.length === 1 && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      Alert.alert(
        translations.error[language],
        translations.invalidOtp[language]
      );
      return;
    }

    try {
      setLoading(true);
      const fcmToken = await getFCMToken();

      const response = await fetch('https://marathikamgarsena.com/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'KAMGARUNION_API_KEY'
        },
        body: JSON.stringify({
          mobile_number: phoneNumber,
          otp: otpString,
          fcm_token: fcmToken || ''
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store user data and token for future use
        const userData = {
          id: data.data.id,
          uniqueId: data.data.unique_id,
          name: data.data.name,
          email: data.data.email,
          mobileNumber: data.data.mobile_number,
          company: data.data.company,
          designation: data.data.designation,
          profileImage: data.data.user_profile,
          isPremium: data.data.is_premium,
          token: data.data.token,
          expiryDate: data.data.expiry_date || "",
          location: data.data.location || ""
        };
        await login(userData);

        // Let the authentication state change handle navigation automatically
        // The AppNavigator will automatically show the appropriate screen based on auth state
        // No need for manual navigation or delays
      } else {
        Alert.alert(
          translations.error[language],
          data.message || translations.invalidOtp[language]
        );
      }
    } catch (error) {
      Alert.alert(
        translations.error[language],
        translations.somethingWentWrong[language]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header
        title={language === 'mr' ? 'पडताळणी' : 'Verification'}
        showBackButton={false}
        onBackPress={() => navigation.goBack()}
        showIcons={false}
      />


      {/* Banner Image */}
      <View style={[styles.bannerContainer, { height: 220 }]}>
        <Image
          source={require('../../assets/banner.jpg')}
          style={[styles.bannerImage, { height: 220 }]}
          resizeMode="cover"
        />
      </View>

      {/* OTP Text */}
      <Text style={styles.otpMessage}>
        {translations.otpSent[language]} {phoneNumber}
      </Text>
      <Text style={styles.otpSubMessage}>
        {translations.enterOtp[language]}
      </Text>

      {/* OTP Input */}
      <View style={styles.otpContainer}>
        {[0, 1, 2, 3].map((index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              if (ref) {
                inputRefs.current[index] = ref;
              }
            }}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={otp[index]}
            onChangeText={(text) => handleOtpChange(text, index)}
            onFocus={() => {
              if (otp[index] !== '') {
                // select the existing text so user can overwrite
                inputRefs.current[index]?.setNativeProps({ selection: { start: 0, end: 1 } });
              }
            }}
            onKeyPress={(e) => {
              if (e.nativeEvent.key === 'Backspace') {
                if (otp[index] === '' && index > 0) {
                  inputRefs.current[index - 1]?.focus();
                }
              }
            }}
          />
        ))}
      </View>


      {/* Verify Button */}
      <TouchableOpacity
        style={[
          styles.verifyButton,
          loading && styles.verifyButtonDisabled
        ]}
        onPress={handleVerifyOtp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.verifyButtonText}>{translations.verify[language]}</Text>
        )}
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
    textAlign: 'center',
    marginBottom: 0,
    position: 'absolute',
    width: '100%',
    top: 20,
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
  otpMessage: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  otpSubMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#ff5e00',
    fontSize: 24,
    textAlign: 'center',
    marginHorizontal: 10,
    color: '#333',
  },
  verifyButton: {
    backgroundColor: '#ff5e00',
    marginHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 2,
    marginBottom: 20,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 16,
    color: '#666',
  },
  resendLink: {
    fontSize: 16,
    color: '#ff5e00',
    fontWeight: 'bold',
  },
  verifyButtonDisabled: {
    opacity: 0.7,
  },
});

export default OtpScreen;