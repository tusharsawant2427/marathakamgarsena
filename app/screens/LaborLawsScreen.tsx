import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { NavigationProp } from '../types/navigation';

const laborLaws = [
  {
    id: '1',
    title: 'Providing Priority in employment to minimum local persons in all Micro, Small, Medium, Large & Mega Industrial Enterprises.',
    subtitle: 'Providing Priority in employment to minimum 80 local persons in all Micro.',
    pdfUrl: 'https://marathikamgarsena.com/storage/act_rules/1701074275.pdf'
  },
  {
    id: '2',
    title: 'The Factories Act, 1948',
    subtitle: 'The Factories Act, 1948',
    pdfUrl: 'https://marathikamgarsena.com/storage/act_rules/1701074275.pdf'
  },
  {
    id: '3',
    title: 'The Minimum Wages Act, 1948',
    subtitle: 'The Minimum Wages Act, 1948',
    pdfUrl: 'https://marathikamgarsena.com/storage/act_rules/1701074275.pdf'
  },
  {
    id: '4',
    title: '74The Industrial Disputes Act, 1947',
    subtitle: '74The Industrial Disputes Act, 1947',
    pdfUrl: 'https://marathikamgarsena.com/storage/act_rules/1701074275.pdf'
  },
  {
    id: '5',
    title: 'The Employers Liability Act, 1938 (repealed by Act No.23 of 2016)',
    subtitle: 'The Employers Liability Act, 1938 (repealed by Act No.23 of 2016)',
    pdfUrl: 'https://marathikamgarsena.com/storage/act_rules/1701074275.pdf'
  },
  {
    id: '6',
    title: 'The Workmen Compensation Act, 1923',
    subtitle: 'The Workmen Compensation Act, 1923',
    pdfUrl: 'https://marathikamgarsena.com/storage/act_rules/1701074275.pdf'
  },
  {
    id: '7',
    title: 'The Child Labour (Prohibition and Regulation) Act, 1986',
    subtitle: 'The Child Labour (Prohibition and Regulation) Act, 1986',
    pdfUrl: 'https://marathikamgarsena.com/storage/act_rules/1701074275.pdf'
  }
];

const LaborLawsScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const handlePdfPress = (pdfUrl: string, title: string) => {
    navigation.navigate('PdfViewer', {
      pdfUrl,
      title,
    });
  };

  return (
    <View style={styles.container}>
        <Header
        title="Labour Laws"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        showIcons={false}
      />
      
      <ScrollView style={styles.scrollView}>
        {laborLaws.map((law) => (
          <View key={law.id} style={styles.lawCard}>
            <View style={styles.lawContent}>
              <Text style={styles.lawTitle}>{law.title}</Text>
              <Text style={styles.lawSubtitle}>{law.subtitle}</Text>
            </View>
            <TouchableOpacity 
              style={styles.pdfIcon}
              onPress={() => handlePdfPress(law.pdfUrl, law.title)}
            >
              <Image 
                source={require('../../assets/pdf-icon.png')}
                style={styles.pdfImage}
              />
            </TouchableOpacity>
          </View>
        ))}
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
    padding: 16,
    backgroundColor: '#FF5722',
    height: 60,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  lawCard: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  lawContent: {
    flex: 1,
    marginRight: 16,
  },
  lawTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  lawSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  pdfIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});

export default LaborLawsScreen; 