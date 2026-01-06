import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useRef} from 'react';
import {images, fonts, Colors, styles} from '../../../constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../components/MainButton';
import Header from '../../../components/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PhoneInput from 'react-native-phone-number-input';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import LightButton from '../../../components/LightButton';
import {useSelector} from 'react-redux';

const Profile = ({navigation}) => {
  const user = useSelector(state => state.user.user);
  console.log('my profile user', user);
  const phoneInput = useRef(null);
  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [image, setImage] = useState();
  const [show, setShow] = useState(false);
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [age, setAge] = useState(user?.age);
  const [address, setAddress] = useState(user?.address);
  const [location, setLocation] = useState(user?.city);
  const [myState, setMyState] = useState(user?.state);
  const [postalCode, setPostalCode] = useState(user?.postalcode);
  const [status, setStatus] = useState(user?.student);
  const [day, month, year] = user?.dob?.split('-') || ['', '', ''];

  const {top, bottom} = useSafeAreaInsets();

  // Data for FlatList
  const profileData = [
    {
      key: 'header',
      render: () => (
        <View style={styles.HeaderView}>
          <Text style={styles.headerText}>Profile</Text>
          <TouchableOpacity
            style={{position: 'absolute', right: wp(4)}}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('EditProfile')}>
            <Text
              style={{
                fontSize: 10,
                color: '#4686D4',
                fontFamily: fonts.medium,
              }}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      key: 'avatar',
      render: () => (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: wp(8),
          }}>
          <Image
            source={user.image ? {uri: user.image} : images.avatar}
            resizeMode="cover"
            style={[
              styles.profileStyle,
              {justifyContent: 'center', alignItems: 'center', opacity: 0.9},
            ]}
          />
        </View>
      ),
    },
    {
      key: 'fullName',
      render: () => (
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
              editable={false}
              value={name}
            />
          </View>
        </View>
      ),
    },
    {
      key: 'contactNumber',
      render: () => (
        <View style={[styles.inputView, {marginTop: wp(4)}]}>
          <Text style={styles.labelStyle}>Contact Number</Text>
          <View style={[styles.inputViewStyle, {paddingLeft: wp(2)}]}>
            <PhoneInput
              ref={phoneInput}
              defaultValue={value}
              defaultCode="US"
              layout="first"
              onChangeText={text => setValue(text)}
              onChangeFormattedText={text => setFormattedValue(text)}
              disabled
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
              codeTextStyle={{display: 'none'}}
              textInputProps={{
                placeholder: '323234345',
                placeholderTextColor: Colors.black,
                fontFamily: fonts.medium,
                height: wp(12),
              }}
            />
          </View>
        </View>
      ),
    },
    {
      key: 'address',
      render: () => (
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
              value={address}
              editable={false}
            />
          </View>
        </View>
      ),
    },
    {
      key: 'email',
      render: () => (
        <View style={[styles.inputView, {marginTop: wp(4)}]}>
          <Text style={styles.labelStyle}>Email Address</Text>
          <View style={styles.inputViewStyle}>
            <Image
              source={images.gmailIcon}
              resizeMode="contain"
              style={{width: wp(5), height: wp(6)}}
            />
            <TextInput
              placeholder="nadeem@gmail.com"
              placeholderTextColor={Colors.lightgrey}
              keyboardType="email-address"
              style={styles.inputStyle}
              autoCapitalize="none"
              editable={false}
              value={email}
            />
          </View>
        </View>
      ),
    },
    {
      key: 'dob',
      render: () => (
        <View style={[styles.inputView, {marginTop: wp(4)}]}>
          <Text style={styles.labelStyle}>Date of Birth</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="12"
              placeholderTextColor={Colors.black}
              maxLength={2}
              keyboardType="numeric"
              editable={false}
              value={day}
            />
            <TextInput
              style={styles.input}
              placeholder="12"
              placeholderTextColor={Colors.black}
              maxLength={2}
              keyboardType="numeric"
              editable={false}
              value={month}
            />
            <TextInput
              style={styles.inputLong}
              placeholder="2024"
              placeholderTextColor={Colors.black}
              maxLength={4}
              keyboardType="numeric"
              editable={false}
              value={year}
            />
          </View>
        </View>
      ),
    },
    {
      key: 'age',
      render: () => (
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
              value={age}
              editable={false}
            />
          </View>
        </View>
      ),
    },
    {
      key: 'city',
      render: () => (
        <View style={[styles.inputView, {marginTop: wp(4)}]}>
          <Text style={styles.labelStyle}>City</Text>
          <View style={styles.inputViewStyle}>
            <Image
              source={images.addressIcon}
              resizeMode="contain"
              style={{width: wp(5), height: wp(6)}}
            />
            <TextInput
              placeholder="Enter your City"
              placeholderTextColor={Colors.lightgrey}
              keyboardType="default"
              style={styles.inputStyle}
              value={location}
              editable={false}
            />
          </View>
        </View>
      ),
    },
    {
      key: 'state',
      render: () => (
        <View style={[styles.inputView, {marginTop: wp(4)}]}>
          <Text style={styles.labelStyle}>State</Text>
          <View style={styles.inputViewStyle}>
            <Image
              source={images.postalcodeIcon}
              resizeMode="contain"
              style={{width: wp(5), height: wp(6)}}
            />
            <TextInput
              placeholder="Enter your State"
              placeholderTextColor={Colors.lightgrey}
              keyboardType="default"
              style={styles.inputStyle}
              value={myState}
              editable={false}
            />
          </View>
        </View>
      ),
    },
    {
      key: 'postalCode',
      render: () => (
        <View style={[styles.inputView, {marginTop: wp(4)}]}>
          <Text style={styles.labelStyle}>Postal Code</Text>
          <View style={styles.inputViewStyle}>
            <Image
              source={images.postalcodeIcon}
              resizeMode="contain"
              style={{width: wp(5), height: wp(6)}}
            />
            <TextInput
              placeholder="Enter your Postal code"
              placeholderTextColor={Colors.lightgrey}
              keyboardType="default"
              style={styles.inputStyle}
              value={postalCode}
              editable={false}
            />
          </View>
        </View>
      ),
    },
    {
      key: 'studentStatus',
      render: () => (
        <View style={[styles.inputView, {marginTop: wp(4)}]}>
          <Text style={styles.labelStyle}>Are you student?</Text>
          <View style={styles.inputViewStyle}>
            <Image
              source={images.studentIcon}
              resizeMode="contain"
              style={{width: wp(5), height: wp(6)}}
            />
            <TextInput
              placeholder="Yes"
              placeholderTextColor={Colors.lightgrey}
              keyboardType="default"
              style={styles.inputStyle}
              editable={false}
              value={status}
            />
          </View>
        </View>
      ),
    },
    {
      key: 'changePassword',
      render: () => (
        <View style={{marginBottom: wp(20), marginTop: wp(6)}}>
          <LightButton
            onPress1={() => navigation.navigate('ChangePassword')}
            title1="Change Password"
          />
        </View>
      ),
    },
  ];

  return (
    <KeyboardAvoidingView
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS === 'ios' ? top : 0},
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <FlatList
        data={profileData}
        renderItem={({item}) => item.render()}
        keyExtractor={item => item.key}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: wp(10)}}
      />
    </KeyboardAvoidingView>
  );
};

export default Profile;
