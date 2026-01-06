import {
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Platform,
  RefreshControl,
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
import {images, fonts, Colors, styles} from '../../../../constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../../components/MainButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Loader from '../../../../components/Loader';
import {AllGetAPI} from '../../../../components/ApiRoot';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';

import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {setUser} from '../../../redux/Auth';
import {useFocusEffect} from '@react-navigation/native';
const Reservations = ({navigation}) => {
  const user = useSelector(state => state.user.user);
  console.log('my user data', user);

  const [refreshing, setRefreshing] = useState(false);
  const [isloading, setIsLoading] = useState(false);

  const [pickup, setPickUp] = useState('');
  const [pickupLat, setPickUpLat] = useState(null);
  const [pickupLng, setPickUpLng] = useState(null);
  const [usernotfound, setuserNotFound] = useState(false);
  const [dropoff, setDropoff] = useState('');
  const [dropoffLat, setDropoffLat] = useState(null);
  const [dropoffLng, setDropoffLng] = useState(null);

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

  const mapViewRef = useRef(null);

  const myData = {
    pickup,
    pickupLat,
    pickupLng,
    dropoff,
    dropoffLat,
    dropoffLng,
  };
  const handleNextPress = useCallback(() => {
    if (pickup && dropoff) {
      navigation.navigate('ReservationApply', {myData});
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
  }, [pickup, dropoff, navigation, myData]);
  const onRefresh = () => {
    setRefreshing(true);
  };
  const googlePlacesRef = useRef(null);
  const googleDropoffRef = useRef(null);

  const {top} = useSafeAreaInsets();
  return (
    <ImageBackground
      source={images.mapBackground}
      resizeMode="cover"
      style={[
        styles.mainContainer,
        // {paddingTop: Platform.OS == 'ios' ? top : 0},
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
            styles.mainContainer,
            {paddingTop: Platform.OS == 'ios' ? top : 0},
          ]}>
          {isloading && <Loader />}

          <View style={styles.bottomHeaderView}>
            <Text style={styles.headerText}>Reservations</Text>
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
              onPress={() => navigation.navigate('SharedReservation')}
              style={{
                position: 'absolute',
                right: wp(4),
                paddingHorizontal: wp(2),
                paddingVertical: wp(2),
                borderWidth: 1,
                borderColor: Colors.buttoncolor,
                borderRadius: wp(2),
              }}>
              <Text style={{fontSize: 12, color: 'black'}}>Shared Res</Text>
            </TouchableOpacity>
          </View>
          {/* <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        </ScrollView> */}
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{paddingBottom: wp(6)}}>
            <View
              style={{
                width: wp(65),
                height: wp(13),
                borderRadius: wp(3),
                backgroundColor: Colors.white,
                marginTop: wp(15),
                alignSelf: 'center',
                paddingHorizontal: wp(3),
                paddingVertical: wp(2),
              }}>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: fonts.bold,
                  color: Colors.black,
                }}>
                My location
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: fonts.bold,
                  color: Colors.black,
                }}>
                {user.address}
              </Text>
            </View>
            <Image
              source={require('../../../../assets/PlaceIndicate.png')}
              resizeMode="contain"
              style={{
                width: 28,
                height: 28,
                alignSelf: 'center',
                marginTop: wp(1),
              }}
            />
            <Image
              source={require('../../../../assets/toolspic.jpeg')}
              resizeMode="cover"
              style={{
                width: wp(90),
                height: wp(17),
                borderRadius: wp(3),
                marginTop: wp(45),
                alignSelf: 'center',
              }}
            />
            <View style={[styles.PickupView, {marginTop: wp(3)}]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: wp(3),
                }}>
                <GooglePlacesAutocomplete
                  placeholder="Current Location"
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
                    key: 'AIzaSyDeLHyqt8QAOnRIWUyHY4e26DH2qCyXHak',
                    language: 'en',
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
                  placeholder="Where would you like to go?"
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
                    key: 'AIzaSyDeLHyqt8QAOnRIWUyHY4e26DH2qCyXHak',
                    language: 'en',
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
            <View style={{marginTop: wp(10), marginBottom: wp(4)}}>
              <MainButton title="Next" onPress={handleNextPress} />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Reservations;
