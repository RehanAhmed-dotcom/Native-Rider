import {
  FlatList,
  Image,
  ImageBackground,
  Switch,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
  View,
  TextInput,
  Linking,
  Keyboard,
  KeyboardAvoidingView,
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
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import {PostAPiwithToken} from '../../../components/ApiRoot';
import {useSelector} from 'react-redux';
import Loader from '../../../components/Loader';

const ReservationDetails = ({navigation, route}) => {
  const {item, distance} = route.params;
  const user = useSelector(state => state.user.user);
  console.log('my item data', item);
  const [offeringprice, setOffeingrPrice] = useState('');
  const [selectedRideId, setSelectedRideId] = useState(null);
  const [isloading, setIsLoading] = useState(false);
  const [confirm, setConfrim] = useState(false);
  const closemodal = () => {
    setConfrim(false);
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

  const MakeOffer = () => {
    const formdata = new FormData();
    const token = user.api_token;
    formdata.append('reservation_id', item.id);
    formdata.append('offered_price', offeringprice);
    setIsLoading(true);
    PostAPiwithToken({url: 'make-offer', Token: token}, formdata)
      .then(res => {
        setIsLoading(false);

        console.log('res of accept reservation ', JSON.stringify(res));
        if (res.status == 'success') {
          Toast.show({
            type: 'success',
            text1: 'Offer Submited',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          // navigation.navigate('Payment_R')
          navigation.goBack();
        } else {
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
  const CancelRideApi = id => {
    const formdata = new FormData();
    const token = user.api_token;
    //   formdata.append('ride_id', id);
    formdata.append('reservation_id', id);
    PostAPiwithToken(
      {url: 'driver-reservation-cancelled', Token: token},
      formdata,
    )
      .then(res => {
        console.log('res of cancel ', JSON.stringify(res));
        if (res.status == 'success') {
          Toast.show({
            type: 'success',
            text1: 'Cancel Ride',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });

          navigation.goBack();
          getDriverOffers();
        } else {
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
        console.log('api error', err);
      });
  };

  const handleCallPress = () => {
    const phoneNumber = item?.rider?.phone; // e.g., "+10166299295"
    if (phoneNumber) {
      // Keep the original phone number for the tel: scheme (including + sign for international calls)
      const phoneUrl = `tel:${phoneNumber}`; // Use original phoneNumber to preserve + sign
      console.log('Attempting to open dialer with URL:', phoneUrl); // Debug log

      Linking.canOpenURL(phoneUrl)
        .then(supported => {
          console.log('Can open URL:', supported); // Debug log
          if (supported) {
            Linking.openURL(phoneUrl).catch(err => {
              console.error('Failed to open dialer:', err);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to open dialer',
                topOffset: Platform.OS === 'ios' ? 50 : 0,
                visibilityTime: 3000,
                autoHide: true,
              });
            });
          } else {
            // Fallback: Try opening without checking canOpenURL (sometimes canOpenURL is unreliable)
            Linking.openURL(phoneUrl).catch(err => {
              console.error('Fallback failed to open dialer:', err);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Dialer not supported on this device',
                topOffset: Platform.OS === 'ios' ? 50 : 0,
                visibilityTime: 3000,
                autoHide: true,
              });
            });
          }
        })
        .catch(err => {
          console.error('Error checking canOpenURL:', err);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'An error occurred while trying to make a call',
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Driver phone number not available',
        topOffset: Platform.OS === 'ios' ? 50 : 0,
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  const {top, bottom} = useSafeAreaInsets();

  // Convert item.date to a JavaScript Date object
  const rideDate = moment(item.scheduled_date, 'ddd, MMM DD').toDate();

  // Get the current date
  const currentDate = new Date();

  // Compare the dates (ignoring time)
  const isToday = rideDate.toDateString() === currentDate.toDateString();
  console.log('isToday', isToday);
  return (
    <View
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS == 'ios' ? top : 0},
      ]}>
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios'
            ? ''
            : keyboardStatus === true
            ? 'height'
            : 'undefined'
        }
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        {isloading && <Loader />}

        <View style={[styles.HeaderView]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{position: 'absolute', left: wp(4)}}
            activeOpacity={0.7}>
            <AntDesign name="left" size={20} color={'#2D3D54'} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Reservation Detail</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Conversation_R', {
                item: item?.rider,
              })
            }
            style={{position: 'absolute', right: wp(4)}}
            activeOpacity={0.7}>
            <Image
              source={images.chatIcon}
              tintColor={Colors.buttoncolor}
              resizeMode="contain"
              style={{width: wp(6), height: wp(6)}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCallPress}
            style={{position: 'absolute', right: wp(12)}}
            activeOpacity={0.7}>
            <Image
              source={images.callicon}
              resizeMode="contain"
              style={{width: wp(5), height: wp(5)}}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom:
              Platform.OS == 'ios' && keyboardStatus ? wp(50) : wp(6),
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: wp(8),
            }}>
            <Image
              source={
                item?.rider?.image ? {uri: item?.rider?.image} : images.avatar
              }
              resizeMode="cover"
              style={[
                styles.profileStyle,
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: 0.9,
                  width: wp(30),
                  height: wp(30),
                  borderRadius: wp(15),
                },
              ]}
            />
            <Text style={[styles.usernameText, {marginTop: wp(1)}]}>
              {item?.rider?.name}
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: fonts.medium,
                color: Colors.black,
                lineHeight: 15,
              }}>
              User
            </Text>
          </View>
          <View style={{marginHorizontal: wp(5), marginTop: wp(5)}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={images.locIcon}
                  resizeMode="contain"
                  style={{width: wp(5), height: wp(5), marginTop: wp(1.2)}}
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
                </View>
              </View>
              <Text style={styles.paymentStyle}>
                Price $ {item?.offered_price}
              </Text>
            </View>
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
                  justifyContent: 'center',
                }}>
                <Image
                  source={images.seatIcon}
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
                    Passengers
                  </Text>
                </View>
              </View>
              <Text style={styles.paymentStyle}>{item?.passengers}</Text>
            </View>

            <View style={[styles.inputView, {marginTop: wp(4)}]}>
              <Text style={styles.labelStyle}>Offer Price</Text>
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
                    placeholder={
                      'Enter your offer price'
                      // item.status == 'pending'
                      //   ? ` >${item.offered_price}`
                      //   : item.offered_price
                    }
                    placeholderTextColor={Colors.lightgrey}
                    keyboardType="number-pad"
                    style={[styles.inputStyle, {width: wp(63), marginLeft: 1}]}
                    autoCapitalize="none"
                    value={
                      item.driver_offered_price
                        ? item.driver_offered_price
                        : offeringprice
                    }
                    onChangeText={text => setOffeingrPrice(text)}
                    editable={!item.driver_offered_price}
                  />
                </View>
                {!item.driver_offered_price && (
                  <TouchableOpacity style={{paddingRight: wp(3)}}>
                    <AntDesign
                      name={'edit'}
                      size={20}
                      color={Colors.buttoncolor}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={{marginTop: wp(6)}}>
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
                marginTop: wp(8),
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                  }}>
                  Time
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: fonts.bold,
                    color: Colors.black,
                    lineHeight: 18,
                  }}>
                  {item.scheduled_time}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                    textAlign: 'right',
                  }}>
                  Date
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: fonts.bold,
                    color: Colors.black,
                    lineHeight: 18,
                  }}>
                  {item?.scheduled_date}
                </Text>
              </View>
            </View>
          </View>
          {item.status == 'pending' ? (
            <TouchableOpacity
              //   disabled={!offeringprice || parseInt(offeringprice) < parseInt(item?.offered_price || 0)}
              onPress={() => {
                const userPrice = parseInt(offeringprice || 0);
                const riderPrice = parseInt(item?.offered_price || 0);
                if (isNaN(userPrice) || userPrice < riderPrice) {
                  Toast.show({
                    type: 'error',
                    text1: 'Invalid Price',
                    text2: `Your offered price must be greater than ${riderPrice}`,
                    topOffset: Platform.OS === 'ios' ? 50 : 0,
                    visibilityTime: 3000,
                    autoHide: true,
                  });
                } else {
                  MakeOffer();
                }
              }}
              style={{
                width: wp(90),
                height: wp(13),
                backgroundColor:
                  //   offeringprice && parseInt(offeringprice) >= parseInt(item?.offered_price || 0)
                  //     ?
                  Colors.buttoncolor,
                // : '#cccccc',
                borderRadius: wp(3),
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: wp(15),
              }}>
              <Text
                style={[styles.titleText, {color: Colors.white, fontSize: 14}]}>
                Submit
              </Text>
            </TouchableOpacity>
          ) : item.status == 'completed' ? (
            <View
              style={{
                width: wp(90),
                height: wp(13),
                backgroundColor: '#22BB55',
                borderRadius: wp(3),
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: wp(10),
              }}>
              <Text
                style={[styles.titleText, {color: Colors.white, fontSize: 14}]}>
                Completed
              </Text>
            </View>
          ) : item.status == 'offer_made' ||
            item.status == 'request_for_payment' ? (
            <View
              style={{
                width: wp(90),
                height: wp(13),
                backgroundColor: Colors.white,
                borderColor: Colors.buttoncolor,
                borderWidth: 1,
                borderRadius: wp(3),
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: wp(6),
              }}>
              <Text
                style={[styles.titleText, {color: Colors.black, fontSize: 14}]}>
                {item.status == 'offer_made'
                  ? 'Your Offer is Pending'
                  : 'Your payment request is pending.'}
              </Text>
            </View>
          ) : (
            <View
              style={{
                alignItems: 'center',
                marginTop: wp(10),
                marginHorizontal: wp(5),
                marginBottom: wp(5),
              }}>
              {isToday ? (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('TrackReservationMap_R', {
                      item,
                      distance,
                    })
                  }
                  style={{
                    width: wp(90),
                    height: wp(13),
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
                    Track Your Ride
                  </Text>
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    width: wp(90),
                    height: wp(13),
                    backgroundColor: Colors.white,
                    borderColor: Colors.buttoncolor,
                    borderWidth: 1,
                    borderRadius: wp(3),
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: wp(3),
                  }}>
                  <Text
                    style={[
                      styles.titleText,
                      {color: Colors.black, fontSize: 14},
                    ]}>
                    Your Ride Will Continue on {item.scheduled_date}
                  </Text>
                </View>
              )}
              {item.status == 'started' ? null : (
                <TouchableOpacity
                  onPress={() => {
                    // CancelOfferApi(item.id);
                    setConfrim(true);
                  }}
                  style={{
                    width: wp(90),
                    marginTop: wp(4),
                    height: wp(13),
                    backgroundColor: Colors.white,
                    borderRadius: wp(3),
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#D63544',
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
          )}

          <Modal
            transparent={true}
            visible={confirm}
            onRequestClose={closemodal}
            animationType="none">
            <View style={styles.modalTopView}>
              <View style={styles.modalsecondView}>
                <View>
                  <Image
                    source={images.signoutImg}
                    resizeMode="contain"
                    style={{width: wp(35), height: wp(35), alignSelf: 'center'}}
                  />
                </View>
                <View
                  style={{
                    alignSelf: 'center',
                    marginHorizontal: wp(17),
                    marginTop: wp(5),
                  }}>
                  <Text style={styles.modalText}>
                    Are you sure you want to to cancel your reservation?
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
                    onPress={() => {
                      CancelRideApi(item.id), closemodal();
                    }}
                    style={styles.modalbutton1}>
                    <Text style={[styles.titleText, {fontSize: 14}]}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => closemodal()}
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
      </KeyboardAvoidingView>
    </View>
  );
};

export default ReservationDetails;
