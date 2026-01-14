import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import MapView, {Marker, Polyline} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {Google_Map_Key} from '../../../components/GoogleMapkey';
import {images, fonts, Colors} from '../../../constant/Index';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';
import Loader from '../../../components/Loader';
import {AllGetAPI, PostAPiwithToken} from '../../../components/ApiRoot';
import Geolocation from '@react-native-community/geolocation';

const {width, height} = Dimensions.get('window');

const ResMapTrack = ({navigation, route}) => {
  const user = useSelector(state => state.user.user);
  const {item, distance} = route.params;
  console.log('my item dataaa new', item);

  const pickupCords = {
    latitude: parseFloat(item.pickup_latitude),
    longitude: parseFloat(item.pickup_longitude),
  };
  const droplocationCords = {
    latitude: parseFloat(item.destination_latitude),
    longitude: parseFloat(item.destination_longitude),
  };
  const [isloading, setIsLoading] = useState(false);
  const [coords, setCoords] = useState([]);
  const [isRideStarted, setIsRideStarted] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(pickupCords);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeDistance, setRouteDistance] = useState(null);
  const [routeDuration, setRouteDuration] = useState(null);
  const [hasInitiatedPayment, setHasInitiatedPayment] = useState(false); // New state to track payment initiation
  const mapViewRef = useRef(null);
  const intervalRef = useRef(null);
  const bottomSheetRef = useRef(null);

  const averageSpeed = 50; // 50 km/h

  const calculateEstimatedTime = (distance, averageSpeed) => {
    const timeInHours = distance / averageSpeed;
    const hours = Math.floor(timeInHours);
    const minutes = Math.floor((timeInHours - hours) * 60);
    return {hours, minutes};
  };

  const formatEstimatedTime = (hours, minutes) => {
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${
        minutes > 1 ? 's' : ''
      }`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  };

  const fetchPaymentRequest = () => {
    const formdata = new FormData();
    formdata.append('reservation_id', item.id);

    PostAPiwithToken(
      {url: 'check-reservation-status', Token: user?.api_token},
      formdata,
    )
      .then(res => {
        console.log(
          'response dataaaaaaaaa reservationsssss',
          JSON.stringify(res),
        );
        if (res.status === 'success' && !hasInitiatedPayment) {
          if (res.reservation_status === 'accepted') {
            bottomSheetRef.current.open();
          }
        }
      })
      .catch(err => {
        console.log('api error', err);
      });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPaymentRequest();
      intervalRef.current = setInterval(fetchPaymentRequest, 15000);
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    });
    return () => {
      unsubscribe();
      unsubscribeBlur();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [hasInitiatedPayment]);

  const startLocationTracking = () => {
    Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentLocation({latitude, longitude});
        truncateRoute({latitude, longitude});
      },
      error => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 2000,
        fastestInterval: 2000,
      },
    );
  };
  useEffect(() => {
    startLocationTracking();
    if (item.my_status === 'accepted') {
      bottomSheetRef.current.open();
    }
  }, []);

  const truncateRoute = newLocation => {
    if (coords.length > 1) {
      let closestIndex = 0;
      let minDistance = Number.MAX_VALUE;

      coords.forEach((coord, index) => {
        const distance = calculateDistance(newLocation, coord);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      const truncatedCoords = coords.slice(closestIndex);
      setRouteCoordinates(truncatedCoords);
    }
  };

  const calculateDistance = (coord1, coord2) => {
    const R = 6371;
    const dLat = (coord2.latitude - coord1.latitude) * (Math.PI / 180);
    const dLon = (coord2.longitude - coord1.longitude) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coord1.latitude * (Math.PI / 180)) *
        Math.cos(coord2.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const formatDuration = durationInSeconds => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    return `${minutes} min ${seconds} sec`;
  };

  const estimatedTime = calculateEstimatedTime(routeDistance, averageSpeed);
  const formattedEstimatedTime = formatEstimatedTime(
    estimatedTime.hours,
    estimatedTime.minutes,
  );

  const StartRideApi = () => {
    const formdata = new FormData();
    const token = user.api_token;
    formdata.append('reservation_id', item.id);
    setIsLoading(true);
    PostAPiwithToken({url: 'start-reservation', Token: token}, formdata)
      .then(res => {
        setIsLoading(false);
        console.log('res of start ride ', JSON.stringify(res));
        if (res.status === 'success') {
          Toast.show({
            type: 'success',
            text1: 'Your ride start successfully!',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        } else {
          Toast.show({
            type: 'error',
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

  return (
    <View style={styles.container}>
      {isloading && <Loader />}

      <MapView
        ref={mapViewRef}
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: pickupCords.latitude,
          longitude: pickupCords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}>
        <Marker coordinate={pickupCords} title="Pickup Location">
          <Image source={images.mapcar} style={styles.markerIcon} />
        </Marker>

        <Marker coordinate={droplocationCords} title="Drop-off Location">
          <Image source={images.PlaceInicator} style={styles.markerIcon} />
        </Marker>

        <MapViewDirections
          origin={isRideStarted ? currentLocation : pickupCords}
          destination={droplocationCords}
          apikey={Google_Map_Key}
          strokeWidth={5}
          strokeColor="blue"
          onReady={result => {
            setCoords(result.coordinates);
            setRouteCoordinates(result.coordinates);
            setRouteDistance(result.distance);
            setRouteDuration(result.duration);
            if (mapViewRef.current) {
              mapViewRef.current.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  right: width / 20,
                  bottom: height / 20,
                  left: width / 20,
                  top: height / 20,
                },
                animated: true,
              });
            }
          }}
        />

        {routeCoordinates.length > 1 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={5}
            strokeColor="blue"
          />
        )}

        {isRideStarted && (
          <Marker coordinate={currentLocation}>
            <Image source={images.mapcar} style={styles.carIcon} />
          </Marker>
        )}
      </MapView>

      {routeDistance && routeDuration && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Distance: {routeDistance.toFixed(2)} km
          </Text>
          <Text style={styles.infoText}>
            Estimated Time: {formattedEstimatedTime}
          </Text>
        </View>
      )}
      {routeDistance && routeDuration && (
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.DriverView,
            {
              paddingVertical: wp(4),
              backgroundColor: '#DDE7F3',
              elevation: 4,
              borderRadius: wp(2),
              position: 'absolute',
              bottom: !isRideStarted ? wp(25) : wp(10),
              alignSelf: 'center',
              width: wp(90),
              paddingHorizontal: wp(3),
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.2,
              shadowRadius: 3,
            },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
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
                <Text style={[styles.usernameText, {color: Colors.black}]}>
                  {item?.rider?.name}
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
            <View></View>
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
      )}

      <RBSheet
        ref={bottomSheetRef}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={230}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
          },
        }}>
        <Text style={styles.bottomSheetTitle}>
          Fare Payment Required to Proceed
        </Text>
        <View style={{marginTop: wp(2), marginBottom: wp(3)}}>
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
              {item?.destination_location}
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
              {item?.pickup_location}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.payButton}
          onPress={() => {
            setHasInitiatedPayment(true); // Set flag to prevent bottom sheet from reopening
            navigation.navigate('ReachedMap', {item, distance: routeDistance});
            bottomSheetRef.current.close();
          }}>
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </RBSheet>
    </View>
  );
};

export default ResMapTrack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  markerIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  carIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  startButton: {
    position: 'absolute',
    bottom: 30,
    left: '20%',
    right: '20%',
    backgroundColor: '#1B8DFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    position: 'absolute',
    top: 50,
    left: '20%',
    right: '20%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  bottomSheetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    // fontFamily
    textAlign: 'center',
    marginBottom: 20,
    color: 'black',
  },
  payButton: {
    backgroundColor: '#1B8DFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  driverimg: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
  },
});
