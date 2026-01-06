import {
  Alert,
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
import React, {useState, useRef, useEffect} from 'react';
import {images, fonts, Colors, styles} from '../../../constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../components/MainButton';
import Header from '../../../components/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useSelector} from 'react-redux';
import {ChangePassword} from '../../../components/ApiRoot';
import Loader from '../../../components/Loader';
const ChangePassword_R = ({navigation}) => {
  const user = useSelector(state => state.user.user);

  const [show, setshow] = useState(false);
  const [show2, setshow2] = useState(false);

  const [show3, setshow3] = useState(false);

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

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Enter Old Password'),
    newPassword: Yup.string()
      .min(8, 'Minimum 8 characters')
      .required('Enter New Password'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords do not match')
      .required('Confirm New Password'),
  });

  const ChangePassApi = async (values, {resetForm}) => {
    const token = user.api_token;
    setIsLoading(true);
    try {
      const response = await fetch(
        'https://nativeriderapp.com/api/change-password',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            old_password: values.oldPassword,
            password: values.newPassword,
            password_confirmation: values.confirmPassword,
          }),
        },
      );
      const jsonResponse = await response.json();
      console.log('JSON resp', jsonResponse);
      if (jsonResponse.status === 'success') {
        setIsLoading(false);
        // dispatch(setUser(jsonResponse.userdata));
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Password changed successfully!',
          topOffset: Platform.OS === 'ios' ? 50 : 0,
          visibilityTime: 3000,
          autoHide: true,
        });
        resetForm();
        navigation.goBack();
      } else {
        setIsLoading(false);
        if (jsonResponse.message.old_password) {
          Toast.show({
            type: 'error',
            text1: 'Old Password Error',
            text2: jsonResponse.message.old_password[0],
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        } else if (jsonResponse.message.password) {
          Toast.show({
            type: 'error',
            text1: 'Password Error',
            text2: jsonResponse.message.password[0],
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error('error', error);
    }
  };

  const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  const {top, bottom} = useSafeAreaInsets();
  return (
    <Formik
      initialValues={{
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      }}
      validationSchema={validationSchema}
      onSubmit={(values, {resetForm}) => ChangePassApi(values, {resetForm})}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
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

            <View style={styles.HeaderView}>
              <Text style={styles.headerText}>Change Password</Text>
              <TouchableOpacity
                onPress={() => navigation.openDrawer()}
                style={{position: 'absolute', left: wp(4)}}
                activeOpacity={0.7}>
                <Image
                  source={images.menuIcon}
                  resizeMode="contain"
                  style={{width: wp(6), height: wp(6)}}
                />
              </TouchableOpacity>
            </View>
            <Wrapper behavior="padding" style={{flex: 1}}>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{paddingBottom: wp(6)}}>
                <View style={{marginTop: wp(10)}}>
                  <Image
                    source={images.changepasImg}
                    resizeMode="contain"
                    style={{width: wp(60), height: wp(50), alignSelf: 'center'}}
                  />
                </View>
                <View style={[styles.inputView, {marginTop: wp(4)}]}>
                  <Text style={styles.labelStyle}>Old Password</Text>
                  <View style={styles.inputViewStyle}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        source={images.passkey}
                        resizeMode="contain"
                        style={{width: wp(5), height: wp(6)}}
                      />
                      <TextInput
                        placeholder="Insert your old password here"
                        placeholderTextColor={Colors.lightgrey}
                        keyboardType="default"
                        style={[styles.inputStyle, {width: wp(70)}]}
                        secureTextEntry={!show}
                        autoCapitalize="none"
                        onChangeText={handleChange('oldPassword')}
                        onBlur={handleBlur('oldPassword')}
                        value={values.oldPassword}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() => setshow(!show)}
                      style={{paddingRight: wp(3)}}>
                      <Feather
                        name={!show ? 'eye-off' : 'eye'}
                        size={20}
                        color={Colors.buttoncolor}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.oldPassword && errors.oldPassword && (
                    <Text style={styles.errortxt}>{errors.oldPassword}</Text>
                  )}
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
                        secureTextEntry={!show2}
                        autoCapitalize="none"
                        onChangeText={handleChange('newPassword')}
                        onBlur={handleBlur('newPassword')}
                        value={values.newPassword}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() => setshow2(!show2)}
                      style={{paddingRight: wp(3)}}>
                      <Feather
                        name={!show2 ? 'eye-off' : 'eye'}
                        size={20}
                        color={Colors.buttoncolor}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.newPassword && errors.newPassword && (
                    <Text style={styles.errortxt}>{errors.newPassword}</Text>
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
                        placeholder="Cofirm your new password here"
                        placeholderTextColor={Colors.lightgrey}
                        keyboardType="default"
                        style={[styles.inputStyle, {width: wp(70)}]}
                        secureTextEntry={!show3}
                        autoCapitalize="none"
                        onChangeText={handleChange('confirmPassword')}
                        onBlur={handleBlur('confirmPassword')}
                        value={values.confirmPassword}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() => setshow3(!show3)}
                      style={{paddingRight: wp(3)}}>
                      <Feather
                        name={!show3 ? 'eye-off' : 'eye'}
                        size={20}
                        color={Colors.buttoncolor}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Text style={styles.errortxt}>
                      {errors.confirmPassword}
                    </Text>
                  )}
                </View>
                <View style={{marginTop: wp(15), marginBottom: wp(5)}}>
                  <MainButton
                    title={isSubmitting ? 'Updating...' : 'Update'}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                  />
                </View>
              </ScrollView>
            </Wrapper>
          </KeyboardAvoidingView>
        </View>
      )}
    </Formik>
  );
};

export default ChangePassword_R;
