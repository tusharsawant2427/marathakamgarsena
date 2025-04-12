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
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { RootStackParamList, NavigationProp } from '../types/navigation';

type OtpScreenRouteProp = RouteProp<RootStackParamList, 'OtpScreen'>;

const { width } = Dimensions.get('window');

const OtpScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<OtpScreenRouteProp>();
  const { language, translations } = useLanguage();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const phoneNumber = route.params.phoneNumber;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      setOtp(['', '', '', '', '', '']);
      navigation.goBack();
      return true;
    });

    return () => backHandler.remove();
  }, [navigation]);

  const handleOtpChange = (text: string, index: number) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (numericValue && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert(
        translations.error[language],
        translations.invalidOtp[language]
      );
      return;
    }
    // TODO: Implement OTP verification
    navigation.navigate('Dashboard');
  };

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
          <Text style={[styles.headerText, { fontSize: 24 }]}>VERIFICATION</Text>
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

      {/* OTP Text */}
      <Text style={styles.otpMessage}>
        {translations.otpSent[language]} {phoneNumber}
      </Text>
      <Text style={styles.otpSubMessage}>
        {translations.enterOtp[language]}
      </Text>

      {/* OTP Input */}
      <View style={styles.otpContainer}>
        {[0, 1, 2, 3, 4, 5].map((index) => (
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
          />
        ))}
      </View>

      {/* Verify Button */}
      <TouchableOpacity
        style={styles.verifyButton}
        onPress={handleVerifyOtp}
      >
        <Text style={styles.verifyButtonText}>{translations.verify[language]}</Text>
      </TouchableOpacity>

      {/* Resend OTP */}
      <TouchableOpacity style={styles.resendContainer}>
        <Text style={styles.resendText}>{translations.didntReceiveOtp[language]} </Text>
        <Text style={styles.resendLink}>{translations.resend[language]}</Text>
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
    borderBottomColor: '#FF5722',
    fontSize: 24,
    textAlign: 'center',
    marginHorizontal: 10,
    color: '#333',
  },
  verifyButton: {
    backgroundColor: '#FF5722',
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
    color: '#FF5722',
    fontWeight: 'bold',
  },
});

export default OtpScreen;