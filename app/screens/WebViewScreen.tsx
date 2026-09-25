import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Header from '../components/Header';

type WebViewScreenRouteProp = RouteProp<{
  params: { url: string; title: string };
}, 'params'>;

const WebViewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<WebViewScreenRouteProp>();
  const { url, title } = route.params;

  return (
    <View style={styles.container}>
      <Header
        title={title}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        showIcons={false}
      />
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff5e00" />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default WebViewScreen;
