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
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Header from '../components/Header';
import ViewShot, { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';

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
  const navigation = useNavigation();
  const { userData, login } = useAuth();
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

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        position: userData.designation || '',
        mobile: userData.mobileNumber || '',
        uniqueId: userData.uniqueId || '',
        profileImage: userData.profileImage || '',
        expiryDate: userData.expiryDate || '',
      });

      // If user is not premium, initiate ID card request
      if (!userData.isPremium) {
        handleIdCardRequest();
      }
    }
  }, [userData]);

  const handleIdCardRequest = async () => {
    try {
      setLoading(true);
      
      // First API call to request ID card
      const requestResponse = await fetch('https://marathikamgarsena.com/api/request-for-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData?.token}`
        },
        body: JSON.stringify({
          id_card_id: 1
        }),
      });

      const requestData = await requestResponse.json();

      if (!requestData.success) {
        Alert.alert('Error', requestData.message || 'Failed to request ID card');
        return;
      }

      // Second API call to update ID card status
      const updateResponse = await fetch('https://marathikamgarsena.com/api/update-for-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData?.token}`
        },
        body: JSON.stringify({
          id_card_id: 1,
          order_id: requestData.data.order_id,
          transaction_id: requestData.data.transaction_id
        }),
      });

      const updateData = await updateResponse.json();

      if (updateData.success) {
        const subscriptionEndDate = updateData.data.subscription_end_date;
        // Update form data with expiry date
        setFormData(prev => ({
          ...prev,
          expiryDate: subscriptionEndDate || prev.expiryDate
        }));

        // Update user's premium status using login function
        if (userData) {
          await login({
            ...userData,
            isPremium: true,
            expiryDate: subscriptionEndDate
          });
        }
      } else {
        Alert.alert('Error', updateData.message || 'Failed to update ID card status');
      }
    } catch (error) {
      console.error('Error in ID card request:', error);
      Alert.alert('Error', 'Failed to process ID card request');
    } finally {
      setLoading(false);
    }
  };

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
            <Text style={styles.loadingText}>Processing your ID card request...</Text>
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

            <Text style={styles.languageNote}>
              {language === 'mr' ? 'मराठी ओळखपत्र तयार आहे' : 'Your ID Card is Ready'}
            </Text>

            <TouchableOpacity 
              style={styles.downloadButton} 
              onPress={generateIDCard}
              disabled={loading}
            >
              <Text style={styles.downloadButtonText}>
                {language === 'mr' ? 'ओळखपत्र डाउनलोड करा' : 'Download ID Card'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.shareButton} 
              onPress={handleShare}
              disabled={loading}
            >
              <Text style={styles.shareButtonText}>
                {language === 'mr' ? 'सोशल मीडियावर शेअर करा' : 'Share to Social Media'}
              </Text>
            </TouchableOpacity>
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
  languageNote: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 16,
  },
  downloadButton: {
    backgroundColor: '#ff5e00',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    marginHorizontal: 16,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  shareButton: {
    backgroundColor: '#ff5e00',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 20,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
});

export default ApplyIDCardScreen; 