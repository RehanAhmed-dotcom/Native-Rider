import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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
import {PostAPiwithToken} from '../../../components/ApiRoot';
import Toast from 'react-native-toast-message';
import Loader from '../../../components/Loader';
const CELL_COUNT = 4;
const ForgetOtp_D = ({navigation, route}) => {
  const {email} = route.params;
  const [isloading, setIsLoading] = useState(false);
  const [counter, setcounter] = useState(60);

  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setcounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

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

  const _apiverifyotp = () => {
    const formdata = new FormData();
    formdata.append('email', email);
    formdata.append('pin', value);
    setIsLoading(true);
    PostAPiwithToken({url: 'confirm-code'}, formdata)
      .then(res => {
        setIsLoading(false);
        console.log('first,', res);
        if (res.status == 'success') {
          setIsLoading(false);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          navigation.navigate('UpgradePassword_D', {value, email});
          console.log('first,', res);
        } else {
          setIsLoading(false);
          Toast.show({
            type: 'error',
            text1: 'email error!',
            text2: 'enter valid email address',
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        }
      })
      .catch(err => {
        setIsLoading(false);

        console.log('api error', err);
      });
  };

  const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  const {top, bottom} = useSafeAreaInsets();
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
        <Header head="Verification" onPress={() => navigation.goBack()} />
        <Wrapper behavior="padding" style={{flex: 1}}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{paddingBottom: wp(6)}}>
            <View style={{marginTop: wp(4), paddingHorizontal: wp(10)}}>
              <Text style={[styles.onboardTextP, {color: '#7D7F88'}]}>
                Code send to email, This code will expired in 60sec
              </Text>
            </View>
            <View style={{marginTop: wp(16)}}>
              <Image
                source={images.logopic}
                style={{width: wp(50), height: wp(50), alignSelf: 'center'}}
              />
            </View>

            <View style={[styles.pinView, {marginTop: wp(20)}]}>
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
                marginTop: wp(30),
                marginBottom: wp(5),
              }}>
              <MainButton title="Verify" onPress={() => _apiverifyotp()} />
            </View>
            {counter == 0 ? (
              <TouchableOpacity style={styles.counter}>
                <Text style={[styles.counter_txt, {color: Colors.buttoncolor}]}>
                  Resend
                </Text>
                {/* <AntDesign
                name="right"
                size={12}
                style={{ color: Colors.buttoncolor, marginLeft: wp(1) }}
              /> */}
              </TouchableOpacity>
            ) : (
              <View style={styles.counter}>
                <Text style={styles.counter_txt}>{'0:' + counter}</Text>
              </View>
            )}
          </ScrollView>
        </Wrapper>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ForgetOtp_D;
