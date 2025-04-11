import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';

const ContactUsScreen = () => {
  const navigation = useNavigation();

  const organizationInfo = {
    name: 'MARATHI KAMGAR SENA',
    regNumber: 'A.L.C/KARYASAN-17/11082',
    address: 'Shop number 9, Shubhangan Complex, Sector 7, Plot Number 25, Kamothe, Mumbai - 410209',
    mobile: '+91 8369519408',
    email: 'marathi.kamgar.sena@gmail.com',
  };

  const importantContacts = [
    {
      name: 'Mahesh Dattajirao Jadhav',
      position: 'President-Marathi Kamgar Sena',
      phone: '8369519408',
      email: 'marathi.kamgar.sena@gmail.com',
      image: require('../../assets/mahesh.jpg'),
    },
    {
      name: 'Prashant Jadhav',
      position: 'General Secretary',
      phone: '9224422271',
      image: require('../../assets/mahesh.jpg'),
    },
    {
      name: 'Sudhir Navale',
      position: 'General secretary',
      phone: '9987325776',
      image: require('../../assets/mahesh.jpg'),
    },
    {
      name: 'Rahul Sharma',
      position: 'Vice president',
      phone: '8369519408',
      image: require('../../assets/mahesh.jpg'),
    },
    {
      name: 'Adv. Swapnil Nagnath Kale',
      position: 'Vice president',
      phone: '+918369519408',
      image: require('../../assets/mahesh.jpg'),
    },
    {
      name: 'JaySingh Patil',
      position: 'Vice president',
      phone: '+918369519408',
      image: require('../../assets/mahesh.jpg'),
    },
  ];

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <View style={styles.container}>
       <Header
        title="Contact Us"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        showIcons={false}
      />

      <ScrollView style={styles.content}>
        <View style={styles.orgInfoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Organisation Name: </Text>
            <Text style={styles.value}>{organizationInfo.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Registration Number: </Text>
            <Text style={styles.value}>{organizationInfo.regNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Registered Address: </Text>
            <Text style={styles.value}>{organizationInfo.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Mobile Number: </Text>
            <TouchableOpacity onPress={() => handleCall(organizationInfo.mobile)}>
              <Text style={[styles.value, styles.link]}>{organizationInfo.mobile}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email Address: </Text>
            <TouchableOpacity onPress={() => handleEmail(organizationInfo.email)}>
              <Text style={[styles.value, styles.link]}>{organizationInfo.email}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Important Contacts</Text>
        
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Name or District"
          placeholderTextColor="#666"
        />

        <View style={styles.contactsGrid}>
          {importantContacts.map((contact, index) => (
            <View key={index} style={styles.contactCard}>
              <Image source={contact.image} style={styles.contactImage} />
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactPosition}>{contact.position}</Text>
              <TouchableOpacity onPress={() => handleCall(contact.phone)}>
                <Text style={styles.contactPhone}>{contact.phone}</Text>
              </TouchableOpacity>
              {contact.email && (
                <TouchableOpacity onPress={() => handleEmail(contact.email)}>
                  <Text style={styles.contactEmail}>{contact.email}</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>About Us</Text>
        <View style={styles.divider} />
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>Marathi Kamgar Sena Aims, Objectives and Policies.</Text>
          
          <Text style={styles.aboutText}>
            Jai Jawan, Jai Kisan and Jai Kamgar is the prime motto of Marathi Kamgar Sena. Endeavor to give material and cultural glory to the state of Maharashtra and Marathi language. Priority to Marathi Youth in the employment industry of Maharashtra is the goal of Marathi Kamgar Sena.
          </Text>
          
          <Text style={styles.aboutText}>
            The progress of State of Maharashtra and Marathi language along with overall development of Maharashtra is the core of the principles of Marathi Kamgar Sena. The organization is committed to making this idea a reality. It includes the expansion of Marathi culture, deserving importance be given to Marathi language and it's implementation, the expansion of knowledge in Marathi, and overall development of Marathi material and culture.
          </Text>
          
          <Text style={styles.aboutText}>
            The Marathi Kamgar Sena considers it necessary to unite all the Marathi People / Workers including the youth of Maharashtra.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5722',
    padding: 16,
    paddingTop: 40,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  content: {
    flex: 1,
  },
  orgInfoCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    color: '#666',
    fontSize: 13.5,
    marginBottom: 4,
  },
  value: {
    color: '#333',
    fontSize: 13,
  },
  link: {
    color: '#FF5722',
    textDecorationLine: 'underline',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#FF5722',
    marginHorizontal: 16,
    marginTop: 5,
    marginBottom: 5,
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    margin: 16,
    padding: 12,
    borderRadius: 24,
    fontSize: 16,
  },
  contactsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 8,
    marginHorizontal: 8,
  },
  contactCard: {
    width: '30%',
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 0,
  },
  contactImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 4,
  },
  contactName: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  contactPosition: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  contactPhone: {
    color: '#FF5722',
    textDecorationLine: 'underline',
    marginBottom: 2,
    fontSize: 11,
  },
  contactEmail: {
    color: '#FF5722',
    textDecorationLine: 'underline',
    fontSize: 10,
  },
  aboutSection: {
    padding: 16,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 8,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
    textAlign: 'justify',
  },
  divider: {
    height: 1,
    backgroundColor: '#FF5722',
    width: '70%',
    alignSelf: 'center',
    marginVertical: 8,
  },
});

export default ContactUsScreen; 