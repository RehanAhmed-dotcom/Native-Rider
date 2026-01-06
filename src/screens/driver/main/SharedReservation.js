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
  Modal,
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
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {AllGetAPI, PostAPiwithToken} from '../../../components/ApiRoot';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import Loader from '../../../components/Loader';

const SharedReservation = ({navigation}) => {
  const user = useSelector(state => state.user.user);

  const [isloading, setIsLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const closemodal = () => {
    setConfirm(false);
  };
  const [selectedRideId, setSelectedRideId] = useState(null);
  const [ReservationData, setReservationData] = useState([]);
  const [PendingArray, setPendingArray] = useState([]);
  const [AcceptedArray, setAcceptedArray] = useState([]);
  console.log('AcceptedArray',PendingArray)
  const [offerArray, setOfferArray] = useState([]);

  const [onchangeTab, setOnChangeTab] = useState('1');

  const fetchSharedReservations = () => {
    setIsLoading(true);
    AllGetAPI({url: 'reservations-shared', Token: user?.api_token})
      .then(res => {
        setIsLoading(false);
        console.log('response dataaaaaaaaa resssssf', JSON.stringify(res));
        if (res.status == 'success') {
          const acceptedArray = res.reservations.filter(
            item =>
              item.my_status === 'accepted' ||
              item.my_status === 'paid' ||
              item.my_status === 'confirmed' ||
              item.status === 'started' ||
              item.status === 'completed',
          );
          const pendingArray = res.reservations.filter(
            item => item.my_status === 'pending' && item.status != 'cancelled',
          );
          const cancelledArray = res.reservations.filter(
            item => item.status === 'accepted',
          );
          const offerArray = res.reservations.filter(
            item => item.my_status === 'driver_offered',
          );
          setPendingArray(pendingArray);
          setAcceptedArray(acceptedArray);
          setOfferArray(offerArray);
          console.log('pendingArray', pendingArray);
          // console.log('pendingArray', pendingArray);
          console.log('cancelledArray', offerArray);
          setIsLoading(false);
          // setReservationData(res.reservations)
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('api error', err);
      });
  };
  useEffect(() => {
    fetchSharedReservations();
  }, []);

  const OfferAcceptApi = id => {
    console.log('rideee', id);
    const formdata = new FormData();
    const token = user.api_token;
    formdata.append('participant_id', id);
    formdata.append('status', 'accepted');
    setIsLoading(true);
    PostAPiwithToken({url: 'respond-to-driver-offer', Token: token}, formdata)
      .then(res => {
        setIsLoading(false);
        console.log('res of handle offer ', JSON.stringify(res));
        if (res.status == 'success') {
          setIsLoading(false);
          Toast.show({
            type: 'success',
            text1: 'Offer Accepted',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });

          fetchSharedReservations();
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
  const OfferRejectApi = id => {
    console.log('rideee', id);
    const formdata = new FormData();
    const token = user.api_token;
    formdata.append('participant_id', id);
    formdata.append('status', 'rejected');
    setIsLoading(true);
    PostAPiwithToken({url: 'bid-shared-reservation', Token: token}, formdata)
      .then(res => {
        setIsLoading(false);
        console.log('res of register ', JSON.stringify(res));
        if (res.status == 'success') {
          setIsLoading(false);
          Toast.show({
            type: 'success',
            text1: 'Offer Decline',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });

          fetchSharedReservations();
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

  const CancelReservationApi = id => {
    const formdata = new FormData();
    const token = user.api_token;
    formdata.append('reservation_id', id);
    setIsLoading(true);
    PostAPiwithToken({url: 'cancel-reservation', Token: token}, formdata)
      .then(res => {
        setIsLoading(false);
        console.log('res of Cancel reservation ', JSON.stringify(res));
        closemodal();
        if (res.status === 'success') {
          setIsLoading(false);
          Toast.show({
            type: 'success',
            text1: 'Decline Reservation',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          //   fetchbookings();
          fetchSharedReservations();
          //   navigation.goBack();
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

  const {top, bottom} = useSafeAreaInsets();


  return (
    <View
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS == 'ios' ? top : 0},
      ]}>
      {isloading && <Loader />}

      <Header head="Shared Reservations" onPress={() => navigation.goBack()} />
      <ScrollView>
        {/* {Driverdata?.length === 0 ? (
                    <View style={{ marginTop: wp(60) }}>
                        <Text
                            style={{
                                fontSize: 20,
                                fontFamily: fonts.bold,
                                color: Colors.black,
                                textAlign: 'center',
                                marginTop: wp(4),
                            }}>
                            No Drivers Found!
                        </Text>
                    </View>
                ) : ( */}
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
              tintColor={onchangeTab == '1' ? Colors.buttoncolor : '#C6DEFB'}
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
                  color: onchangeTab == '1' ? Colors.white : Colors.buttoncolor,
                }}>
                Available
              </Text>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setOnChangeTab('2')}>
            <ImageBackground
              source={images.acceptImg}
              resizeMode="contain"
              tintColor={onchangeTab == '2' ? Colors.buttoncolor : '#C6DEFB'}
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
                  color: onchangeTab == '2' ? Colors.white : Colors.buttoncolor,
                }}>
                Accepted
              </Text>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setOnChangeTab('3')}>
            <ImageBackground
              source={images.completeImg}
              resizeMode="contain"
              tintColor={onchangeTab == '3' ? Colors.buttoncolor : '#C6DEFB'}
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
                  color: onchangeTab == '3' ? Colors.white : Colors.buttoncolor,
                }}>
                Offers
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
        {onchangeTab === '1' ? (
          <View style={{marginTop: wp(3)}}>
              {PendingArray?.length === 0 ? (
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
                                  No Pending reservation Found!
                                </Text>
                              </View>
                            ) : (
            <FlatList
              data={[...PendingArray]
                .filter(item => {
                  const itemDate = new Date(item.created_at);
                  const today = new Date();
                  return (
                    itemDate.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0)
                  );
                })
                .sort(
                  (a, b) => new Date(b.created_at) - new Date(a.created_at),
                )}
              keyExtractor={item => item.id}
              renderItem={({item}) => {
                return (
                  <View>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[styles.DriverView]}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
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
                        <View></View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <View></View>
                        <Text style={styles.paymentStyle}>
                          Price $
                          {item.final_price
                            ? item.final_price
                            : item.offered_price}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Image
                            source={images.seatIcon}
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
                            {' '}
                            Available seats
                          </Text>
                        </View>
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: fonts.medium,
                            color: Colors.black,
                          }}>
                          {item?.passengers}
                        </Text>
                      </View>
                      <View style={{marginTop: wp(2)}}>
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
                            {item.pickup_location}
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
                            {item.destination_location}
                          </Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('SharedResRequest', {item})
                        }
                        activeOpacity={0.7}
                        style={{
                          width: wp(80),
                          height: wp(13),
                          backgroundColor: Colors.buttoncolor,
                          borderRadius: wp(3),
                          alignSelf: 'center',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: wp(4),
                        }}>
                        <Text style={styles.titleText}>
                          Request For Reservation
                        </Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
        )}
          </View>
        ) : onchangeTab === '2' ? (
          <View style={{marginTop: wp(3)}}>
              {AcceptedArray?.length === 0 ? (
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
                                  No Accepted reservation Found!
                                </Text>
                              </View>
                            ) : (
            <FlatList
              data={[...AcceptedArray].sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at),
              )}
              keyExtractor={item => item.id}
              renderItem={({item}) => {
                const pickupLat = parseFloat(item?.pickup_latitude);
                const pickupLng = parseFloat(item?.pickup_longitude);
                const dropoffLat = parseFloat(item?.destination_latitude);
                const dropoffLng = parseFloat(item?.destination_longitude);

                // Calculate distance
                const distance = haversineDistance(
                  pickupLat,
                  pickupLng,
                  dropoffLat,
                  dropoffLng,
                );
                console.log('my distance', distance);
                return (
                  <View>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[styles.DriverView]}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
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
                        <View></View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <View></View>
                        <Text style={styles.paymentStyle}>
                          Price $
                          {item.driver_offer
                            ? item.driver_offer
                            : item.final_price}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Image
                            source={images.seatIcon}
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
                            {' '}
                            Available seats
                          </Text>
                        </View>
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: fonts.medium,
                            color: Colors.black,
                          }}>
                          {item?.passengers}
                        </Text>
                      </View>
                      <View style={{marginTop: wp(2)}}>
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
                            {item.pickup_location}
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
                            {item.destination_location}
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
                              Track Reservation
                            </Text>
                          </TouchableOpacity>
                        ) : item?.my_status == 'accepted' ? (
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
                              {item?.my_status === 'accepted'
                                ? 'Pay Now'
                                : null}
                            </Text>
                          </TouchableOpacity>
                        ) : item?.my_status == 'paid' ? (
                          <TouchableOpacity
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
                          </TouchableOpacity>
                        ) : null}
                        {item.status == 'completed' ? (
                          <View
                            style={{
                              width: wp(80),
                              height: wp(12),
                              backgroundColor: '#22BB55',
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
                              Completed
                            </Text>
                          </View>
                        ) : item.status == 'started' ? null : (
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
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
                            )}
          </View>
        ) : onchangeTab === '3' ? (
          <View style={{marginTop: wp(3)}}>
             {offerArray?.length === 0 ? (
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
                                  No Reservation Offers Found!
                                </Text>
                              </View>
                            ) : (
            <FlatList
              data={[...offerArray].sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at),
              )}
              keyExtractor={item => item.id}
              renderItem={({item}) => {
                return (
                  <View>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[styles.DriverView]}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
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
                        <View></View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <View></View>
                        <Text style={styles.paymentStyle}>
                          Price $
                          {item.driver_offer
                            ? item.driver_offer
                            : item.final_price}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Image
                            source={images.seatIcon}
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
                            {' '}
                            Available seats
                          </Text>
                        </View>
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: fonts.medium,
                            color: Colors.black,
                          }}>
                          {item?.passengers}
                        </Text>
                      </View>
                      <View style={{marginTop: wp(2)}}>
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
                            {item.pickup_location}
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
                            {item.destination_location}
                          </Text>
                        </View>
                      </View>

                      {/* <View
                     
                        style={{
                          width: wp(80),
                          height: wp(13),
                          backgroundColor: '#D63544',
                          borderRadius: wp(3),
                          alignSelf: 'center',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: wp(4),
                        }}>
                        <Text style={styles.titleText}>
                        Cancelled Reservation
                        </Text>
                      </View> */}
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginHorizontal: wp(2),
                          marginTop: wp(5),
                        }}>
                        <TouchableOpacity
                          onPress={() => OfferAcceptApi(item?.offer_id)}
                          // onPress={()=>navigation.navigate('SharedResDetails_R',{item,distance:3434})}

                          style={styles.modalbutton1}>
                          <Text style={[styles.titleText, {fontSize: 14}]}>
                            Accept
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          //   onPress={() => OfferRejectApi(item.id)}
                          style={styles.modalbutton2}>
                          <Text
                            style={[
                              styles.titleText,
                              {color: '#D63544', fontSize: 14},
                            ]}>
                            Decline
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
                            )}
          </View>
        ) : null}
        {/* )} */}

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
                  onPress={() => CancelReservationApi(selectedRideId)}
                  style={styles.modalbutton1}>
                  <Text style={[styles.titleText, {fontSize: 14}]}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setConfirm(false)}
                  style={styles.modalbutton2}>
                  <Text
                    style={[
                      styles.titleText,
                      {color: '#D63544', fontSize: 14},
                    ]}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

export default SharedReservation;
