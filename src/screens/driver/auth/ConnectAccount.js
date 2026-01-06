import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import WebView from 'react-native-webview';
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../../../constant/Index';
 
const ConnectAccount = ({ navigation, route }) => {
  const { webViewUrl } = route.params;
  const { top } = useSafeAreaInsets();
 
  const handleNavigation = navState => {
    const currentUrl = navState.url;
 
    if (currentUrl.includes('stripe-success')) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Account linked successfully',
        topOffset: Platform.OS === 'ios' ? 50 : 0,
        visibilityTime: 3000,
        autoHide: true,
      });
 
      // Wait a moment then go back or redirect
      setTimeout(() => {
        navigation.goBack(); // or navigate to dashboard, etc.
      }, 1500);
    }
 
    if (currentUrl.includes('stripe-failure')) {
      Toast.show({
        type: 'error',
        text1: 'Cancelled',
        text2: 'You did not complete the onboarding.',
        topOffset: Platform.OS === 'ios' ? 50 : 0,
        visibilityTime: 3000,
        autoHide: true,
      });
 
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    }
  };
 
  return (
    <View style={[styles.mainContainer, { paddingTop: Platform.OS === 'ios' ? top : 0 }]}>
      <WebView
        source={{ uri: webViewUrl }}
        style={{ flex: 1 }}
        onNavigationStateChange={handleNavigation}
        startInLoadingState={true}
      />
    </View>
  );
};
 
export default ConnectAccount;