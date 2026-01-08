import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PhoneInput from 'react-native-phone-number-input';
import { launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {Dropdown} from 'react-native-element-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Formik} from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import {setUser} from '../../../redux/Auth';
import {useDispatch} from 'react-redux';
import {PostAPiwithToken} from '../../../components/ApiRoot';
import Loader from '../../../components/Loader';
import {LoginManager, AccessToken, Profile} from 'react-native-fbsdk-next';

const SignUp_D = ({navigation}) => {
  const phoneInput = useRef(null);
  const [value, setValue] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [formattedValue, setFormattedValue] = useState('');
  const [image, setimage] = useState();
  const [show, setshow] = useState(false);
  const [selectionstatus, setSelectionStatus] = useState(null);
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

  const selection = [
    {label: 'Yes', value: 'yes'},
    {label: 'No', value: 'no'},
  ];

  const dispatch = useDispatch();
  const [isloading, setIsLoading] = useState(false);
  const upload = async setFieldValue => {
    // try {
    //   const image = await ImageCropPicker.openPicker({
    //     width: 400,
    //     height: 400,
    //     cropping: true,
    //     compressImageQuality: 1,
    //   });
    //   console.log('image', image);
    //   if (image && image.path) {
    //     setFieldValue('image', image.path);
    //   } else {
    //     console.error('No image path found');
    //   }
    // } catch (error) {
    //   console.error('Error picking image:', error);
    // }
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 1,
      });
  
      if (result.didCancel) return;
  
      const asset = result.assets?.[0];
      if (!asset?.uri) {
        console.error('No image selected');
        return;
      }
  
      // Resize to 400x400 (Play-safe alternative to cropping)
      const resized = await ImageResizer.createResizedImage(
        asset.uri,
        400,
        400,
        'JPEG',
        100,
        0
      );
  
      setFieldValue('image', resized.uri);
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };
  const [terms, setTerms] = useState(false);

  const dayRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const handleDayChange = (text, setFieldValue) => {
    setFieldValue('dob.day', text);
    if (text.length === 2) {
      monthRef.current.focus();
    }
  };
  const handleMonthChange = (text, setFieldValue) => {
    setFieldValue('dob.month', text);
    if (text.length === 2) {
      yearRef.current.focus();
    }
  };
  const calculateAge = dob => {
    const {day, month, year} = dob;
    if (!day || !month || !year) return '';
    const birthDate = new Date(year, month - 1, day); // Note: month is 0-indexed in JavaScript Date
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age.toString();
  };

  const handleFacebookLogin = async (setFieldValue, values) => {
    try {
      // Request permissions including 'email'
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email', // Request email permission
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
        `https://graph.facebook.com/v16.0/me?fields=id,name,first_name,last_name,email,picture&access_token=${data.accessToken}`,
      );
      const profileData = await response.json();

      console.log('Facebook profile data:', profileData);

      if (profileData) {
        const {name, first_name, last_name, email, picture, id} = profileData;

        // Default DOB (since birthday may not be available)
        const dob = {day: '', month: '', year: ''};
        const age = calculateAge(dob).toString();

        // Populate Formik fields
        setFieldValue('firstname', first_name || '');
        setFieldValue('lastname', last_name || '');
        setFieldValue('email', email || `${id}@facebook.com`); // Fallback to a generated email
        setFieldValue('dob', dob);
        setFieldValue('age', age);
        setFieldValue('image', picture?.data?.url || '');
        setFieldValue('password', 'facebook-authenticated');
        setFieldValue('terms', true); // Auto-accept terms

        // Phone number is not typically available; prompt user to input manually
        if (!values.phone) {
          Toast.show({
            type: 'info',
            text1: 'Phone Number Required',
            text2: 'Please enter your phone number manually.',
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        }

        // Call register API
        _registerAPI(
          first_name || 'Facebook',
          last_name || 'User',
          values.phone || '',
          values.address || '',
          email || `${id}@facebook.com`,
          'facebook-authenticated',
          dob,
          age,
          values.city || '', // Use existing city or empty
          values.state || '',
          values.postalcode || '',
          values.isStudent || 'no',
          picture?.data?.url || '',
        );
      }
    } catch (error) {
      console.error('Facebook login error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Facebook login failed. Please try again.',
        topOffset: Platform.OS === 'ios' ? 20 : 0,
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  const _validationSchema = yup.object(
    {
      firstname: yup.string().required('Firstname is required.'),
      lastname: yup.string().required('Lastname is required.'),
      phone: yup.string().required('Phone number is required'),
      address: yup.string().required('Address is required'),
      email: yup
        .string()
        .email(`well that's not an email`)
        .required('Please! enter your email')
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'),
      password: yup
        .string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&\-_\s])[A-Za-z\d@$!%*#?&\-_\s]{8,}$/,
          'Must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character',
        )
        .when('$isFacebookLogin', {
          is: true,
          then: schema => schema.notRequired(),
          otherwise: schema => schema.required('PasswordOMETRY'),
        }),
      dob: yup.object().shape({
        day: yup
          .number()
          .required('Day is required')
          .min(1, 'Invalid day')
          .max(31, 'Invalid day'),
        month: yup
          .number()
          .required('Month is required')
          .min(1, 'Invalid month')
          .max(12, 'Invalid month'),
        year: yup
          .number()
          .required('Year is required')
          .min(1900, 'Year must be after 1900')
          .max(new Date().getFullYear(), 'Year cannot be in the future')
          .test(
            'is-adult',
            'You must be at least 18 years old',
            function (value) {
              const {day, month} = this.parent;
              const age = calculateAge({day, month, year: value});
              return age >= 18;
            },
          ),
      }),
      age: yup.string().required('Age is required'),
      city: yup.string().required('City is required'),
      state: yup.string().required('State is required'),
      postalcode: yup.string().required('Postal code is required'),
      isStudent: yup.string().required('Please select if you are a student'),
      image: yup.string().required('Please select an image'),
      terms: yup
        .boolean()
        .oneOf([true], 'You must accept the terms and conditions')
        .required('You must accept the terms and conditions'),
    },
    [['password', 'password']],
  ); // Circular dependency fix for password

  const _registerAPI = (
    firstname,
    lastname,
    mobile,
    address,
    email,
    password,
    dob,
    age,
    city,
    state,
    postalcode,
    isStudent,
    image,
  ) => {
    const formdata = new FormData();
    const dateofbirth = `${dob.day}-${dob.month}-${dob.year}`;
    const fullName = `${firstname} ${lastname}`.trim();
    console.log('dateofbirthdateofbirth', dateofbirth);
    formdata.append('name', fullName);
    formdata.append('phone', mobile);
    formdata.append('address', address);
    formdata.append('email', email);
    formdata.append('password', password);
    formdata.append('dob', dateofbirth);
    formdata.append('age', age);
    formdata.append('city', city);
    formdata.append('state', state);
    formdata.append('postalcode', postalcode);
    formdata.append('student', isStudent);
    formdata.append('type', 'Rider');
    {
      image &&
        formdata.append('image', {
          uri: image,
          type: 'image/jpeg',
          name: `image${new Date()}.jpg`,
        });
    }
    setIsLoading(true);
    PostAPiwithToken({url: 'register'}, formdata)
      .then(res => {
        setIsLoading(false);
        console.log('response data-------', res);
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
          console.log('mydata', res);

          navigation.navigate('AccountVerifyOtp_D', {user_res: res});
        } else {
          setIsLoading(false);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message.email
              ? res?.message?.email
              : res.message?.email
              ? res.message?.email
              : res.message,
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        }
        console.log('res of register ', res);
      })
      .catch(err => {
        setIsLoading(false);
        console.log('api error', err);
      });
  };

  renderSelection = () => {
    return (
      <View>
        <Image
          source={images.studentIcon}
          resizeMode="contain"
          style={{width: wp(6), height: wp(6), marginHorizontal: wp(2)}}
        />
      </View>
    );
  };
  const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  const {top, bottom} = useSafeAreaInsets();
  return (
    <Formik
      initialValues={{
        firstname: '',
        lastname: '',
        phone: '',
        address: '',
        email: '',
        password: '',
        dob: {day: '', month: '', year: ''},
        age: '',
        city: '',
        state: '',
        postalcode: '',
        isStudent: '',
        image: '',
        terms: false,
      }}
      validateOnMount={true}
      onSubmit={values => {
        console.log('my values values', values);
        _registerAPI(
          values.firstname,
          values.lastname,
          values.phone,
          values.address,
          values.email,
          values.password,
          values.dob,
          values.age,
          values.city,
          values.state,
          values.postalcode,
          values.isStudent,
          values.image,
        );
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
      }) => {
        useEffect(() => {
          const age = calculateAge(values.dob);
          if (age) {
            setFieldValue('age', age);
          }
        }, [values.dob.day, values.dob.month, values.dob.year, setFieldValue]);

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
                head="Let’s explore together!"
                onPress={() => navigation.goBack()}
              />
              <Wrapper behavior="padding" style={{flex: 1}}>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{paddingBottom: wp(6)}}>
                  <View style={{marginTop: wp(4), paddingHorizontal: wp(10)}}>
                    <Text style={[styles.onboardTextP, {color: '#7D7F88'}]}>
                      Create your Native Rider account to explore your dream
                      ride and share ride with friends!
                    </Text>
                  </View>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: wp(6),
                    }}>
                    <TouchableOpacity onPress={() => upload(setFieldValue)}>
                      <Image
                        source={
                          values.image ? {uri: values.image} : images.avatar
                        }
                        resizeMode="cover"
                        style={[
                          styles.profileStyle,
                          {
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity: 0.9,
                          },
                        ]}
                      />
                    </TouchableOpacity>
                    {errors.image && touched.image && (
                      <Text style={[styles.imageerr]}>{errors.image}</Text>
                    )}
                  </View>
                  <View style={[styles.inputView, {marginTop: wp(4)}]}>
                    <Text style={styles.labelStyle}>First Name</Text>
                    <View style={styles.inputViewStyle}>
                      <Image
                        source={images.usernameIcon}
                        resizeMode="contain"
                        style={{width: wp(5), height: wp(6)}}
                      />
                      <TextInput
                        placeholder="First Name"
                        placeholderTextColor={Colors.lightgrey}
                        keyboardType="default"
                        style={styles.inputStyle}
                        onChangeText={handleChange('firstname')}
                        onBlur={handleBlur('firstname')}
                        value={values.firstname}
                      />
                    </View>
                    {errors.firstname && touched.firstname && (
                      <Text style={[styles.errortxt]}>{errors.firstname}</Text>
                    )}
                  </View>
                  <View style={[styles.inputView, {marginTop: wp(4)}]}>
                    <Text style={styles.labelStyle}>Last Name</Text>
                    <View style={styles.inputViewStyle}>
                      <Image
                        source={images.usernameIcon}
                        resizeMode="contain"
                        style={{width: wp(5), height: wp(6)}}
                      />
                      <TextInput
                        placeholder="Last Name"
                        placeholderTextColor={Colors.lightgrey}
                        keyboardType="default"
                        style={styles.inputStyle}
                        onChangeText={handleChange('lastname')}
                        onBlur={handleBlur('lastname')}
                        value={values.lastname}
                      />
                    </View>
                    {errors.lastname && touched.lastname && (
                      <Text style={[styles.errortxt]}>{errors.lastname}</Text>
                    )}
                  </View>
                  <View style={[styles.inputView, {marginTop: wp(4)}]}>
                    <Text style={styles.labelStyle}>Phone Number</Text>
                    <View style={[styles.inputViewStyle, {paddingLeft: wp(2)}]}>
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
                          fontSize: 14,
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
                  </View>
                  <View style={[styles.inputView, {marginTop: wp(4)}]}>
                    <Text style={styles.labelStyle}>Address</Text>
                    <View style={styles.inputViewStyle}>
                      <Image
                        source={images.addressIcon}
                        resizeMode="contain"
                        style={{width: wp(5), height: wp(6)}}
                      />
                      <TextInput
                        placeholder="Enter address"
                        placeholderTextColor={Colors.lightgrey}
                        keyboardType="default"
                        style={styles.inputStyle}
                        onChangeText={handleChange('address')}
                        onBlur={handleBlur('address')}
                        value={values.address}
                      />
                    </View>
                    {errors.address && touched.address && (
                      <Text style={[styles.errortxt]}>{errors.address}</Text>
                    )}
                  </View>
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
                  <View style={[styles.inputView, {marginTop: wp(4)}]}>
                    <Text style={styles.labelStyle}>Date of Birth</Text>
                    <View style={styles.inputRow}>
                      <TextInput
                        ref={dayRef}
                        style={styles.input}
                        placeholder="DD"
                        placeholderTextColor={Colors.lightgrey}
                        maxLength={2}
                        keyboardType="numeric"
                        onChangeText={text =>
                          handleDayChange(text, setFieldValue)
                        }
                        value={values.dob.day}
                      />
                      <TextInput
                        ref={monthRef}
                        style={styles.input}
                        placeholder="MM"
                        placeholderTextColor={Colors.lightgrey}
                        maxLength={2}
                        keyboardType="numeric"
                        onChangeText={text =>
                          handleMonthChange(text, setFieldValue)
                        }
                        value={values.dob.month}
                      />
                      <TextInput
                        ref={yearRef}
                        style={styles.inputLong}
                        placeholderTextColor={Colors.lightgrey}
                        placeholder="YYYY"
                        maxLength={4}
                        keyboardType="numeric"
                        onChangeText={text => setFieldValue('dob.year', text)}
                        value={values.dob.year}
                      />
                    </View>
                    {errors.dob && (
                      <Text style={[styles.errortxt]}>
                        {errors.dob.day || errors.dob.month || errors.dob.year}
                      </Text>
                    )}
                  </View>
                  <View style={[styles.inputView, {marginTop: wp(4)}]}>
                    <Text style={styles.labelStyle}>Age</Text>
                    <View style={styles.inputViewStyle}>
                      <Image
                        source={images.dbirthIcon}
                        resizeMode="contain"
                        style={{width: wp(5), height: wp(6)}}
                      />
                      <TextInput
                        placeholder="Enter your age"
                        placeholderTextColor={Colors.lightgrey}
                        keyboardType="numeric"
                        style={styles.inputStyle}
                        onChangeText={handleChange('age')}
                        onBlur={handleBlur('age')}
                        value={values.age}
                        editable={false} // Make the age field read-only
                      />
                    </View>
                    {errors.age && touched.age && (
                      <Text style={[styles.errortxt]}>{errors.age}</Text>
                    )}
                  </View>
                  <View style={[styles.inputView, {marginTop: wp(4)}]}>
                    <Text style={styles.labelStyle}>City</Text>
                    <View style={styles.inputViewStyle}>
                      <Image
                        source={images.cityIcon}
                        resizeMode="contain"
                        style={{width: wp(5), height: wp(5)}}
                      />
                      <TextInput
                        placeholder="Enter City"
                        placeholderTextColor={Colors.lightgrey}
                        keyboardType="default"
                        style={styles.inputStyle}
                        onChangeText={handleChange('city')}
                        onBlur={handleBlur('city')}
                        value={values.city}
                      />
                    </View>
                    {errors.city && touched.city && (
                      <Text style={[styles.errortxt]}>{errors.city}</Text>
                    )}
                  </View>
                  <View style={[styles.inputView, {marginTop: wp(4)}]}>
                    <Text style={styles.labelStyle}>State</Text>
                    <View style={styles.inputViewStyle}>
                      <Image
                        source={images.stateIcon}
                        resizeMode="contain"
                        style={{width: wp(5), height: wp(5)}}
                      />
                      <TextInput
                        placeholder="Enter State"
                        placeholderTextColor={Colors.lightgrey}
                        keyboardType="default"
                        style={styles.inputStyle}
                        onChangeText={handleChange('state')}
                        onBlur={handleBlur('state')}
                        value={values.state}
                      />
                    </View>
                    {errors.state && touched.state && (
                      <Text style={[styles.errortxt]}>{errors.state}</Text>
                    )}
                  </View>
                  <View style={[styles.inputView, {marginTop: wp(4)}]}>
                    <Text style={styles.labelStyle}>Postal Code</Text>
                    <View style={styles.inputViewStyle}>
                      <Image
                        source={images.postalcodeIcon}
                        resizeMode="contain"
                        style={{width: wp(5), height: wp(5)}}
                      />
                      <TextInput
                        placeholder="Enter Postal Code"
                        placeholderTextColor={Colors.lightgrey}
                        keyboardType="default"
                        style={styles.inputStyle}
                        onChangeText={handleChange('postalcode')}
                        onBlur={handleBlur('postalcode')}
                        value={values.postalcode}
                      />
                    </View>
                    {errors.postalcode && touched.postalcode && (
                      <Text style={[styles.errortxt]}>{errors.postalcode}</Text>
                    )}
                  </View>
                  <View style={[styles.inputView, {marginTop: wp(4)}]}>
                    <Text style={styles.labelStyle}>Are you student?</Text>
                    <Dropdown
                      data={selection}
                      labelField="label"
                      valueField="value"
                      placeholder="Select"
                      placeholderStyle={{color: Colors.lightgrey}}
                      value={values.isStudent}
                      itemTextStyle={{
                        fontSize: 14,
                        color: Colors.black,
                        fontFamily: fonts.medium,
                        textAlign: 'center',
                      }}
                      selectedTextStyle={{
                        fontSize: 14,
                        color: Colors.black,
                        fontFamily: fonts.medium,
                      }}
                      maxHeight={wp(65)}
                      containerStyle={{
                        width: wp(40),
                        alignSelf: 'flex-end',
                        marginRight: wp(10),
                        borderRadius: wp(4),
                      }}
                      itemContainerStyle={{
                        borderBottomWidth: 1,
                        borderColor: Colors.grey,
                        width: wp(40),
                        borderTopLeftRadius: wp(4),
                        borderTopRightRadius: wp(4),
                      }}
                      onChange={item => {
                        setFieldValue('isStudent', item.value);
                        setIsFocus(false);
                      }}
                      renderLeftIcon={renderSelection}
                      style={styles.dropdown}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      renderRightIcon={() => (
                        <AntDesign
                          style={styles.icon}
                          color={isFocus ? Colors.buttoncolor : 'black'}
                          name={isFocus ? 'up' : 'down'}
                          size={18}
                        />
                      )}
                    />
                    {errors.isStudent && touched.isStudent && (
                      <Text style={[styles.errortxt]}>{errors.isStudent}</Text>
                    )}
                  </View>
                  <View>
                    <View style={styles.checkrow}>
                      <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                          onPress={() => setFieldValue('terms', !values.terms)}>
                          <Ionicons
                            name={
                              values.terms ? 'checkbox' : 'checkbox-outline'
                            }
                            size={18}
                            color={values.terms ? Colors.buttoncolor : 'grey'}
                          />
                        </TouchableOpacity>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text
                            style={{
                              fontSize: 11,
                              color: Colors.lightblack,
                              fontFamily: fonts.medium,
                              paddingLeft: wp(1),
                            }}>
                            I agree to all{' '}
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <TouchableOpacity
                              onPress={() =>
                                Linking.openURL(
                                  'https://nativeriderapp.com/term',
                                )
                              }>
                              <Text
                                style={[
                                  styles.textStyle,
                                  {
                                    color: Colors.buttoncolor,
                                    fontSize: 12,
                                    fontFamily: fonts.bold,
                                  },
                                ]}>
                                Terms and Conditions,
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              // onPress={() =>
                              //   navigation.navigate('PrivacyPolicy')
                              // }>
                              onPress={() =>
                                Linking.openURL(
                                  'https://nativeriderapp.com/privacy',
                                )
                              }>
                              <Text
                                style={[
                                  styles.textStyle,
                                  {
                                    color: Colors.buttoncolor,
                                    fontSize: 12,
                                    fontFamily: fonts.bold,
                                  },
                                ]}>
                                {' Privacy Policy'}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                    {errors.terms && touched.terms && (
                      <Text style={[styles.errortxt, {marginLeft: wp(6)}]}>
                        {errors.terms}
                      </Text>
                    )}
                  </View>
                  <View style={{marginTop: wp(10)}}>
                    <MainButton title="Create account" onPress={handleSubmit} />
                  </View>
                  <View style={[styles.bottomView, {marginTop: wp(4)}]}>
                    <Text style={styles.bottomText}>
                      Already have an Account?
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.4}
                      onPress={() => navigation.navigate('Login_D')}>
                      <Text
                        style={[
                          styles.bottomText,
                          {
                            color: Colors.buttoncolor,
                            fontFamily: fonts.bold,
                            fontSize: 14,
                          },
                        ]}>
                        {' '}
                        Log In
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
                    onPress={() => handleFacebookLogin(setFieldValue, values)}
                    style={[styles.facebookbutton, {flexDirection: 'row'}]}>
                    <Image
                      source={images.facebookicon}
                      resizeMode="contain"
                      style={{width: wp(5), height: wp(5), marginRight: wp(2)}}
                    />
                    <Text style={[styles.titleText]}>
                      Register With Facebook
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

export default SignUp_D;
