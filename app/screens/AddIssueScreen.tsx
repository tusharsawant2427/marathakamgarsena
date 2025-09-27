import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../components/Header';
import { issueService, CreateIssueData } from '../services/issueService';
import { ApiError } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

type RootStackParamList = {
  Issues: undefined;
  AddIssue: undefined;
};

type AddIssueScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddIssue'>;
};

const AddIssueScreen = ({ navigation }: AddIssueScreenProps) => {
  const { userData } = useAuth();
  const { language } = useLanguage();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [designation, setDesignation] = useState('');
  const [issueDetails, setIssueDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setMobile(userData.mobileNumber || '');
      setEmail(userData.email || '');
      setCompany(userData.company || '');
      setDesignation(userData.designation || '');
    }
  }, [userData]);

  const handleSubmit = async () => {
    if (!name || !mobile || !company || !designation || !issueDetails) {
      Alert.alert(
        language === 'mr' ? 'त्रुटी' : 'Error',
        language === 'mr' ? 'सर्व आवश्यक फील्ड भरा' : 'Please fill in all required fields'
      );
      return;
    }

    try {
      setLoading(true);
      setError('');

      const issueData: CreateIssueData = {
        name,
        mobile_number: mobile,
        company,
        designation,
        description: issueDetails,
      };

      const response = await issueService.createIssue(issueData);
      
      if (response.success) {
        Alert.alert(
          'Success',
          language === 'mr' ? 'समस्या जोडण्यास सफल झाली आहे' : 'Issue submitted successfully',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        setError(response.message || language === 'mr' ? 'समस्या जोडण्यास सफल झाली नाही' : 'Failed to submit issue');
      }
    } catch (err) {
      const error = err as ApiError;
      setError(error.message || language === 'mr' ? 'समस्या जोडण्यास सफल झाली नाही' : 'Failed to submit issue');
      console.error('Error submitting issue:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={language === 'mr' ? 'नविन समस्या नोंद करा' : 'Submit New Issue'}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        showIcons={false}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          style={styles.content}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.formContainer}>
            <Text style={styles.label}>{language === 'mr' ? 'नाव *' : 'Name *'}</Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              value={name}
              editable={false}
              placeholder={language === 'mr' ? 'नाव द्या' : 'Enter your name'}
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>{language === 'mr' ? 'मोबाइल नंबर *' : 'Mobile Number *'}</Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              value={mobile}
              editable={false}
              placeholder={language === 'mr' ? 'मोबाइल नंबर द्या' : 'Enter your mobile number'}
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={10}
            />

            <Text style={styles.label}>{language === 'mr' ? 'कंपनी नाव *' : 'Company Name *'}</Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              value={company}
              editable={false}
              placeholder={language === 'mr' ? 'कंपनी नाव द्या' : 'Enter company name'}
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>{language === 'mr' ? 'पद / जॉब प्रोफाइल *' : 'Designation / Job profile *'}</Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              value={designation}
              editable={false}
              placeholder={language === 'mr' ? 'पद / जॉब प्रोफाइल द्या' : 'Enter your designation'}
              placeholderTextColor="#999"
            />
            <Text style={styles.label}>{language === 'mr' ? 'आपली समस्या विस्तार रुपात लिहा *' : 'Enter your issue in detail *'}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={issueDetails}  
              onChangeText={setIssueDetails}
              placeholder={language === 'mr' ? 'आपली समस्या विस्तारात लिहा' : 'Describe your issue'}
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}

            <TouchableOpacity 
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>{language === 'mr' ? 'अर्ज दाखल करा' : 'Submit'}</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  formContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#FFE0D9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  readOnlyInput: {
    backgroundColor: '#f0f0f0',
    color: '#666',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#ff5e00',
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff5e00',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default AddIssueScreen; 