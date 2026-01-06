import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../../components/Header';
import {fonts, styles} from '../../../constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../components/MainButton';
import Toast from 'react-native-toast-message';
import {PostAPiwithToken} from '../../../components/ApiRoot';
import {useSelector} from 'react-redux';
import Loader from '../../../components/Loader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const TripCode = ({navigation, route}) => {
  const user = useSelector(state => state.user.user);
  const [refreshing, setRefreshing] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const {tripresponse} = route.params;
  const inputs = useRef([]);
  const [code, setCode] = useState(''); // Changed to string

  const [keyboardStatus, setKeyboardStatus] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleChangeText = (text, index) => {
    if (/^\d?$/.test(text)) {
      const updatedCode = code.split('');
      updatedCode[index] = text;
      const newCode = updatedCode.join('');
      setCode(newCode);

      // Move to next input
      if (text && index < inputs.current.length - 1) {
        inputs.current[index + 1].focus();
      }

      // Optionally blur last input
      if (index === inputs.current.length - 1 && text) {
        inputs.current[index].blur();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1].focus();
      const updatedCode = code.split('');
      updatedCode[index - 1] = ''; // Clear the previous digit
      setCode(updatedCode.join(''));
    }
  };

  // const _addintotripAPI = () => {
  //   const formdata = new FormData();
  //   const token = user.api_token;
  //   formdata.append('trip_id', tripresponse?.id);
  //   formdata.append('status', 'accepted');
  //   setIsLoading(true);
  //   if(code.length ===6 &&code===tripresponse?.trip_code){
  //   PostAPiwithToken({ url: 'join-trip', Token: token }, formdata)
  //     .then(res => {
  //       setIsLoading(false);
  //       if (res.status === 'success') {
  //         navigation.navigate('PayNow' ,{tripresponse});
  //         Toast.show({
  //           type: 'success',
  //           text1: 'Success',
  //           text2:`You are now an official member of the trip to ${tripresponse?.destination}`,
  //           topOffset: Platform.OS === 'ios' ? 50 : 0,
  //           visibilityTime: 3000,
  //           autoHide: true,

  //         });
  //       } else {
  //         Toast.show({
  //           type: 'error',
  //           text1: 'Error',
  //           text2: res.message || 'Something went wrong',
  //           topOffset: Platform.OS === 'ios' ? 50 : 0,
  //           visibilityTime: 3000,
  //           autoHide: true,
  //           topOffset: Platform.OS === 'ios' ? 50 : 0,
  //         });
  //       }
  //       console.log('response data-------', res);
  //     })
  //     .catch(err => {
  //       setIsLoading(false);
  //       console.log('api error', err);
  //     });
  //   }else{
  //     setIsLoading(false);

  //     Toast.show({
  //       type:'error',
  //       position:'top',
  //       text1: 'Invalid Trip Code',
  //       text2: 'The code you entered does not match the trip code. Please try again.',
  //       visibilityTime:3000,
  //       autoHide:true,
  //       topOffset: Platform.OS === 'ios' ? 50 : 0,

  //     })
  //   }
  // };

  const handleContinue = () => {
    // Optional: Add validation to ensure code is 6 digits
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Invalid Code',
        text2: 'Please enter a valid 6-digit code',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: Platform.OS === 'ios' ? 50 : 0,
      });
      return;
    }

    Toast.show({
      type: 'success',
      position: 'top',
      text1: 'New Trip',
      text1Style: {color: '#22BB55'},
      text2: 'You are now an official member of the trip to Sakardo, Pakistan',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: Platform.OS === 'ios' ? 50 : 0,
    });
    navigation.navigate('Drawer', {screen: 'Trips'});
  };
  const {top} = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS == 'ios' ? top : 0},
      ]}>
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios'
            ? ''
            : keyboardStatus === true
            ? 'height'
            : 'undefined'
        }
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        {isloading && <Loader />}
        <Header head="Trip Code" onPress={() => navigation.goBack()} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: Platform.OS == 'ios' ? wp(60) : wp(6),
          }}>
          <Image
            source={require('../../../assets/codeImg.png')}
            style={{
              width: wp(100),
              height: wp(100),
              marginVertical: 10,
              resizeMode: 'contain',
            }}
          />
          <View style={{paddingHorizontal: wp(5)}}>
            <Text style={styles.subtitle}>
              Provide the unique code for your invitation
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.medium,
                color: '#1A1E25',
                marginBottom: 5,
              }}>
              Trip Code
            </Text>

            <View style={styles.codeContainer}>
              {[...Array(6)].map((_, index) => (
                <TextInput
                  key={index}
                  ref={ref => (inputs.current[index] = ref)}
                  style={styles.codeInput}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={code[index] || ''}
                  onChangeText={text => handleChangeText(text, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                  autoFocus={index === 0}
                />
              ))}
            </View>
          </View>
          <View style={{marginVertical: wp(5)}}>
            <MainButton
              title="Continue"
              onPress={() =>
                code.length === 6 && code === tripresponse?.trip_code
                  ? navigation.navigate('PayNow', {code, tripresponse})
                  : Toast.show({
                      type: 'error',
                      position: 'top',
                      text1: 'Invalid Trip Code',
                      text2:
                        'The code you entered does not match the trip code. Please try again.',
                      visibilityTime: 3000,
                      autoHide: true,
                      topOffset: Platform.OS === 'ios' ? 50 : 0,
                    })
              }
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default TripCode;
