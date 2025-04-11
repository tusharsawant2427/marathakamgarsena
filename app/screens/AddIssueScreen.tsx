import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../components/Header';

type RootStackParamList = {
  Issues: undefined;
  AddIssue: undefined;
};

type AddIssueScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddIssue'>;
};

const AddIssueScreen = ({ navigation }: AddIssueScreenProps) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [designation, setDesignation] = useState('');
  const [issueDetails, setIssueDetails] = useState('');

  const handleSubmit = () => {
    // Here you would typically make an API call to submit the issue
    console.log({
      name,
      mobile,
      email,
      company,
      designation,
      issueDetails,
    });
    
    // Navigate back to issues screen
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
       <Header
        title="Submit New Issue"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        showIcons={false}
      />


      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            value={mobile}
            onChangeText={setMobile}
            placeholder="Enter your mobile number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Company Name</Text>
          <TextInput
            style={styles.input}
            value={company}
            onChangeText={setCompany}
            placeholder="Enter company name"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Designation / Job profile</Text>
          <TextInput
            style={styles.input}
            value={designation}
            onChangeText={setDesignation}
            placeholder="Enter your designation"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Enter your issue in detail (Mandatory)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={issueDetails}
            onChangeText={setIssueDetails}
            placeholder="Describe your issue"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
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
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#FF5722',
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddIssueScreen; 