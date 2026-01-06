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
import React, {useState, useEffect} from 'react';
import {images, fonts, Colors, styles} from '../../../constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../components/MainButton';
import Header from '../../../components/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import {Formik} from 'formik';
import * as yup from 'yup';
import Toast from 'react-native-toast-message';
import {PostAPiwithToken} from '../../../components/ApiRoot';
import Loader from '../../../components/Loader';
const UpgradePassword_D = ({navigation, route}) => {
  const {email, value} = route.params;
  // console.log('email',email)
  const [show, setshow] = useState(false);
  const [show2, setshow2] = useState(false);
  const [isPasswordEntered, setIsPasswordEntered] = useState(false);
  const [isRePasswordEntered, setIsRePasswordEntered] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const _validationSchema = yup.object({
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        'Must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character',
      ),
    repassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
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

  const ResetPassApi = (password, repassword) => {
    const formdata = new FormData();

    formdata.append('password', password);
    formdata.append('password_confirmation', repassword);
    formdata.append('email', email);
    formdata.append('pin', value);
    setIsLoading(true);
    PostAPiwithToken({url: 'reset'}, formdata)
      .then(res => {
        setIsLoading(false);
        if (res.status == 'success') {
          setIsLoading(false);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          navigation.navigate('Login_D');
        }
        console.log('res of update ', res);
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
        password: '',
        repassword: '',
      }}
      validateOnMount={true}
      onSubmit={values => {
        ResetPassApi(values.password, values.repassword);
      }}
      validationSchema={_validationSchema}>
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
              head="Reset your password"
              onPress={() => navigation.goBack()}
            />
            <Wrapper behavior="padding" style={{flex: 1}}>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{paddingBottom: wp(6)}}>
                <View style={{marginTop: wp(4), paddingHorizontal: wp(10)}}>
                  <Text style={[styles.onboardTextP, {color: '#7D7F88'}]}>
                    Type and confirm your brand new password.
                  </Text>
                </View>
                <View style={{marginTop: wp(16)}}>
                  <Image
                    source={images.logopic}
                    style={{width: wp(50), height: wp(50), alignSelf: 'center'}}
                  />
                </View>
                <View style={[styles.inputView, {marginTop: wp(4)}]}>
                  <Text style={styles.labelStyle}>New Password</Text>
                  <View style={styles.inputViewStyle}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        source={images.passkey}
                        resizeMode="contain"
                        style={{width: wp(5), height: wp(6)}}
                      />
                      <TextInput
                        placeholder="Insert your new password here"
                        placeholderTextColor={Colors.lightgrey}
                        keyboardType="default"
                        style={[styles.inputStyle, {width: wp(70)}]}
                        secureTextEntry={!show}
                        onChangeText={text => {
                          handleChange('password')(text);
                          setIsPasswordEntered(text.length > 0);
                        }}
                        onBlur={handleBlur('password')}
                        value={values.password}
                      />
                    </View>
                    {isPasswordEntered && (
                      <TouchableOpacity
                        onPress={() => setshow(!show)}
                        style={{paddingRight: wp(3)}}>
                        <Feather
                          name={!show ? 'eye-off' : 'eye'}
                          size={20}
                          color={Colors.buttoncolor}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  {errors.password && touched.password && (
                    <Text style={[styles.errortxt]}>{errors.password}</Text>
                  )}
                </View>
                <View style={[styles.inputView, {marginTop: wp(4)}]}>
                  <Text style={styles.labelStyle}>Confirm New Password</Text>
                  <View style={styles.inputViewStyle}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        source={images.passkey}
                        resizeMode="contain"
                        style={{width: wp(5), height: wp(6)}}
                      />
                      <TextInput
                        placeholder="Insert your new password here"
                        placeholderTextColor={Colors.lightgrey}
                        keyboardType="default"
                        style={[styles.inputStyle, {width: wp(70)}]}
                        secureTextEntry={!show2}
                        onChangeText={text => {
                          handleChange('repassword')(text);
                          setIsRePasswordEntered(text.length > 0); // Update isPasswordEntered state
                        }}
                        onBlur={handleBlur('repassword')}
                        value={values.repassword}
                      />
                    </View>
                    {isRePasswordEntered && (
                      <TouchableOpacity
                        onPress={() => setshow2(!show2)}
                        style={{paddingRight: wp(3)}}>
                        <Feather
                          name={!show2 ? 'eye-off' : 'eye'}
                          size={20}
                          color={Colors.buttoncolor}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  {errors.repassword && touched.repassword && (
                    <Text style={styles.errortxt}>{errors.repassword}</Text>
                  )}
                </View>
                <View
                  style={{
                    alignSelf: 'center',
                    marginTop: wp(30),
                    marginBottom: wp(5),
                  }}>
                  <MainButton title="Update Password" onPress={handleSubmit} />
                </View>
              </ScrollView>
            </Wrapper>
          </KeyboardAvoidingView>
        </View>
      )}
    </Formik>
  );
};

export default UpgradePassword_D;
