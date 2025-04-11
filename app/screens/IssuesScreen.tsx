import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../components/Header';

type RootStackParamList = {
  Dashboard: undefined;
  Issues: undefined;
  AddIssue: undefined;
};

type IssuesScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Issues'>;
};

const { width } = Dimensions.get('window');

const IssuesScreen = ({ navigation }: IssuesScreenProps) => {
  const issues = [
    {
      id: 1,
      title: 'test',
      status: 'Pending',
      date: '11 Apr 2025',
    },
    {
      id: 2,
      title: 'test',
      status: 'Resolved',
      date: '11 Apr 2025',
    },
    // Add more issues here
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Your Issues"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        showIcons={false}
      />

      <ScrollView style={styles.content}>
        {issues.map((issue) => (
          <View key={issue.id} style={styles.issueCard}>
            <Text style={styles.issueTitle}>{issue.title}</Text>
            <View style={styles.issueFooter}>
              <Text style={styles.issueStatus}>Status: {issue.status}</Text>
              <Text style={styles.issueDate}>{issue.date}</Text>
            </View>
          </View>
        ))}
        {issues.length === 0 && (
          <Text style={styles.noIssuesText}>
            Press the plus button on bottom right to add an issue !
          </Text>
        )}
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => {
          navigation.navigate('AddIssue');
        }}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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
    padding: 16,
    top: 50,
  },
  issueCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  issueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  issueStatus: {
    color: '#FF5722',
    fontSize: 14,
  },
  issueDate: {
    color: '#666',
    fontSize: 14,
  },
  noIssuesText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 24,
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default IssuesScreen; 