import {
  Alert,
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch} from 'react-redux';
import {
  setOnboarding,
  setOnboardingFalse,
} from '../../../redux/OnboardingSlice';
import {setUserType} from '../../../redux/Auth';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import Toast from 'react-native-toast-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Welcome = ({navigation}) => {
  const [confirm, setConfirm] = useState(false);
  const dispatch = useDispatch();

  const requestLocationPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    console.log('req', request);
    try {
      const result = await request(permission);
      console.log('result', result);
      if (result === RESULTS.GRANTED) {
        getLocation();
      } else if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
        Toast.show({
          type: 'error',
          text1: 'Permission Denied',
          text2: 'Location permission is required to find nearby requests.',
        });
      }
    } catch (error) {
      console.error('Permission request error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to request location permission. Please try again.',
      });
    }
  };

  const getLocation = () => {
    console.log('loc');
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        saveLocationEnabled();
        setConfirm(false);
      },
      error => {
        console.error('Location error:', error);
        Toast.show({
          type: 'error',
          text1: 'Location Error',
          text2: 'Unable to retrieve location. Please try again.',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 10000,
      },
    );
  };

  const saveLocationEnabled = async () => {
    try {
      await AsyncStorage.setItem('locationEnabled', 'true');
    } catch (error) {
      console.error('Failed to save location enabled state:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save location settings.',
      });
    }
  };

  const checkLocationEnabled = async () => {
    try {
      const locationEnabled = await AsyncStorage.getItem('locationEnabled');
      setConfirm(locationEnabled !== 'true');
    } catch (error) {
      console.error('Failed to retrieve location enabled state:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to check location settings.',
      });
    }
  };

  useEffect(() => {
    checkLocationEnabled();
    SplashScreen.hide();
  }, []);
  const {top} = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS === 'ios' ? top : 0},
      ]}>
      <TouchableOpacity
        onPress={() => dispatch(setUserType(null))}
        style={[styles.arrowStyle,{marginTop:wp(5)}]}>
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
          <Text style={styles.onboardTextH}>Welcome to Native Rider!</Text>
          <Text style={styles.onboardTextP}>
            More than just a ride, it’s your complete transportation solution!
          </Text>
        </View>
        <View style={{marginTop: wp(10)}}>
          <MainButton
            onPress={() => navigation.navigate('SignUp_D')}
            title="Create an account"
          />
        </View>
        <View style={{marginBottom: wp(5), marginTop: wp(1)}}>
          <LightButton
            onPress1={() => navigation.navigate('Login_D')}
            title1="Log In"
          />
        </View>
      </View>
      <Modal
        transparent={true}
        visible={confirm}
        // onRequestClose={() => {
        //   setConfirm(false);
        // }}
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
                Enabling your location improves visibility, helping drivers find
                you faster.
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
              {/* onPress={requestLocationPermission} */}
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
                setConfirm(false);
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

export default Welcome;
