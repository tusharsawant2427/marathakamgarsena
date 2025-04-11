import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  Dimensions,
} from 'react-native';

type HeaderProps = {
  title: string;
  showBackButton?: boolean;
  showIcons?: boolean;
  onBackPress?: () => void;
  onNotificationPress?: () => void;
  onLogoutPress?: () => void;
  rightComponent?: React.ReactNode;
};

const { width } = Dimensions.get('window');

const Header = ({
  title,
  showBackButton = false,
  showIcons = false,
  onBackPress,
  onNotificationPress,
  onLogoutPress,
  rightComponent,
}: HeaderProps) => {
  return (
    <View style={[styles.headerContainer, { height: 93 }]}>
      <View style={styles.headerPattern}>
        <Image 
          source={require('../../assets/header_small.png')}
          style={[styles.headerImage]}
          resizeMode="cover"
        />
        <View style={styles.headerContent}>
          {showBackButton ? (
            <View style={styles.titleWithBack}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={onBackPress}
              >
                <Image 
                  source={require('../../assets/back.png')}
                  style={[styles.backIcon, { width: 20, height: 20 }]}
                />
              </TouchableOpacity>
              <Text style={[styles.headerText, { fontSize: 17, marginLeft: 16 }]}>
                {title}
              </Text>
            </View>
          ) : (
            <Text style={[styles.headerText, { fontSize: 17 }]}>
              {title}
            </Text>
          )}
          
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
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FF5722',
    paddingTop: 20,
    overflow: 'hidden',
  },
  headerPattern: {
    width: width,
    height: 73,
  },
  headerImage: {
    position: 'absolute',
    width: width,
    height: 100,
    top: -10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    height: '100%',
  },
  titleWithBack: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backIcon: {
    tintColor: '#fff',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconImage: {
    tintColor: '#fff',
  },
});

export default Header; 