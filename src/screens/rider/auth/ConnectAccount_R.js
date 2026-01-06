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
import React, {useRef, useState, useEffect} from 'react';
import {images, fonts, Colors, styles} from '../../../constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../components/MainButton';
import Header from '../../../components/Header';
import Feather from 'react-native-vector-icons/Feather';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ImageCropPicker from 'react-native-image-crop-picker';
import {Dropdown} from 'react-native-element-dropdown';
import * as yup from 'yup';
import {Formik} from 'formik';
import {AllGetAPI, PostAPiwithToken} from '../../../components/ApiRoot';
import Toast from 'react-native-toast-message';
import Loader from '../../../components/Loader';
import {setUser} from '../../../redux/Auth';
import {useDispatch, useSelector} from 'react-redux';
const ConnectAccount_R = ({navigation}) => {
  const user = useSelector(state => state.user.user);
  const [isloading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const _validationSchema = yup.object({
    accountnum: yup.string().required('Account number is required'),

    routenum: yup.string().required('Routing number is required'),

    ssnitin: yup
      .string()
      .required('SSN/ITIN number is required')
      .matches(/^\d+$/, 'SSN/ITIN must contain only digits')
      .min(9, 'SSN/ITIN must be at least 9 digits'),
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
  const {top} = useSafeAreaInsets();
  const _editAPI = (accountnum, routenum, ssnitin) => {
    const token = user?.api_token;
    const formdata = new FormData();
    formdata.append('account_number', accountnum);
    formdata.append('routing_number', routenum);
    formdata.append('ssn_number', ssnitin);
    setIsLoading(true);
    PostAPiwithToken({url: 'edit', Token: token}, formdata)
      .then(res => {
        setIsLoading(false);
        // console.log('my Response:', res);
        if (res?.status === 'success') {
          _createExpressApi(res);

          // Toast.show({
          //     type: 'success',
          //     text1: 'Success',
          //     text2: res?.message || 'Profile updated successfully.',
          //     topOffset: Platform.OS === 'ios' ? 50 : 0,
          //     visibilityTime: 3000,
          //     autoHide: true,
          // });
          console.log('Response Data:', res);
          // dispatch(setUser(res.userdata));
        } else {
          const errorMessage =
            res?.message?.email || res?.message || 'An error occurred.';
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: errorMessage,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });

          console.error('Error Response:', res);
        }
      })
      .catch(err => {
        setIsLoading(false);

        console.error('API Error:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong. Please try again later.',
          topOffset: Platform.OS === 'ios' ? 50 : 0,
          visibilityTime: 3000,
          autoHide: true,
        });
      });
  };
  const _createExpressApi = res => {
    setIsLoading(true);
    AllGetAPI({url: 'create-express', Token: user?.api_token})
      .then(res => {
        setIsLoading(false);
        console.log('create-express response:', JSON.stringify(res));
        if (res?.status === 'success') {
          // navigation.navigate('AccountVerifyOtp_R', { user_res: res })
          navigation.navigate('Drawer_R');

          // _LinkAccountApi();
          dispatch(setUser(res?.userdata));
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message || 'Failed to create express account',
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('create-express api error:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to create express account',
          topOffset: Platform.OS === 'ios' ? 50 : 0,
          visibilityTime: 3000,
          autoHide: true,
        });
      });
  };
  return (
    <Formik
      initialValues={{
        accountnum: '',
        routenum: '',
        ssnitin: '',
      }}
      validateOnMount={true}
      onSubmit={values => {
        _editAPI(values.accountnum, values.routenum, values.ssnitin);
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
        setFieldValue,
      }) => (
        <View
          style={[
            styles.mainContainer,
            {paddingTop: Platform.OS == 'ios' ? top : 0},
          ]}>
          <KeyboardAvoidingView
            behavior={
              Platform.OS === 'ios'
                ? 'padding'
                : keyboardStatus === true
                ? 'height'
                : 'undefined'
            }
            style={{flex: 1}}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
            {isloading && <Loader />}
            <Header
              head="Add Account Info"
              onPress={() => navigation.goBack()}
            />
            {/* <Wrapper behavior="padding" style={{ flex: 1 }}> */}
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{paddingBottom: wp(6)}}>
              <View style={[styles.inputView, {marginTop: wp(4)}]}>
                <Text style={styles.labelStyle}>Account Number</Text>
                <View style={styles.inputViewStyle}>
                  <Image
                    source={images.ibanIcon}
                    resizeMode="contain"
                    style={{width: wp(5), height: wp(5)}}
                  />
                  <TextInput
                    placeholder="Enter Number"
                    placeholderTextColor={Colors.lightgrey}
                    keyboardType="number-pad"
                    style={styles.inputStyle}
                    onChangeText={handleChange('accountnum')}
                    onBlur={handleBlur('accountnum')}
                    value={values.accountnum}
                    maxLength={12}
                  />
                </View>
                {errors.accountnum && touched.accountnum && (
                  <Text style={[styles.errortxt]}>{errors.accountnum}</Text>
                )}
              </View>
              <View style={[styles.inputView, {marginTop: wp(4)}]}>
                <Text style={styles.labelStyle}>Routing Number</Text>
                <View style={styles.inputViewStyle}>
                  <Image
                    source={images.ibanIcon}
                    resizeMode="contain"
                    style={{width: wp(5), height: wp(5)}}
                  />
                  <TextInput
                    placeholder="Enter Number"
                    placeholderTextColor={Colors.lightgrey}
                    keyboardType="number-pad"
                    style={styles.inputStyle}
                    onChangeText={handleChange('routenum')}
                    onBlur={handleBlur('routenum')}
                    value={values.routenum}
                    maxLength={9}
                  />
                </View>
                {errors.routenum && touched.routenum && (
                  <Text style={[styles.errortxt]}>{errors.routenum}</Text>
                )}
              </View>
              <View style={[styles.inputView, {marginTop: wp(4)}]}>
                <Text style={styles.labelStyle}>
                  Social Security Number (SSN) or Individual Taxpayer
                  Identification Number (ITIN)
                </Text>
                <View style={styles.inputViewStyle}>
                  <Image
                    source={images.ibanIcon}
                    resizeMode="contain"
                    style={{width: wp(5), height: wp(5)}}
                  />
                  <TextInput
                    placeholder="Enter ssn/itin Number"
                    placeholderTextColor={Colors.lightgrey}
                    keyboardType="number-pad"
                    style={styles.inputStyle}
                    onChangeText={handleChange('ssnitin')}
                    onBlur={handleBlur('ssnitin')}
                    value={values.ssnitin}
                    maxLength={9}
                  />
                </View>
                {errors.ssnitin && touched.ssnitin && (
                  <Text style={[styles.errortxt]}>{errors.ssnitin}</Text>
                )}
              </View>
              <View style={{marginTop: wp(7), marginBottom: wp(5)}}>
                <MainButton title="Update" onPress={handleSubmit} />
              </View>
            </ScrollView>
            {/* </Wrapper> */}
          </KeyboardAvoidingView>
        </View>
      )}
    </Formik>
  );
};

export default ConnectAccount_R;
