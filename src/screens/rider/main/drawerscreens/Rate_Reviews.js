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
import {Rating, AirbnbRating} from 'react-native-ratings';
import moment from 'moment';

const Rate_Reviews = ({navigation}) => {
  const user = useSelector(state => state.user.user);
  const [onchangeTab, setonChangeTab] = useState('1');
  const [refreshing, setRefreshing] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [bookingFeedback, setBookingFeedback] = useState([]);
  const [tripFeedback, setTripFeedback] = useState([]);
  const [ReservationFeedback, setReservationFeedback] = useState([]);
  const [rating, setRating] = useState('');

  const {top, bottom} = useSafeAreaInsets();
  const onRefresh = () => {
    setRefreshing(true);
    fetchFeedbacks();
  };

  const fetchFeedbacks = () => {
    // setIsLoading(true);
    AllGetAPI({url: 'feedbacks', Token: user?.api_token})
      .then(res => {
        setIsLoading(false);
        setRefreshing(false);
        console.log('response dataaaaaaaaa feedbacks', JSON.stringify(res));
        if (res.status == 'success') {
          setRefreshing(false);
          setIsLoading(false);
          setBookingFeedback(res?.ride_feedbacks);
            setTripFeedback(res?.trip_feedbacks);
            setReservationFeedback(res?.reservation_feedbacks);
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
    fetchFeedbacks();
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
        <Text style={styles.headerText}>Ratings/Reviews</Text>
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
                Rides
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
                Trips
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
                Reservations
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
        {onchangeTab === '1' ? (
          <View style={{marginTop: wp(3)}}>
            {bookingFeedback?.length === 0 ? (
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
                  No Rides feedback found!
                </Text>
              </View>
            ) : (
              <FlatList
                data={bookingFeedback}
                inverted
                keyExtractor={item => item.id}
                renderItem={({item}) => {
                  return (
                    <View>
                      <View
                    
                        style={[styles.DriverView, {paddingVertical: wp(4)}]}
                       >
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
                              <View
                                style={{
                                  alignItems: 'center',
                                  flexDirection:'row',
                                  marginLeft:wp(-3),

                                }}>
                                <AirbnbRating
                                  starContainerStyle={{marginLeft: wp(2)}}
                                  count={5}
                                  defaultRating={item.rating}
                                  size={14}
                                  showRating={false} 
                                  minValue={1}
                                  isDisabled={true}
                                />
                                <Text style={{fontSize:12,fontFamily:fonts.medium,color:Colors.black,marginLeft:wp(2)}}>{moment(item.created_at).subtract(0, 'days').calendar()}</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                        <View style={{marginTop: wp(4)}}>
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
                              marginHorizontal: wp(2),
                            }}>
                            <Text
                              style={{
                                fontSize: 14,
                                fontFamily: fonts.medium,
                                color: '#8D8D8D',
                              }}>
                              {item.feedback_text}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                }}
              />
            )}
          </View>
         
        ) : onchangeTab === '2' ? (
            <View style={{marginTop: wp(3)}}>
            {tripFeedback?.length === 0 ? (
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
                  No Trip feedback found!
                </Text>
              </View>
            ) : (
              <FlatList
                data={tripFeedback}
                inverted
                keyExtractor={item => item.id}
                renderItem={({item}) => {
                  return (
                    <View>
                      <View
                    
                        style={[styles.DriverView, {paddingVertical: wp(4)}]}
                       >
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
                              <View
                                style={{
                                  alignItems: 'center',
                                  flexDirection:'row',
                                  marginLeft:wp(-3),

                                }}>
                                <AirbnbRating
                                  starContainerStyle={{marginLeft: wp(2)}}
                                  count={5}
                                  defaultRating={item.rating}
                                  size={14}
                                  showRating={false} // This hides the review labels
                                  minValue={1}
                                  isDisabled={true}
                                />
                                <Text style={{fontSize:12,fontFamily:fonts.medium,color:Colors.black,marginLeft:wp(2)}}>{moment(item.created_at).subtract(0, 'days').calendar()}</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                        <View style={{marginTop: wp(4)}}>
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
                              marginHorizontal: wp(2),
                            }}>
                            <Text
                              style={{
                                fontSize: 14,
                                fontFamily: fonts.medium,
                                color: '#8D8D8D',
                              }}>
                              {item.feedback_text}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                }}
              />
            )}
          </View>
        ) : (
            <View style={{marginTop: wp(3)}}>
            {ReservationFeedback?.length === 0 ? (
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
                  No Reservation feedback found!
                </Text>
              </View>
            ) : (
              <FlatList
                data={ReservationFeedback}
                inverted
                keyExtractor={item => item.id}
                renderItem={({item}) => {
                  return (
                    <View>
                      <View
                    
                        style={[styles.DriverView, {paddingVertical: wp(4)}]}
                       >
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
                              <View
                                style={{
                                  alignItems: 'center',
                                  flexDirection:'row',
                                  marginLeft:wp(-3),

                                }}>
                                <AirbnbRating
                                  starContainerStyle={{marginLeft: wp(2)}}
                                  count={5}
                                  defaultRating={item.rating}
                                  size={14}
                                  showRating={false} // This hides the review labels
                                  minValue={1}
                                  isDisabled={true}
                                />
                                <Text style={{fontSize:12,fontFamily:fonts.medium,color:Colors.black,marginLeft:wp(2)}}>{moment(item.created_at).subtract(0, 'days').calendar()}</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                        <View style={{marginTop: wp(4)}}>
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
                              marginHorizontal: wp(2),
                            }}>
                            <Text
                              style={{
                                fontSize: 14,
                                fontFamily: fonts.medium,
                                color: '#8D8D8D',
                              }}>
                              {item.feedback_text}
                            </Text>
                          </View>
                        </View>
                      </View>
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

export default Rate_Reviews;
