import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
  Modal,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import MapView, {Marker, Polyline} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {Google_Map_Key} from '../../../components/GoogleMapkey';
import {images, fonts, Colors} from '../../../constant/Index';
import Geolocation from 'react-native-geolocation-service';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';
import Loader from '../../../components/Loader';
import {PostAPiwithToken} from '../../../components/ApiRoot';
import Toast from 'react-native-toast-message';

const {width, height} = Dimensions.get('window');

const TrackMap = ({route, navigation}) => {
  const user = useSelector(state => state.user.user);
  const [confirmSout, setConfrimSout] = useState(false);
  const closemodalSout = () => {
    setConfrimSout(false);
  };
  const {item, distance} = route.params;
  console.log('my item data', item);

  // Initialize pickupCords as null until ride starts
  const [pickupCords, setPickupCords] = useState(null);
  const droplocationCords = {
    latitude: parseFloat(item.destination_latitude),
    longitude: parseFloat(item.destination_longitude),
  };
  const [isloading, setIsLoading] = useState(false);
  const [coords, setCoords] = useState([]);
  const [isRideStarted, setIsRideStarted] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  console.log('my location ', currentLocation);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeDistance, setRouteDistance] = useState(null);
  const [routeDuration, setRouteDuration] = useState(null);

  // New state for alternative routes
  const [alternativeRoutes, setAlternativeRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [showAlternativeRoutes, setShowAlternativeRoutes] = useState(false);

  const mapViewRef = useRef(null);
  const intervalRef = useRef(null);
  const bottomSheetRef = useRef(null);

  const averageSpeed = 50; // 50 km/h

  // Route colors for different alternatives
  const routeColors = ['#1B8DFF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

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

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentLocation({latitude, longitude});
        if (!isRideStarted) {
          setPickupCords({latitude, longitude});
        }
      },
      error => {
        console.log(error);
        setPickupCords({
          latitude: parseFloat(item.pickup_latitude),
          longitude: parseFloat(item.pickup_longitude),
        });
      },
      {enableHighAccuracy: true, timeout: 5000, maximumAge: 1000},
    );

    if (isRideStarted && pickupCords) {
      startLocationTracking();

      intervalRef.current = setInterval(() => {
        Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            setCurrentLocation({latitude, longitude});
            setPickupCords({latitude, longitude});
            truncateRoute({latitude, longitude});

            // Open bottom sheet when within 50 meters (0.05 km) of destination
            if (
              calculateDistance({latitude, longitude}, droplocationCords) <=
              0.05
            ) {
              bottomSheetRef.current.open();
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
              }
              setIsRideStarted(false);
            }
          },
          error => {
            console.log(error);
          },
          {enableHighAccuracy: true, timeout: 5000, maximumAge: 1000},
        );
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRideStarted, pickupCords]);

  const startLocationTracking = () => {
    Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentLocation({latitude, longitude});
        setPickupCords({latitude, longitude});
        truncateRoute({latitude, longitude});
      },
      error => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 1000,
        fastestInterval: 1000,
      },
    );
  };

  const truncateRoute = newLocation => {
    const currentRoute = alternativeRoutes[selectedRouteIndex];
    if (currentRoute && currentRoute.coordinates.length > 1) {
      let closestIndex = 0;
      let minDistance = Number.MAX_VALUE;

      currentRoute.coordinates.forEach((coord, index) => {
        const distance = calculateDistance(newLocation, coord);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      const truncatedCoords = currentRoute.coordinates.slice(closestIndex);
      setRouteCoordinates(truncatedCoords);
    }
  };

  const calculateDistance = (coord1, coord2) => {
    const R = 6371; // Radius of the Earth in km
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

  // Function to handle route selection
  const handleRouteSelection = routeIndex => {
    setSelectedRouteIndex(routeIndex);
    const selectedRoute = alternativeRoutes[routeIndex];
    setRouteCoordinates(selectedRoute.coordinates);
    setRouteDistance(selectedRoute.distance);
    setRouteDuration(selectedRoute.duration);
    setCoords(selectedRoute.coordinates);

    // Fit map to selected route
    if (mapViewRef.current) {
      mapViewRef.current.fitToCoordinates(selectedRoute.coordinates, {
        edgePadding: {
          right: width / 20,
          bottom: height / 20,
          left: width / 20,
          top: height / 20,
        },
        animated: true,
      });
    }
  };

  const StartRideApi = () => {
    const formdata = new FormData();
    const token = user.api_token;
    formdata.append('ride_id', item.id);
    setIsLoading(true);
    PostAPiwithToken({url: 'start-ride', Token: token}, formdata)
      .then(res => {
        setIsLoading(false);
        console.log('res of start ride ', JSON.stringify(res));
        if (res.status == 'success') {
          setIsLoading(false);
          Toast.show({
            type: 'success',
            text1: 'Your ride start successfully!',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
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

  const RequestForPaymentApi = () => {
    const formdata = new FormData();
    const token = user.api_token;
    formdata.append('ride_id', item.id);
    setIsLoading(true);
    PostAPiwithToken({url: 'payment-request-ride', Token: token}, formdata)
      .then(res => {
        setIsLoading(false);
        console.log('res of request payment ', JSON.stringify(res));
        if (res.status == 'success') {
          setIsLoading(false);
          navigation.navigate('Drawer_R', {screen: 'Bookings_R'});
          bottomSheetRef.current.close();
          Toast.show({
            type: 'success',
            text1: 'Request for payment',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
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

  return (
    <View style={styles.container}>
      {isloading && <Loader />}

      {pickupCords && (
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

          {/* Main route directions */}
          <MapViewDirections
            origin={isRideStarted ? currentLocation : pickupCords}
            destination={droplocationCords}
            apikey={Google_Map_Key}
            strokeWidth={5}
            strokeColor={routeColors[selectedRouteIndex]}
            alternatives={true}
            onReady={result => {
              // Store the main route
              const mainRoute = {
                coordinates: result.coordinates,
                distance: result.distance,
                duration: result.duration,
              };

              setAlternativeRoutes([mainRoute]);
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
            onError={errorMessage => {
              console.log('MapViewDirections Error: ', errorMessage);
            }}
          />

          {/* Alternative routes */}
          {showAlternativeRoutes && (
            <>
              <MapViewDirections
                origin={isRideStarted ? currentLocation : pickupCords}
                destination={droplocationCords}
                apikey={Google_Map_Key}
                strokeWidth={3}
                strokeColor={routeColors[1]}
                waypoints={[
                  {
                    latitude: pickupCords.latitude + 0.01,
                    longitude: pickupCords.longitude + 0.01,
                  },
                ]}
                optimizeWaypoints={true}
                onReady={result => {
                  const altRoute = {
                    coordinates: result.coordinates,
                    distance: result.distance,
                    duration: result.duration,
                  };

                  setAlternativeRoutes(prev => {
                    const newRoutes = [...prev];
                    newRoutes[1] = altRoute;
                    return newRoutes;
                  });
                }}
                onError={errorMessage => {
                  console.log('Alternative Route Error: ', errorMessage);
                }}
              />

              <MapViewDirections
                origin={isRideStarted ? currentLocation : pickupCords}
                destination={droplocationCords}
                apikey={Google_Map_Key}
                strokeWidth={3}
                strokeColor={routeColors[2]}
                waypoints={[
                  {
                    latitude: pickupCords.latitude - 0.01,
                    longitude: pickupCords.longitude - 0.01,
                  },
                ]}
                optimizeWaypoints={true}
                onReady={result => {
                  const altRoute2 = {
                    coordinates: result.coordinates,
                    distance: result.distance,
                    duration: result.duration,
                  };

                  setAlternativeRoutes(prev => {
                    const newRoutes = [...prev];
                    newRoutes[2] = altRoute2;
                    return newRoutes;
                  });
                }}
                onError={errorMessage => {
                  console.log('Alternative Route 2 Error: ', errorMessage);
                }}
              />
            </>
          )}

          {/* Current route polyline (for active tracking) */}
          {routeCoordinates.length > 1 && isRideStarted && (
            <Polyline
              coordinates={routeCoordinates}
              strokeWidth={6}
              strokeColor={routeColors[selectedRouteIndex]}
              lineDashPattern={[1]}
            />
          )}

          {/* Current location marker when ride is started */}
          {isRideStarted && currentLocation && (
            <Marker coordinate={currentLocation}>
              <Image source={images.mapcar} style={styles.carIcon} />
            </Marker>
          )}
        </MapView>
      )}

      {/* Route information */}
      {routeDistance && routeDuration && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Distance: {routeDistance.toFixed(2)} km
          </Text>
          <Text style={styles.infoText}>
            Estimated Time: {formattedEstimatedTime}
          </Text>
          {!isRideStarted && (
            <TouchableOpacity
              style={styles.routeToggleButton}
              onPress={() => setShowAlternativeRoutes(!showAlternativeRoutes)}>
              <Text style={styles.routeToggleText}>
                {showAlternativeRoutes
                  ? 'Hide Routes'
                  : 'Show Alternative Routes'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Alternative route selection buttons */}
      {showAlternativeRoutes &&
        alternativeRoutes.length > 1 &&
        !isRideStarted && (
          <View style={styles.routeSelectionContainer}>
            {alternativeRoutes.map(
              (route, index) =>
                route && (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.routeButton,
                      {
                        backgroundColor:
                          selectedRouteIndex === index
                            ? routeColors[index]
                            : 'rgba(255,255,255,0.9)',
                        borderColor: routeColors[index],
                      },
                    ]}
                    onPress={() => handleRouteSelection(index)}>
                    <Text
                      style={[
                        styles.routeButtonText,
                        {
                          color:
                            selectedRouteIndex === index
                              ? 'white'
                              : routeColors[index],
                        },
                      ]}>
                      Route {index + 1}
                    </Text>
                    <Text
                      style={[
                        styles.routeButtonSubText,
                        {
                          color:
                            selectedRouteIndex === index
                              ? 'white'
                              : routeColors[index],
                        },
                      ]}>
                      {route.distance.toFixed(1)} km
                    </Text>
                  </TouchableOpacity>
                ),
            )}
          </View>
        )}

      {/* Driver info card */}
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
                  item?.user?.image ? {uri: item?.user?.image} : images.avatar
                }
                resizeMode="contain"
                style={styles.driverimg}
                borderRadius={wp(5)}
              />
              <View style={{marginLeft: wp(2)}}>
                <Text style={[styles.usernameText, {color: Colors.black}]}>
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
        </TouchableOpacity>
      )}

      {/* Start ride button */}
      {isRideStarted || item.status === 'started' ? (
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            setConfrimSout(true);
          }}>
          <Text style={styles.buttonText}>End Your Ride</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            setIsRideStarted(true);
            setShowAlternativeRoutes(false); // Hide alternative routes when ride starts
            StartRideApi();
          }}>
          <Text style={styles.buttonText}>Start Your Ride</Text>
        </TouchableOpacity>
      )}
      {/* {routeDistance<0.95?   (
        <TouchableOpacity
          style={styles.startButton}
onPress={()=>
{bottomSheetRef.current.open(),
setIsRideStarted(false)}
}
          >
          <Text style={styles.buttonText}>End Your Ride</Text>
        </TouchableOpacity>
      ):null} */}

      {/* Bottom sheet for payment */}
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
        <Text style={styles.bottomSheetTitle}>Reached</Text>
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
          style={styles.payButton}
          onPress={() => {
            RequestForPaymentApi();
            bottomSheetRef.current.close();
          }}>
          <Text style={styles.payButtonText}>Request For Payment</Text>
        </TouchableOpacity>
      </RBSheet>
      <Modal
        transparent={true}
        visible={confirmSout}
        onRequestClose={closemodalSout}
        animationType="none">
        <View style={styles.modalTopView}>
          <View style={styles.modalsecondView}>
            <View>
              <Image
                source={require('../../../assets/endride.png')}
                resizeMode="contain"
                style={{width: wp(20), height: wp(20), alignSelf: 'center'}}
              />
            </View>
            <View
              style={{
                alignSelf: 'center',
                marginHorizontal: wp(17),
                marginTop: wp(5),
              }}>
              <Text style={styles.modalText}>
                Are you sure you want to End your Ride?
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
                  closemodalSout(),
                    setIsRideStarted(false),
                    bottomSheetRef.current.open();
                }}
                style={styles.modalbutton1}>
                <Text style={[styles.titleText, {fontSize: 14}]}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => closemodalSout()}
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
    </View>
  );
};

export default TrackMap;

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
    left: '10%',
    right: '10%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  routeToggleButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#1B8DFF',
    borderRadius: 20,
  },
  routeToggleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  routeSelectionContainer: {
    position: 'absolute',
    top: 150,
    left: '10%',
    right: '10%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 10,
  },
  routeButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  routeButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  routeButtonSubText: {
    fontSize: 10,
    fontWeight: '600',
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
  usernameText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    fontWeight: '600',
  },
  modalTopView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalsecondView: {
    width: wp(90),
    // height: wp(60),
    borderRadius: wp(4),
    // justifyContent: 'space-between',
    backgroundColor: Colors.background,
    paddingVertical: wp(10),
  },
  modalText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: Colors.black,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: wp(1),
  },
  modalbutton1: {
    width: wp(33),
    height: wp(12),
    backgroundColor: Colors.buttoncolor,
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalbutton2: {
    width: wp(33),
    height: wp(12),
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D63544',
  },
  titleText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: Colors.white,
  },
});
