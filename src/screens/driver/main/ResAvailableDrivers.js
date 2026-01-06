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
import {PostAPiwithToken} from '../../../components/ApiRoot';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import Loader from '../../../components/Loader';

const ResAvailableDrivers = ({navigation, route}) => {
  const {myresdata} = route.params;
  console.log('my response data', myresdata);
  const user = useSelector(state => state.user.user);
  const [isloading, setIsLoading] = useState(false);
  const [myOffers, setMyOffers] = useState([]);

  const getDriverOffers = () => {
    const formdata = new FormData();
    const token = user.api_token;

    formdata.append('reservation_id', myresdata?.id);

    // setIsLoading(true);
    PostAPiwithToken({url: 'offers-by-reservation', Token: token}, formdata)
      .then(res => {
        setIsLoading(false);
        console.log('res of offerssss ', JSON.stringify(res));
        if (res.status == 'success') {
          setIsLoading(false);
          setMyOffers(res.offers);
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
  useEffect(() => {
    getDriverOffers(true);

    const intervalId = setInterval(() => {
      getDriverOffers();
    }, 3000);

    return () => clearInterval(intervalId);
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

  const CancelOfferApi = id => {
    const formdata = new FormData();
    const token = user.api_token;
    //   formdata.append('ride_id', id);
    formdata.append('reservation_id', id);

    PostAPiwithToken(
      {url: 'offer-reservation-cancelled', Token: token},
      formdata,
    )
      .then(res => {
        console.log('res of cancel ', JSON.stringify(res));
        if (res.status == 'success') {
          Toast.show({
            type: 'success',
            text1: 'Cancel Offer',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          //   navigation.goBack()
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

  const AcceptOfferApi = id => {
    const formdata = new FormData();
    const token = user.api_token;
    formdata.append('reservation_id', id);

    PostAPiwithToken({url: 'accept-offer', Token: token}, formdata)
      .then(res => {
        console.log('res of accept offer ', JSON.stringify(res));
        if (res.status == 'success') {
          Toast.show({
            type: 'success',
            text1: 'Accept Offer',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          getDriverOffers();
          //   navigation.navigate('Payment_R')
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
  const {top} = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS == 'ios' ? top : 0},
      ]}>
      {isloading && <Loader />}

      <Header
        head="Available Drivers"
        onPress={() => navigation.navigate('Drawer')}
      />
      <ScrollView>
        <View style={{marginTop: wp(3)}}>
          {myOffers?.length === 0 ? (
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
                No driver offers found!
              </Text>
            </View>
          ) : (
            <FlatList
              data={myOffers}
              inverted
              keyExtractor={item => item.id}
              renderItem={({item}) => {
                const pickupLat = parseFloat(myresdata?.pickup_latitude);
                const pickupLng = parseFloat(myresdata?.pickup_longitude);
                const dropoffLat = parseFloat(myresdata?.destination_latitude);
                const dropoffLng = parseFloat(myresdata?.destination_longitude);

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
                        navigation.navigate('OfferDriverDetail', {
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
                              $ {item?.driver_offered_price}
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
                          marginTop: wp(4),
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <TouchableOpacity
                          onPress={() => AcceptOfferApi(item?.id)}
                          style={{
                            width: wp(35),
                            height: wp(12),
                            backgroundColor: Colors.buttoncolor,
                            borderRadius: wp(2),
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text style={styles.titleText}>Accept Offer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => CancelOfferApi(item.id)}
                          style={{
                            width: wp(35),
                            height: wp(12),
                            borderWidth: 1,
                            borderColor: '#FB5B58',
                            borderRadius: wp(2),
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text style={[styles.titleText, {color: '#FB5B58'}]}>
                            Cancel Offer
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
      </ScrollView>
    </View>
  );
};

export default ResAvailableDrivers;
