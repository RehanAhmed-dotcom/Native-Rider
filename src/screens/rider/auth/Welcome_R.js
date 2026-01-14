import {
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
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
import LightButton from '../../../components/LightButton';
import SplashScreen from 'react-native-splash-screen';
import {setOnboardingFalse} from '../../../redux/OnboardingSlice';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch} from 'react-redux';
import {setUserType} from '../../../redux/Auth';
import Geolocation from '@react-native-community/geolocation';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Welcome_R = ({navigation}) => {
  const [confirm, setConfirm] = useState(false);
  const dispatch = useDispatch();

  const closemodal = () => {
    setConfirm(false);
  };

  // const requestLocationPermission = async () => {
  //   const permission =
  //     Platform.OS === 'ios'
  //       ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
  //       : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  //   console.log('permission got');
  //   const result = await request(permission);
  //   console.log('res', result);
  //   if (result === RESULTS.GRANTED) {
  //     getLocation();
  //     // console.log("get location function")
  //   } else {
  //     Alert.alert(
  //       'Permission Denied',
  //       'Location permission is required to find nearby requests.',
  //     );
  //   }
  // };
  const requestLocationPermission = async () => {
    try {
      const permission =
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
  
      // 1️⃣ Check first
      const status = await check(permission);
      console.log('permission status:', status);
  
      if (status === RESULTS.GRANTED) {
        getLocation();
        return;
      }
  
      // 2️⃣ Ask only if denied
      if (status === RESULTS.DENIED) {
        const result = await request(permission);
        console.log('request result:', result);
  
        if (result === RESULTS.GRANTED) {
          getLocation();
        } else {
          Alert.alert(
            'Permission Required',
            'Please allow location permission to continue.'
          );
        }
        return;
      }
  
      // 3️⃣ Handle BLOCKED (THIS PREVENTS CRASH)
      if (status === RESULTS.BLOCKED) {
        Alert.alert(
          'Permission Blocked',
          'Location permission is blocked. Please enable it from Settings.'
        );
      }
    } catch (error) {
      console.log('Location permission error:', error);
    }
  };
  // const getLocation = () => {
  //   Geolocation.getCurrentPosition(
  //     position => {
  //       const {latitude, longitude} = position.coords;
  //       console.log('Latitude:', latitude, 'Longitude:', longitude);
  //       // Alert.alert(
  //       //     'Location Retrieved',
  //       //     `Latitude: ${latitude}, Longitude: ${longitude}`
  //       // );
  //       // saveLocationEnabled();
  //       closemodal();
  //     },
  //     error => {
  //       console.error(error);
  //       Alert.alert('Error', 'Unable to retrieve location. Please try again.');
  //     },
  //     {enableHighAccuracy: false, timeout: 15000, maximumAge: 10000},
  //   );
  // };
  const getLocation = () => {
    // Geolocation.getCurrentPosition(
    //   position => {
    //     const { latitude, longitude } = position.coords;
    //     console.log('Latitude:', latitude, 'Longitude:', longitude);
    //     closemodal();
    //   },
    //   error => {
    //     console.log('Location error:', error);
    //     Alert.alert(
    //       'Location Error',
    //       error.message || 'Unable to retrieve location.'
    //     );
    //   },
    //   {
    //     enableHighAccuracy: false,
    //     timeout: 20000,
    //     maximumAge: 10000,
    //     forceRequestLocation: true,
    //     showLocationDialog: true,
    //   }
    // );
    Geolocation.getCurrentPosition(info =>{ console.log("info",info.coords.latitude);  closemodal();});
  };

  const saveLocationEnabled = async () => {
    try {
      await AsyncStorage.setItem('locationEnabled', 'true');
    } catch (error) {
      console.error('Failed to save location enabled state:', error);
    }
  };

  const checkLocationEnabled = async () => {
    try {
      const locationEnabled = await AsyncStorage.getItem('locationEnabled');
      if (locationEnabled === 'true') {
        setConfirm(false);
      } else {
        setConfirm(true);
      }
    } catch (error) {
      console.error('Failed to retrieve location enabled state:', error);
    }
  };

  useEffect(() => {
    checkLocationEnabled();
  }, []);

  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        onPress={() => dispatch(setUserType(null))}
        style={styles.arrowStyle}>
        <AntDesign name="left" size={20} color={'#2D3D54'} />
      </TouchableOpacity>
      <View
        style={{
          justifyContent: 'space-around',
          alignItems: 'center',
          flex: 1,
          marginVertical: wp(15),
        }}>
        <Image
          source={images.welcomepic}
          resizeMode="cover"
          style={styles.onboardingImgView}
        />
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: wp(20),
          }}>
          <Text style={styles.onboardTextH}>Welcome</Text>
          <Text style={styles.onboardTextP}>
            Have a better sharing experience
          </Text>
        </View>
        <View style={{marginTop: wp(10)}}>
          <MainButton
            onPress={() => navigation.navigate('SignUp_R')}
            title="Create an account"
          />
        </View>
        <View style={{marginBottom: wp(5), marginTop: wp(1)}}>
          <LightButton
            // onPress1={() => requestLocationPermission()}
            onPress1={() => navigation.navigate('Login_R')}
            title1="Log In"
          />
        </View>
      </View>
      <Modal
        transparent={true}
        visible={confirm}
        // onRequestClose={closemodal}
        animationType="none">
        <View style={styles.modalTopView}>
          <View style={styles.modalsecondView}>
            {/* <TouchableOpacity onPress={() => closemodal()} style={{ position: 'absolute', top: wp(4), right: wp(4) }}>
                                                    <AntDesign name='close' size={20} color={Colors.black} />
                                                </TouchableOpacity> */}
            <View>
              <Image
                source={images.LocationIcon}
                resizeMode="contain"
                style={{
                  width: wp(25),
                  height: wp(25),
                  alignSelf: 'center',
                  marginTop: wp(-3),
                }}
              />
            </View>
            <View
              style={{
                alignSelf: 'center',
                marginHorizontal: wp(10),
                marginTop: wp(5),
              }}>
              <Text style={styles.modalText}>Enable your location</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: fonts.medium,
                  color: Colors.lightgrey,
                  textAlign: 'center',
                  lineHeight: 20,
                }}>
                Choose your location to start find the request around you
              </Text>
            </View>
            <TouchableOpacity
              style={{
                width: wp(75),
                height: wp(12),
                borderRadius: wp(2),
                backgroundColor: Colors.buttoncolor,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: wp(10),
              }}
              onPress={requestLocationPermission}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.bold,
                  color: Colors.background,
                }}>
                {/* Use my location */}
                Continue
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                closemodal();
              }}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: wp(5),
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.medium,
                  color: Colors.lightgrey,
                }}>
                Skip for now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Welcome_R;
