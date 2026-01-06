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
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {images, fonts, Colors, styles} from '../../../../constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../../components/MainButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {AllGetAPI, PostAPiwithToken} from '../../../../components/ApiRoot';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import Loader from '../../../../components/Loader';
import moment from 'moment';
import FastImage from 'react-native-fast-image';

const Bookings = ({navigation}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false); // State for dropdown visibility
  const user = useSelector(state => state.user.user);
  const [pendingBooking, setPendingBooking] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [completeBooking, setCompleteBooking] = useState([]);
  const [confirm, setConfirm] = useState(false);

  const [selectedRideId, setSelectedRideId] = useState(null);
  const [onchangeTab, setOnChangeTab] = useState('1');
  const [selectedOption, setSelectedOption] = useState('Bookings'); // Track selected dropdown option
  const [IncomingRes, setIncomingRes] = useState([]);
  const [AcceptedRes, setAcceptedRes] = useState([]);

  console.log('accepted res', AcceptedRes);
  const [CompletedRes, setCompletedRes] = useState([]);
  const closemodal = () => {
    setConfirm(false);
  };


    const [confirmres, setConfirmres] = useState(false);
    const closemodalRes = () => {
      setConfirm(false);
    };
    const [selectedResId, setSelectedResId] = useState(null);
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOptionSelect = option => {
    setSelectedOption(option);
    setOnChangeTab(option === 'Bookings' ? '1' : '1'); // Reset to first tab when switching options
    setDropdownVisible(false);
  };

  const fetchbookings = () => {
    setIsLoading(true);
    AllGetAPI({url: 'rides-details-driver', Token: user?.api_token})
      .then(res => {
        setIsLoading(false);
        setRefreshing(false);
        console.log(
          'response dataaaaaaaaa total bookingfdfdfdfd',
          JSON.stringify(res),
        );
        if (res.status === 'success') {
          setIsLoading(false);
          setRefreshing(false);
          setPendingBooking(res?.rides?.pending);
          setCompleteBooking(res?.rides?.completed);
        } else {
          setIsLoading(false);
          setRefreshing(false);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        setRefreshing(false);
        console.log('api error', err);
      });
  };

  useEffect(() => {
    fetchbookings();
  }, []);

  const CancelRideApi = id => {
    const formdata = new FormData();
    const token = user.api_token;
    formdata.append('ride_id', id);
    setIsLoading(true);
    PostAPiwithToken({url: 'cancel-ride-driver', Token: token}, formdata)
      .then(res => {
        setIsLoading(false);
        console.log('res of Cancel booking ', JSON.stringify(res));
        closemodal();
        if (res.status === 'success') {
          setIsLoading(false);
          Toast.show({
            type: 'success',
            text1: 'Decline Booking',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          fetchbookings();

          navigation.goBack();
        } else {
          setIsLoading(false);
          Toast.show({
            type: 'error',
            text1: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
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
    const CancelReservationApi = id => {
      const formdata = new FormData();
      const token = user.api_token;
      formdata.append('reservation_id', id);
      setIsLoading(true);
      PostAPiwithToken({url: 'cancel-reservation', Token: token}, formdata)
        .then(res => {
          setIsLoading(false);
          console.log('res of Cancel booking ', JSON.stringify(res));
          closemodalRes();
          if (res.status === 'success') {
            setIsLoading(false);
            Toast.show({
              type: 'success',
              text1: 'Decline Booking',
              text2: res.message,
              topOffset: Platform.OS === 'ios' ? 50 : 0,
              visibilityTime: 3000,
              autoHide: true,
            });
            fetchReservations();
  
            navigation.goBack();
          } else {
            setIsLoading(false);
            Toast.show({
              type: 'error',
              text1: res.message,
              topOffset: Platform.OS === 'ios' ? 50 : 0,
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

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = degrees => degrees * (Math.PI / 180);

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers
    return distance.toFixed(2); // Round to 2 decimal places
  };

  const calculateEstimatedTime = (distance, averageSpeed = 50) => {
    // Time = Distance / Speed
    const timeInHours = distance / averageSpeed;
    const timeInMinutes = timeInHours * 60;
    return Math.round(timeInMinutes); // Round to the nearest minute
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchbookings();
    fetchReservations();
  };

  const {top, bottom} = useSafeAreaInsets();

  const fetchReservations = () => {
    setIsLoading(true);
    AllGetAPI({url: 'offers-reservation-for-rider', Token: user?.api_token})
      .then(res => {
        setIsLoading(false);
        setRefreshing(false);
        console.log('response reservation  rider', JSON.stringify(res));
        if (res.status == 'success') {
          setRefreshing(false);
          setIsLoading(false);
          setIncomingRes(res?.pending);
          setAcceptedRes(res?.accepted);
          setCompletedRes(res?.completed);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          setRefreshing(false);
          setIsLoading(false);
        }
      })
      .catch(err => {
        setRefreshing(false);
        setIsLoading(false);
        console.log('api error', err);
      });
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Dummy data for Reserved In Progress and Completed
  const reservedInProgressData = [
    {
      id: '1',
      user: {name: 'Harry Potter', image: images.avatar},
      pickup_address: 'London',
      destination_address: 'Hogwarts',
      pickup_latitude: 51.5074,
      pickup_longitude: -0.1278,
      destination_latitude: 51.4983,
      destination_longitude: -0.1767,
    },
    {
      id: '2',
      user: {name: 'Draco Malfoy', image: images.avatar},
      pickup_address: 'Malfoy Manor',
      destination_address: 'Hogsmeade',
      pickup_latitude: 51.5074,
      pickup_longitude: -0.1278,
      destination_latitude: 51.4983,
      destination_longitude: -0.1767,
    },
  ];

  const reservedCompletedData = [
    {
      id: '3',
      user: {name: 'Luna Lovegood', image: images.avatar},
      pickup_address: 'Ottery St Catchpole',
      destination_address: 'Diagon Alley',
      pickup_latitude: 51.5074,
      pickup_longitude: -0.1278,
      destination_latitude: 51.4983,
      destination_longitude: -0.1767,
    },
    {
      id: '4',
      user: {name: 'Neville Longbottom', image: images.avatar},
      pickup_address: 'Little Whinging',
      destination_address: 'King’s Cross',
      pickup_latitude: 51.5074,
      pickup_longitude: -0.1278,
      destination_latitude: 51.4983,
      destination_longitude: -0.1767,
    },
  ];

  return (
    <View
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS === 'ios' ? top : 0},
      ]}>
      {isLoading && <Loader />}

      <View style={styles.bottomHeaderView}>
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
        <Text style={styles.headerText}>{selectedOption}</Text>

        <FastImage
          source={require('../../../../assets/arrow.gif')}
          resizeMode={FastImage.resizeMode.contain}
          style={{
            width: wp(10),
            height: wp(10),
            position: 'absolute',
            right: wp(11),
          }}
        />
        <TouchableOpacity
          onPress={toggleDropdown}
          style={{position: 'absolute', right: wp(4)}}
          activeOpacity={0.7}>
          <Image
            source={images.bmenuIcon}
            resizeMode="contain"
            style={{width: wp(6), height: wp(6)}}
          />
        </TouchableOpacity>
      </View>

      {/* Dropdown Modal */}
      <Modal
        transparent={true}
        visible={dropdownVisible}
        onRequestClose={() => setDropdownVisible(false)}
        animationType="fade">
        <TouchableOpacity
          style={styles.dropdownOverlay}
          onPress={() => setDropdownVisible(false)}>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleOptionSelect('Bookings')}>
              <Text style={styles.dropdownText}>Bookings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleOptionSelect('Reserved')}>
              <Text style={styles.dropdownText}>Reserved</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {selectedOption === 'Bookings' ? (
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: wp(3),
                marginHorizontal: wp(3),
              }}>
              <TouchableOpacity onPress={() => setOnChangeTab('1')}>
                <ImageBackground
                  source={images.viewfill}
                  resizeMode="contain"
                  tintColor={
                    onchangeTab === '1' ? Colors.buttoncolor : '#C6DEFB'
                  }
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: wp(47),
                    height: wp(12),
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.bold,
                      color:
                        onchangeTab === '1' ? Colors.white : Colors.buttoncolor,
                    }}>
                    In Progress
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setOnChangeTab('2')}>
                <ImageBackground
                  source={images.viewunfill}
                  resizeMode="contain"
                  tintColor={
                    onchangeTab === '2' ? Colors.buttoncolor : '#C6DEFB'
                  }
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: wp(47),
                    height: wp(12),
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.bold,
                      color:
                        onchangeTab === '2' ? Colors.white : Colors.buttoncolor,
                    }}>
                    Completed
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>
            {onchangeTab === '1' ? (
              <View style={{marginTop: wp(3)}}>
                {pendingBooking?.length === 0 ? (
                  <View style={{marginTop: wp(60)}}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: fonts.bold,
                        color: Colors.black,
                        textAlign: 'center',
                        marginTop: wp(4),
                        marginHorizontal: wp(14),
                        lineHeight: 25,
                      }}>
                      No In Progress Bookings Found!
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={pendingBooking}
                    inverted
                    keyExtractor={item => item.id}
                    renderItem={({item}) => {
                      const pickupLat = parseFloat(item?.pickup_latitude);
                      const pickupLng = parseFloat(item?.pickup_longitude);
                      const dropoffLat = parseFloat(item?.destination_latitude);
                      const dropoffLng = parseFloat(
                        item?.destination_longitude,
                      );

                      // Calculate distance
                      const distance = haversineDistance(
                        pickupLat,
                        pickupLng,
                        dropoffLat,
                        dropoffLng,
                      );
                      const estimatedTime = calculateEstimatedTime(distance);
                      const rideDateTime = moment(
                        `${item.date} ${item.time}`,
                        'MM-DD-YYYY h:mm A',
                      );
                      const currentDateTime = moment();
                      const isExpired = rideDateTime.isBefore(currentDateTime);
                      return (
                        <View>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            style={[
                              styles.DriverView,
                              {paddingVertical: wp(4)},
                            ]}
                            onPress={() =>
                              navigation.navigate('BookingDetails', {
                                item,
                                status: 'accept',
                                distance,
                                estimatedTime,
                              })
                            }>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <Image
                                  source={
                                    item?.user?.image
                                      ? {uri: item?.user?.image}
                                      : images.avatar
                                  }
                                  resizeMode="contain"
                                  style={styles.driverimg}
                                  borderRadius={wp(5)}
                                />
                                <View style={{marginLeft: wp(2)}}>
                                  <Text style={styles.usernameText}>
                                    {item?.user?.name}
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: 13,
                                      fontFamily: fonts.medium,
                                      color: Colors.black,
                                      lineHeight: 15,
                                    }}>
                                    Driver
                                  </Text>
                                </View>
                              </View>
                              <View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <Image
                                    source={images.locIcon}
                                    resizeMode="contain"
                                    style={{width: wp(5), height: wp(5)}}
                                  />
                                  <View style={{marginLeft: wp(2)}}>
                                    <Text
                                      style={{
                                        fontSize: 13,
                                        fontFamily: fonts.medium,
                                        color: Colors.black,
                                      }}>
                                      {distance}km
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: 11,
                                        fontFamily: fonts.medium,
                                        color: Colors.black,
                                        lineHeight: 16,
                                      }}>
                                      ({estimatedTime} mins away)
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                            <View style={{marginTop: wp(4)}}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
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
                                  {item?.pickup_address}
                                </Text>
                              </View>
                              <View
                                style={{
                                  width: wp(80),
                                  height: wp(0.3),
                                  backgroundColor: Colors.grey,
                                  alignSelf: 'center',
                                  marginVertical: wp(2),
                                }}></View>

                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
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
                                  {item?.destination_address}
                                </Text>
                              </View>
                            </View>
                            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: wp(5) }}>
                              <TouchableOpacity
                                style={{ width: wp(40), height: wp(12), backgroundColor: Colors.buttoncolor, borderRadius: wp(3), alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={[styles.titleText, { color: Colors.white, fontSize: 14 }]}>{item.status === 'open' ? 'Pending' : null}</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => { setConfirm(true); setSelectedRideId(item.id); }}
                                style={{ width: wp(40), height: wp(12), backgroundColor: Colors.white, borderRadius: wp(3), alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#D63544' }}>
                                <Text style={[styles.titleText, { color: '#D63544', fontSize: 14 }]}>Cancel Ride</Text>
                              </TouchableOpacity>
                            </View> */}
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: wp(5),
                              }}>
                              {isExpired ? (
                                <View
                                  style={{
                                    width: wp(80),
                                    height: wp(13),
                                    backgroundColor: Colors.grey,
                                    borderRadius: wp(3),
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: wp(2),
                                  }}>
                                  <Text
                                    style={[
                                      styles.titleText,
                                      {color: Colors.white, fontSize: 14},
                                    ]}>
                                    Expired Booking
                                  </Text>
                                </View>
                              ) : item.status == 'request_for_payment' ? (
                                <TouchableOpacity
                                  onPress={() =>
                                    navigation.navigate('TrackMap_D', {
                                      item,
                                      distance,
                                    })
                                  }
                                  style={{
                                    width: wp(80),
                                    height: wp(13),
                                    backgroundColor: Colors.buttoncolor,
                                    borderRadius: wp(3),
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: wp(2),
                                  }}>
                                  <Text
                                    style={[
                                      styles.titleText,
                                      {color: Colors.white, fontSize: 14},
                                    ]}>
                                    Pay Now
                                  </Text>
                                </TouchableOpacity>
                              ) : (
                                <>
                                  {/* {item.rider_status == 'pending' &&(
                                    <View
                                      style={{
                                        width: wp(40),
                                        height: wp(12),
                                        backgroundColor: Colors.buttoncolor,
                                        borderRadius: wp(3),
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      }}>
                                      <Text
                                        style={[
                                          styles.titleText,
                                          {color: Colors.white, fontSize: 14},
                                        ]}>
                                        {item?.rider_status === 'pending'
                                          ? 'Pending'
                                          :null}
                                      </Text>
                                    </View>
                                  )} */}
                                  {/* {item?.rider_status == 'accepted'&&  (
                                    <View
                                      style={{
                                        width: wp(40),
                                        height: wp(12),
                                        backgroundColor: Colors.buttoncolor,
                                        borderRadius: wp(3),
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      }}>
                                      <Text
                                        style={[
                                          styles.titleText,
                                          {color: Colors.white, fontSize: 14},
                                        ]}>
                                        {item?.rider_status==='accepted'?'Accepted':null}
                                      </Text>
                                    </View>
                                  )} */}
                                  {item.status == 'started' ? (
                                    <TouchableOpacity
                                      onPress={() =>
                                        navigation.navigate('TrackMap_D', {
                                          item,
                                        })
                                      }
                                      style={{
                                        width: wp(80),
                                        height: wp(12),
                                        backgroundColor: Colors.buttoncolor,
                                        borderRadius: wp(3),
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginLeft: wp(2),
                                      }}>
                                      <Text
                                        style={[
                                          styles.titleText,
                                          {color: Colors.white, fontSize: 14},
                                        ]}>
                                        Track Ride
                                      </Text>
                                    </TouchableOpacity>
                                  ) : item.rider_status == 'pending' ? (
                                    <View
                                      style={{
                                        width: wp(40),
                                        height: wp(12),
                                        backgroundColor: Colors.buttoncolor,
                                        borderRadius: wp(3),
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      }}>
                                      <Text
                                        style={[
                                          styles.titleText,
                                          {color: Colors.white, fontSize: 14},
                                        ]}>
                                        {item?.rider_status === 'pending'
                                          ? 'Pending'
                                          : null}
                                      </Text>
                                    </View>
                                  ) : item?.rider_status == 'accepted' ? (
                                    <TouchableOpacity
                                      onPress={() =>
                                        navigation.navigate('TrackMap_D', {
                                          item,
                                          distance,
                                        })
                                      }
                                      style={{
                                        width: wp(40),
                                        height: wp(12),
                                        backgroundColor: Colors.buttoncolor,
                                        borderRadius: wp(3),
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      }}>
                                      <Text
                                        style={[
                                          styles.titleText,
                                          {color: Colors.white, fontSize: 14},
                                        ]}>
                                        {item?.rider_status === 'accepted'
                                          ? 'Pay Now'
                                          : null}
                                      </Text>
                                    </TouchableOpacity>
                                  ) : (
                                    item.rider_status == 'paid' && (
                                      <View
                                        style={{
                                          width: wp(40),
                                          height: wp(12),
                                          backgroundColor: Colors.buttoncolor,
                                          borderRadius: wp(3),
                                          alignSelf: 'center',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                        }}>
                                        <Text
                                          style={[
                                            styles.titleText,
                                            {color: Colors.white, fontSize: 14},
                                          ]}>
                                          {item?.rider_status === 'paid'
                                            ? 'Paid'
                                            : null}
                                        </Text>
                                      </View>
                                    )
                                  )}
                                  {item.status == 'started' ? null : (
                                    <TouchableOpacity
                                      onPress={() => {
                                        setConfirm(true);
                                        setSelectedRideId(item.id);
                                      }}
                                      style={{
                                        width: wp(40),
                                        height: wp(13),
                                        backgroundColor: Colors.white,
                                        borderRadius: wp(3),
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderWidth: 1,
                                        borderColor: '#D63544',

                                        // marginTop: wp(4),
                                      }}>
                                      <Text
                                        style={[
                                          styles.titleText,
                                          {color: '#D63544', fontSize: 14},
                                        ]}>
                                        Cancel Ride
                                      </Text>
                                    </TouchableOpacity>
                                  )}
                                </>
                              )}
                            </View>
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                  />
                )}
              </View>
            ) : (
              <View style={{marginTop: wp(3)}}>
                {completeBooking?.length === 0 ? (
                  <View style={{marginTop: wp(60)}}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: fonts.bold,
                        color: Colors.black,
                        textAlign: 'center',
                        marginTop: wp(4),
                        marginHorizontal: wp(14),
                        lineHeight: 25,
                      }}>
                      No Completed Bookings Found!
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={completeBooking}
                    inverted
                    keyExtractor={item => item.id}
                    renderItem={({item}) => {
                      const pickupLat = parseFloat(item?.pickup_latitude);
                      const pickupLng = parseFloat(item?.pickup_longitude);
                      const dropoffLat = parseFloat(item?.destination_latitude);
                      const dropoffLng = parseFloat(
                        item?.destination_longitude,
                      );

                      // Calculate distance
                      const distance = haversineDistance(
                        pickupLat,
                        pickupLng,
                        dropoffLat,
                        dropoffLng,
                      );
                      return (
                        <View>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            style={[
                              styles.DriverView,
                              {paddingVertical: wp(4)},
                            ]}
                            onPress={() =>
                              navigation.navigate('BookingDetails', {
                                item,
                                status: 'completed',
                                distance,
                              })
                            }>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <Image
                                  source={
                                    item?.user?.image
                                      ? {uri: item?.user?.image}
                                      : images.avatar
                                  }
                                  resizeMode="contain"
                                  style={styles.driverimg}
                                  borderRadius={wp(5)}
                                />
                                <View style={{marginLeft: wp(2)}}>
                                  <Text style={styles.usernameText}>
                                    {item?.user?.name}
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: 13,
                                      fontFamily: fonts.medium,
                                      color: Colors.black,
                                      lineHeight: 15,
                                    }}>
                                    Driver
                                  </Text>
                                </View>
                              </View>
                              <View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <Image
                                    source={images.locIcon}
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
                                    {distance}km
                                  </Text>
                                </View>
                              </View>
                            </View>
                            <View style={{marginTop: wp(4)}}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
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
                                  {item?.pickup_address}
                                </Text>
                              </View>
                              <View
                                style={{
                                  width: wp(80),
                                  height: wp(0.3),
                                  backgroundColor: Colors.grey,
                                  alignSelf: 'center',
                                  marginVertical: wp(2),
                                }}></View>

                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
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
                                  {item?.destination_address}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                  />
                )}
              </View>
            )}
          </View>
        ) : (
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: wp(3),
                marginHorizontal: wp(3),
              }}>
              <TouchableOpacity onPress={() => setOnChangeTab('1')}>
                <ImageBackground
                  source={images.incoming}
                  resizeMode="contain"
                  tintColor={
                    onchangeTab == '1' ? Colors.buttoncolor : '#C6DEFB'
                  }
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 122,
                    height: 30,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.bold,
                      color:
                        onchangeTab == '1' ? Colors.white : Colors.buttoncolor,
                    }}>
                    pending
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setOnChangeTab('2')}>
                <ImageBackground
                  source={images.acceptImg}
                  resizeMode="contain"
                  tintColor={
                    onchangeTab == '2' ? Colors.buttoncolor : '#C6DEFB'
                  }
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 122,
                    height: 30,
                    marginLeft: wp(-4),
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.bold,
                      color:
                        onchangeTab == '2' ? Colors.white : Colors.buttoncolor,
                    }}>
                    Accepted
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setOnChangeTab('3')}>
                <ImageBackground
                  source={images.completeImg}
                  resizeMode="contain"
                  tintColor={
                    onchangeTab == '3' ? Colors.buttoncolor : '#C6DEFB'
                  }
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 122,
                    height: 30,
                    marginLeft: wp(-4),
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.bold,
                      color:
                        onchangeTab == '3' ? Colors.white : Colors.buttoncolor,
                    }}>
                    Completed
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>
            {onchangeTab === '1' ? (
              <View style={{marginTop: wp(3)}}>
                {IncomingRes?.length === 0 ? (
                  <View style={{marginTop: wp(60)}}>
                    {/* <Image source={item.image} resizeMode='contain' style={{ width: wp(80), height: wp(80), alignSelf: 'center' }} /> */}
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: fonts.bold,
                        color: Colors.black,
                        textAlign: 'center',
                        marginTop: wp(4),
                        marginHorizontal: wp(14),
                        lineHeight: 25,
                      }}>
                      No pending reservation found!
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={[...IncomingRes].sort((a, b) => b.id - a.id)}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({item}) => {
                      const pickupLat = parseFloat(item?.pickup_latitude);
                      const pickupLng = parseFloat(item?.pickup_longitude);
                      const dropoffLat = parseFloat(item?.destination_latitude);
                      const dropoffLng = parseFloat(
                        item?.destination_longitude,
                      );

                      // Calculate distance
                      const distance = haversineDistance(
                        pickupLat,
                        pickupLng,
                        dropoffLat,
                        dropoffLng,
                      );
                      return (
                        <View>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            style={[
                              styles.DriverView,
                              {paddingVertical: wp(4)},
                            ]}
                            onPress={() =>
                              navigation.navigate('ResAvailableDrivers', {
                                myresdata: item,
                              })
                            }>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <Image
                                  source={
                                    item?.rider?.image
                                      ? {uri: item?.rider?.image}
                                      : images.avatar
                                  }
                                  resizeMode="contain"
                                  style={styles.driverimg}
                                  borderRadius={wp(5)}
                                />
                                <View style={{marginLeft: wp(2)}}>
                                  <Text style={styles.usernameText}>
                                    {item?.rider?.name}
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: 13,
                                      fontFamily: fonts.medium,
                                      color: Colors.black,
                                      lineHeight: 15,
                                    }}>
                                    Rider
                                  </Text>
                                </View>
                              </View>
                              <View>
                                <View style={{alignItems: 'center'}}>
                                  <Text
                                    style={{
                                      fontSize: 10,
                                      fontFamily: fonts.bold,
                                      color: Colors.buttoncolor,
                                      marginLeft: wp(2),
                                    }}>
                                    Price
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: 18,
                                      fontFamily: fonts.bold,
                                      color: Colors.buttoncolor,
                                      marginLeft: wp(2),
                                      lineHeight: 18,
                                    }}>
                                    ${item?.offered_price}
                                  </Text>
                                </View>
                              </View>
                            </View>
                            <View style={{marginTop: wp(4)}}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
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
                                  {item?.pickup_location}
                                </Text>
                              </View>
                              <View
                                style={{
                                  width: wp(80),
                                  height: wp(0.3),
                                  backgroundColor: Colors.grey,
                                  alignSelf: 'center',
                                  marginVertical: wp(2),
                                }}></View>

                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
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
                                  {item?.destination_location}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                  />
                )}
              </View>
            ) : onchangeTab === '2' ? (
              <View style={{marginTop: wp(3)}}>
                {AcceptedRes?.length === 0 ? (
                  <View style={{marginTop: wp(60)}}>
                    {/* <Image source={item.image} resizeMode='contain' style={{ width: wp(80), height: wp(80), alignSelf: 'center' }} /> */}
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: fonts.bold,
                        color: Colors.black,
                        textAlign: 'center',
                        marginTop: wp(4),
                        marginHorizontal: wp(14),
                        lineHeight: 25,
                      }}>
                      No accepted reservation found!
                    </Text>
                  </View>
                ) : (
                  <FlatList
                  data={[...AcceptedRes].sort((a, b) => b.id - a.id)} // or by date/time
                  keyExtractor={item => item.id.toString()}
                  renderItem={({item}) => {
                      const pickupLat = parseFloat(item?.pickup_latitude);
                      const pickupLng = parseFloat(item?.pickup_longitude);
                      const dropoffLat = parseFloat(item?.destination_latitude);
                      const dropoffLng = parseFloat(
                        item?.destination_longitude,
                      );

                      // Calculate distance
                      const distance = haversineDistance(
                        pickupLat,
                        pickupLng,
                        dropoffLat,
                        dropoffLng,
                      );
                      return (
                        <View>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            style={[
                              styles.DriverView,
                              {paddingVertical: wp(4)},
                            ]}
                            onPress={() =>
                              navigation.navigate('ReservationAcpDetails', {
                                item,
                                distance,
                              })
                            }>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <Image
                                  source={
                                    item?.driver?.image
                                      ? {uri: item?.driver?.image}
                                      : images.avatar
                                  }
                                  resizeMode="contain"
                                  style={styles.driverimg}
                                  borderRadius={wp(5)}
                                />
                                <View style={{marginLeft: wp(2)}}>
                                  <Text style={styles.usernameText}>
                                    {item?.driver?.name}
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: 13,
                                      fontFamily: fonts.medium,
                                      color: Colors.black,
                                      lineHeight: 15,
                                    }}>
                                    Driver
                                  </Text>
                                </View>
                              </View>
                              <View>
                                <View style={{alignItems: 'center'}}>
                                  <Text
                                    style={{
                                      fontSize: 10,
                                      fontFamily: fonts.bold,
                                      color: Colors.buttoncolor,
                                      marginLeft: wp(2),
                                    }}>
                                    Price
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: 18,
                                      fontFamily: fonts.bold,
                                      color: Colors.buttoncolor,
                                      marginLeft: wp(2),
                                      lineHeight: 18,
                                    }}>
                                    ${item?.driver_offered_price}
                                  </Text>
                                </View>
                              </View>
                            </View>
                            <View style={{marginTop: wp(4)}}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
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
                                  {item?.pickup_location}
                                </Text>
                              </View>
                              <View
                                style={{
                                  width: wp(80),
                                  height: wp(0.3),
                                  backgroundColor: Colors.grey,
                                  alignSelf: 'center',
                                  marginVertical: wp(2),
                                }}></View>

                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
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
                                  {item?.destination_location}
                                </Text>
                              </View>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: wp(4),
                              }}>
                              {item.status == 'started' ? (
                                <TouchableOpacity
                                  onPress={() =>
                                    navigation.navigate('ResMapTrack', {
                                      item,
                                    })
                                  }
                                  style={{
                                    width: wp(80),
                                    height: wp(12),
                                    backgroundColor: Colors.buttoncolor,
                                    borderRadius: wp(3),
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: wp(2),
                                  }}>
                                  <Text
                                    style={[
                                      styles.titleText,
                                      {color: Colors.white, fontSize: 14},
                                    ]}>
                                    Track Ride
                                  </Text>
                                </TouchableOpacity>
                              ) : item?.status == 'accepted' ? (
                                <TouchableOpacity
                                  onPress={() =>
                                    navigation.navigate('ResMapTrack', {
                                      item,
                                      distance,
                                    })
                                  }
                                  style={{
                                    width: wp(40),
                                    height: wp(12),
                                    backgroundColor: Colors.buttoncolor,
                                    borderRadius: wp(3),
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    style={[
                                      styles.titleText,
                                      {color: Colors.white, fontSize: 14},
                                    ]}>
                                    {item?.status === 'accepted'
                                      ? 'Pay Now'
                                      : null}
                                  </Text>
                                </TouchableOpacity>
                              ) : item?.status == 'paid' ? (
                                <View
                                  style={{
                                    width: wp(40),
                                    height: wp(12),
                                    backgroundColor: Colors.buttoncolor,
                                    borderRadius: wp(3),
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    style={[
                                      styles.titleText,
                                      {color: Colors.white, fontSize: 14},
                                    ]}>
                                    {item?.status === 'paid' ? 'Paid' : null}
                                  </Text>
                                </View>
                              ) : null}
                              {item.status == 'started' ? null : (
                                <TouchableOpacity
                                  onPress={() => {
                                    setConfirmres(true);
                                    setSelectedResId(item.id);
                                  }}
                                  style={{
                                    width: wp(40),
                                    height: wp(13),
                                    backgroundColor: Colors.white,
                                    borderRadius: wp(3),
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: '#D63544',

                                    // marginTop: wp(4),
                                  }}>
                                  <Text
                                    style={[
                                      styles.titleText,
                                      {color: '#D63544', fontSize: 14},
                                    ]}>
                                    Cancel Res
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                  />
                )}
              </View>
            ) : (
              <View style={{marginTop: wp(3)}}>
                {CompletedRes?.length === 0 ? (
                  <View style={{marginTop: wp(60)}}>
                    {/* <Image source={item.image} resizeMode='contain' style={{ width: wp(80), height: wp(80), alignSelf: 'center' }} /> */}
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: fonts.bold,
                        color: Colors.black,
                        textAlign: 'center',
                        marginTop: wp(4),
                        marginHorizontal: wp(14),
                        lineHeight: 25,
                      }}>
                      No completed reservation found!
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={CompletedRes}
                    inverted
                    keyExtractor={item => item.id}
                    renderItem={({item}) => {
                      const pickupLat = parseFloat(item?.pickup_latitude);
                      const pickupLng = parseFloat(item?.pickup_longitude);
                      const dropoffLat = parseFloat(item?.destination_latitude);
                      const dropoffLng = parseFloat(
                        item?.destination_longitude,
                      );

                      // Calculate distance
                      const distance = haversineDistance(
                        pickupLat,
                        pickupLng,
                        dropoffLat,
                        dropoffLng,
                      );
                      return (
                        <View>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            style={[
                              styles.DriverView,
                              {paddingVertical: wp(4)},
                            ]}
                            onPress={() =>
                              navigation.navigate('ReservationAcpDetails', {
                                item,
                                distance,
                              })
                            }>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <Image
                                  source={
                                    item?.driver?.image
                                      ? {uri: item?.driver?.image}
                                      : images.avatar
                                  }
                                  resizeMode="contain"
                                  style={styles.driverimg}
                                  borderRadius={wp(5)}
                                />
                                <View style={{marginLeft: wp(2)}}>
                                  <Text style={styles.usernameText}>
                                    {item?.driver?.name}
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: 13,
                                      fontFamily: fonts.medium,
                                      color: Colors.black,
                                      lineHeight: 15,
                                    }}>
                                    Driver
                                  </Text>
                                </View>
                              </View>
                              <View>
                                <View style={{alignItems: 'center'}}>
                                  <Text
                                    style={{
                                      fontSize: 10,
                                      fontFamily: fonts.bold,
                                      color: Colors.buttoncolor,
                                      marginLeft: wp(2),
                                    }}>
                                    Offered Price
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: 18,
                                      fontFamily: fonts.bold,
                                      color: Colors.buttoncolor,
                                      marginLeft: wp(2),
                                      lineHeight: 18,
                                    }}>
                                    Rs {item?.final_price}
                                  </Text>
                                </View>
                              </View>
                            </View>
                            <View style={{marginTop: wp(4)}}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
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
                                  {item?.pickup_location}
                                </Text>
                              </View>
                              <View
                                style={{
                                  width: wp(80),
                                  height: wp(0.3),
                                  backgroundColor: Colors.grey,
                                  alignSelf: 'center',
                                  marginVertical: wp(2),
                                }}></View>

                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
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
                                  {item?.destination_location}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                  />
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Cancel Ride Modal */}
      <Modal
        transparent={true}
        visible={confirm}
        onRequestClose={closemodal}
        animationType="none">
        <View style={styles.modalTopView}>
          <View style={styles.modalsecondView}>
            <View>
              <Image
                source={images.switchtoImg}
                resizeMode="contain"
                style={{width: wp(35), height: wp(35), alignSelf: 'center'}}
              />
            </View>
            <View
              style={{
                alignSelf: 'center',
                marginHorizontal: wp(13),
                marginTop: wp(5),
              }}>
              <Text style={styles.modalText}>
                Are you sure you want to cancel this ride
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: wp(7),
                marginTop: wp(5),
              }}>
              <TouchableOpacity
                onPress={() => CancelRideApi(selectedRideId)}
                style={styles.modalbutton1}>
                <Text style={[styles.titleText, {fontSize: 14}]}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => closemodal()}
                style={styles.modalbutton2}>
                <Text
                  style={[styles.titleText, {color: '#D63544', fontSize: 14}]}>
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


           <Modal
                      transparent={true}
                      visible={confirmres}
                      onRequestClose={closemodalRes}
                      animationType="none">
                      <View style={styles.modalTopView}>
                        <View style={styles.modalsecondView}>
                          <View>
                            <Image
                              source={images.switchtoImg}
                              resizeMode="contain"
                              style={{width: wp(35), height: wp(35), alignSelf: 'center'}}
                            />
                          </View>
                          <View
                            style={{
                              alignSelf: 'center',
                              marginHorizontal: wp(13),
                              marginTop: wp(5),
                            }}>
                            <Text style={styles.modalText}>
                              Are you sure you want to cancel this Reservation?
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginHorizontal: wp(7),
                              marginTop: wp(5),
                            }}>
                            <TouchableOpacity
                              onPress={() => CancelReservationApi(selectedResId)}
                              style={styles.modalbutton1}>
                              <Text style={[styles.titleText, {fontSize: 14}]}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => setConfirmres(false)}
                              style={styles.modalbutton2}>
                              <Text
                                style={[styles.titleText, {color: '#D63544', fontSize: 14}]}>
                                No
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </Modal>
    </View>
  );
};

export default Bookings;
