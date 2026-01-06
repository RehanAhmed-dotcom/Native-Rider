import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Toast from 'react-native-toast-message';
import Header from '../../../components/Header';
import MainButton from '../../../components/MainButton';
import Loader from '../../../components/Loader';
import { fonts, images, Colors, styles } from '../../../constant/Index';
import { PostAPiwithToken } from '../../../components/ApiRoot';
const RefferalCode_R = ({navigation}) => {
    const user = useSelector(state => state.user.user);
      const [isLoading, setIsLoading] = useState(false);
      const [code, setCode] = useState(['', '', '', '', '', '']);
      const inputs = useRef([]);
    
      // Handle text change in input fields
      const handleChangeText = (text, index) => {
        if (/^[a-zA-Z0-9]?$/.test(text)) { // Allow single alphanumeric character or empty
          const newCode = [...code];
          newCode[index] = text.toUpperCase(); // Convert to uppercase for consistency
          setCode(newCode);
    
          // Move to next input if text is entered and not the last input
          if (text && index < 5) {
            inputs.current[index + 1].focus();
          }
    
          // Blur last input if filled
          if (text && index === 5) {
            inputs.current[index].blur();
          }
        }
      };
    
      // Handle backspace key press
      const handleKeyPress = ({ nativeEvent: { key } }, index) => {
        if (key === 'Backspace' && !code[index] && index > 0) {
          const newCode = [...code];
          newCode[index - 1] = ''; // Clear the previous input
          setCode(newCode);
          inputs.current[index - 1].focus();
        }
      };
    
      // Handle API call for referral code submission
      const _RefferalcodeAPI = () => {
        const referralCode = code.join('');
        if (referralCode.length !== 6 || !/^[a-zA-Z0-9]{6}$/.test(referralCode)) {
          Toast.show({
            type: 'error',
            text1: 'Invalid Code',
            text2: 'Please enter a valid 6-character alphanumeric referral code',
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          return;
        }
    
        const formdata = new FormData();
        formdata.append('referral_code', referralCode);
        setIsLoading(true);
    
        PostAPiwithToken({ url: 'verify-referral-code', Token: user.api_token }, formdata)
          .then(res => {
            setIsLoading(false);
            console.log('API Response:', res);
    
            if (res.status === 'success') {
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Referral code verified successfully',
                topOffset: Platform.OS === 'ios' ? 50 : 0,
                visibilityTime: 3000,
                autoHide: true,
              });
              navigation.navigate('Drawer_R',{ screen: 'BottomNavigation_R' });
            } else {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: res.message || 'Invalid referral code',
                topOffset: Platform.OS === 'ios' ? 50 : 0,
                visibilityTime: 3000,
                autoHide: true,
              });
            }
          })
          .catch(err => {
            setIsLoading(false);
            console.log('API Error:', err);
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Something went wrong. Please try again.',
              topOffset: Platform.OS === 'ios' ? 50 : 0,
              visibilityTime: 3000,
              autoHide: true,
            });
          });
      };
    
  return (
    <View style={styles.mainContainer}>
    {isLoading && <Loader />}
    <View style={[styles.bottomHeaderView,{flexDirection:'row',justifyContent:'space-between'}]}>
      <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={{paddingLeft:wp(4)}}>
        <AntDesign name="left" size={20} color={'#2D3D54'} />
      </TouchableOpacity>
      <Text style={styles.headerText}>Referral Code</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Drawer', { screen: 'BottomNavigation' })}
        activeOpacity={0.7}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
    </View>

    <ScrollView>
      <View style={styles.imageContainer}>
        <Image
          source={images.tripImg}
          style={{ width: wp(80), height: wp(100), alignSelf:'center'
          }}
          resizeMode='contain' 

/>
      </View>

      <View style={{ paddingHorizontal: wp(5) }}>
        <Text style={styles.subtitle}>Enter the 6-character alphanumeric referral code to continue</Text>
        <Text style={styles.label}>Referral Code</Text>
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputs.current[index] = ref)}
              style={styles.codeInput}
              maxLength={1}
              keyboardType="default"
              value={digit}
              onChangeText={text => handleChangeText(text, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              autoFocus={index === 0}
              textAlign="center"
              autoCapitalize="characters"
            />
          ))}
        </View>
      </View>

      <View style={{ marginVertical: wp(5) }}>
        <MainButton title="Continue" onPress={_RefferalcodeAPI} />
      </View>
    </ScrollView>
  </View>
  )
}

export default RefferalCode_R