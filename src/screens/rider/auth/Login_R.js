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
import {appleAuth} from '@invertase/react-native-apple-authentication';
import AppleIcon from 'react-native-vector-icons/FontAwesome';
import React, {useState, useRef, useEffect} from 'react';
import {images, fonts, Colors, styles} from '../../../constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../components/MainButton';
import Header from '../../../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import PhoneInput from 'react-native-phone-number-input';
import {Formik} from 'formik';
import * as yup from 'yup';
import Toast from 'react-native-toast-message';
import {PostAPiwithToken} from '../../../components/ApiRoot';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearRiderCredentials,
  setRiderCredentials,
  setUser,
} from '../../../redux/Auth';
import Loader from '../../../components/Loader';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
const Login_R = ({navigation}) => {
  const {
    riderCredentials: {email: savedEmail, password: savedPassword, rememberMe},
  } = useSelector(state => state.user);
  const [check, setcheck] = useState(rememberMe);
  const [show, setshow] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const toglecheck = () => {
    setcheck(!check);
  };
  const phoneInput = useRef(null);
  const [value, setValue] = useState('');
  const [isPasswordEntered, setIsPasswordEntered] = useState(false);

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

  const _validationSchema = yup.object({
    // phone: yup.string().required('Phone number is required'),
    email: yup
      .string()
      .email(`well that's not an email`)
      .required('Please! enter your email')
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&\-_\s])[A-Za-z\d@$!%*#?&\-_\s]{8,}$/,
        'Must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character',
      ),
  });
  const appleRegisterApi = userData => {
    console.log('register api');
    const form = new FormData();
    form.append(
      'name',
      `${userData.fullName.givenName} ${userData.fullName.familyName}`,
    );
    form.append('email', userData.email);
    form.append('password', userData.email);
    form.append('socialLogin', 1);
    form.append('appleId', userData.user);
    form.append('type', 'Driver');
    PostAPiwithToken({url: 'register'}, form).then(res => {
      setIsLoading(false);
      console.log('register', res);
      if (res.status == 'success') {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res.message,
          topOffset: Platform.OS === 'ios' ? 20 : 0,
          visibilityTime: 3000,
          autoHide: true,
        });
        dispatch(setUser(res.userdata));
      }
    });
  };
  const appleLoginApi = appleId => {
    console.log('login id for saad in login', appleId);
    const form = new FormData();
    form.append('appleId', appleId);
    PostAPiwithToken({url: 'appleLoginProcess'}, form).then(res => {
      setIsLoading(false);
      console.log('res of apple login', res);
      if (res.status == 'success') {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res.message,
          topOffset: Platform.OS === 'ios' ? 20 : 0,
          visibilityTime: 3000,
          autoHide: true,
        });
        dispatch(setUser(res.userdata));
      }
    });
  };
  const appleLoginFunction = (appleData, setFieldValue) => {
    setIsLoading(true);
    console.log('apple id for saad', appleData?.user);
    const formdata = new FormData();
    formdata.append('appleId', appleData?.user);

    PostAPiwithToken({url: 'apple-login'}, formdata).then(res => {
      if (res.status == 'success') {
        setFieldValue('email', appleData.email);
        setFieldValue('password', appleData.email);
        console.log('res of apple-login', res);
        if (res.login == 0) {
          appleRegisterApi(appleData);
        } else if (res.userData.socialLogin == 1) {
          // appleLoginApi1(appleData.user);
          appleLoginApi(appleData.user);
          console.log(`login`);
        } else {
          Alert.alert(
            'Error',
            'Email address already exists. Login with your password',
          );
        }
      }
    });
  };
  const appleLogin = async setFieldValue => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      // Note: it appears putting FULL_NAME first is important, see issue #293
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );
    console.log('Apple Auth Response:', appleAuthRequestResponse);
    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
      console.log('user is authenticated');
      appleLoginFunction(appleAuthRequestResponse, setFieldValue);
    }
  };
  const LoginApi = (
    email,
    password,
    isFacebookLogin = false,
    facebookToken = null,
  ) => {
    const formdata = new FormData();
    formdata.append('email', email);
    if (isFacebookLogin) {
      formdata.append('password', 'facebook-authenticated');
    } else {
      formdata.append('password', password);
    }
    formdata.append('type', 'Driver');
    setIsLoading(true);
    PostAPiwithToken({url: 'login'}, formdata)
      .then(res => {
        console.log('my login res', res);
        setIsLoading(false);
        if (res.status === 'success') {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          dispatch(setUser(res.userdata));
          if (check && !isFacebookLogin) {
            dispatch(setRiderCredentials({email, password, rememberMe: check}));
          } else {
            dispatch(clearRiderCredentials());
          }
        } else {
          setIsLoading(false);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        }
        console.log('Login API response:', res);
      })
      .catch(err => {
        setIsLoading(false);
        console.log('API error:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Login failed. Please try again.',
          topOffset: Platform.OS === 'ios' ? 20 : 0,
          visibilityTime: 3000,
          autoHide: true,
        });
      });
  };

  const handleFacebookLogin = async (setFieldValue, values) => {
    try {
      // Request permissions including 'email'
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      console.log('Facebook login result:', result);

      if (result.isCancelled) {
        Toast.show({
          type: 'info',
          text1: 'Login Cancelled',
          text2: 'Facebook login was cancelled.',
          topOffset: Platform.OS === 'ios' ? 20 : 0,
          visibilityTime: 3000,
          autoHide: true,
        });
        return;
      }

      // Get access token
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error('Failed to obtain access token');
      }

      // Fetch user profile data including email
      const response = await fetch(
        `https://graph.facebook.com/v16.0/me?fields=id,name,email&access_token=${data.accessToken}`,
      );
      const profileData = await response.json();
      console.log('Facebook profile data:', profileData);

      if (profileData) {
        const {email, id} = profileData;

        // Populate Formik fields for UI consistency
        setFieldValue('email', email || `${id}@facebook.com`);
        setFieldValue('password', 'facebook-authenticated'); // Placeholder password

        // Call LoginApi with Facebook token
        LoginApi(email || `${id}@facebook.com`, null, true, data.accessToken);
      }
    } catch (error) {
      console.error('Facebook login error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Facebook login failed. Please try again.',
        topOffset: Platform.OS === 'ios' ? 50 : 0,
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  return (
    <Formik
      initialValues={{
        email: savedEmail || '',
        password: savedPassword || '',
      }}
      validateOnMount={true}
      onSubmit={values => {
        // console.log('values', values);
        // navigation.navigate('BottomNavigation')
        LoginApi(values.email, values.password);
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
        setValues,
      }) => {
        useEffect(() => {
          if (rememberMe) {
            setValues({email: savedEmail, password: savedPassword});
          }
        }, [rememberMe, savedEmail, savedPassword, setValues]);
        const {top} = useSafeAreaInsets();
        const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
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
              <Header
                head="Welcome Back!"
                onPress={() => navigation.goBack()}
              />
              <Wrapper behavior="padding" style={{flex: 1}}>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{paddingBottom: wp(6)}}>
                  <View style={{marginTop: wp(4)}}>
                    <Text style={[styles.onboardTextP, {color: '#7D7F88'}]}>
                      Login to your account and get started again!
                    </Text>
                  </View>
                  <View style={{marginVertical: wp(5)}}>
                    <Image
                      source={images.logopic}
                      style={{
                        width: wp(35),
                        height: wp(35),
                        alignSelf: 'center',
                      }}
                    />
                  </View>

                  {/* <View style={[styles.inputView, { marginTop: wp(4) }]}>
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
                  <View style={[styles.inputView, {marginTop: wp(4)}]}>
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
                  <View style={[styles.inputView, {marginTop: wp(4)}]}>
                    <Text style={styles.labelStyle}>Password</Text>
                    <View style={styles.inputViewStyle}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                          source={images.passkey}
                          resizeMode="contain"
                          style={{width: wp(5), height: wp(6)}}
                        />
                        <TextInput
                          placeholder="Insert your password here"
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
                  <View style={styles.checkrow}>
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        onPress={() => {
                          toglecheck();
                        }}>
                        <Ionicons
                          name={check ? 'checkbox' : 'checkbox-outline'}
                          size={18}
                          color={check ? Colors.buttoncolor : 'grey'}
                        />
                      </TouchableOpacity>
                      <View style={{}}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: Colors.lightblack,
                            fontFamily: fonts.medium,
                            paddingLeft: wp(1),
                          }}>
                          Remember Me{' '}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={{marginLeft: wp(3)}}
                      onPress={() => navigation.navigate('Forget_R')}>
                      <Text
                        style={[
                          styles.textStyle,
                          {
                            color: Colors.buttoncolor,
                            fontSize: 12,
                            fontFamily: fonts.bold,
                          },
                        ]}>
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{marginTop: wp(10)}}>
                    <MainButton title="Log In" onPress={handleSubmit} />
                  </View>
                  <View style={[styles.bottomView, {marginTop: wp(4)}]}>
                    <Text style={styles.bottomText}>
                      Don’t have an account?
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.4}
                      onPress={() => navigation.navigate('SignUp_R')}>
                      <Text
                        style={[
                          styles.bottomText,
                          {color: Colors.buttoncolor, fontFamily: fonts.bold},
                        ]}>
                        {' '}
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                      marginHorizontal: wp(12),
                      marginTop: wp(3),
                    }}>
                    <View
                      style={{
                        width: wp(30),
                        height: wp(0.4),
                        backgroundColor: Colors.grey,
                      }}></View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: fonts.regular,
                        color: Colors.black,
                      }}>
                      OR
                    </Text>
                    <View
                      style={{
                        width: wp(30),
                        height: wp(0.4),
                        backgroundColor: Colors.grey,
                      }}></View>
                  </View>
                  <TouchableOpacity
                    // onPress={() =>
                    //     Toast.show({
                    //         type: 'success',
                    //         text1: 'Coming soon',
                    //     })
                    // }
                    onPress={() => handleFacebookLogin(setValues, values)}
                    style={[styles.facebookbutton, {flexDirection: 'row'}]}>
                    <Image
                      source={images.facebookicon}
                      resizeMode="contain"
                      style={{width: wp(5), height: wp(5), marginRight: wp(2)}}
                    />
                    <Text style={[styles.titleText]}>
                      Continue With Facebook
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => appleLogin(setValues)}
                    style={[
                      styles.facebookbutton,
                      {
                        flexDirection: 'row',
                        backgroundColor: 'transparent',
                        borderWidth: 1,
                        borderColor: 'black',
                      },
                    ]}>
                    {/* <Image
                      source={images.facebookicon}
                      resizeMode="contain"
                      style={{width: wp(5), height: wp(5), marginRight: wp(2)}}
                    /> */}
                    <AppleIcon
                      name={'apple'}
                      color={'black'}
                      size={wp(5)}
                      style={{marginRight: 10}}
                    />
                    <Text style={[styles.titleText, {color: 'black'}]}>
                      Continue With Apple
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </Wrapper>
            </KeyboardAvoidingView>
          </View>
        );
      }}
    </Formik>
  );
};

export default Login_R;
