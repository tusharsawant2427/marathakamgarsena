import React, { useState } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';

const { width } = Dimensions.get('window');

const ApplyIDCardScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    mobile: '',
    address: '',
  });

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    Alert.alert(
      'Success',
      'Your ID Card application has been submitted successfully!',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Header
        title="Your ID Card is Ready"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        showIcons={false}
      />

      <View style={styles.formContainer}>
        <View style={styles.idCardContainer}>
          <Image
            source={require('../../assets/id_card_layout_preview.jpg')}
            style={styles.idCardHeader}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.languageNote}>Change App language to Marathi to get Marathi ID Card</Text>

        <TouchableOpacity style={styles.downloadButton} onPress={handleSubmit}>
          <Text style={styles.downloadButtonText}>Download PDF ID Card</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton} onPress={() => {}}>
          <Text style={styles.shareButtonText}>Share to Social Media</Text>
        </TouchableOpacity>
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
    padding: 16,
  },
  idCardContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  idCardHeader: {
    width: '100%',
    height: '100%',
  },
  idCardContent: {
    padding: 16,
  },
  idCardField: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  idCardLabel: {
    fontSize: 16,
    color: '#333',
    marginRight: 8,
  },
  idCardValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  signatureImage: {
    alignSelf: 'flex-end',
    width: 100,
    height: 40,
    marginTop: 20,
  },
  signatureText: {
    textAlign: 'right',
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  designationText: {
    textAlign: 'right',
    fontSize: 14,
    color: '#333',
  },
  rulesContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  rulesHeader: {
    width: '100%',
    height: 60,
  },
  rulesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 12,
    color: '#333',
  },
  ruleText: {
    fontSize: 14,
    color: '#333',
    paddingHorizontal: 16,
    paddingVertical: 4,
    textAlign: 'left',
  },
  languageNote: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 16,
  },
  downloadButton: {
    backgroundColor: '#FF5722',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  shareButton: {
    backgroundColor: '#FF5722',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ApplyIDCardScreen; 