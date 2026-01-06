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
  RefreshControl,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {images, fonts, Colors, styles} from '../../../../constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../../components/MainButton';
import Header from '../../../../components/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {useSelector} from 'react-redux';
import {AllGetAPI, PostAPiwithToken} from '../../../../components/ApiRoot';
import Toast from 'react-native-toast-message';
import Loader from '../../../../components/Loader';
const OfferRequests_R = ({navigation}) => {
  const user = useSelector(state => state.user.user);
  const [isloading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [requestData, setRequestData] = useState([]);
  console.log('resquesssdfdf', requestData);

  // const DriversData = [
  //     { id: '1', username: 'Ron Weasely', price: '450', userimage: images.chatpic1, image: images.carImg2, distance: '800m  (5mins away)', availableSeats: '3', picup: 'Philadelphia', dropoff: 'New York' },
  //     { id: '2', username: 'Hermione Granger', price: '350', userimage: images.chatpic3, image: images.carImg2, distance: '800m  (5mins away)', availableSeats: '4', picup: 'Philadelphia', dropoff: 'New York' },
  //     { id: '3', username: 'Severus Snape', price: '650', userimage: images.chatpic5, image: images.carImg2, distance: '800m  (5mins away)', availableSeats: '2', picup: 'Philadelphia', dropoff: 'New York', },
  // ];

  const fetchNewOffers = () => {
    setIsLoading(true);
    AllGetAPI({url: 'get-all-offers', Token: user?.api_token})
      .then(res => {
        setRefreshing(false);
        setIsLoading(false);
        console.log('response dataaaaaaaaa runner', JSON.stringify(res));
        if (res.status == 'success') {
          setIsLoading(false);
          setRefreshing(false);
          setRequestData(res.offers);
        }
      })
      .catch(err => {
        setIsLoading(false);
        setRefreshing(false);
        console.log('api error', err);
      });
  };

  useEffect(() => {
    fetchNewOffers();
    // const intervalId = setInterval(() => {
    //     fetchNewOffers();
    // }, 5000);
    // return () => clearInterval(intervalId);
  }, []);

  const OfferAcceptApi = id => {
    console.log('rideee', id);
    const formdata = new FormData();
    const token = user.api_token;
    formdata.append('offer_id', id);
    formdata.append('status', 'accepted');
    setIsLoading(true);

    PostAPiwithToken({url: 'handle-offer', Token: token}, formdata)
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

          fetchNewOffers();
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
    formdata.append('offer_id', id);
    formdata.append('status', 'rejected');
    setIsLoading(true);
    PostAPiwithToken({url: 'handle-offer', Token: token}, formdata)
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

          fetchNewOffers();
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
  const onRefresh = () => {
    setRefreshing(true);
    fetchNewOffers();
  };

  const {top, bottom} = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS == 'ios' ? top : 0},
      ]}>
      {isloading && <Loader />}
      <View style={styles.HeaderView}>
        <Text style={styles.headerText}>Requests</Text>
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
        {requestData?.length === 0 ? (
          <View style={{marginTop: wp(60)}}>
            {/* <Image source={item.image} resizeMode='contain' style={{ width: wp(80), height: wp(80), alignSelf: 'center' }} /> */}
            <Text
              style={{
                fontSize: 20,
                fontFamily: fonts.bold,
                color: Colors.black,
                textAlign: 'center',
                marginTop: wp(4),
              }}>
              No Request Found!
            </Text>
          </View>
        ) : (
          <View style={{marginTop: wp(3)}}>
            <FlatList
              data={requestData}
              inverted
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => {
                const pickupLat = parseFloat(item?.ride?.pickup_latitude);
                const pickupLng = parseFloat(item?.ride?.pickup_longitude);
                const dropoffLat = parseFloat(item?.ride?.destination_latitude);
                const dropoffLng = parseFloat(
                  item?.ride?.destination_longitude,
                );
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
                      style={[styles.DriverView]}
                      onPress={() =>
                        navigation.navigate('DriverDetails_R', {item, distance})
                      }>
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
                        <View>
                          {/* <Image
                                                      source={item?.user?.vehicle_image_front ? { uri: item?.user?.vehicle_image_front } : images.carImg2}
                                                        resizeMode="contain"
                                                        style={{ width: wp(25), height: wp(15) }}
                                                    /> */}
                        </View>
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
                            {distance} km
                          </Text>
                        </View>
                        <Text style={[styles.paymentStyle, {fontSize: 14}]}>
                          Offer Price $ {parseInt(item?.offer_price)}
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
                            Requested seats
                          </Text>
                        </View>
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: fonts.medium,
                            color: Colors.black,
                          }}>
                          {item?.seats_requested}
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
                            {item?.ride?.pickup_address}
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
                            {item?.ride?.destination_address}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginHorizontal: wp(2),
                          marginTop: wp(5),
                        }}>
                        <TouchableOpacity
                          onPress={() => OfferAcceptApi(item.id)}
                          style={styles.modalbutton1}>
                          <Text style={[styles.titleText, {fontSize: 14}]}>
                            Accept
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => OfferRejectApi(item.id)}
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
          </View>
        )}
      </ScrollView>
    </View>
  );
};
export default OfferRequests_R;
