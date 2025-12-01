import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';

type HeaderProps = {
  title: string;
  showBackButton?: boolean;
  showIcons?: boolean;
  onBackPress?: () => void;
  onNotificationPress?: () => void;
  onLogoutPress?: () => void;
  rightComponent?: React.ReactNode;
  titleStyleCenter?: boolean,
};

const { width } = Dimensions.get('window');

const Header = ({
  title,
  showBackButton = false,
  showIcons = false,
  titleStyleCenter = true,
  onBackPress,
  onNotificationPress,
  onLogoutPress,
  rightComponent,
}: HeaderProps) => {
  const statusBarHeight = Platform.OS === 'ios' ? 20 : (StatusBar.currentHeight || 0) <= 42 ? 20 : StatusBar.currentHeight || 0;
  const headerHeight = 75 + statusBarHeight;
  return (
    <View style={[styles.headerContainer, { height: headerHeight }]}>
      <StatusBar backgroundColor="#ff5e00" barStyle="light-content" />
      <View style={[styles.headerPattern, { height: headerHeight }]}>
        <Image 
          source={require('../../assets/header_small.png')}
          style={[styles.headerImage, { height: headerHeight }]}
          resizeMode="cover"
        />
        <View style={[styles.headerContent, { marginTop: statusBarHeight+20 }]}>
        {titleStyleCenter && (
          <View style={styles.leftSection}>
            {showBackButton && (
              <TouchableOpacity 
                style={styles.backButton}
                onPress={onBackPress}
              >
                <Image 
                  source={require('../../assets/back.png')}
                  style={[styles.backIcon, { width: 20, height: 20 }]}
                />
              </TouchableOpacity>
            )}
          </View>
           )}

          <View style={styles.titleContainer}>
            <Text style={[styles.headerText, { fontSize: 23 }]}>
              {title}
            </Text>
          </View>

          <View style={styles.rightSection}>
            {showIcons && (
              <View style={[styles.headerIcons]}>
                <TouchableOpacity onPress={onNotificationPress}>
                  <Image 
                    source={require('../../assets/bell.png')}
                    style={[styles.iconImage, { width: 20, height: 20 }]}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={onLogoutPress}>
                  <Image 
                    source={require('../../assets/logout.png')}
                    style={[styles.iconImage, { width: 20, height: 20 }]}
                  />
                </TouchableOpacity>
              </View>
            )}
            {rightComponent}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#ff5e00',
    width: '100%',
    overflow: 'hidden',
    zIndex: 1000,
    elevation: 5,
  },
  headerPattern: {
    width: '100%',
    position: 'relative',
  },
  headerImage: {
    position: 'absolute',
    width: '100%',
    top: '18%',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    width: '100%',
    height: 40,
  },
  leftSection: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    verticalAlign: 'middle'
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
    marginLeft: -5,
  },
  backIcon: {
    tintColor: '#fff',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  iconImage: {
    tintColor: '#fff',
  },
});

export default Header;