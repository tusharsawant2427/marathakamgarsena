import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { NavigationProp } from '../types/navigation';
import { actRulesService, ActRule } from '../services/actRulesService';
import { ApiError } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const LaborLawsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { userData } = useAuth();
  const { language } = useLanguage();
  const [actRules, setActRules] = useState<ActRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActRules();
  }, []);

  const fetchActRules = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await actRulesService.getActRules();
      setActRules(response.data);
    } catch (err) {
      const error = err as ApiError;
      setError(error.message || 'Failed to fetch labor laws');
      console.error('Error fetching labor laws:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePdfPress = (pdfUrl: string, title: string) => {
    navigation.navigate('PdfViewer', {
      pdfUrl,
      title,
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title={language === 'mr' ? 'कामगार कायदे' : 'Labour Laws'}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        showIcons={false}
      />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff5e00" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchActRules}>
            <Text style={styles.retryButtonText}>{language === 'mr' ? 'पुन्हा प्रयत्न करा' : 'Retry'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {actRules.map((law) => (
            <TouchableOpacity 
              key={law.id} 
              style={styles.lawCard}
              onPress={() => handlePdfPress(law.file_name, language === 'mr' ? 'कामगार कायदे' : 'Labour Laws')}
            >
              <View style={styles.lawContent}>
                <Text style={styles.lawTitle}>{law.name}</Text>
                <Text style={styles.lawSubtitle}>{law.description}</Text>
              </View>
              <View style={styles.pdfIcon}>
                <Image 
                  source={require('../../assets/pdf-icon.png')}
                  style={styles.pdfImage}
                />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#ff5e00',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
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