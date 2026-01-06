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

const Reservation_R = ({navigation}) => {
  const user = useSelector(state => state.user.user);
  const [onchangeTab, setonChangeTab] = useState('1');
  const [refreshing, setRefreshing] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [IncomingRes, setIncomingRes] = useState([]);
  const [AcceptedRes, setAcceptedRes] = useState([]);
  const [CompletedRes, setCompletedRes] = useState([]);
  console.log('completed',CompletedRes)



  const {top, bottom} = useSafeAreaInsets();
  const onRefresh = () => {
    setRefreshing(true);
    fetchReservations();
  };

  const fetchReservations = () => {
    // setIsLoading(true);
    AllGetAPI({url: 'reservations', Token: user?.api_token})
      .then(res => {
        setIsLoading(false);
        setRefreshing(false);
        console.log('response dataaaaaaaaa reservationsssss', JSON.stringify(res));
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
    // const intervalId = setInterval(fetchReservations, 3000); 

    // return () => clearInterval(intervalId); 
  }, []);

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

    const distance = R * c;
    return distance.toFixed(2);
  };

  const calculateEstimatedTime = (distance, averageSpeed = 50) => {
    // Time = Distance / Speed
    const timeInHours = distance / averageSpeed;
    const timeInMinutes = timeInHours * 60;
    return Math.round(timeInMinutes); // Round to the nearest minute
  };

  return (
    <View
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS == 'ios' ? top : 0},
      ]}>
      {isloading && <Loader />}

      <View style={styles.HeaderView}>
        <Text style={styles.headerText}>Reservation</Text>
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
             <TouchableOpacity onPress={()=>navigation.navigate('SharedReservations_R')} style={{position: 'absolute',right:wp(4),paddingHorizontal:wp(2),paddingVertical:wp(2),borderWidth:1,borderColor:Colors.buttoncolor,borderRadius:wp(2)}}>
              <Text style={{fontSize:12,color:'black'}}>Shared Res</Text>
              </TouchableOpacity>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: wp(3),
            marginHorizontal: wp(3),
          }}>
          <TouchableOpacity onPress={() => setonChangeTab('1')}>
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
                Incoming
              </Text>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setonChangeTab('2')}>
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
          <TouchableOpacity onPress={() => setonChangeTab('3')}>
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
                data={IncomingRes}
                inverted
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
                  return (
                    <View>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.DriverView, {paddingVertical: wp(4)}]}
                        onPress={() =>
                          navigation.navigate('ReservationDetails', {
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
                                $ {item?.offered_price}
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
                data={AcceptedRes}
                inverted
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
                  return (
                    <View>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.DriverView, {paddingVertical: wp(4)}]}
                        onPress={() =>
                          navigation.navigate('ReservationDetails', {
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
                                $ {item?.final_price}
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
                  const dropoffLng = parseFloat(item?.destination_longitude);

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
                        style={[styles.DriverView, {paddingVertical: wp(4)}]}
                        onPress={() =>
                          navigation.navigate('ReservationDetails', {
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
                                $ {item?.offered_price}
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
      </ScrollView>
    </View>
  );
};

export default Reservation_R;
