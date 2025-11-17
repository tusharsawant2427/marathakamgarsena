import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { NavigationProp } from '../types/navigation';
import Header from '../components/Header';
import ViewShot, { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationType = NativeStackNavigationProp<RootStackParamList>;

interface FormData {
  name: string;
  position: string;
  mobile: string;
  uniqueId: string;
  profileImage?: string;
  expiryDate?: string;
}

const { width } = Dimensions.get('window');

// Define the ID card's original dimensions (based on your image)
const ORIGINAL_CARD_WIDTH = 856;
const ORIGINAL_CARD_HEIGHT = 740;
const CARD_ASPECT_RATIO = ORIGINAL_CARD_WIDTH / ORIGINAL_CARD_HEIGHT;

// Use the full screen width with minimal margins
const CARD_MARGINS = 16;
const cardWidth = width - (CARD_MARGINS * 2);
const cardHeight = cardWidth / CARD_ASPECT_RATIO;

// Scale factor to map from original dimensions to actual card size
const scaleX = cardWidth / ORIGINAL_CARD_WIDTH;
const scaleY = cardHeight / ORIGINAL_CARD_HEIGHT;

// Define the exact fixed positions of the fields on the original image
const FIELD_POSITIONS = {
  profileImage: { 
    x: 180, 
    y: 140, 
    width: 100, 
    height: 100 
  },
  name: {
    x: 366,
    y: 147
  },
  position: {
    x: 366,
    y: 172
  },
  memberNumber: {
    x: 366,
    y: 172
  },
  memberTitle: {
    x: 326,
    y: 220
  },
  mobile: {
    x: 408,
    y: 197
  },
  uniqueId: {
    x: 432,
    y: 222
  },
  expiryDate: {
    x: 230,
    y: 290
  }
};

// Add type for position
interface ScaledPosition {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

// Function to map original coordinates to scaled coordinates
const getScaledPosition = (
  originalX: number, 
  originalY: number, 
  originalWidth: number | null = null, 
  originalHeight: number | null = null
): ScaledPosition => {
  const scaledPos: ScaledPosition = {
    x: originalX * scaleX,
    y: originalY * scaleY,
  };
  
  if (originalWidth !== null && originalHeight !== null) {
    scaledPos.width = originalWidth * scaleX;
    scaledPos.height = originalHeight * scaleY;
  }
  
  return scaledPos;
};

const ApplyIDCardScreen = () => {
  const navigation = useNavigation<NavigationType>();
  const { userData, login, updateUserData } = useAuth();
  const { language } = useLanguage();
  const viewShotRef = useRef<ViewShot>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    position: '',
    mobile: '',
    uniqueId: '',
    profileImage: '',
    expiryDate: '',
  });

  // Refresh user data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const refreshUserData = async () => {
        try {
          const storedUserData = await AsyncStorage.getItem('userData');
          if (storedUserData) {
            const parsedData = JSON.parse(storedUserData);
            await updateUserData(parsedData);
            console.log('User data refreshed, isPremium:', parsedData.isPremium);
          }
        } catch (error) {
          console.error('Error refreshing user data:', error);
        }
      };
      
      refreshUserData();
    }, [])
  );

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        position: userData.designation || '',
        mobile: userData.mobileNumber || '',
        uniqueId: userData.uniqueId || '',
        profileImage: userData.profileImage || '',
        expiryDate: userData.expiryDate || userData.subscription_end_date || '',
      });

      // Only show loading if not premium (ID card not activated)
      // If user is premium, they already have access to ID card
      if (!userData.isPremium && !userData.is_premium) {
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [userData]);

  const generateIDCard = async () => {
    try {
      if (!viewShotRef.current) {
        Alert.alert('Error', 'Failed to generate ID card');
        return;
      }

      const uri = await captureRef(viewShotRef, {
        format: 'png',
        quality: 0.8,
      });
      
      const filePath = `${RNFS.DocumentDirectoryPath}/id_card_${Date.now()}.png`;
      
      await RNFS.copyFile(uri, filePath);
      
      Alert.alert(
        'Success',
        'ID Card has been generated and saved!',
        [{ text: 'OK' }]
      );

      return filePath;
    } catch (error) {
      Alert.alert('Error', 'Failed to generate ID card');
      console.error(error);
    }
  };

  const handleShare = async () => {
    try {
      const filePath = await generateIDCard();
      if (filePath) {
        await Share.open({
          url: `file://${filePath}`,
          type: 'image/png',
          title: 'Share ID Card'
        });
      } else {
        Alert.alert('Error', 'Failed to generate ID card for sharing.');
      }
    } catch (error) {
      console.error('Error during sharing:', error);
      Alert.alert('Error', 'An error occurred while trying to share the ID card. Please try again.');
    }
  };

  const openTermsConditions = () => {
    navigation.navigate('WebView', {
      url: 'https://marathikamgarsena.com/terms-conditions?source=android',
      title: language === 'mr' ? 'नियम आणि अटी' : 'Terms & Conditions',
    });
  };

  const openPrivacyPolicy = () => {
    navigation.navigate('WebView', {
      url: 'https://marathikamgarsena.com/privacy-policy?source=android',
      title: language === 'mr' ? 'गोपनीयता धोरण' : 'Privacy Policy',
    });
  };

  // Get scaled positions for each field
  const profileImgPos = getScaledPosition(
    FIELD_POSITIONS.profileImage.x,
    FIELD_POSITIONS.profileImage.y,
    FIELD_POSITIONS.profileImage.width,
    FIELD_POSITIONS.profileImage.height
  );
  
  const namePos = getScaledPosition(FIELD_POSITIONS.name.x, FIELD_POSITIONS.name.y);
  const positionPos = getScaledPosition(FIELD_POSITIONS.position.x, FIELD_POSITIONS.position.y);
  const mobilePos = getScaledPosition(FIELD_POSITIONS.mobile.x, FIELD_POSITIONS.mobile.y);
  const uniqueIdPos = getScaledPosition(FIELD_POSITIONS.uniqueId.x, FIELD_POSITIONS.uniqueId.y);
  const expiryPos = getScaledPosition(FIELD_POSITIONS.expiryDate.x, FIELD_POSITIONS.expiryDate.y);
  const memberNumberPos = getScaledPosition(FIELD_POSITIONS.memberNumber.x, FIELD_POSITIONS.memberNumber.y);
  const memberTitlePos = getScaledPosition(FIELD_POSITIONS.memberTitle.x, FIELD_POSITIONS.memberTitle.y);

  return (
    <ScrollView style={styles.container}>
      <Header
        title={language === 'mr' ? 'आपलं ओळखपत्र' : 'Your ID Card'}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        showIcons={false}
      />

      <View style={styles.formContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff5e00" />
            <Text style={styles.loadingText}>Loading your ID card...</Text>
          </View>
        ) : !userData?.isPremium && !userData?.is_premium ? (
          <View style={styles.premiumRequiredContainer}>
            {/* <View style={[styles.idCardContainer, { width: cardWidth, height: cardHeight }]}>
              <View style={styles.idCardWrapper}>
                <Image
                  source={require('../../assets/id_card_layout_preview.jpg')}
                  style={styles.idCardHeader}
                  resizeMode="contain"
                />
              </View>
            </View> */}
            <Text style={styles.premiumIcon}>🔒</Text>
            <Text style={styles.premiumTitle}>Premium Membership Required</Text>
            <Text style={styles.premiumText}>
              To download your ID card, you need to activate premium membership by making a payment.
            </Text>
            <TouchableOpacity
              style={styles.activateButton}
              onPress={() => navigation.navigate('ExamplePayment')}
              activeOpacity={0.8}>
              <Text style={styles.activateButtonText}>Activate Premium Membership</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backToDashboardButton}
              onPress={() => navigation.navigate('Dashboard')}
              activeOpacity={0.8}>
              <Text style={styles.backToDashboardButtonText}>Back to Dashboard</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <ViewShot ref={viewShotRef} style={[styles.idCardContainer, { width: cardWidth, height: cardHeight }]}>
              <View style={styles.idCardWrapper}>
                <Image
                  source={require('../../assets/id_card_layout_preview.jpg')}
                  style={styles.idCardHeader}
                  resizeMode="contain"
                />
                <View style={styles.overlayContainer}>
                  {/* Profile image */}
                  <View 
                    style={[
                      styles.profileImageContainer, 
                      {
                        position: 'absolute',
                        left: profileImgPos.x,
                        top: profileImgPos.y,
                        width: profileImgPos.width,
                        height: profileImgPos.height,
                      }
                    ]}
                  >
                    <Image
                      source={
                        formData.profileImage
                          ? { uri: formData.profileImage }
                          : require('../../assets/profile.png')
                      }
                      style={styles.profileImage}
                      resizeMode="cover"
                      defaultSource={require('../../assets/profile.png')}
                    />
                  </View>
                  
                  {/* Name */}
                  <Text 
                    style={[
                      styles.overlayText, 
                      {
                        position: 'absolute',
                        left: namePos.x,
                        top: namePos.y,
                        fontSize: 15 * scaleX,
                      }
                    ]}
                  >
                    {formData.name}
                  </Text>
                  
                  {/* Position */}
                  <Text 
                    style={[
                      styles.overlayText, 
                      {
                        position: 'absolute',
                        left: positionPos.x,
                        top: positionPos.y,
                        fontSize: 16 * scaleX,
                      }
                    ]}
                  >
                    {language === 'mr' ? 'सदस्य' : 'Member'}
                  </Text>
                  
                  {/* Mobile */}
                  <Text 
                    style={[
                      styles.overlayText, 
                      {
                        position: 'absolute',
                        left: mobilePos.x,
                        top: mobilePos.y,
                        fontSize: 16 * scaleX,
                      }
                    ]}
                  >
                    {formData.mobile}
                  </Text>
                  
                    {/* Position */}
                    <Text 
                    style={[
                      styles.overlayText, 
                      {
                        position: 'absolute',
                        left: memberTitlePos.x,
                        top: memberTitlePos.y,
                        fontSize: 15 * scaleX,
                      }
                    ]}
                  >
                    सभासद क्रमांक :
                  </Text>

                  {/* Unique ID */}
                  <Text 
                    style={[
                      styles.overlayText, 
                      {
                        position: 'absolute',
                        left: uniqueIdPos.x,
                        top: uniqueIdPos.y,
                        fontSize: 14 * scaleX,
                      }
                    ]}
                  >
                    {formData.uniqueId}
                  </Text>
                  
                  {/* Expiry Date */}
                  {formData.expiryDate && (
                    <Text 
                      style={[
                        styles.overlayText, 
                        {
                          position: 'absolute',
                          left: expiryPos.x,
                          top: expiryPos.y,
                          fontSize: 15 * scaleX,
                        }
                      ]}
                    >
                      {new Date(formData.expiryDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </Text>
                  )}
                </View>
              </View>
            </ViewShot>
  <View style={styles.divider} />

            <View style={styles.linksSection}>
              {/* <Text style={styles.linksSectionTitle}>
                {language === 'mr' ? 'अधिक माहिती' : 'More Information'}
              </Text> */}
              <View style={styles.linksContainer}>
                <TouchableOpacity 
                  style={styles.linkButton} 
                  onPress={openTermsConditions}
                >
                  <Text style={styles.linkIcon}>📋</Text>
                  <Text style={styles.linkButtonText} numberOfLines={1}>
                    {language === 'mr' ? 'नियम व अटी' : 'Terms & Conditions'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.linkButton} 
                  onPress={openPrivacyPolicy}
                >
                  <Text style={styles.linkIcon}>🔒</Text>
                  <Text style={styles.linkButtonText} numberOfLines={1}>
                    {language === 'mr' ? 'गोपनीयता' : 'Privacy Policy'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.statusCard}>
              <View style={styles.statusIconContainer}>
                <Text style={styles.statusIcon}>✓</Text>
              </View>
              <Text style={styles.statusTitle}>
                {language === 'mr' ? 'ओळखपत्र तयार आहे!' : 'ID Card is Ready!'}
              </Text>
              <Text style={styles.statusSubtitle}>
                {language === 'mr' ? 'आपले ओळखपत्र डाउनलोड किंवा शेअर करा' : 'Download or share your ID card'}
              </Text>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={styles.downloadButton} 
                onPress={generateIDCard}
                disabled={loading}
              >
                <Text style={styles.buttonIcon}>⬇</Text>
                <Text style={styles.downloadButtonText}>
                  {language === 'mr' ? 'डाउनलोड करा' : 'Download'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.shareButton} 
                onPress={handleShare}
                disabled={loading}
              >
                <Text style={styles.buttonIcon}>📤</Text>
                <Text style={styles.shareButtonText}>
                  {language === 'mr' ? 'शेअर करा' : 'Share'}
                </Text>
              </TouchableOpacity>
            </View>

          
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 8,
    alignItems: 'center',
  },
  idCardContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginHorizontal: CARD_MARGINS,
    marginVertical: 8,
    alignSelf: 'center',
    maxWidth: width - (CARD_MARGINS * 2),
  },
  idCardWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  idCardHeader: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayText: {
    color: '#000',
    fontWeight: 'bold',
  },
  profileImageContainer: {
    overflow: 'hidden',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#ff5e00',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#ffe8dc',
  },
  statusIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff5f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#ff5e00',
  },
  statusIcon: {
    fontSize: 32,
    color: '#ff5e00',
    fontWeight: 'bold',
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    textAlign: 'center',
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  downloadButton: {
    flex: 1,
    backgroundColor: '#ff5e00',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#ff5e00',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#ff5e00',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#ff5e00',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonIcon: {
    fontSize: 20,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 32,
    marginVertical: 10,
  },
  linksSection: {
    marginBottom: 30,
    paddingHorizontal: 16,
  },
  linksSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 6,
  },
  linkIcon: {
    fontSize: 18,
  },
  linkButtonText: {
    color: '#ff5e00',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  premiumRequiredContainer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 40,
  },
  premiumIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  premiumText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  activateButton: {
    backgroundColor: '#667eea',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
    elevation: 2,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  activateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backToDashboardButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
  },
  backToDashboardButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ApplyIDCardScreen;
 
