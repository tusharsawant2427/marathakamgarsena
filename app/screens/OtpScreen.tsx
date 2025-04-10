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
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  OtpScreen: undefined;
  Dashboard: undefined;
};

type OtpScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'OtpScreen'>;
};

const { width } = Dimensions.get('window');

const OtpScreen = ({ navigation }: OtpScreenProps) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      setOtp(['', '', '', '']);
      navigation.goBack();
      return true;
    });

    return () => backHandler.remove();
  }, [navigation]);

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numeric input
    const numericValue = value.replace(/[^0-9]/g, '');
    setOtp(prevOtp => {
      const updatedOtp = [...prevOtp];
      updatedOtp[index] = numericValue;
      return updatedOtp;
    });

    // Move to next input if value is entered
    if (numericValue && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
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
        OTP has been sent to you on your mobile phone.
      </Text>
      <Text style={styles.otpSubMessage}>
        Please enter it below
      </Text>

      {/* OTP Input */}
      <View style={styles.otpContainer}>
        {[0, 1, 2, 3].map((index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            style={styles.otpInput}
            maxLength={1}
            keyboardType="number-pad"
            value={otp[index]}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>

      {/* Verify Button */}
      <TouchableOpacity 
        style={styles.verifyButton}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text style={styles.verifyButtonText}>Verify</Text>
      </TouchableOpacity>

      {/* Resend OTP */}
      <TouchableOpacity style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't receive OTP? </Text>
        <Text style={styles.resendLink}>Resend</Text>
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