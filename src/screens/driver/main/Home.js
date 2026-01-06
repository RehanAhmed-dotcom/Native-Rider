import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
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
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import {AllGetAPI, PostAPiwithToken} from '../../../components/ApiRoot';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {setUser} from '../../../redux/Auth';
import {useFocusEffect} from '@react-navigation/native';
// import { InterstitialAd, BannerAd, BannerAdSize, TestIds, MobileAds, AdEventType } from 'react-native-google-mobile-ads';
import FastImage from 'react-native-fast-image';
import {Google_Map_Key} from '../../../components/GoogleMapkey';
const Home = ({navigation}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [accountStatus, setAccountStatusModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const user = useSelector(state => state.user.user);
  console.log('userdaaaaa status', JSON.stringify(user));
  const googlePlacesRef = useRef(null);
  const googleDropoffRef = useRef(null);
  const dispatch = useDispatch();
  const [nameSearch, setNameSearch] = useState('');
  // const [selectedSeats, setSelectedSeats] = useState('');
  console.log('nameee', nameSearch);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isTimePickerVisible2, setTimePickerVisibility2] = useState(false);
  const [SelectedTime, setSelectedTime] = useState('');
  const [SelectedTime2, setSelectedTime2] = useState('');
  const [selectionstatus, setSelectionStatus] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [pickup, setPickUp] = useState('');
  const [pickupLat, setPickUpLat] = useState(null);
  const [pickupLng, setPickUpLng] = useState(null);
  const [usernotfound, setuserNotFound] = useState(false);
  const [dropoff, setDropoff] = useState('');
  const [dropoffLat, setDropoffLat] = useState(null);
  const [dropoffLng, setDropoffLng] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState(null);

  const [keyboardStatus, setKeyboardStatus] = useState(false);

  useEffect(()=>{
    AllGetAPI({url: 'handle-referral-wallet', Token: user?.api_token})
    .then(res => {
      console.log('handle-referral-wallet', res);
     
    })
  },[])
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

  // console.log('my seats',selectedSeats)

  // const interstitial =
  //  InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
  //   requestNonPersonalizedAdsOnly: true,
  // });

  //   const adUnitIdinterstitial = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-5392627825502697/9588409853';

  // const interstitial = InterstitialAd.createForAdRequest(adUnitIdinterstitial, {
  //   keywords: ['fashion', 'clothing'],
  // });

  // const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-5392627825502697/8374053032';

  const selection = Array.from({length: 50}, (_, i) => {
    const start = i * 2 + 1;
    const end = (i + 1) * 2;
    const range = `${start}-${end}`;
    return {label: range, value: range};
  });

  const showTimePicker = useCallback(() => {
    setTimePickerVisibility(true);
  }, []);

  const hideTimePicker = useCallback(() => {
    setTimePickerVisibility(false);
  }, []);

  const handleTimeConfirm = useCallback(
    time => {
      const selectedTime = moment(time);
      const currentTime = moment();
      const selectedDate = moment(SelectedTime2, 'L');
      const isToday = selectedDate.isSame(currentTime, 'day');
      if (isToday && selectedTime.isBefore(currentTime)) {
        Toast.show({
          type: 'error',
          text1: 'You cannot select a past time for today!',
          topOffset: Platform.OS === 'ios' ? 50 : 0,
          visibilityTime: 3000,
          autoHide: true,
        });
      } else {
        setSelectedTime(selectedTime.format('hh:mm a'));
      }
      hideTimePicker();
    },
    [SelectedTime2, hideTimePicker],
  );

  const showTimePicker2 = useCallback(() => {
    setTimePickerVisibility2(true);
  }, []);

  const hideTimePicker2 = useCallback(() => {
    setTimePickerVisibility2(false);
  }, []);

  const handleConfirm = useCallback(
    date => {
      const selectedDate = moment(date);
      const currentDate = moment();
      if (selectedDate.isBefore(currentDate, 'day')) {
        Toast.show({
          type: 'error',
          text1: 'You cannot select a past date!',
          topOffset: Platform.OS === 'ios' ? 50 : 0,
          visibilityTime: 3000,
          autoHide: true,
        });
      } else {
        setSelectedTime2(selectedDate.format('L'));
      }
      hideTimePicker2();
    },
    [hideTimePicker2],
  );

  useFocusEffect(
    useCallback(() => {
      if (
        user?.address === null ||
        user?.phone === null ||
        user?.city === null ||
        user?.state === null ||
        user?.postalcode === null ||
        user?.dob === null ||
        user?.age === null
      ) {
        setShowProfileModal(true);
      } else {
        setShowProfileModal(false);
      }
    }, [user]),
  );

  const handleCloseModal = () => {
    setShowProfileModal(false);
    // if (user?.vehicle_image_back === null) {
    navigation.navigate('EditProfile');
    // } else {
    // navigation.navigate('ConnectAccount_R');
    // }
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
      // Show Interstitial Ad if loaded
      // interstitial.load();
      // interstitial.addAdEventListener(AdEventType.LOADED, () => {
      //   interstitial.show();
      // });
      // interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      //   navigation.navigate('AvailableDraviers', { formData });
      //   setPickUp(''),
      //   setDropoff(''),
      //   setSelectedSeats(''),
      //   setSelectedTime(''),
      //   setSelectedTime2('');
      // });
      // interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      //   console.error('Interstitial ad failed to load or show:', error);
      //   navigation.navigate('AvailableDraviers', { formData });
      //   setPickUp(''),
      //   setDropoff(''),
      //   setSelectedSeats(''),
      //   setSelectedTime(''),
      //   setSelectedTime2('');
      // });
      // // Navigate even if ad fails to load immediately
      // setTimeout(() => {
      //   if (!interstitial.loaded) {
      //     navigation.navigate('AvailableDraviers', { formData });
      //     setPickUp(''),
      //     setDropoff(''),
      //     setSelectedSeats(''),
      //     setSelectedTime(''),
      //     setSelectedTime2('');
      //   }
      // }, 1000);
      navigation.navigate('AvailableDraviers', {formData});
      setPickUp(''),
        setDropoff(''),
        setSelectedSeats(''),
        setSelectedTime(''),
        setSelectedTime2('');
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'All fields are required.',
        topOffset: Platform.OS === 'ios' ? 50 : 0,
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  }, [pickup, dropoff, SelectedTime2, SelectedTime, navigation, formData]);

  const getdevicetoken = useCallback(async () => {
    let token = await messaging().getToken();
    console.log('Token0000---------=======', token);
  }, []);

  useEffect(() => {
    getdevicetoken();
  }, [getdevicetoken]);

  const getNotifications = useCallback(async () => {
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
  }, [navigation]);

  const _createChannel = useCallback(() => {
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
  }, []);

  const [driverData, setDriverData] = useState([]);
  const driverdata = () => {
    AllGetAPI({url: 'drivers-with-rides', Token: user?.api_token})
      .then(res => {
        console.log('driver dataaaaaaaaa', res);
        setDriverData(res?.drivers);
      })
      .catch(err => {
        console.log('api error', err);
      });
  };

  useEffect(() => {
    // Initialize Google Mobile Ads
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
        const headers = {
          Authorization: `Bearer ${user?.api_token}`,
        };
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
        console.log('FCM Token Error:', error);
      });
  }, [user]);

  useEffect(() => {
    getNotifications();
    driverdata();
    _createChannel();
  }, [getNotifications, _createChannel]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {});
    return unsubscribe;
  }, []);

  const renderSelection = useCallback(() => {
    return (
      <View>
        <Image
          source={images.studentIcon}
          resizeMode="contain"
          style={{width: wp(6), height: wp(6), marginHorizontal: wp(2)}}
        />
      </View>
    );
  }, []);

  useEffect(() => {
    if (nameSearch.trim() === '') {
      setFilteredDrivers([]);
    } else {
      const filtered = driverData.filter(driver =>
        driver.name.toLowerCase().includes(nameSearch.toLowerCase()),
      );
      setFilteredDrivers(filtered);
    }
  }, [nameSearch]);

  const [filteredDrivers, setFilteredDrivers] = useState([]);

  const handleSearch = () => {
    const results = driverData.filter(item =>
      item.name.toLowerCase().includes(nameSearch.toLowerCase()),
    );
    setFilteredDrivers(results);
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     if (user?.status == '1') {
  //       setAccountStatusModal(true);
  //     } else {
  //       setAccountStatusModal(false);
  //     }
  //   }, [user])
  // );
  const getSeatsForVehicle = () => {
    return Array.from({length: 100}, (_, i) => ({
      label: `${i + 1}`,
      value: `${i + 1}`,
    }));
  };

  const fetchUser = async () => {
    try {
      const res = await AllGetAPI({
        url: 'user',
        Token: user?.api_token,
      });

      if (res?.user?.status == '1') {
        // console.error('user api data:', res);
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
    // const intervalId = setInterval(fetchUser, 2000);

    // return () => clearInterval(intervalId);
  }, []);

  const handleEmailPress = () => {
    Linking.openURL(
      'mailto:nativerider@gmail.com?subject=Account Recovery&body=Hello, I need help recovering my account.',
    );
  };

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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        <View style={[styles.mainContainer]}>
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
              onPress={() => navigation.navigate('Subscription')}
              style={{position: 'absolute', right: wp(4)}}
              activeOpacity={0.7}>
              {/* <Image source={require('../../../assets/mycoin.gif')} resizeMode='contain' style={{ width: wp(7), height: wp(7) }} />
               */}
              {/* <Image
    source={require('../../../assets/mycoin.gif')}
    resizeMode="contain"
    style={{ width: wp(7), height: wp(7) }}
    autoPlay={true} // Optional: Explicitly enable GIF animation
  /> */}
              <FastImage
                source={require('../../../assets/mygif2.gif')}
                resizeMode={FastImage.resizeMode.contain}
                style={{width: wp(12), height: wp(12)}}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: wp(95),
              height: wp(14),
              backgroundColor: '#FFFFFF',
              borderRadius: wp(3),
              alignSelf: 'center',
              marginTop: wp(3),
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: wp(3),
              elevation: 3,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.2,
              shadowRadius: 3,
            }}>
            <AntDesign name="search1" color={'#4686D4'} size={20} />
            <TextInput
              placeholder="Search"
              placeholderTextColor={'grey'}
              value={nameSearch}
              style={{
                color: '#000000',
                fontSize: 14,
                fontFamily: fonts.medium,
                width: wp(80),
              }}
              onChangeText={txt => setNameSearch(txt)}
            />
          </View>

          {nameSearch.trim() !== '' && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: wp(5),
              }}>
              <Text
                style={{
                  marginTop: wp(2),
                  color: '#000',
                  fontFamily: fonts.medium,
                }}>
                Results for{' '}
                <Text
                  style={{
                    marginTop: wp(2),
                    color: '#4686D4',
                    fontFamily: fonts.bold,
                  }}>
                  "{nameSearch}"
                </Text>
              </Text>
              <Text
                style={{
                  marginTop: wp(2),
                  color: '#4686D4',
                  fontFamily: fonts.medium,
                }}>
                {filteredDrivers.length} found
              </Text>
            </View>
          )}
          <View>
            <FlatList
              data={filteredDrivers}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{}}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(
                      'SearchDrivers',
                      {driverName: item},
                      setNameSearch(''),
                    )
                  }
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: wp(5),
                    paddingVertical: wp(4),
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#ccc',
                    backgroundColor: '#fff',
                    marginTop: wp(2),
                  }}>
                  <View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <AntDesign
                        name="clockcircleo"
                        size={16}
                        color="#000000"
                      />
                      <Text
                        style={{
                          fontFamily: fonts.medium,
                          fontSize: 14,
                          color: '#000',
                          marginLeft: wp(2),
                        }}>
                        {item.name}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontFamily: fonts.regular,
                        fontSize: 12,
                        color: 'grey',
                        marginTop: wp(1),
                        width: wp(65),
                        marginLeft: wp(7),
                      }}
                      numberOfLines={1}>
                      {item.address}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      fontSize: 13,
                      color: '#000',
                    }}>
                    {item.distance} km
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingBottom: Platform.OS == 'ios' ? wp(20) : wp(6),
            }}>
            <View style={[styles.PickupView, {marginTop: wp(30)}]}>
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
                    if (details && details.geometry) {
                      setPickUp(details.name);
                      setPickUpLat(details.geometry.location.lat);
                      setPickUpLng(details.geometry.location.lng);
                      googlePlacesRef.current?.setAddressText(
                        details.formatted_address,
                      );
                    }
                  }}
                  query={{
                    key: Google_Map_Key,
                    language: 'en',
                    types: 'geocode',
                  }}
                  textInputProps={{
                    placeholderTextColor: 'black',
                  }}
                  styles={{
                    textInput: {
                      width: wp(68),
                      height: wp(10),
                      borderRadius: wp(2),
                      alignSelf: 'center',
                      color: Colors.black,
                    },
                    description: {
                      color: 'black',
                    },
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
                  minLength={2}
                  autoFocus={false}
                  returnKeyType={'search'}
                  keyboardAppearance={'light'}
                  listViewDisplayed={false}
                  enablePoweredByContainer={false}
                  debounce={200}
                  listUnderlayColor="#c8c7cc"
                  onPress={(data, details = null) => {
                    if (details && details.geometry) {
                      setDropoff(details.name);
                      setDropoffLat(details.geometry.location.lat);
                      setDropoffLng(details.geometry.location.lng);
                      googleDropoffRef.current?.setAddressText(
                        details.formatted_address,
                      );
                    }
                  }}
                  query={{
                    key: Google_Map_Key,
                    language: 'en',
                    types: 'geocode',
                  }}
                  textInputProps={{
                    placeholderTextColor: 'black',
                  }}
                  styles={{
                    textInput: {
                      width: wp(68),
                      height: wp(10),
                      borderRadius: wp(2),
                      alignSelf: 'center',
                      color: Colors.black,
                    },
                    description: {
                      color: 'black',
                    },
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
                  onPress={showTimePicker2}
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
                  onPress={showTimePicker}
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
              // renderLeftIcon={renderSelection}
              style={styles.dropdownHome}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              renderRightIcon={() => (
                // <AntDesign
                //   style={styles.icon}
                //   color={isFocus ? Colors.buttoncolor : 'black'}
                //   name={isFocus ? "up" : 'down'}
                //   size={18}
                // />
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
              <MainButton title="Next" onPress={handleNextPress} />
              {/* <View style={{marginTop:wp(3)}}> */}
              {/* <BannerAd
              // unitId={TestIds.BANNER} 
              unitId={adUnitId} 
              // size={BannerAdSize.BANNER} 
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              requestOptions={{
                // requestNonPersonalizedAdsOnly: true,
              }}
              onAdLoaded={() => {
                console.log('Banner ad loaded');
              }}
              onAdFailedToLoad={(error) => {
                console.error('Banner ad failed to load:', error);
              }}
            /> */}
              {/* </View> */}
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
        </View>
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
                Your account has been terminated by admin. Sign up to continue!
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
                    dispatch(setUser(null)), setuserNotFound(false);
                  }}
                  style={[styles.modalbutton1, {width: wp(60)}]}>
                  <Text style={[styles.titleText, {fontSize: 14}]}>SignUp</Text>
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
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Home;
