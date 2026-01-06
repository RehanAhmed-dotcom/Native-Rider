import {
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import {images, fonts, Colors, styles} from '../../../constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../components/MainButton';
import Header from '../../../components/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import {AllGetAPI, PostAPiwithToken} from '../../../components/ApiRoot';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Google_Map_Key} from '../../../components/GoogleMapkey';
import {useFocusEffect} from '@react-navigation/native';
import {setUser} from '../../../redux/Auth';
// import {
//   InterstitialAd,
//   BannerAd,
//   BannerAdSize,
//   TestIds,
//   MobileAds,
//   AdEventType,
// } from 'react-native-google-mobile-ads';

const Home_R = ({navigation}) => {
  const user = useSelector(state => state.user.user);
  console.log('userdata driver user', user);
  const dispatch = useDispatch();

  //   const adUnitIdinterstitial = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-5392627825502697/9588409853';

  // const interstitial = InterstitialAd.createForAdRequest(adUnitIdinterstitial, {
  //   keywords: ['fashion', 'clothing'],
  // });

  // const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-5392627825502697/8374053032';

  // const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
  //   requestNonPersonalizedAdsOnly: true,
  // });

  const googlePlacesRef = useRef(null);
  const googleDropoffRef = useRef(null);
  const [pickup, setPickUp] = useState('');
  const [pickupLat, setPickUpLat] = useState(null);
  const [pickupLng, setPickUpLng] = useState(null);
  const [dropoff, setDropoff] = useState('');
  const [dropoffLat, setDropoffLat] = useState(null);
  const [dropoffLng, setDropoffLng] = useState(null);
  const [usernotfound, setuserNotFound] = useState(false);
  const [mysubscription, setMySubscription] = useState(true);
  const [confreetrail, setConfreetrail] = useState(true);

  console.log('mysub', mysubscription);
  console.log('mytrail', confreetrail);
  const [subnotfound, setSubNotFound] = useState(false);
  const [accountStatus, setAccountStatusModal] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState(null);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isTimePickerVisible2, setTimePickerVisibility2] = useState(false);
  const [SelectedTime, setSelectedTime] = useState('');
  const [SelectedTime2, setSelectedTime2] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const checkTrialPeriod = () => {
    if (user?.created_at) {
      const createdAt = new Date(user.created_at);
      const trialEndDate = new Date(createdAt);
      trialEndDate.setDate(createdAt.getDate() + 5);
      const currentDate = new Date();
      if (currentDate > trialEndDate) {
        setConfreetrail(false);
      } else {
        setConfreetrail(true);
      }
    } else {
      setConfreetrail(false);
    }
  };

  const subscriptionstatus_api = () => {
    AllGetAPI({url: 'subscription-status', Token: user?.api_token})
      .then(res => {
        console.log('response of subscriptions', JSON.stringify(res));
        if (res.status === 'success') {
          setMySubscription(
            res.subscribed === 'true' || res.subscribed === true,
          );
        } else {
          setMySubscription(false);
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
        console.log('api error', err);
        setMySubscription(false);
      });
  };

  useEffect(() => {
    if (mysubscription === false && confreetrail === false) {
      setSubNotFound(true);
    } else {
      setSubNotFound(false);
    }
  }, [mysubscription, confreetrail]);

  useEffect(() => {
    SplashScreen.hide();
    checkTrialPeriod();
    subscriptionstatus_api();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (
        user?.vehicle_image_back === null ||
        user?.vehicle_image_front === null ||
        user?.license_plate === null ||
        user?.registration === null ||
        user?.insurance === null ||
        user?.driver_license === null ||
        user?.vehicle_make === null ||
        user?.vehicle_model === null ||
        user?.vehicle_type === null ||
        user?.ssn_number === null
      ) {
        setShowProfileModal(true);
      } else {
        setShowProfileModal(false);
      }
    }, [user]),
  );

  const handleCloseModal = () => {
    setShowProfileModal(false);
    if (
      user?.address === null ||
      user?.phone === null ||
      user?.city === null ||
      user?.state === null ||
      user?.postalcode === null ||
      user?.dob === null ||
      user?.age === null
    ) {
      navigation.navigate('EditProfile_R');
    } else if (
      user?.vehicle_image_front === null ||
      user?.vehicle_image_back === null ||
      user?.registration === null ||
      user?.vehicle_type === null ||
      user?.vehicle_make === null ||
      user?.vehicle_model === null ||
      user?.license_plate === null ||
      user?.driver_license === null
    ) {
      navigation.navigate('EditVehicelInfo_R');
    } else if (user?.ssn_number === null) {
      navigation.navigate('ConnectAccount_R');
    }
  };

  const getSeatsForVehicle = () => {
    return Array.from({length: 100}, (_, i) => ({
      label: `${i + 1}`,
      value: `${i + 1}`,
    }));
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleTimeConfirm = time => {
    const selectedTime = moment(time);
    const currentTime = moment();
    const selectedDate = moment(SelectedTime2, 'L');
    const isToday = selectedDate.isSame(currentTime, 'day');

    if (isToday && selectedTime.isBefore(currentTime)) {
      Toast.show({
        type: 'error',
        text1: 'You cannot select a past time for today!',
        topOffset: Platform.OS === 'ios' ? 20 : 0,
        visibilityTime: 3000,
        autoHide: true,
      });
    } else {
      setSelectedTime(selectedTime.format('hh:mm a'));
    }
    hideTimePicker();
  };

  const showTimePicker2 = () => {
    setTimePickerVisibility2(true);
  };

  const hideTimePicker2 = () => {
    setTimePickerVisibility2(false);
  };

  const handleConfirm = date => {
    const selectedDate = moment(date);
    const currentDate = moment();

    if (selectedDate.isBefore(currentDate, 'day')) {
      Toast.show({
        type: 'error',
        text1: 'You cannot select a past date!',
        topOffset: Platform.OS === 'ios' ? 20 : 0,
        visibilityTime: 3000,
        autoHide: true,
      });
    } else {
      setSelectedTime2(selectedDate.format('L'));
    }
    hideTimePicker2();
  };

  const formData = {
    pickup,
    pickupLat,
    pickupLng,
    dropoff,
    dropoffLat,
    dropoffLng,
    selectedSeats,
    SelectedTime2,
    SelectedTime,
  };

  const handleNextPress = useCallback(() => {
    if (pickup && dropoff && SelectedTime2 && SelectedTime) {
      // interstitial.load();
      // interstitial.addAdEventListener(AdEventType.LOADED, () => {
      //   interstitial.show();
      // });
      // interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      //   navigation.navigate('UtilityOption_R', {formData});
      //   setPickUp('');
      //   setDropoff('');
      //   setSelectedSeats('');
      //   setSelectedTime('');
      //   setSelectedTime2('');
      // });
      // interstitial.addAdEventListener(AdEventType.ERROR, error => {
      //   console.error('Interstitial ad failed to load or show:', error);
      //   navigation.navigate('UtilityOption_R', {formData});
      //   setPickUp('');
      //   setDropoff('');
      //   setSelectedSeats('');
      //   setSelectedTime('');
      //   setSelectedTime2('');
      // });
      // setTimeout(() => {
      //   if (!interstitial.loaded) {
      //     navigation.navigate('UtilityOption_R', {formData});
      //     setPickUp('');
      //     setDropoff('');
      //     setSelectedSeats('');
      //     setSelectedTime('');
      //     setSelectedTime2('');
      //   }
      // }, 1000);
      navigation.navigate('UtilityOption_R', {formData});
      setPickUp('');
      setDropoff('');
      setSelectedSeats('');
      setSelectedTime('');
      setSelectedTime2('');
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'All fields are required.',
        topOffset: Platform.OS === 'ios' ? 20 : 0,
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  }, [pickup, dropoff, SelectedTime2, SelectedTime, navigation, formData]);

  const getdevicetoken = async () => {
    let token = await messaging().getToken();
    console.log('Token0000---------=======', token);
  };

  useEffect(() => {
    getdevicetoken();
  }, []);

  const getNotifications = async () => {
    await messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      navigation.navigate('Notification', {
        notification: remoteMessage.notification,
      });
    });
    await messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          navigation.navigate('Notification_R', {
            notification: remoteMessage.notification,
          });
        }
      });
  };

  const _createChannel = () => {
    PushNotification.createChannel(
      {
        channelId: 'fcm_fallback_notification_channel',
        channelName: 'fcm_fallback_notification_channel',
        channelDescription: 'A channel to categorise your notifications',
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      created =>
        console.log(
          'created channel00000000000000000000000000000000000000000',
          created,
        ),
    );
  };

  useEffect(() => {
    // MobileAds()
    //   .initialize()
    //   .then(adapterStatuses => {
    //     console.log('Google Mobile Ads initialized:', adapterStatuses);
    //   })
    //   .catch(error => {
    //     console.error('Google Mobile Ads initialization failed:', error);
    //   });
    messaging()
      .requestPermission()
      .then(() => {
        return messaging().getToken();
      })
      .then(token => {
        console.log('FCM Token:', token);
        const formdata = new FormData();
        formdata.append('fcm_token', token);
        PostAPiwithToken({url: 'update-fcm', Token: user?.api_token}, formdata)
          .then(res => {
            if (res.status === 'success') {
              console.log('FCM token update----- runner', res);
            } else {
              setuserNotFound(true);
            }
          })
          .catch(err => {
            console.log('api error', err);
          });
      })
      .catch(error => {
        console.log('Error getting FCM token:', error);
      });
  }, []);

  useEffect(() => {
    getNotifications();
    _createChannel();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {});
    return unsubscribe;
  }, []);

  const fetchUser = async () => {
    try {
      const res = await AllGetAPI({
        url: 'user',
        Token: user?.api_token,
      });
      if (res?.user?.status == '1') {
        setAccountStatusModal(true);
      } else {
        setAccountStatusModal(false);
      }
    } catch (err) {
      console.error('API error:', err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = degrees => degrees * (Math.PI / 180);
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const handleEmailPress = () => {
    Linking.openURL(
      'mailto:nativerider@gmail.com?subject=Account Recovery&body=Hello, I need help recovering my account.',
    );
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
  const {top, bottom} = useSafeAreaInsets();
  return (
    <ImageBackground
      source={images.mapBackground}
      resizeMode="cover"
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <View
          style={[
            styles.bottomHeaderView,
            {backgroundColor: 'rgba(255,255,255,.6)'},
          ]}>
          <Text style={styles.headerText}>Home</Text>
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
          <TouchableOpacity
            // onPress={() => navigation.navigate('Subscription_R')}
            onPress={() => navigation.navigate('Subscription_R')}
            style={{position: 'absolute', right: wp(4)}}
            activeOpacity={0.7}>
            <FastImage
              source={require('../../../assets/mygif2.gif')}
              resizeMode={FastImage.resizeMode.contain}
              style={{width: wp(12), height: wp(12)}}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: Platform.OS == 'ios' ? wp(20) : wp(6),
          }}>
          <View style={[styles.PickupView, {marginTop: wp(45)}]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: wp(3),
              }}>
              <GooglePlacesAutocomplete
                placeholder="Pick Up"
                ref={googlePlacesRef}
                fetchDetails={true}
                suppressDefaultStyles={false}
                keyboardShouldPersistTaps="always"
                numberOfLines={1}
                timeout={20000}
                autoFillOnNotFound={false}
                predefinedPlaces={[]}
                isRowScrollable={true}
                minLength={2}
                autoFocus={false}
                returnKeyType={'search'}
                keyboardAppearance={'light'}
                listViewDisplayed={false}
                enablePoweredByContainer={false}
                debounce={200}
                listUnderlayColor="#c8c7cc"
                onPress={(data, details = null) => {
                  if (details) {
                    setPickUp(details?.name);
                    setPickUpLat(details?.geometry?.location?.lat);
                    setPickUpLng(details?.geometry?.location?.lng);
                    googlePlacesRef.current?.setAddressText(
                      details?.formatted_address,
                    );
                    if (dropoffLat && dropoffLng) {
                      const distance = haversineDistance(
                        details?.geometry?.location?.lat,
                        details?.geometry?.location?.lng,
                        dropoffLat,
                        dropoffLng,
                      );
                      console.log(
                        'Distance between pickup and dropoff:',
                        distance.toFixed(2),
                        'km',
                      );
                    }
                  }
                }}
                query={{key: Google_Map_Key, language: 'en', types: 'geocode'}}
                textInputProps={{placeholderTextColor: 'black'}}
                styles={{
                  textInput: {
                    width: wp(68),
                    height: wp(10),
                    borderRadius: wp(2),
                    alignSelf: 'center',
                    color: Colors.black,
                  },
                  description: {color: 'black'},
                }}
              />
              <Image
                source={images.pickupIcon}
                resizeMode="contain"
                style={{width: wp(5), height: wp(5)}}
              />
            </View>
            <View
              style={{
                width: wp(80),
                height: wp(0.3),
                backgroundColor: Colors.grey,
                alignSelf: 'center',
                marginVertical: wp(3),
              }}></View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: wp(3),
              }}>
              <GooglePlacesAutocomplete
                placeholder="Drop Off"
                ref={googleDropoffRef}
                fetchDetails={true}
                suppressDefaultStyles={false}
                keyboardShouldPersistTaps="always"
                numberOfLines={1}
                timeout={20000}
                autoFillOnNotFound={false}
                predefinedPlaces={[]}
                isRowScrollable={true}
                listUnderlayColor="#c8c7cc"
                minLength={2}
                autoFocus={false}
                returnKeyType={'search'}
                keyboardAppearance={'light'}
                listViewDisplayed={false}
                enablePoweredByContainer={false}
                debounce={200}
                onPress={(data, details = null) => {
                  if (details) {
                    setDropoff(details.name);
                    setDropoffLat(details?.geometry?.location?.lat);
                    setDropoffLng(details?.geometry?.location?.lng);
                    googleDropoffRef.current?.setAddressText(
                      details?.formatted_address,
                    );
                    if (pickupLat && pickupLng) {
                      const distance = haversineDistance(
                        pickupLat,
                        pickupLng,
                        details?.geometry?.location?.lat,
                        details?.geometry?.location?.lng,
                      );
                      console.log(
                        'Distance between pickup and dropoff:',
                        distance.toFixed(2),
                        'km',
                      );
                    }
                  }
                }}
                query={{key: Google_Map_Key, language: 'en', types: 'geocode'}}
                textInputProps={{placeholderTextColor: 'black'}}
                styles={{
                  textInput: {
                    width: wp(68),
                    height: wp(10),
                    borderRadius: wp(2),
                    alignSelf: 'center',
                    color: Colors.black,
                  },
                  description: {color: 'black'},
                }}
              />
              <Image
                source={images.dropoffIcon}
                resizeMode="contain"
                style={{width: wp(5), height: wp(5)}}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: wp(5),
              marginBottom: wp(2),
              marginTop: wp(4),
            }}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  showTimePicker2();
                }}
                style={{
                  width: wp(40),
                  height: wp(13),
                  borderRadius: wp(3),
                  backgroundColor: Colors.white,
                  elevation: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.black,
                    fontFamily: fonts.medium,
                  }}>
                  {SelectedTime2 ? SelectedTime2 : 'Select Date'}
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  showTimePicker();
                }}
                style={{
                  width: wp(40),
                  height: wp(13),
                  borderRadius: wp(3),
                  backgroundColor: Colors.white,
                  elevation: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.black,
                    fontFamily: fonts.medium,
                  }}>
                  {SelectedTime ? SelectedTime : 'Select Time'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Dropdown
            data={getSeatsForVehicle()}
            labelField="label"
            valueField="value"
            placeholder="Select number of seats"
            placeholderStyle={{color: Colors.lightgrey}}
            value={selectedSeats}
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
            maxHeight={wp(70)}
            containerStyle={{
              width: wp(40),
              alignSelf: 'flex-end',
              marginRight: wp(10),
              borderRadius: wp(4),
              marginTop: wp(-6),
            }}
            itemContainerStyle={{
              borderBottomWidth: 1,
              borderColor: Colors.grey,
              width: wp(30),
              alignSelf: 'center',
              borderTopLeftRadius: wp(4),
              borderTopRightRadius: wp(4),
            }}
            onChange={item => {
              setSelectedSeats(item.value);
              setIsFocus(false);
            }}
            style={styles.dropdownHome}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            renderRightIcon={() => (
              <Image
                source={images.seatIcon}
                resizeMode="contain"
                style={{width: wp(6), height: wp(6)}}
              />
            )}
          />
          <View
            style={{
              marginTop: wp(10),
              marginBottom: wp(4),
              alignItems: 'center',
            }}>
            <MainButton title="Next" onPress={() => handleNextPress()} />
            {/* <View style={{marginTop: wp(3)}}>
            <BannerAd
                      unitId={adUnitId} 
    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
              onAdLoaded={() => {
                console.log('Banner ad loaded');
              }}
              onAdFailedToLoad={error => {
                console.error('Banner ad failed to load:', error);
              }}
            />
          </View> */}
          </View>
        </ScrollView>

        <DateTimePicker
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleTimeConfirm}
          onCancel={hideTimePicker}
        />
        <DateTimePicker
          isVisible={isTimePickerVisible2}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideTimePicker2}
        />
        <Modal
          visible={showProfileModal}
          transparent={true}
          animationType="slide">
          <View style={styles.modalContainerPro}>
            <View style={styles.modalContentPro}>
              <Text style={styles.modalTextPro}>
                Please complete your profile first.
              </Text>
              <TouchableOpacity
                onPress={handleCloseModal}
                style={styles.modalButtonPro}>
                <Text style={styles.modalButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal transparent={true} visible={usernotfound} animationType="none">
          <View style={styles.modalTopView}>
            <View style={styles.modalsecondView}>
              <View>
                <Image
                  source={images.usernameIcon}
                  resizeMode="contain"
                  style={{width: wp(20), height: wp(20), alignSelf: 'center'}}
                />
              </View>
              <View
                style={{
                  alignSelf: 'center',
                  marginHorizontal: wp(17),
                  marginTop: wp(5),
                }}>
                <Text style={styles.modalText}>
                  No user found. Sign up to continue!
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: wp(7),
                  marginTop: wp(5),
                }}>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(setUser(null));
                    setuserNotFound(false);
                  }}
                  style={[styles.modalbutton1, {width: wp(60)}]}>
                  <Text style={[styles.titleText, {fontSize: 14}]}>SignUp</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal transparent={true} visible={subnotfound} animationType="none">
          <View style={styles.modalTopView}>
            <View style={styles.modalsecondView}>
              <View>
                <Image
                  source={require('../../../assets/subIcon.png')}
                  resizeMode="contain"
                  style={{width: wp(20), height: wp(20), alignSelf: 'center'}}
                />
              </View>
              <View
                style={{
                  alignSelf: 'center',
                  marginHorizontal: wp(10),
                  marginTop: wp(5),
                }}>
                <Text style={styles.modalText}>
                  No subscription found. Please subscribe to continue.
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: wp(7),
                  marginTop: wp(5),
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setSubNotFound(false);
                    navigation.navigate('Subscription_R');
                  }}
                  style={[styles.modalbutton1, {width: wp(60)}]}>
                  <Text style={[styles.titleText, {fontSize: 14}]}>
                    Subscribe
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal visible={accountStatus} transparent={true} animationType="slide">
          <View style={styles.modalContainerPro}>
            <View
              style={[
                styles.modalContentPro,
                {
                  paddingHorizontal: wp(3),
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}>
              <Text style={[styles.modalTextPro, {lineHeight: 22}]}>
                Your account has been suspended. To recover your account, please
                contact us at{' '}
                <TouchableOpacity onPress={handleEmailPress}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: Colors.buttoncolor,
                      textDecorationLine: 'underline',
                      paddingTop: wp(2),
                    }}>
                    nativerider@gmail.com
                  </Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Home_R;
