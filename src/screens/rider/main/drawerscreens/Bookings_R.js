import { FlatList, Image, ImageBackground, Modal, Platform, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { images, fonts, Colors, styles } from '../../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import MainButton from '../../../../components/MainButton'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { AllGetAPI, PostAPiwithToken } from '../../../../components/ApiRoot'
import { useSelector } from 'react-redux'
import Toast from 'react-native-toast-message'
import Loader from '../../../../components/Loader'
import moment from 'moment'

const Bookings_R = ({ navigation }) => {
  const user = useSelector(state => state.user.user)
  const [pendingBooking, setPendingBooking] = useState([])
  const [completeBooking, setCompleteBooking] = useState([])
  const [selectedRideId, setSelectedRideId] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [isloading, setIsLoading] = useState(false)

  console.log('pending booking', JSON.stringify(pendingBooking))

  const [confirm, setConfrim] = useState(false)
  const closemodal = () => {
    setConfrim(false)
  }
  const [onchangeTab, setonChangeTab] = useState('1')
  const DriversData = [
    { id: '1', username: 'Ron Weasely', price: '450', userimage: images.chatpic1, image: images.carImg2, distance: '800m', availableSeats: '3', picup: 'Philadelphia', dropoff: 'New York', status: 'Pending' },
    { id: '2', username: 'Hermione Granger', price: '450', userimage: images.chatpic3, image: images.carImg2, distance: '800m', availableSeats: '4', picup: 'Philadelphia', dropoff: 'New York', status: 'Accepted' },
    { id: '3', username: 'Severus Snape', price: '450', userimage: images.chatpic5, image: images.carImg2, distance: '800m', availableSeats: '2', picup: 'Philadelphia', dropoff: 'New York', status: 'Pending' },
  ]
  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await AllGetAPI({
        url: 'rides-details-rider',
        Token: user?.api_token,
      });
      setRefreshing(false);
      setIsLoading(false);
      if (res.status === 'success') {
        setPendingBooking(res?.rides?.pending || []);
        setCompleteBooking(res?.rides?.completed || []);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.message,
          topOffset: Platform.OS === 'ios' ? 50 : 0,
          visibilityTime: 3000,
          autoHide: true,
        });
      }
    } catch (err) {
      console.error('API error:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch bookings',
        topOffset: Platform.OS === 'ios' ? 50 : 0,
        visibilityTime: 3000,
        autoHide: true,
      });
      setRefreshing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(); 
    // const intervalId = setInterval(fetchBookings, 4000); 

    // return () => clearInterval(intervalId); 
  }, []);

  const CancelRideApi = (id) => {
    const formdata = new FormData()
    const token = user.api_token
    formdata.append('ride_id', id)

    PostAPiwithToken({ url: 'cancel-ride', Token: token }, formdata)
      .then(res => {
        console.log('res of register ', JSON.stringify(res))
        closemodal()
        if (res.status == 'success') {
          Toast.show({
            type: 'success',
            text1: 'Decline Booking',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          })
          fetchBookings()
        } else {
          Toast.show({
            type: 'error',
            text1: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          })
        }
      })
      .catch(err => {
        console.log('api error', err)
      })
  }

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degrees) => degrees * (Math.PI / 180)
    const R = 6371 // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1)
    const dLon = toRadians(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c
    return distance.toFixed(2)
  }

  const calculateEstimatedTime = (distance, averageSpeed = 50) => {
    const timeInHours = distance / averageSpeed
    const timeInMinutes = timeInHours * 60
    return Math.round(timeInMinutes)
  }

  const { top, bottom } = useSafeAreaInsets()
  const onRefresh = () => {
    setRefreshing(true)
    fetchBookings()
  }

  return (
    <View style={[styles.mainContainer, { paddingTop: Platform.OS == 'ios' ? top : 0 }]}>
      {isloading && <Loader />}
      <View style={styles.HeaderView}>
        <Text style={styles.headerText}>Bookings</Text>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{ position: 'absolute', left: wp(4) }}
          activeOpacity={0.7}
        >
          <Image source={images.menuIcon} resizeMode='contain' style={{ width: wp(6), height: wp(6) }} />
        </TouchableOpacity>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: wp(3), marginHorizontal: wp(3) }}>
          <TouchableOpacity onPress={() => setonChangeTab('1')}>
            <ImageBackground
              source={images.viewfill}
              resizeMode='contain'
              tintColor={onchangeTab == '1' ? Colors.buttoncolor : '#C6DEFB'}
              style={{ justifyContent: 'center', alignItems: 'center', width: wp(47), height: wp(12) }}
            >
              <Text style={{ fontSize: 14, fontFamily: fonts.bold, color: onchangeTab == '1' ? Colors.white : Colors.buttoncolor }}>
                In Progress
              </Text>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setonChangeTab('2')}>
          <ImageBackground source={images.viewunfill} resizeMode='contain' tintColor={onchangeTab == '2' ? Colors.buttoncolor : '#C6DEFB'} style={{ justifyContent: 'center', alignItems: 'center', width: wp(47), height: wp(12) }}>
              <Text style={{ fontSize: 14, fontFamily: fonts.bold, color: onchangeTab == '2' ? Colors.white : Colors.buttoncolor }}>
                Completed
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
        {onchangeTab == '1' ? (
          <View style={{ marginTop: wp(3) }}>
            {pendingBooking?.length === 0 ? (
              <View style={{ marginTop: wp(60) }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: fonts.bold,
                    color: Colors.black,
                    textAlign: 'center',
                    marginTop: wp(4),
                    marginHorizontal: wp(14),
                    lineHeight: 25,
                  }}
                >
                  No In Progress Bookings Found!
                </Text>
              </View>
            ) : (
              <FlatList
                data={pendingBooking}
                inverted
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const pickupLat = parseFloat(item?.pickup_latitude)
                  const pickupLng = parseFloat(item?.pickup_longitude)
                  const dropoffLat = parseFloat(item?.destination_latitude)
                  const dropoffLng = parseFloat(item?.destination_longitude)
                  const distance = haversineDistance(pickupLat, pickupLng, dropoffLat, dropoffLng)
                  const estimatedTime = calculateEstimatedTime(distance)
                  // Check if the ride is expired
                  const rideDateTime = moment(`${item.date} ${item.time}`, 'MM-DD-YYYY h:mm A')
                  const currentDateTime = moment()
                  const isExpired = rideDateTime.isBefore(currentDateTime)
 const rideDate = moment(item.date, 'MM-DD-YYYY').toDate();
  const currentDate = new Date();
  const isToday = rideDate.toDateString() === currentDate.toDateString();
                  return (
                    <View>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.DriverView, { paddingVertical: wp(4) }]}
                        onPress={() => navigation.navigate('BookingDetails_R', { item, status: 'accept', distance, estimatedTime })}
                      >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                              source={item?.user?.image ? { uri: item?.user?.image } : images.avatar}
                              resizeMode='contain'
                              style={styles.driverimg}
                              borderRadius={wp(5)}
                            />
                            <View style={{ marginLeft: wp(2) }}>
                              <Text style={styles.usernameText}>{item?.user?.name}</Text>
                              <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, lineHeight: 15 }}>
                                Driver
                              </Text>
                            </View>
                          </View>
                          <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Image source={images.locIcon} resizeMode='contain' style={{ width: wp(5), height: wp(5) }} />
                              <View style={{ marginLeft: wp(2) }}>
                                <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black }}>{distance}km</Text>
                                <Text style={{ fontSize: 11, fontFamily: fonts.medium, color: Colors.black, lineHeight: 16 }}>
                                  ({estimatedTime} mins)
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                        <View style={{ marginTop: wp(4) }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={images.pickupIcon} resizeMode='contain' style={{ width: wp(5), height: wp(5) }} />
                              <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, marginLeft: wp(2) }}>
                                From
                              </Text>
                            </View>
                            <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>{item?.pickup_address}</Text>
                          </View>
                          <View style={{ width: wp(80), height: wp(0.3), backgroundColor: Colors.grey, alignSelf: 'center', marginVertical: wp(2) }} />
                          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                              <Image source={images.dropoffIcon} resizeMode='contain' style={{ width: wp(4.5), height: wp(4.5) }} />
                              <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, marginLeft: wp(2) }}>
                                To
                              </Text>
                            </View>
                            <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>{item?.destination_address}</Text>
                          </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: wp(5) }}>
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
                              }}
                            >
                              <Text style={[styles.titleText, { color: Colors.white, fontSize: 14 }]}>Expired Booking</Text>
                            </View>
                          ) : 
                           isToday&&item.status=='open' ? (
                            <>
                                        <TouchableOpacity
                                          onPress={() =>
                                            navigation.navigate('TrackMap', {item, distance})
                                          }
                                          style={{
                                            width: wp(40),
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
                                        <TouchableOpacity
                                        onPress={() => {
                                          setConfrim(true)
                                          setSelectedRideId(item.id)
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
                                        }}
                                      >
                                        <Text style={[styles.titleText, { color: '#D63544', fontSize: 14 }]}>Cancel Ride</Text>
                                      </TouchableOpacity>
                                      </>
                                      ) : item.status=='request_for_payment' ?
                          <View
                                         style={{
                                           width: wp(80),
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
                          :  item.status == 'started' ?(
                            <TouchableOpacity
                            onPress={() => navigation.navigate('TrackMap', {item})}
                              style={{
                                width: wp(80),
                                height: wp(12),
                                backgroundColor: Colors.buttoncolor,
                                borderRadius: wp(3),
                                alignSelf: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginLeft:wp(2)
                                
                              }}>
                              <Text
                                style={[
                                  styles.titleText,
                                  {color: Colors.white, fontSize: 14},
                                ]}>
                               Track Ride
                              </Text>
                            </TouchableOpacity>
                          ): (
                            <TouchableOpacity
                              onPress={() => {
                                setConfrim(true)
                                setSelectedRideId(item.id)
                              }}
                              style={{
                                width: wp(80),
                                height: wp(13),
                                backgroundColor: Colors.white,
                                borderRadius: wp(3),
                                alignSelf: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: '#D63544',
                                marginTop: wp(4),
                              }}
                            >
                              <Text style={[styles.titleText, { color: '#D63544', fontSize: 14 }]}>Cancel Ride</Text>
                            </TouchableOpacity>
                          )}
                         
                        </View>
                      </TouchableOpacity>
                    </View>
                  )
                }}
              />
            )}
          </View>
        ) : (
          <View style={{ marginTop: wp(3) }}>
            {completeBooking?.length === 0 ? (
              <View style={{ marginTop: wp(60) }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: fonts.bold,
                    color: Colors.black,
                    textAlign: 'center',
                    marginTop: wp(4),
                    marginHorizontal: wp(14),
                    lineHeight: 25,
                  }}
                >
                  No Completed Bookings Found!
                </Text>
              </View>
            ) : (
              <FlatList
                data={completeBooking}
                inverted
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const pickupLat = parseFloat(item?.pickup_latitude)
                  const pickupLng = parseFloat(item?.pickup_longitude)
                  const dropoffLat = parseFloat(item?.destination_latitude)
                  const dropoffLng = parseFloat(item?.destination_longitude)
                  const distance = haversineDistance(pickupLat, pickupLng, dropoffLat, dropoffLng)
                  return (
                    <View>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.DriverView, { paddingVertical: wp(4) }]}
                        onPress={() => navigation.navigate('BookingDetails_R', { item, status: 'completed', distance })}
                      >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                              source={item?.user?.image ? { uri: item?.user?.image } : images.avatar}
                              resizeMode='contain'
                              style={styles.driverimg}
                              borderRadius={wp(5)}
                            />
                            <View style={{ marginLeft: wp(2) }}>
                              <Text style={styles.usernameText}>{item?.user?.name}</Text>
                              <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, lineHeight: 15 }}>
                                Rider
                              </Text>
                            </View>
                          </View>
                          <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Image source={images.locIcon} resizeMode='contain' style={{ width: wp(5), height: wp(5) }} />
                              <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, marginLeft: wp(2) }}>
                                {distance}km
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={{ marginTop: wp(4) }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                              <Image source={images.pickupIcon} resizeMode='contain' style={{ width: wp(5), height: wp(5) }} />
                              <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, marginLeft: wp(2) }}>
                                From
                              </Text>
                            </View>
                            <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>{item?.pickup_address}</Text>
                          </View>
                          <View style={{ width: wp(80), height: wp(0.3), backgroundColor: Colors.grey, alignSelf: 'center', marginVertical: wp(2) }} />
                          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                              <Image source={images.dropoffIcon} resizeMode='contain' style={{ width: wp(4.5), height: wp(4.5) }} />
                              <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, marginLeft: wp(2) }}>
                                To
                              </Text>
                            </View>
                            <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>{item?.destination_address}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )
                }}
              />
            )}
          </View>
        )}
      </ScrollView>
      <Modal
        transparent={true}
        visible={confirm}
        onRequestClose={closemodal}
        animationType="none"
      >
        <View style={styles.modalTopView}>
          <View style={styles.modalsecondView}>
            <View>
              <Image source={images.switchtoImg} resizeMode='contain' style={{ width: wp(35), height: wp(35), alignSelf: 'center' }} />
            </View>
            <View style={{ alignSelf: 'center', marginHorizontal: wp(13), marginTop: wp(5) }}>
              <Text style={styles.modalText}>Are you sure you want to cancel this ride</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: wp(7), marginTop: wp(5) }}>
              <TouchableOpacity
                onPress={() => {
                  CancelRideApi(selectedRideId)
                }}
                style={styles.modalbutton1}
              >
                <Text style={[styles.titleText, { fontSize: 14 }]}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => closemodal()} style={styles.modalbutton2}>
                <Text style={[styles.titleText, { color: '#D63544', fontSize: 14 }]}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default Bookings_R