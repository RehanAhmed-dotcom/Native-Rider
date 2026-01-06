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

const SearchDrivers = ({navigation, route}) => {
  const {driverName} = route.params;
  console.log('my driverrrrrrrrrrrrrr', JSON.stringify(driverName));

  const DriversData = [
    {
      id: '1',
      username: 'Ron Weasely',
      price: '450',
      userimage: images.chatpic1,
      image: images.carImg2,
      distance: '800m  (5mins away)',
      availableSeats: '3',
      picup: 'Philadelphia',
      dropoff: 'New York',
    },
    {
      id: '2',
      username: 'Hermione Granger',
      price: '450',
      userimage: images.chatpic3,
      image: images.carImg2,
      distance: '800m  (5mins away)',
      availableSeats: '4',
      picup: 'Philadelphia',
      dropoff: 'New York',
    },
    {
      id: '3',
      username: 'Severus Snape',
      price: '450',
      userimage: images.chatpic5,
      image: images.carImg2,
      distance: '800m  (5mins away)',
      availableSeats: '2',
      picup: 'Philadelphia',
      dropoff: 'New York',
    },
  ];
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
  return (
    <View
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS == 'ios' ? top : 0},
      ]}>
      <Header head={driverName?.name} onPress={() => navigation.goBack()} />
      <ScrollView>
        <View style={{marginTop: wp(3)}}>
          {driverName.rides?.length === 0 ? (
            <View style={{marginTop: wp(30)}}>
              <Image
                source={images.norides}
                resizeMode="contain"
                style={{width: wp(70), height: wp(70), alignSelf: 'center'}}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: fonts.bold,
                  color: Colors.black,
                  textAlign: 'center',
                  // marginTop: wp(4),
                  marginHorizontal: wp(14),
                  lineHeight: 18,
                }}>
                No data found here...
              </Text>
              {/* <View>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fonts.medium,
                  color: Colors.black,
                  textAlign: 'center',
                  marginHorizontal: wp(15),
                  lineHeight: 18,
                  marginTop: wp(4),
                }}>
                If no driver is available then you can reserve a ride in the
                reservation section.{' '}
                <TouchableOpacity style={{}}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: fonts.medium, 
                      color: Colors.buttoncolor,
                    }}>
                    Click Here
                  </Text>
                </TouchableOpacity>
              </Text>
              </View> */}
            </View>
          ) : (
            <FlatList
              data={driverName?.rides}
              keyExtractor={item => item.id}
              inverted
              renderItem={({item}) => {
                console.log('item', item);
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
                const estimatedTime = calculateEstimatedTime(distance);

                return (
                  <View>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[styles.DriverView]}
                      onPress={() =>
                        navigation.navigate('RiderDetails', {
                          item,
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
                          style={{flexDirection: 'row', alignItems: 'center'}}>
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
                          <Image
                            source={
                              item?.driver?.vehicle_image_front
                                ? {uri: item?.driver?.vehicle_image_front}
                                : images.carImg2
                            }
                            resizeMode="contain"
                            style={{width: wp(25), height: wp(15)}}
                          />
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
                            {distance}km
                          </Text>
                          <Text
                            style={{
                              fontSize: 11,
                              fontFamily: fonts.medium,
                              color: Colors.black,
                              lineHeight: 16,
                            }}>
                            {' '}
                            ({estimatedTime} mins)
                          </Text>
                        </View>
                        <Text style={styles.paymentStyle}>
                          Price ${item.fare}
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
                          {item?.available_seats}
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
                        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(3) }}>
                                                            <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>{item.dropoff}</Text>
                                                            <Image source={images.dropoffIcon} resizeMode='contain' style={{ width: wp(5), height: wp(5) }} />
                                                        </View> */}
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
                      {/* navigation.navigate('Requesting', { typenew: 'notFriend' }) */}

                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('Requesting', {
                            typenew: 'notFriend',
                            item,
                          })
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
                          Request For Booking
                        </Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          )}
        </View>
        {/* <View style={{ marginTop: wp(3) }}>
                  <FlatList
                      data={DriversData}
                      keyExtractor={(item) => item.id}
                      inverted
                      renderItem={({ item }) => {
                          return (
                              <View>
                                  <TouchableOpacity activeOpacity={0.8} style={[styles.DriverView]} onPress={() => navigation.navigate('RiderDetails', { item })}>
                                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                              <Image source={item.userimage} resizeMode='contain' style={styles.driverimg} borderRadius={wp(5)} />
                                              <View style={{ marginLeft: wp(2) }}>
                                                  <Text style={styles.usernameText}>{item.username}</Text>
                                                  <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, lineHeight: 15 }}>Rider</Text>
                                              </View>
                                          </View>
                                          <View>
                                              <Image
                                                  source={item.image}
                                                  resizeMode="contain"
                                                  style={{ width: wp(25), height: wp(15) }}
                                              />
                                          </View>
                                      </View>
                                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                              <Image source={images.locIcon} resizeMode='contain' style={{ width: wp(5), height: wp(5) }} />
                                              <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, marginLeft: wp(2) }}>{item.distance}</Text>
                                          </View>
                                          <Text style={styles.paymentStyle}>Rs {item.price}</Text>
                                      </View>
                                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                              <Image source={images.seatIcon} resizeMode='contain' style={{ width: wp(5), height: wp(5) }} />
                                              <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, marginLeft: wp(2) }}> Available seats</Text>
                                          </View>
                                          <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>{item.availableSeats}</Text>

                                      </View>
                                      <View style={{ marginTop: wp(2), }}>
                                          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                                              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                  <Image source={images.pickupIcon} resizeMode='contain' style={{ width: wp(5), height: wp(5) }} />
                                                  <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, marginLeft: wp(2) }}>From</Text>
                                              </View>
                                              <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>{item.picup}</Text>
                                          </View>
                                          <View style={{ width: wp(80), height: wp(0.3), backgroundColor: Colors.grey, alignSelf: 'center', marginVertical: wp(2) }}></View>
                                         
                                          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                                              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                              <Image source={images.dropoffIcon} resizeMode='contain' style={{ width: wp(4.5), height: wp(4.5) }} />

                                                  <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, marginLeft: wp(2) }}>To</Text>
                                              </View>
                                              <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>{item.dropoff}</Text>
                                          </View>
                                      </View>
                                      <TouchableOpacity onPress={() => navigation.navigate('Requesting', { typenew: 'notFriend' })} activeOpacity={0.7} style={{ width: wp(80), height: wp(13), backgroundColor: Colors.buttoncolor, borderRadius: wp(3), alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginTop: wp(4) }}>
                                          <Text style={styles.titleText}>Request For Booking</Text>
                                      </TouchableOpacity>
                                  </TouchableOpacity>
                              </View>
                          )
                      }}
                  />
              </View> */}
      </ScrollView>
    </View>
  );
};

export default SearchDrivers;
