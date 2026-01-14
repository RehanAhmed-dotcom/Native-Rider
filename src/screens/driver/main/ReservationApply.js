import {
  FlatList,
  Image,
  ImageBackground,
  Switch,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
  KeyboardAvoidingView,
  Keyboard,
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MapView, {Marker, Polyline} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {Google_Map_Key} from '../../../components/GoogleMapkey';
import RBSheet from 'react-native-raw-bottom-sheet';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Toast from 'react-native-toast-message';
import {AllGetAPI, PostAPiwithToken} from '../../../components/ApiRoot';
import {useSelector} from 'react-redux';
import Loader from '../../../components/Loader';

const {width, height} = Dimensions.get('window');

const getSeatsForVehicle = vehicle => {
  switch (vehicle) {
    case 'Sedan':
      return 7;
    case 'SUV':
      return 9;
    case 'Van':
      return 10;
    case 'Sprinter':
      return 20;
    case 'Bus':
      return 30;
    default:
      return 1;
  }
};

const ReservationApply = ({navigation, route}) => {
  const user = useSelector(state => state.user.user);
  const [isloading, setIsLoading] = useState(false);

  const {myData} = route.params || {};
  const {top} = useSafeAreaInsets();
  const [selectedRide, setSelectedRide] = useState('Private');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [vehicleType, setVehicleType] = useState('');
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [isPassengersModalVisible, setPassengersModalVisible] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);
  const [isVehicleModalVisible, setVehicleModalVisible] = useState(false);
  const [baseprice, setBasePrice] = useState('');
  const [offerprice, setOfferPrice] = useState('');
  const [allVehicles, setAllVehicles] = useState([]);

  const mapViewRef = useRef(null);
  const bottomSheetRef = useRef(null);

  const [currentLocation, setCurrentLocation] = useState({
    latitude: parseFloat(myData?.pickupLat) || 37.78825,
    longitude: parseFloat(myData?.pickupLng) || -122.4324,
  });
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeDistance, setRouteDistance] = useState(null);
  const [routeDuration, setRouteDuration] = useState(null);
  const [coords, setCoords] = useState([]);
  const [isRideStarted, setIsRideStarted] = useState(false);
  const intervalRef = useRef(null);

  const pickupCords = {
    latitude: parseFloat(myData?.pickupLat) || 37.78825,
    longitude: parseFloat(myData?.pickupLng) || -122.4324,
  };
  const droplocationCords = {
    latitude: parseFloat(myData?.dropoffLat),
    longitude: parseFloat(myData?.dropoffLng),
  };

  const [keyboardStatus, setKeyboardStatus] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardStatus(true),
    );
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardStatus(false),
    );
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const averageSpeed = 60;

  const calculateEstimatedTime = (distance, averageSpeed) => {
    const timeInHours = distance / averageSpeed;
    const hours = Math.floor(timeInHours);
    const minutes = Math.floor((timeInHours - hours) * 60);
    return {hours, minutes};
  };

  const formatEstimatedTime = (hours, minutes) => {
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${
        minutes > 1 ? 's' : ''
      }`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  };

  const fetchBasePrice = () => {
    AllGetAPI({url: 'get-base-fare', Token: user?.api_token})
      .then(res => setBasePrice(res.base_fare))
      .catch(err => console.log('api error', err));
  };

  useEffect(() => {
    fetchBasePrice();
  }, []);

  const decreasePassengers = () => {
    setPassengerCount(prev => (prev > 1 ? prev - 1 : 1));
  };

  const increasePassengers = () => {
    setPassengerCount(prev => {
      if (prev >= 100) {
        Toast.show({
          type: 'error',
          text1: 'Limit Reached',
          text2: 'Maximum 100 passengers allowed',
          topOffset: Platform.OS === 'ios' ? 50 : 0,
          visibilityTime: 3000,
          autoHide: true,
        });
        return 100;
      }
      return prev + 1;
    });
  };

  useEffect(() => {
    const maxSeats = getSeatsForVehicle(vehicleType);
    if (passengerCount > maxSeats) setPassengerCount(maxSeats);
  }, [vehicleType]);

  const calculateDistance = (coord1, coord2) => {
    const R = 6371;
    const dLat = (coord2.latitude - coord1.latitude) * (Math.PI / 180);
    const dLon = (coord2.longitude - coord1.longitude) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coord1.latitude * (Math.PI / 180)) *
        Math.cos(coord2.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const estimatedTime = routeDistance
    ? calculateEstimatedTime(routeDistance, averageSpeed)
    : {hours: 0, minutes: 0};
  const formattedEstimatedTime = formatEstimatedTime(
    estimatedTime.hours,
    estimatedTime.minutes,
  );

  const handleRideSelection = rideType => setSelectedRide(rideType);

  const handleApplyPress = () => bottomSheetRef.current.open();

  // Reusable function to reopen bottom sheet smoothly
  const reopenBottomSheet = () => {
    setTimeout(() => {
      if (bottomSheetRef.current) {
        bottomSheetRef.current.open();
      }
    }, 400);
  };

  // DateTimePicker Functions
  const showDatePicker = () => setDatePickerVisibility(true);

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    reopenBottomSheet();
  };

  const handleConfirmDate = date => {
    const currentDateTime = new Date();
    if (date < currentDateTime) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Time',
        text2: 'You cannot select a past time.',
        topOffset: Platform.OS === 'ios' ? 50 : 0,
        visibilityTime: 3000,
        autoHide: true,
      });
      hideDatePicker();
      return;
    }

    const formattedDate = date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
    const formattedTime = date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    setSelectedDate(formattedDate);
    setSelectedTime(formattedTime);
    hideDatePicker(); // This now correctly reopens the sheet
  };

  const formatDate = date => date || 'Select date';
  const formatTime = time => time || 'and time';

  const fetchVehicles = async () => {
    try {
      const res = await AllGetAPI({
        url: 'vehicle-types',
        Token: user?.api_token,
      });
      if (res.status === 'success') {
        setAllVehicles(res?.vehicle_types);
      }
    } catch (err) {
      console.log('Vehicle fetch error:', err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const saveComment = () => {
    if (comment.trim() === '') {
      Toast.show({type: 'error', text1: 'Comment is required'});
    } else {
      setCommentModalVisible(false);
      reopenBottomSheet();
    }
  };

  const isValidCoordinates =
    !isNaN(pickupCords.latitude) && !isNaN(pickupCords.longitude);

  const createReservation = () => {
    if (!vehicleType) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Vehicle type is required',
      });
      return;
    }

    const parsedOfferPrice = parseInt(offerprice);
    if (!parsedOfferPrice || parsedOfferPrice < baseprice) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: offerprice
          ? `Fare must be greater than $${baseprice}.`
          : 'Please enter the fare amount.',
      });
      return;
    }

    const formdata = new FormData();
    const token = user.api_token;

    formdata.append('pickup_latitude', myData?.pickupLat);
    formdata.append('pickup_longitude', myData?.pickupLng);
    formdata.append('destination_latitude', myData?.dropoffLat);
    formdata.append('destination_longitude', myData?.dropoffLng);
    formdata.append('pickup_location', myData?.pickup);
    formdata.append('destination_location', myData?.dropoff);
    formdata.append('ride_type', selectedRide);
    formdata.append('offered_price', offerprice);
    formdata.append('scheduled_date', selectedDate || '');
    formdata.append('scheduled_time', selectedTime || '');
    formdata.append('comments', comment);
    formdata.append('passengers', passengerCount);
    formdata.append('vehicle_type', vehicleType);

    setIsLoading(true);
    PostAPiwithToken({url: 'reservation', Token: token}, formdata)
      .then(res => {
        console.log('api response', JSON.stringify(res));
        setIsLoading(false);
        if (res.status === 'success') {
          Toast.show({type: 'success', text1: 'Success', text2: res.message});
          navigation.navigate('ResAvailableDrivers', {
            myresdata: res.reservation,
          });
          bottomSheetRef.current.close();
          setSelectedDate(null);
          setSelectedTime(null);
          setComment('');
          setOfferPrice('');
          setPassengerCount(1);
          setVehicleType('');
        } else {
          Toast.show({type: 'error', text1: 'Error', text2: res.message});
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
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : keyboardStatus
            ? 'height'
            : 'undefined'
        }
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        {isloading && <Loader />}

        {isValidCoordinates ? (
          <MapView
            ref={mapViewRef}
            style={StyleSheet.absoluteFill}
            initialRegion={{
              latitude: pickupCords.latitude,
              longitude: pickupCords.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}>
            <Marker coordinate={pickupCords} title="Pickup Location">
              <Image source={images.mapcar} style={styles.markerIcon} />
            </Marker>
            <Marker coordinate={droplocationCords} title="Drop-off Location">
              <Image source={images.PlaceInicator} style={styles.markerIcon} />
            </Marker>
            <MapViewDirections
              origin={isRideStarted ? currentLocation : pickupCords}
              destination={droplocationCords}
              apikey={Google_Map_Key}
              strokeWidth={5}
              strokeColor="blue"
              onReady={result => {
                setCoords(result.coordinates);
                setRouteCoordinates(result.coordinates);
                setRouteDistance(result.distance);
                setRouteDuration(result.duration);
                mapViewRef.current?.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    top: height / 20,
                    right: width / 20,
                    bottom: height / 20,
                    left: width / 20,
                  },
                  animated: true,
                });
              }}
            />
            {routeCoordinates.length > 1 && (
              <Polyline
                coordinates={routeCoordinates}
                strokeWidth={5}
                strokeColor="blue"
              />
            )}
          </MapView>
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Invalid map coordinates.</Text>
          </View>
        )}

        {/* Your existing UI code (header, pickup/dropoff, ride type, etc.) */}
        {/* ... (kept exactly the same as your original) ... */}

        <View
          style={[
            styles.bottomHeaderView,
            {backgroundColor: 'rgba(255,255,255,0.6)'},
          ]}>
          <Text style={styles.headerText}>Reservation</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{position: 'absolute', left: wp(4)}}>
            <AntDesign name="left" size={20} color="#2D3D54" />
          </TouchableOpacity>
        </View>

        {/* Pickup & Dropoff Card */}
        <View
          style={{
            width: wp(90),
            borderRadius: wp(4),
            backgroundColor: Colors.white,
            elevation: 2,
            paddingHorizontal: wp(3),
            paddingVertical: wp(5),
            alignSelf: 'center',
            marginTop: wp(1),
            shadowOffset: {height: 2, width: 2},
            shadowOpacity: 0.2,
            shadowColor: '#4686D4',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={images.pickupIcon}
                resizeMode="contain"
                style={{width: wp(5), height: wp(5)}}
              />
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: fonts.medium,
                  color: Colors.black,
                  marginLeft: wp(2),
                }}>
                From
              </Text>
            </View>
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.medium,
                color: Colors.black,
              }}>
              {myData?.pickup || 'N/A'}
            </Text>
          </View>
          <View
            style={{
              width: wp(80),
              height: wp(0.3),
              backgroundColor: Colors.grey,
              alignSelf: 'center',
              marginVertical: wp(2),
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={images.dropoffIcon}
                resizeMode="contain"
                style={{width: wp(4.5), height: wp(4.5)}}
              />
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: fonts.medium,
                  color: Colors.black,
                  marginLeft: wp(2),
                }}>
                To
              </Text>
            </View>
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.medium,
                color: Colors.black,
              }}>
              {myData?.dropoff || 'N/A'}
            </Text>
          </View>
        </View>

        {routeDistance && (
          <View style={styles.infoContainer}>
            <Text style={[styles.infoText, {color: 'red'}]}>
              Distance: {routeDistance.toFixed(2)} km
            </Text>
            <Text style={styles.infoText}>Time: {formattedEstimatedTime}</Text>
          </View>
        )}

        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <View style={styles.utitityMainView}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.bold,
                color: Colors.black,
                marginTop: wp(1),
              }}>
              What kind of ride do you need?
            </Text>

            <TouchableOpacity
              onPress={() => handleRideSelection('Private')}
              style={{
                width: wp(90),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: wp(3),
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={require('../../../assets/resCar.png')}
                  resizeMode="contain"
                  style={{width: 48, height: 19}}
                />
                <View style={{marginLeft: wp(3)}}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.bold,
                      color: Colors.black,
                    }}>
                    Private Ride
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: fonts.medium,
                      color: Colors.black,
                    }}>
                    Just driver and yourself
                  </Text>
                </View>
              </View>
              <Fontisto
                name={
                  selectedRide === 'Private'
                    ? 'radio-btn-active'
                    : 'radio-btn-passive'
                }
                size={20}
                color={
                  selectedRide === 'Private' ? Colors.buttoncolor : Colors.grey
                }
              />
            </TouchableOpacity>

            <View
              style={{
                width: wp(90),
                height: 1,
                backgroundColor: '#E5E5E5',
                marginTop: wp(3),
              }}
            />

            <TouchableOpacity
              onPress={() => handleRideSelection('Shared')}
              style={{
                width: wp(90),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: wp(3),
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={require('../../../assets/resCar.png')}
                  resizeMode="contain"
                  style={{width: 48, height: 19}}
                />
                <View style={{marginLeft: wp(3)}}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.bold,
                      color: Colors.black,
                    }}>
                    Shared Ride
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: fonts.medium,
                      color: Colors.black,
                    }}>
                    Allows others to join *per seat avail.
                  </Text>
                </View>
              </View>
              <Fontisto
                name={
                  selectedRide === 'Shared'
                    ? 'radio-btn-active'
                    : 'radio-btn-passive'
                }
                size={20}
                color={
                  selectedRide === 'Shared' ? Colors.buttoncolor : Colors.grey
                }
              />
            </TouchableOpacity>

            <View style={{marginVertical: wp(5)}}>
              <MainButton title="Apply" onPress={handleApplyPress} />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* RBSheet */}
      <RBSheet
        ref={bottomSheetRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={hp(85)}
        openDuration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: wp(5),
            backgroundColor: Colors.white,
          },
          draggableIcon: {backgroundColor: Colors.grey},
        }}>
        <View style={{flex: 1}}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{paddingBottom: wp(20)}}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: fonts.bold,
                  color: Colors.black,
                }}>
                {selectedRide} Ride
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fonts.medium,
                  color: Colors.black,
                }}>
                Please specify the number of passengers are with you and how
                much fare do you expect
              </Text>

              {/* Offer Price */}
              <View style={[styles.inputView, {marginTop: wp(4)}]}>
                <Text style={styles.labelStyle}>Offer Fair</Text>
                <View style={styles.inputViewStyle}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={images.priceIcon}
                      tintColor={Colors.buttoncolor}
                      resizeMode="contain"
                      style={{width: wp(5), height: wp(6)}}
                    />
                    <Text
                      style={{
                        fontFamily: fonts.medium,
                        fontSize: 14,
                        color: Colors.black,
                        marginLeft: wp(2),
                      }}>
                      $
                    </Text>
                    <TextInput
                      placeholder="Enter your offer price"
                      placeholderTextColor={Colors.lightgrey}
                      keyboardType="number-pad"
                      style={[styles.inputStyle, {width: wp(63)}]}
                      value={offerprice}
                      onChangeText={setOfferPrice}
                    />
                  </View>
                  <TouchableOpacity style={{paddingRight: wp(3)}}>
                    <AntDesign
                      name="edit"
                      size={20}
                      color={Colors.buttoncolor}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Date & Time */}
              <TouchableOpacity
                onPress={() => {
                  bottomSheetRef.current.close();
                  setTimeout(() => showDatePicker(), 300);
                }}
                style={{
                  width: wp(90),
                  borderRadius: wp(4),
                  backgroundColor: Colors.white,
                  elevation: 4,
                  paddingHorizontal: wp(3),
                  paddingVertical: wp(5),
                  alignSelf: 'center',
                  marginTop: wp(3),
                  shadowOffset: {height: 2, width: 2},
                  shadowOpacity: 0.2,
                  shadowColor: '#4686D4',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                  }}>
                  {formatDate(selectedDate)} {formatTime(selectedTime)}
                </Text>
                <Image
                  source={images.sheetTimeIcon}
                  resizeMode="contain"
                  style={{width: wp(5), height: wp(5)}}
                />
              </TouchableOpacity>

              {/* Vehicle */}
              <TouchableOpacity
                onPress={() => {
                  bottomSheetRef.current.close();
                  setTimeout(() => setVehicleModalVisible(true), 300);
                }}
                style={{
                  width: wp(90),
                  borderRadius: wp(4),
                  backgroundColor: Colors.white,
                  elevation: 4,
                  paddingHorizontal: wp(3),
                  paddingVertical: wp(5),
                  alignSelf: 'center',
                  marginTop: wp(3),
                  shadowOffset: {height: 2, width: 2},
                  shadowOpacity: 0.2,
                  shadowColor: '#4686D4',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                  }}>
                  {vehicleType || 'Select Vehicle'}
                </Text>
                <Image
                  source={require('../../../assets/resCar.png')}
                  resizeMode="contain"
                  style={{width: 40, height: 15}}
                />
              </TouchableOpacity>

              {/* Comments */}
              <TouchableOpacity
                onPress={() => {
                  bottomSheetRef.current.close();
                  setTimeout(() => setCommentModalVisible(true), 300);
                }}
                style={{
                  width: wp(90),
                  borderRadius: wp(4),
                  backgroundColor: Colors.white,
                  elevation: 4,
                  paddingHorizontal: wp(3),
                  paddingVertical: wp(5),
                  alignSelf: 'center',
                  marginTop: wp(3),
                  shadowOffset: {height: 2, width: 2},
                  shadowOpacity: 0.2,
                  shadowColor: '#4686D4',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                    width: wp(70),
                  }}
                  numberOfLines={3}>
                  {comment || 'Comments for your ride'}
                </Text>
                <Image
                  source={images.sheetcommentIcon}
                  resizeMode="contain"
                  style={{width: wp(5), height: wp(5)}}
                />
              </TouchableOpacity>

              {/* Passengers */}
              <TouchableOpacity
                onPress={() => {
                  bottomSheetRef.current.close();
                  setTimeout(() => setPassengersModalVisible(true), 300);
                }}
                style={{
                  width: wp(90),
                  borderRadius: wp(4),
                  backgroundColor: Colors.white,
                  elevation: 4,
                  paddingHorizontal: wp(3),
                  paddingVertical: wp(5),
                  alignSelf: 'center',
                  marginTop: wp(3),
                  shadowOffset: {height: 2, width: 2},
                  shadowOpacity: 0.2,
                  shadowColor: '#4686D4',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                  }}>
                  Passengers: {passengerCount}
                </Text>
                <Image
                  source={images.sheetpass}
                  resizeMode="contain"
                  style={{width: wp(5), height: wp(5)}}
                />
              </TouchableOpacity>

              <View style={{marginVertical: wp(15)}}>
                <MainButton
                  title="Apply"
                  onPress={() => {
                    if (
                      !offerprice ||
                      !selectedDate ||
                      !comment ||
                      !vehicleType
                    ) {
                      Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'All fields are required',
                      });
                      return;
                    }
                    createReservation();
                  }}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </RBSheet>

      {/* DateTimePicker */}
      <DateTimePicker
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
      />

      {/* Comment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCommentModalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              width: wp(90),
              backgroundColor: Colors.white,
              borderRadius: wp(4),
              padding: wp(5),
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: wp(4),
              }}>
              <Text></Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.bold,
                  color: Colors.black,
                }}>
                Comment For Ride
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setCommentModalVisible(false);
                  reopenBottomSheet();
                }}>
                <AntDesign name="close" size={20} color={'#4686D4'} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={{
                height: hp(20),
                borderWidth: 1,
                borderColor: '#4686D4',
                borderRadius: wp(2),
                padding: wp(3),
                textAlignVertical: 'top',
                backgroundColor: Colors.inputColor,
              }}
              multiline
              placeholder="Write here.."
              value={comment}
              onChangeText={setComment}
            />
            <TouchableOpacity
              onPress={saveComment}
              style={{
                width: wp(50),
                backgroundColor: Colors.buttoncolor,
                padding: wp(3),
                borderRadius: wp(2),
                alignSelf: 'center',
                marginTop: wp(5),
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontFamily: fonts.bold,
                }}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Passengers Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isPassengersModalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              width: wp(90),
              backgroundColor: Colors.white,
              borderRadius: wp(4),
              padding: wp(5),
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: wp(3),
              }}>
              <Text></Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.bold,
                  color: Colors.black,
                }}>
                How many people are riding?
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setPassengersModalVisible(false);
                  reopenBottomSheet();
                }}>
                <AntDesign name="close" size={20} color={'#4686D4'} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: wp(80),
              }}>
              <TouchableOpacity
                onPress={decreasePassengers}
                style={styles.priceView}>
                <AntDesign name="minus" size={20} color={Colors.mainColor} />
              </TouchableOpacity>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={images.sheetpass}
                  style={{width: wp(5), height: wp(5), marginRight: wp(2)}}
                />
                <Text style={{fontSize: 18, fontFamily: fonts.bold}}>
                  {passengerCount}
                </Text>
              </View>
              <TouchableOpacity
                onPress={increasePassengers}
                style={styles.priceView}>
                <AntDesign name="plus" size={20} color={Colors.mainColor} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                setPassengersModalVisible(false);
                reopenBottomSheet();
              }}
              style={{
                backgroundColor: Colors.buttoncolor,
                padding: wp(3),
                borderRadius: wp(2),
                marginTop: wp(5),
                alignSelf: 'center',
                width: wp(50),
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontFamily: fonts.bold,
                }}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Vehicle Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVehicleModalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              width: wp(90),
              backgroundColor: Colors.white,
              borderRadius: wp(4),
              padding: wp(7),
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                marginBottom: wp(5),
              }}>
              <Text></Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.bold,
                  color: Colors.black,
                }}>
                Select Vehicle
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setVehicleModalVisible(false);
                  reopenBottomSheet();
                }}>
                <AntDesign name="close" size={20} color={'#4686D4'} />
              </TouchableOpacity>
            </View>
            {allVehicles.map((vehicle, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setVehicleType(vehicle);
                  setPassengerCount(1);
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: wp(3),
                  borderBottomWidth: index === allVehicles.length - 1 ? 0 : 1,
                  borderColor: '#eee',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.bold,
                    color: Colors.black,
                  }}>
                  {vehicle}
                </Text>
                <View
                  style={{
                    width: wp(5),
                    height: wp(5),
                    borderRadius: wp(2.5),
                    borderWidth: 1,
                    borderColor:
                      vehicleType === vehicle
                        ? Colors.buttoncolor
                        : Colors.grey,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {vehicleType === vehicle && (
                    <View
                      style={{
                        width: wp(2.5),
                        height: wp(2.5),
                        borderRadius: wp(1.25),
                        backgroundColor: Colors.buttoncolor,
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => {
                setVehicleModalVisible(false);
                reopenBottomSheet();
              }}
              style={{
                backgroundColor: Colors.buttoncolor,
                padding: wp(4),
                borderRadius: wp(2),
                marginTop: wp(8),
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontFamily: fonts.bold,
                }}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ReservationApply;
