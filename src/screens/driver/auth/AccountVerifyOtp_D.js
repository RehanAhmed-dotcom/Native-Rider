import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  BackHandler,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {images, fonts, Colors, styles} from '../../../constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../components/MainButton';
import Header from '../../../components/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Toast from 'react-native-toast-message';
import {AllGetAPI, PostAPiwithToken} from '../../../components/ApiRoot';
import {useDispatch} from 'react-redux';
import {setUser} from '../../../redux/Auth';
import Loader from '../../../components/Loader';

const CELL_COUNT = 4;

const AccountVerifyOtp_D = ({navigation, route}) => {
  const {user_res} = route.params || {};

  console.log('user res',user_res)
  const dispatch = useDispatch();
  const [counter, setCounter] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

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

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      // Prevent going back
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  // Timer effect
  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const _apiverifyconfirm = () => {
    const email = user_res?.userdata?.email||user_res;
    if (!email || !value) {
      Toast.show({
        type: 'error',
        text1: 'Input Error',
        text2: 'Please enter a valid OTP and email',
        topOffset: Platform.OS === 'ios' ? 20 : 0,
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }
    const formdata = new FormData();
    formdata.append('email', email);
    formdata.append('pin', value);
    setIsLoading(true);
    PostAPiwithToken({url: 'verify'}, formdata)
      .then(res => {
        setIsLoading(false);
        console.log('verify response:', JSON.stringify(res));
        if (res?.status === 'success') {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message || 'OTP verified successfully',
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          dispatch(setUser(res?.userdata));
          // Uncomment if needed: _createExpressApi();
        } else {
          Toast.show({
            type: 'error',
            text1: 'Verification Error',
            text2: res.message || 'Invalid OTP',
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('verify api error:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to verify OTP',
          topOffset: Platform.OS === 'ios' ? 20 : 0,
          visibilityTime: 3000,
          autoHide: true,
        });
      });
  };

  const handleResend = () => {
    const email = user_res?.userdata?.email||user_res;
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Email not found',
        topOffset: Platform.OS === 'ios' ? 20 : 0,
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }
    setCounter(60);
    const formdata = new FormData();
    formdata.append('email', email);
    PostAPiwithToken({url: 'forgot'}, formdata)
      .then(res => {
        console.log('resend-otp response', JSON.stringify(res));
        if (res?.status === 'success') {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message || 'OTP resent successfully',
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message || 'Failed to resend OTP',
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        }
      })
      .catch(err => {
        console.log('resend-otp api error:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to resend OTP',
          topOffset: Platform.OS === 'ios' ? 20 : 0,
          visibilityTime: 3000,
          autoHide: true,
        });
      });
  };

  const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  const {top} = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS === 'ios' ? top : 0},
      ]}>
      {isLoading && <Loader />}
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
        <Header head="Account Verification" onPress={null} />
        <Wrapper behavior="padding" style={{flex: 1}}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{paddingBottom: wp(6)}}>
            <View style={{marginTop: wp(4), paddingHorizontal: wp(10)}}>
              <Text style={[styles.onboardTextP, {color: '#7D7F88'}]}>
                Please enter your OTP code
              </Text>
            </View>
            <View style={{marginTop: wp(16)}}>
              <Image
                source={images.logopic}
                style={{width: wp(50), height: wp(50), alignSelf: 'center'}}
              />
            </View>
            <View style={[styles.pinView, {marginTop: wp(25)}]}>
              <CodeField
                ref={ref}
                {...props}
                value={value}
                onChangeText={setValue}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({index, symbol, isFocused}) => (
                  <Text
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getCellOnLayoutHandler(index)}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                )}
              />
            </View>
            <View
              style={{
                alignSelf: 'center',
                marginTop: wp(20),
                marginBottom: wp(5),
              }}>
              <MainButton title="Verify" onPress={_apiverifyconfirm} />
            </View>
            {counter === 0 ? (
              <TouchableOpacity style={styles.counter} onPress={handleResend}>
                <Text style={[styles.counter_txt, {color: Colors.buttoncolor}]}>
                  Resend
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.counter}>
                <Text style={styles.counter_txt}>{`0:${
                  counter < 10 ? '0' : ''
                }${counter}`}</Text>
              </View>
            )}
          </ScrollView>
        </Wrapper>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AccountVerifyOtp_D;
