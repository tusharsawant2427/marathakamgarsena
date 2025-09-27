import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface Member {
  id: number;
  name: string;
  designation: string;
  mobile_number: string;
  email: string | null;
  address: string | null;
  profile: string;
  addedby: number;
  created_at: string;
  updated_at: string;
}

const ContactUsScreen = () => {
  const navigation = useNavigation();
  const { language } = useLanguage();
  const { userData } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://marathikamgarsena.com/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData?.token}`
        },
        body: JSON.stringify({
          language_code: language
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMembers(data.data);
      } else {
        Alert.alert(
          language === 'mr' ? 'त्रुटी' : 'Error',
          data.message || (language === 'mr' ? 'सदस्य माहिती लोड करण्यात अयशस्वी' : 'Failed to load members')
        );
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      Alert.alert(
        language === 'mr' ? 'त्रुटी' : 'Error',
        language === 'mr' ? 'सदस्य माहिती लोड करण्यात अयशस्वी' : 'Failed to load members'
      );
    } finally {
      setLoading(false);
    }
  };

  const organizationInfo = {
    name: language === 'mr' ? 'मराठी कामगार सेना' : 'MARATHI KAMGAR SENA',
    regNumber: language === 'mr' ? 'ए.एल.सी./कर्यसंघ-१७/११०८२' : 'A.L.C/KARYASAN-17/11082',
    address: language === 'mr' ? 'शॉप क्रमांक ९, शुभांगन कॉम्प्लेक्स, सेक्टर ७, प्लॉट क्रमांक २५, कामोठे, मुंबई - ४१०२०९' : 'Shop number 9, Shubhangan Complex, Sector 7, Plot Number 25, Kamothe, Mumbai - 410209',
    mobile:  '+91 8369519408',
    email: 'marathi.kamgar.sena@gmail.com',
  };

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header
        title={language === 'mr' ? 'संपर्क करा' : 'Contact Us'}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        showIcons={false}
      />

      <ScrollView style={styles.content}>
        <View style={styles.orgInfoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{language === 'mr' ? 'संस्थेचे नाव' : 'Organisation Name: '}</Text>
            <Text style={styles.value}>{organizationInfo.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{language === 'mr' ? 'संस्थेचा नोंदणी क्रमांक' : 'Registration Number: '}</Text>
            <Text style={styles.value}>{organizationInfo.regNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{language === 'mr' ? 'संस्थेचा अधिकृत पत्ता' : 'Registered Address: '}</Text>
            <Text style={styles.value}>{organizationInfo.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{language === 'mr' ? 'मोबाइल नंबर' : 'Mobile Number: '} </Text>
            <TouchableOpacity onPress={() => handleCall(organizationInfo.mobile)}>
              <Text style={[styles.value, styles.link]}>{organizationInfo.mobile}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{language === 'mr' ? 'ईमेल पत्ता' : 'Email Address: '}</Text>
            <TouchableOpacity onPress={() => handleEmail(organizationInfo.email)}>
              <Text style={[styles.value, styles.link]}>{organizationInfo.email}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          {language === 'mr' ? 'महत्वाचे संपर्क' : 'Important Contacts'}
        </Text>
        
        {/* <TextInput
          style={styles.searchInput}
          placeholder={language === 'mr' ? 'नाव किंवा जिल्हा शोधा' : 'Search by Name or Designation'}
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        /> */}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff5e00" />
          </View>
        ) : (
          <View style={styles.contactsGrid}>
            {filteredMembers.map((member) => (
              <View key={member.id} style={styles.contactCard}>
                <Image 
                  source={member.profile ? { uri: member.profile } : require('../../assets/splash_logo_main.png')} 
                  style={styles.contactImage} 
                  defaultSource={require('../../assets/splash_logo_main.png')}
                />
                <Text style={styles.contactName}>{member.name}</Text>
                <Text style={styles.contactPosition}>{member.designation}</Text>
                <TouchableOpacity onPress={() => handleCall(member.mobile_number)}>
                  <Text style={styles.contactPhone}>{member.mobile_number}</Text>
                </TouchableOpacity>
                {member.email && (
                  <TouchableOpacity onPress={() => member.email && handleEmail(member.email)}>
                    <Text style={styles.contactEmail}>{member.email}</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>
          {language === 'mr' ? 'आमच्याबद्दल' : 'About Us'}
        </Text>
        <View style={styles.divider} />
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>
            {language === 'mr' ? 'मराठी कामगार सेनेची ध्येय आणि धोरण...' : 'Marathi Kamgar Sena Aims, Objectives and Policies.'}
          </Text>
          
          <Text style={styles.aboutText}>
            {language === 'mr' 
              ? 'जय जवान,जय किसान आणि जय कामगार हे मराठी कामगार सेनेचे ब्रीद वाक्य आहे.महाराष्ट्र राज्य आणि मराठी भाषा यांना भौतिक व सांस्कृतिक वैभव प्राप्त करून देणे.महाराष्ट्रातील रोजगार उद्योगात मराठी कामगारांना प्राधान्य हे मराठी कामगार सेनेचे ध्येय आहे.'
              : 'Jai Jawan, Jai Kisan and Jai Kamgar is the prime motto of Marathi Kamgar Sena. Endeavor to give material and cultural glory to the state of Maharashtra and Marathi language. Priority to Marathi Youth in the employment industry of Maharashtra is the goal of Marathi Kamgar Sena.'
            }
          </Text>
          
          <Text style={styles.aboutText}>
            {language === 'mr'
              ? 'महाराष्ट्र राज्य व मराठी भाषा,महाराष्ट्राचा सर्वांगीण विकास या गोष्टींचा विचार हा मराठी कामगार सेनेच्या तत्त्वांचा मूळ गाभा आहे. हा विचार प्रत्यक्षात आणण्याकरता संघटना बांधील आहे. मराठी संस्कृती विस्तार, मराठी भाषा विचार, मराठीमध्ये ज्ञानकक्षा रुंदावणे, भौतिक व सांस्कृतिक विकास करणे ह्या गोष्टी त्यामध्ये अंतर्भूत आहेत.'
              : 'The progress of State of Maharashtra and Marathi language along with overall development of Maharashtra is the core of the principles of Marathi Kamgar Sena. The organization is committed to making this idea a reality. It includes the expansion of Marathi culture, deserving importance be given to Marathi language and it\'s implementation, the expansion of knowledge in Marathi, and overall development of Marathi material and culture.'
            }
          </Text>
          
          <Text style={styles.aboutText}>
            {language === 'mr'
              ? 'महाराष्ट्राच्या विकासार्थ काम करण्यासाठी सर्व मराठी माणसांना/कामगारांना - ज्यात सर्व जातींचे, धर्मांचे, पंथांचे आणि वर्गांचे लोक आले - एकत्र करून मराठी कामगार सेनेच्या ध्वजाखाली त्यांना एकवटवणे ही गोष्ट मराठी कामगार सेना आवश्यक मानते.'
              : 'The Marathi Kamgar Sena considers it necessary to unite all the Marathi People/Workers including people of all castes, religions, creeds and classes to work for the development of Maharashtra under the banner of the Marathi Kamgar Sena.'
            }
          </Text>

          <Text style={styles.aboutText}>
            {language === 'mr'
              ? 'महाराष्ट्रातील रस्ते, आरोग्य, व्यापार, शेती, वीज, पाणी, शिक्षण, पर्यटन, महिला, कामगार, विद्यार्थी, आदिवासी, कायदा व सुव्यवस्था, क्रीडा, उद्योग, वित्त, गृहखाते, सहकार, रेल्वे, केंद्र-राज्य संबंध या क्षेत्रांतील सर्व प्रश्नांची तड लावणे आणि त्यात मराठी माणसाचे/कामगारांचे सर्वंकष वर्चस्व स्थापित करणे, ही संघटनेच्या कार्याची मुख्य दिशा आहे.'
              : 'Resolving issues relating to Roads, Health, Trade, Agriculture, Electricity, Water, Education, Tourism, Women, Workers, Students, Tribals, Law and Order, Sports, Industry, Finance, Home Department, Co-operation, Railways, Central-State Relations in Maharashtra. The main direction of the organization is to establish the overall dominance of Marathi People and Marathi workers in it.'
            }
          </Text>

          <Text style={styles.aboutText}>
            {language === 'mr'
              ? 'महाराष्ट्रात कामगार क्षेत्रात परप्रांतीयांचे वर्चस्व संपूर्णत: नेस्तनाबूत करणे आणि `मराठी माणसासाठीच महाराष्ट्र\' ह्यानुसार आग्रही असणे ही मराठी कामगार सेनेची विचारधारा आहे.'
              : 'The ideology of the Marathi Kamgar Sena is to completely eradicate the dominance of Migrants in the labor sector in Maharashtra and to insist on "Maharashtra for the Marathi people only".'
            }
          </Text>

          <Text style={styles.aboutText}>
            {language === 'mr'
              ? 'भौतिक व सांस्कृतिक समृद्धीचे शिखर गाठलेला, जगाला हेवा वाटेल असा महाराष्ट्र व मराठी माणूस बनवणे हे मराठी कामगार सेनेचे स्वप्न आहे आणि ते पूर्ण करण्यासाठी प्रयत्नांची पराकाष्ठा करण्यासाठीच ह्या संघटनेचा जन्म झाला आहे.'
              : 'It is the dream of the Marathi Kamgar Sena to make Maharashtra and the Marathi people reach the pinnacle of material and cultural prosperity, making them enviable to the world. This organization was born to strive towards achieving this dream.'
            }
          </Text>

          <Text style={[styles.aboutText, { fontWeight: 'bold',  fontSize: 14 }]}>
            {language === 'mr'
              ? '~ महेश जाधव,\n🔸प्रदेश उपाध्यक्ष -राष्ट्रवादी काँग्रेस पार्टी \n🔸अध्यक्ष - मराठी कामगार सेना'
              : '~ Mahesh Jadhav,\n🔸State Vice President – Nationalist Congress Party \n🔸President - Marathi Kamgar Sena'
            }
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
    backgroundColor: '#ff5e00',
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
    fontSize: 20,
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
    fontSize: 16,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  value: {
    color: '#333',
    fontSize: 15,
  },
  link: {
    color: '#ff5e00',
    textDecorationLine: 'underline',
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#ff5e00',
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
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  contactPosition: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  contactPhone: {
    color: '#ff5e00',
    textDecorationLine: 'underline',
    marginBottom: 2,
    fontSize: 11,
  },
  contactEmail: {
    color: '#ff5e00',
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
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
    textAlign: 'justify',
  },
  divider: {
    height: 1,
    backgroundColor: '#ff5e00',
    width: '70%',
    alignSelf: 'center',
    marginVertical: 8,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
});

export default ContactUsScreen; 