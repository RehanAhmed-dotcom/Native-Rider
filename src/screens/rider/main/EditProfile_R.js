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
import PhoneInput from 'react-native-phone-number-input';
import ImageCropPicker from 'react-native-image-crop-picker';

import AntDesign from 'react-native-vector-icons/AntDesign';
import LightButton from '../../../components/LightButton';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import {PostAPiwithToken} from '../../../components/ApiRoot';
import Loader from '../../../components/Loader';
import {setUser} from '../../../redux/Auth';
import {Dropdown} from 'react-native-element-dropdown';

const EditProfile_R = ({navigation}) => {
  const dispatch = useDispatch();

  const user = useSelector(state => state.user.user);
  console.log('userData', user);
  const [isloading, setIsLoading] = useState(false);

  const [image, setimage] = useState();
  const phoneInput = useRef(null);
  const [value2, setValue2] = useState(user?.student);
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState(user?.phone);
  const [formattedValue, setFormattedValue] = useState('');
  const [countryCode, setCountryCode] = useState('US');
  const handleCountryChange = country => {
    setCountryCode(country.cca2); // Update the default code when the flag changes
  };
  const [name, setname] = useState(user?.name);
  const [age, setage] = useState(user?.age);
  const [address, setAddress] = useState(user?.address);
  const [state, setState] = useState(user?.state);
  const [postalCode, setPostalCode] = useState(user?.postalcode);
  const [email, setEmail] = useState(user?.email);
  const [location, setlocation] = useState(user?.city);
  // const [status, setStatus] = useState(user?.student);

  const [dob, setDob] = useState(() => {
    const [day, month, year] = user?.dob?.split('-') || ['', '', ''];
    return {day, month, year};
  });

  const handleChange = (field, value) => {
    // Remove any non-numeric characters
    let numericValue = value.replace(/[^0-9]/g, '');

    // Get current date
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed
    const currentDay = new Date().getDate();

    if (field === 'day') {
      if (numericValue > 31) {
        numericValue = '31'; // Restrict to max 31
      }
    } else if (field === 'month') {
      if (numericValue > 12) {
        numericValue = '12'; // Restrict to max 12
      }
    } else if (field === 'year') {
      if (numericValue.length > 4) {
        numericValue = numericValue.slice(0, 4); // Restrict year to 4 digits
      }
      if (parseInt(numericValue) > currentYear) {
        numericValue = currentYear.toString(); // Restrict year to max current year
      }
    }

    setDob(prev => {
      const updatedDob = {...prev, [field]: numericValue};

      // Validate full date only when all fields are filled
      if (updatedDob.day && updatedDob.month && updatedDob.year.length === 4) {
        const inputDate = new Date(
          parseInt(updatedDob.year),
          parseInt(updatedDob.month) - 1, // JS months are 0-based
          parseInt(updatedDob.day),
        );
        const today = new Date();

        if (inputDate > today) {
          updatedDob.day = today.getDate().toString();
          updatedDob.month = (today.getMonth() + 1).toString();
          updatedDob.year = today.getFullYear().toString();
        }
      }

      return updatedDob;
    });
  };
  const selection = [
    {label: 'Yes', value: 'yes'},
    {label: 'No', value: 'no'},
  ];
  const upload = async () => {
    try {
      const selectedImage = await ImageCropPicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        compressImageQuality: 1,
      });
      console.log('Selected Image:', selectedImage);
      if (selectedImage && selectedImage.path) {
        setimage(selectedImage.path); // Update the state with the selected image path
      } else {
        console.error('No image path found');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const _editAPI = () => {
    const token = user?.api_token;
    const formattedDob = `${dob.day}-${dob.month}-${dob.year}`;
    const formdata = new FormData();
    if (name) {
      formdata.append('name', name);
    }
    if (value) {
      formdata.append('phone', value);
    }
    if (address) {
      formdata.append('address', address);
    }
    if (email) {
      formdata.append('email', email);
    }
    if (dob.day && dob.month && dob.year) {
      formdata.append('dob', formattedDob);
    }
    if (age) {
      formdata.append('age', age);
    }
    if (location) {
      formdata.append('city', location);
    }
    if (state) {
      formdata.append('state', state);
    }
    if (postalCode) {
      formdata.append('postalcode', postalCode);
    }
    if (value2) {
      formdata.append('student', value2);
    }
    if (image) {
      formdata.append('image', {
        uri: image,
        type: 'image/jpeg',
        name: `image_${Date.now()}.jpg`,
      });
    }

    setIsLoading(true);

    PostAPiwithToken({url: 'edit', Token: token}, formdata)
      .then(res => {
        setIsLoading(false);
        // console.log('my Response:', res);
        if (res?.status === 'success') {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res?.message || 'Profile updated successfully.',
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          console.log('Response Data:', res);
          dispatch(setUser(res.userdata));

          navigation.goBack();
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

  //   const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
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
        <Header head="Edit Profile" onPress={() => navigation.goBack()} />
        {/* <Wrapper behavior="padding" style={{flex: 1}}> */}
        <ScrollView
          contentContainerStyle={{
            paddingBottom:
              Platform.OS == 'ios' && keyboardStatus === true ? wp(60) : wp(6),
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: wp(8),
            }}>
            {image ? (
              <View>
                <Image
                  source={image ? {uri: image} : images.avatar}
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
                <TouchableOpacity
                  onPress={upload}
                  style={{
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    width: wp(22),
                    height: wp(22),
                    borderRadius: wp(11),
                    backgroundColor: 'rgba(0,0,0,.4)',
                  }}>
                  <Feather name="camera" size={25} color={'white'} />
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Image
                  source={user.image ? {uri: user.image} : images.avatar}
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
                <TouchableOpacity
                  onPress={upload}
                  style={{
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    width: wp(22),
                    height: wp(22),
                    borderRadius: wp(11),
                    backgroundColor: 'rgba(0,0,0,.4)',
                  }}>
                  <Feather name="camera" size={25} color={'white'} />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={[styles.inputView, {marginTop: wp(4)}]}>
            <Text style={styles.labelStyle}>Full Name</Text>
            <View style={styles.inputViewStyle}>
              <Image
                source={images.usernameIcon}
                resizeMode="contain"
                style={{width: wp(5), height: wp(6)}}
              />
              <TextInput
                placeholder="Nadeem"
                placeholderTextColor={Colors.black}
                keyboardType="default"
                style={styles.inputStyle}
                onChangeText={text => setname(text)}
                value={name}
              />
            </View>
          </View>
          <View style={[styles.inputView, {marginTop: wp(4)}]}>
            <Text style={styles.labelStyle}>Contact Number</Text>
            <View style={[styles.inputViewStyle, {paddingLeft: wp(2)}]}>
              <PhoneInput
                ref={phoneInput}
                defaultValue={value}
                defaultCode={countryCode}
                onChangeCountry={handleCountryChange}
                layout="first"
                onChangeText={setValue}
                // onChangeFormattedText={text => {
                //     setFormattedValue(text);
                // }}
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
                onChangeText={text => setAddress(text)}
                value={address}
              />
            </View>
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
                placeholder=""
                placeholderTextColor={Colors.lightgrey}
                keyboardType="email-address"
                style={styles.inputStyle}
                autoCapitalize="none"
                onChangeText={text => setEmail(text)}
                value={email}
              />
            </View>
          </View>
          <View style={[styles.inputView, {marginTop: wp(4)}]}>
            <Text style={styles.label}>Date of Birth</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="DD"
                placeholderTextColor={Colors.lightgrey}
                maxLength={2}
                keyboardType="numeric"
                value={dob.day}
                onChangeText={text => handleChange('day', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="MM"
                placeholderTextColor={Colors.lightgrey}
                maxLength={2}
                keyboardType="numeric"
                value={dob.month}
                onChangeText={text => handleChange('month', text)}
              />
              <TextInput
                style={styles.inputLong}
                placeholderTextColor={Colors.lightgrey}
                placeholder="YYYY"
                maxLength={4}
                keyboardType="numeric"
                value={dob.year}
                onChangeText={text => handleChange('year', text)}
              />
            </View>
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
                onChangeText={text => setage(text)}
                value={age}
              />
            </View>
          </View>
          <View style={[styles.inputView, {marginTop: wp(4)}]}>
            <Text style={styles.labelStyle}>City</Text>
            <View style={styles.inputViewStyle}>
              <Image
                source={images.locationpic}
                resizeMode="contain"
                style={{width: wp(5), height: wp(6)}}
              />
              <TextInput
                placeholder="Enter your City"
                placeholderTextColor={Colors.lightgrey}
                keyboardType="default"
                style={styles.inputStyle}
                onChangeText={text => setlocation(text)}
                value={location}
              />
            </View>
          </View>

          <View style={[styles.inputView, {marginTop: wp(4)}]}>
            <Text style={styles.labelStyle}>State</Text>
            <View style={styles.inputViewStyle}>
              <Image
                source={images.stateIcon}
                resizeMode="contain"
                style={{width: wp(5), height: wp(6)}}
              />
              <TextInput
                placeholder="Enter your State"
                placeholderTextColor={Colors.lightgrey}
                keyboardType="default"
                style={styles.inputStyle}
                onChangeText={text => setState(text)}
                value={state}
              />
            </View>
          </View>
          <View style={[styles.inputView, {marginTop: wp(4)}]}>
            <Text style={styles.labelStyle}>Postal Code</Text>
            <View style={styles.inputViewStyle}>
              <Image
                source={images.postalcodeIcon}
                resizeMode="contain"
                style={{width: wp(5), height: wp(6)}}
              />
              <TextInput
                placeholder="Enter your Postal Code"
                placeholderTextColor={Colors.lightgrey}
                keyboardType="number-pad"
                style={styles.inputStyle}
                onChangeText={text => setPostalCode(text)}
                value={postalCode}
              />
            </View>
          </View>
          <View style={[styles.inputView, {marginTop: wp(4)}]}>
            <Text style={styles.labelStyle}>Are you student?</Text>
            {/* <TextInput
                                placeholder="Yes"
                                placeholderTextColor={Colors.lightgrey}
                                keyboardType='default'
                                style={styles.inputStyle}
                                onChangeText={(text) => setStatus(text)}
                                value={status}
                            /> */}
            <Dropdown
              data={selection}
              labelField="label"
              valueField="value"
              placeholder="Select"
              placeholderStyle={{color: Colors.lightgrey}}
              value={value2}
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
                setValue2(item.value);
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
          </View>
          <View style={{marginTop: wp(10), marginBottom: wp(5)}}>
            <MainButton
              title="Update Profile"
              onPress={() => {
                _editAPI();
              }}
            />
          </View>
        </ScrollView>
        {/* </Wrapper> */}
      </KeyboardAvoidingView>
    </View>
  );
};

export default EditProfile_R;
