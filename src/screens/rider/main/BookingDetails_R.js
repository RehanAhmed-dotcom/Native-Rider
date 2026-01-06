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
  Linking,
} from 'react-native';
import React, {useState, useRef} from 'react';
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

const BookingDetails_R = ({navigation, route}) => {
  const {item, status, distance, estimatedTime} = route.params;
  const user = useSelector(state => state.user.user);
  console.log('userdatadfsdf', item);

  const [selectedRideId, setSelectedRideId] = useState(null);

  const [confirm, setConfrim] = useState(false);
  const closemodal = () => {
    setConfrim(false);
  };
  const [confirm2, setConfrim2] = useState(false);
  const closemodal2 = () => {
    setConfrim2(false);
  };
    const handleCallPress = () => {
      const phoneNumber = item?.user?.phone; // e.g., "+10166299295"
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

  const CancelRideApi = id => {
    const formdata = new FormData();
    const token = user.api_token;
    formdata.append('ride_id', id);

    PostAPiwithToken({url: 'cancel-ride', Token: token}, formdata)
      .then(res => {
        console.log('res of register ', JSON.stringify(res));
        closemodal();
        if (res.status == 'success') {
          Toast.show({
            type: 'success',
            text1: 'Decline Booking',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
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
        console.log('api error', err);
      });
  };

  const CompleteRideApi = id => {
    const formdata = new FormData();
    const token = user.api_token;
    formdata.append('ride_id', id);

    PostAPiwithToken({url: 'complete-ride', Token: token}, formdata)
      .then(res => {
        console.log('res of register ', JSON.stringify(res));
        closemodal();
        if (res.status == 'success') {
          Toast.show({
            type: 'success',
            text1: 'Decline Booking',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          navigation.navigate('Payment_R');
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

  const {top, bottom} = useSafeAreaInsets();

  // Convert item.date and item.time to a moment object
  const rideDateTime = moment(`${item.date} ${item.time}`, 'MM-DD-YYYY h:mm A');
  // Get the current date and time
  const currentDateTime = moment();
  // Check if the ride date and time are in the past
  const isExpired = rideDateTime.isBefore(currentDateTime);
  // Check if the ride is today (ignoring time)
  const rideDate = moment(item.date, 'MM-DD-YYYY').toDate();
  const currentDate = new Date();
  const isToday = rideDate.toDateString() === currentDate.toDateString();

  return (
    <View
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS == 'ios' ? top : 0},
      ]}>
      <View style={[styles.HeaderView]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{position: 'absolute', left: wp(4)}}
          activeOpacity={0.7}>
          <AntDesign name="left" size={20} color={'#2D3D54'} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Driver Detail</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Conversation_R', {
              item: item?.offer[0]?.driver?item?.offer[0]?.driver:item?.offer[0]?.rider,
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
      <ScrollView>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: wp(8),
          }}>
          <Image
            source={
              item?.user?.image ? {uri: item?.user?.image} : images.avatar
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
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                    lineHeight: 16,
                  }}>
                  {status == 'accept' ? `${estimatedTime} mins` : 'completed'}
                </Text>
              </View>
            </View>
            <Text style={styles.paymentStyle}>Price $ {item?.fare}</Text>
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
          <TouchableOpacity
            onPress={() => setConfrim2(true)}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: wp(4),
              borderBottomWidth: 1,
              borderColor: Colors.grey,
              paddingBottom: wp(4),
            }}>
            <View>
              <Image
                source={
                  item?.user?.vehicle_image_front
                    ? {uri: item?.user?.vehicle_image_front}
                    : images.carImg
                }
                resizeMode="contain"
                style={{width: wp(30), height: wp(25)}}
              />
            </View>
            <View>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fonts.medium,
                  color: Colors.black,
                }}>
                {user?.vehicle_make} {user?.vehicle_type}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: fonts.bold,
                  color: Colors.black,
                  lineHeight: 18,
                }}>
                {user.license_plate}
              </Text>
            </View>
            <View style={{width:wp(28)}}>
              <Text
                style={{
                  fontSize: 12,
                  color: '#414141',
                  fontFamily: fonts.medium,
                  textAlign: 'right',
            
                }} numberOfLines={5}>
                {item?.utility_options}
              </Text>
              
            </View>
          </TouchableOpacity>
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
                {item.time}
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
                {moment(item?.date, 'MM-DD-YYYY').format('ll')}
              </Text>
            </View>
          </View>
        </View>
        {status == 'accept' ? (
          <View
            style={{
              alignItems: 'center',
              marginTop: wp(10),
              marginHorizontal: wp(5),
              marginBottom: wp(5),
            }}>
            {isExpired ? (
              <View
                style={{
                  width: wp(90),
                  height: wp(13),
                  backgroundColor: Colors.grey,
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
                  Expired Booking
                </Text>
              </View>
            ) : item.status == 'request_for_payment' ? (
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
                  style={[
                    styles.titleText,
                    {color: Colors.black, fontSize: 14},
                  ]}>
                  {item.status == 'offer_made'
                    ? 'Your Offer is Pending'
                    : 'Your payment request is pending.'}
                </Text>
              </View>
            ) : isToday ? (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('TrackMap', {item, distance})
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
                    {item?.status=='started'?'Track Your Ride':'Start Your Ride'}
                </Text>
              </TouchableOpacity>
            ) : item.status == 'request_for_payment' ? (
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
                  Your payment request is pending
                </Text>
              </View>
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
                  Your Ride Will Continue on{' '}
                  {moment(item.date, 'MM-DD-YYYY').format('ll')}
                </Text>
              </View>
            )}
            {!isExpired && !item.status=='request_for_payment' &&(
              <TouchableOpacity
                onPress={() => {
                  setConfrim(true), setSelectedRideId(item.id);
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
                  style={[styles.titleText, {color: '#D63544', fontSize: 14}]}>
                  Cancel Ride
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View></View>
        )}
        {item?.status=='completed'&&(
              <View
                                style={{ width: wp(90), height: wp(13), backgroundColor: '#22BB55', borderRadius: wp(3), alignSelf: 'center', justifyContent: 'center', alignItems: 'center' ,marginTop:wp(10)}}>
                                    <Text style={[styles.titleText, { color: Colors.white, fontSize: 14 }]}>Completed</Text>
                                </View>
        )}
        
      </ScrollView>
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
                onPress={() => {
                  CancelRideApi(selectedRideId);
                }}
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
        visible={confirm2}
        onRequestClose={closemodal2}
        animationType="none">
        <View style={styles.modalTopView}>
          <View style={styles.modalsecondView}>
            <TouchableOpacity
              onPress={() => closemodal2()}
              style={{position: 'absolute', top: wp(2), right: wp(2)}}>
              <AntDesign name="close" size={20} color={Colors.black} />
            </TouchableOpacity>
            {item?.offer?.length === 0 ? (
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.bold,
                    color: Colors.black,
                    textAlign: 'center',
                    marginTop: wp(4),
                  }}>
                  No Rider Found!
                </Text>
              </View>
            ) : (
              <FlatList
                data={item?.offer}
                inverted
                keyExtractor={item => item.id}
                renderItem={({item}) => {
                  console.log('itemdata', JSON.stringify(item));
                  return (
                    <View
                      style={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginHorizontal: wp(4),
                        flexDirection: 'row',
                        marginBottom: wp(5),
                      }}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                          source={{uri: item?.rider?.image}}
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
                      <View
                        style={{
                          width: wp(7),
                          height: wp(7),
                          borderRadius: wp(4),
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth: 1,
                          borderColor: Colors.buttoncolor,
                        }}>
                        <FontAwesome6
                          name="check"
                          color={Colors.buttoncolor}
                          size={18}
                        />
                      </View>
                    </View>
                  );
                }}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BookingDetails_R;
