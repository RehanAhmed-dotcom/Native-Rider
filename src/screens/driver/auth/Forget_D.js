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
import React, {useEffect, useRef, useState} from 'react';
import {images, fonts, Colors, styles} from '../../../constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../components/MainButton';
import Header from '../../../components/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PhoneInput from 'react-native-phone-number-input';
import {Formik} from 'formik';
import * as yup from 'yup';
import {PostAPiwithToken} from '../../../components/ApiRoot';
import Toast from 'react-native-toast-message';
import Loader from '../../../components/Loader';
const Forget_D = ({navigation}) => {
  const phoneInput = useRef(null);
  const [value, setValue] = useState('');

  const [isloading, setIsLoading] = useState(false);
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

  const _validation = yup.object({
    // phone: yup.string().required('Phone number is required'),
    email: yup
      .string()
      .email(`well that's not an email`)
      .required('Please! enter your email')
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'),
  });

  const _apiforgot = email => {
    const formdata = new FormData();
    formdata.append('email', email);
    setIsLoading(true);
    PostAPiwithToken({url: 'forgot'}, formdata)
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
          navigation.navigate('ForgetOtp_D', {email});
          console.log('first,', res);
        } else {
          setIsLoading(false);
          Toast.show({
            type: 'error',
            text1: 'email error!',
            text2: res.message,
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
    <Formik
      initialValues={{
        email: '',
      }}
      validateOnMount={true}
      onSubmit={values => {
        _apiforgot(values.email);
        // navigation.navigate('ForgetOtp_D')
      }}
      validationSchema={_validation}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        touched,
        errors,
        isValid,
      }) => (
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
            <Header
              head="Forgot Password"
              onPress={() => navigation.goBack()}
            />
            <Wrapper behavior="padding" style={{flex: 1}}>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{paddingBottom: wp(6)}}>
                <View style={{marginTop: wp(4), paddingHorizontal: wp(12)}}>
                  <Text style={[styles.onboardTextP, {color: '#7D7F88'}]}>
                    To reset your password, you need your email or mobile number
                    that can be authenticated
                  </Text>
                </View>
                <View style={{marginTop: wp(16)}}>
                  <Image
                    source={images.logopic}
                    style={{width: wp(50), height: wp(50), alignSelf: 'center'}}
                  />
                </View>
                {/* <View style={[styles.inputView, { marginTop: wp(25) }]}>
                <Text style={styles.labelStyle}>Phone Number</Text>
                <View style={[styles.inputViewStyle, { paddingLeft: wp(2) }]}>
                  <PhoneInput
                    ref={phoneInput}
                    defaultValue={value}
                    defaultCode="US"
                    layout="first"
                    onChangeText={text => {
                      setValue(text);
                    }}
                    onChangeFormattedText={text => {
                      handleChange('phone')(text);
                    }}
                    withDarkTheme={false}
                    autoFocus={false}
                    placeholder="Enter Number"
                    placeholderTextColor="black"
                    containerStyle={styles.phoneContainerStyle}
                    textContainerStyle={styles.phonetextContainer}
                    textInputStyle={{
                      color: 'black',
                      fontFamily: fonts.medium,
                      fontSize: 14
                    }}
                    codeTextStyle={{
                      display: 'none',
                    }}
                    textInputProps={{
                      placeholder: 'Enter your phone number',
                      placeholderTextColor: Colors.lightgrey,
                      fontFamily: fonts.medium,
                      height: wp(12),
                    }}
                  />
                </View>
                {errors.phone && touched.phone && (
                  <Text style={[styles.errortxt]}>{errors.phone}</Text>
                )}
              </View> */}
                <View style={[styles.inputView, {marginTop: wp(25)}]}>
                  {/* <Text style={{ fontSize: 10, fontFamily: fonts.medium, color: Colors.black }}>{' (Optional)'}</Text> */}
                  <Text style={styles.labelStyle}>Email Address</Text>
                  <View style={styles.inputViewStyle}>
                    <Image
                      source={images.gmailIcon}
                      resizeMode="contain"
                      style={{width: wp(5), height: wp(6)}}
                    />
                    <TextInput
                      placeholder="e-mail"
                      placeholderTextColor={Colors.lightgrey}
                      keyboardType="email-address"
                      style={styles.inputStyle}
                      autoCapitalize="none"
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                    />
                  </View>
                  {errors.email && touched.email && (
                    <Text style={[styles.errortxt]}>{errors.email}</Text>
                  )}
                </View>
                <View
                  style={{
                    alignSelf: 'center',
                    marginTop: wp(20),
                    marginBottom: wp(5),
                  }}>
                  <MainButton title="Send" onPress={handleSubmit} />
                </View>
              </ScrollView>
            </Wrapper>
          </KeyboardAvoidingView>
        </View>
      )}
    </Formik>
  );
};

export default Forget_D;
