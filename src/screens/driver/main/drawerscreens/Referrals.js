import {
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Linking,
  Alert,
  Share,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {images, fonts, Colors, styles} from '../../../../constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../../components/MainButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../../../components/Header';
import PhoneInput from 'react-native-phone-number-input';
import Geolocation from 'react-native-geolocation-service';
import {
  AllGetAPI,
  PostAPiwithToken,
  DeleteAPiwithToken,
} from '../../../../components/ApiRoot';
import {useSelector} from 'react-redux';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Toast from 'react-native-toast-message';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Loader from '../../../../components/Loader';

const Referrals = ({navigation}) => {
  const user = useSelector(state => state.user.user);

  const {top} = useSafeAreaInsets();
  // const [onchangeTab, setOnChangeTab] = useState('2');
  const [tabs,setTabs] = useState('1');
  const [myrefferals, setMyrefferals] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showModal, setShowModal] = useState(isSubscribed ? false : true);
  const [code2, setCode2] = useState(['', '', '', '', '', '']);
  const inputs2 = useRef([]);

  // Handle text change in input fields
  const handleChangeText2 = (text, index) => {
    if (/^[a-zA-Z0-9]?$/.test(text)) {
      // Allow single alphanumeric character or empty
      const newCode = [...code2];
      newCode[index] = text.toUpperCase(); // Convert to uppercase for consistency
      setCode2(newCode);

      // Move to next input if text is entered and not the last input
      if (text && index < 5) {
        inputs2.current[index + 1].focus();
      }

      // Blur last input if filled
      if (text && index === 5) {
        inputs2.current[index].blur();
      }
    }
  };

  // Handle backspace key press
  const handleKeyPress2 = ({nativeEvent: {key}}, index) => {
    if (key === 'Backspace' && !code2[index] && index > 0) {
      const newCode = [...code2];
      newCode[index - 1] = ''; // Clear the previous input
      setCode2(newCode);
      inputs2.current[index - 1].focus();
    }
  };

  // Handle API call for referral code submission
  const _RefferalcodeAPI = () => {
    const referralCode = code2.join('');
    if (referralCode.length !== 6 || !/^[a-zA-Z0-9]{6}$/.test(referralCode)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Code',
        text2: 'Please enter a valid 6-character alphanumeric referral code',
        topOffset: Platform.OS === 'ios' ? 50 : 0,
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    const formdata = new FormData();
    formdata.append('referral_code', referralCode);
    setIsLoading(true);

    PostAPiwithToken(
      {url: 'verify-referral-code', Token: user.api_token},
      formdata,
    )
      .then(res => {
        setIsLoading(false);
        console.log('API Response:', res);

        if (res.status === 'success') {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Referral code verified successfully',
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          // navigation.navigate('Drawer_R',{ screen: 'BottomNavigation_R' });
          setShowModal(false);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message || 'Invalid referral code',
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('API Error:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong. Please try again.',
          topOffset: Platform.OS === 'ios' ? 50 : 0,
          visibilityTime: 3000,
          autoHide: true,
        });
      });
  };

  console.log('my refferals', myrefferals);

  // Replace with your actual referral code from API or state
  const referralCode = [user.referral_code]; // Example referral code
  const appLink = 'https://apps.apple.com/pk/app/native-rider/id6752636332'; // Replace with your app's deep link or store link

  // Share function
  const onShare = async () => {
    try {
      const shareMessage = `Join our app using my referral code: ${
        code || referralCode.join('')
      } and download the app here: ${appLink}`;
      const result = await Share.share({
        message: shareMessage,
        url: appLink,
        title: 'Invite Friends to Join!',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          Toast.show({
            type: 'success',
            text1: 'Shared Successfully',
            text2: 'Your referral code has been shared!',
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        } else {
          // Toast.show({
          //     type: 'success',
          //     text1: 'Shared Successfully',
          //     text2: 'Your referral code has been shared!',
          // });
        }
      } else if (result.action === Share.dismissedAction) {
        Toast.show({
          type: 'info',
          text1: 'Share Cancelled',
          text2: 'You cancelled the share action.',
          topOffset: Platform.OS === 'ios' ? 50 : 0,
          visibilityTime: 3000,
          autoHide: true,
        });
      }
    } catch (error) {
      // Toast.show({
      //     type: 'error',
      //     text1: 'Error',
      //     text2: 'Something went wrong while sharing.',
      // });
    }
  };

  const inputs = useRef([]);
  const [code, setCode] = useState(referralCode.join('')); // Initialize with referral code

  const handleChangeText = (text, index) => {
    if (/^\d?$/.test(text)) {
      const updatedCode = code.split('');
      updatedCode[index] = text;
      const newCode = updatedCode.join('');
      setCode(newCode);

      // Move to next input
      if (text && index < inputs.current.length - 1) {
        inputs.current[index + 1].focus();
      }

      // Optionally blur last input
      if (index === inputs.current.length - 1 && text) {
        inputs.current[index].blur();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1].focus();
      const updatedCode = code.split('');
      updatedCode[index - 1] = ''; // Clear the previous digit
      setCode(updatedCode.join(''));
    }
  };

  const fetchRefferals = () => {
    // setIsLoading(true);
    AllGetAPI({url: 'referred-users', Token: user?.api_token})
      .then(res => {
        // setIsLoading(false);
        console.log('response refferals  data ', JSON.stringify(res));
        if (res.status == 'success') {
          //   setIsLoading(false);
          setMyrefferals(res?.referred_users);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          // setIsLoading(false);
        }
      })
      .catch(err => {
        console.log('api error', err);
      });
  };

  useEffect(() => {
    fetchRefferals();
    subscriptionstatus_api();
  }, []);

  const subscriptionstatus_api = () => {
    setIsLoading(true);
    AllGetAPI({url: 'subscription-status', Token: user?.api_token})
      .then(res => {
        setIsLoading(false);
        console.log('response of subscriptions', JSON.stringify(res));
        if (res.status === 'success') {
          setIsLoading(false);
          setIsSubscribed(res.subscribed);
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
      })
      .catch(err => {
        setIsLoading(false);
        console.log('api error', err);
      });
  };

  return (
    <View
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS === 'ios' ? top : 0},
      ]}>
      {isLoading && <Loader />}

      <View style={styles.HeaderView}>
        <Text style={styles.headerText}>Referrals</Text>
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
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: wp(3),
            marginHorizontal: wp(5),
            borderRadius: wp(3),
            overflow: 'hidden', // Important for border radius clipping
            borderWidth: 1.5,
            borderColor: Colors.buttoncolor,
            alignSelf: 'center',
            width: wp(90),
            backgroundColor: 'white',
          }}>
          {/* Tab 1: Invite People */}
          <TouchableOpacity
            // activeOpacity={0.7}
            onPress={() => setTabs('1')}
            style={{
              // flex: 1,
              height: wp(14),
              width: wp(44.5),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor:
                tabs === '1' ? Colors.buttoncolor : 'transparent',
              borderTopLeftRadius: wp(2.5),
              borderBottomLeftRadius: wp(2.5),
            }}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: fonts.bold,
                color: tabs === '1' ? Colors.white : Colors.buttoncolor,
              }}>
              Invite People
            </Text>
          </TouchableOpacity>

          {/* Tab 2: Joined People */}
          <TouchableOpacity
            // activeOpacity={0.7}
            onPress={() => {
              console.log('my tab 2'), setTabs('2');
            }}
            style={{
              // flex: 1,
              height: wp(14),
              width: wp(44.5),
              justifyContent: 'center',
              alignItems: 'center',
              // backgroundColor: 'red',
              backgroundColor:
                tabs === '2' ? Colors.buttoncolor : 'transparent',
              borderTopRightRadius: wp(2.5),
              borderBottomRightRadius: wp(2.5),
            }}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: fonts.bold,
                color: tabs === '2' ? Colors.white : Colors.buttoncolor,
              }}>
              Joined People
            </Text>
          </TouchableOpacity>
        </View>
        {tabs === '1' ? (
          <View>
            <Image
              source={require('../../../../assets/refferal.png')}
              resizeMode="contain"
              style={{
                width: wp(90),
                height: wp(60),
                alignSelf: 'center',
                marginTop: wp(7),
              }}
            />
            <View style={{paddingHorizontal: wp(5), marginTop: wp(20)}}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.medium,
                  color: '#1A1E25',
                  marginBottom: 5,
                }}>
                Referral Code
              </Text>
              <View style={styles.codeContainer}>
                {[...Array(6)].map((_, index) => (
                  <TextInput
                    key={index}
                    ref={ref => (inputs.current[index] = ref)}
                    style={styles.codeInput}
                    maxLength={1}
                    keyboardType="number-pad"
                    value={code[index] || ''}
                    onChangeText={text => handleChangeText(text, index)}
                    onKeyPress={e => handleKeyPress(e, index)}
                    autoFocus={index === 0}
                    editable={false}
                  />
                ))}
              </View>
            </View>
            <View style={{marginVertical: wp(20)}}>
              <MainButton title="Share" onPress={onShare} />
            </View>
          </View>
        ) : (
          <>
            {myrefferals?.length === 0 ? (
              <View style={{marginTop: wp(60)}}>
                {/* <Image source={item.image} resizeMode='contain' style={{ width: wp(80), height: wp(80), alignSelf: 'center' }} /> */}
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: fonts.bold,
                    color: Colors.black,
                    textAlign: 'center',
                    marginTop: wp(4),
                  }}>
                  No Refferal Found!
                </Text>
              </View>
            ) : (
              <View style={{flex: 1, marginTop: wp(3)}}>
                <FlatList
                  data={myrefferals}
                  keyExtractor={item => item.id}
                  renderItem={({item}) => {
                    return (
                      <View
                        style={{
                          width: wp(90),
                          backgroundColor: 'white',
                          elevation: 3,
                          borderRadius: wp(2),
                          alignSelf: 'center',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingHorizontal: wp(3),
                          marginTop: wp(3),
                          marginBottom: wp(1),
                          paddingVertical: wp(1),
                          shadowColor: '#000',
                          shadowOffset: {width: 0, height: 2},
                          shadowOpacity: 0.2,
                          shadowRadius: 3,
                        }}>
                        {/* //   <View style={styles.noficationView}> */}
                        <View>
                          <Text
                            style={{
                              fontSize: 14,
                              color: Colors.black,
                              fontFamily: fonts.medium,
                            }}>
                            {item?.name}
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              color: Colors.buttoncolor,
                              fontFamily: fonts.medium,
                            }}>
                            {item?.phone}
                          </Text>
                        </View>
                        <Ionicons
                          name={'checkmark-circle-outline'}
                          color={'#00FF26'}
                          size={30}
                        />
                      </View>
                    );
                  }}
                />
              </View>
            )}
          </>
        )}
      </ScrollView>
      {/* <Modal
        animationType="slide"
        // transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(false);
        }}>
        <View style={{flex: 1}}>
          <View style={styles.mainContainer}>
           
            <View
              style={[
                styles.bottomHeaderView,
                {flexDirection: 'row', justifyContent: 'space-between'},
              ]}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
                style={{paddingLeft: wp(4)}}>
               
              </TouchableOpacity>
              <Text style={styles.headerText}>Referral Code</Text>
              <TouchableOpacity
                // onPress={() => navigation.navigate('Drawer', { screen: 'BottomNavigation' })}
                onPress={() => setShowModal(false)}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.skipText,
                    {color: 'black', marginRight: wp(4)},
                  ]}>
                  Skip
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{paddingBottom: wp(6)}}>
              <View style={styles.imageContainer}>
                <Image
                  source={images.tripImg}
                  style={{width: wp(80), height: wp(100), alignSelf: 'center'}}
                  resizeMode="contain"
                />
              </View>

              <View style={{paddingHorizontal: wp(5)}}>
                <Text style={styles.subtitle}>
                  Enter the 6-character alphanumeric referral code to continue
                </Text>
                <Text style={styles.label}>Referral Code</Text>
                <View style={styles.codeContainer}>
                  {code2.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={ref => (inputs2.current[index] = ref)}
                      style={styles.codeInput}
                      maxLength={1}
                      keyboardType="default"
                      value={digit}
                      onChangeText={text => handleChangeText2(text, index)}
                      onKeyPress={e => handleKeyPress2(e, index)}
                      autoFocus={index === 0}
                      textAlign="center"
                      autoCapitalize="characters"
                    />
                  ))}
                </View>
              </View>

              <View style={{marginVertical: wp(5)}}>
                <MainButton title="Continue" onPress={_RefferalcodeAPI} />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal> */}
    </View>
  );
};

export default Referrals;
