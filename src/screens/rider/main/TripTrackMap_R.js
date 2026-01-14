import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
  Modal,
  PermissionsAndroid,
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
import {PostAPiwithToken} from '../../../components/ApiRoot';
import Toast from 'react-native-toast-message';
import debounce from 'lodash/debounce';
import Geolocation from '@react-native-community/geolocation';

const {width, height} = Dimensions.get('window');

const TripTrackMap_R = ({navigation, route}) => {
  const user = useSelector(state => state.user.user);
  const {item, distance} = route.params;
  const [confirmSout, setConfrimSout] = useState(false);
  const closemodalSout = () => {
    setConfrimSout(false);
  };

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
  const [isRideStarted, setIsRideStarted] = useState(item.status === 'started');
  const [currentLocation, setCurrentLocation] = useState(pickupCords);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeDistance, setRouteDistance] = useState(null);
  const [routeDuration, setRouteDuration] = useState(null);
  const [hasReachedDropoff, setHasReachedDropoff] = useState(false);
  const [alternativeRoutes, setAlternativeRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [showAlternativeRoutes, setShowAlternativeRoutes] = useState(false);
  const [currentDirection, setCurrentDirection] = useState(null);
  const [lastValidLocation, setLastValidLocation] = useState(null);
  const [previousLocations, setPreviousLocations] = useState([]);
  const [bearing, setBearing] = useState(null);
  const [calculatedHeading, setCalculatedHeading] = useState(null);
  const [navigationInstructions, setNavigationInstructions] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [directionBuffer, setDirectionBuffer] = useState([]);

  const mapViewRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const watchIdRef = useRef(null);

  const averageSpeed = 50; // 50 km/h
  const routeColors = ['#1B8DFF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

  const directionIcons = {
    left: images.arrowLeft,
    right: images.arrowRight,
    straight: images.arrowStright,
    back: images.arrowBack,
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location to track your trip.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission error:', err);
        return false;
      }
    }
    return true;
  };

  const smoothLocation = (newLocation, lastLocations, alpha = 0.4) => {
    if (!lastLocations || lastLocations.length === 0) return newLocation;
    const weights = [0.5, 0.3, 0.2];
    let smoothedLat = newLocation.latitude * alpha;
    let smoothedLon = newLocation.longitude * alpha;
    let totalWeight = alpha;

    lastLocations.slice(-3).forEach((loc, index) => {
      if (index < weights.length) {
        smoothedLat += loc.latitude * weights[index];
        smoothedLon += loc.longitude * weights[index];
        totalWeight += weights[index];
      }
    });

    return {
      latitude: smoothedLat / totalWeight,
      longitude: smoothedLon / totalWeight,
    };
  };

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

  const calculateBearing = (start, end) => {
    const startLat = start.latitude * (Math.PI / 180);
    const startLon = start.longitude * (Math.PI / 180);
    const endLat = end.latitude * (Math.PI / 180);
    const endLon = end.longitude * (Math.PI / 180);

    const dLon = endLon - startLon;
    const y = Math.sin(dLon) * Math.cos(endLat);
    const x =
      Math.cos(startLat) * Math.sin(endLat) -
      Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLon);
    let bearing = Math.atan2(y, x) * (180 / Math.PI);
    bearing = (bearing + 360) % 360;
    return bearing;
  };

  const getRelativeDirection = (bearing, heading) => {
    let relativeAngle = (bearing - heading + 360) % 360;
    if (relativeAngle >= 30 && relativeAngle < 150) {
      return 'right';
    } else if (relativeAngle >= 210 && relativeAngle < 330) {
      return 'left';
    } else if (relativeAngle >= 330 || relativeAngle < 30) {
      return 'straight';
    } else {
      return 'back';
    }
  };

  const isMovingAway = (currentLoc, prevLoc, nextWaypoint) => {
    if (!prevLoc) return false;
    const currentDistance = calculateDistance(currentLoc, nextWaypoint);
    const prevDistance = calculateDistance(prevLoc, nextWaypoint);
    return currentDistance > prevDistance + 0.01;
  };

  const formatDuration = durationInSeconds => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    return `${minutes} min ${seconds} sec`;
  };

  const estimatedTime = routeDistance
    ? calculateEstimatedTime(routeDistance, averageSpeed)
    : {hours: 0, minutes: 0};
  const formattedEstimatedTime = formatEstimatedTime(
    estimatedTime.hours,
    estimatedTime.minutes,
  );

  const handleRouteSelection = routeIndex => {
    setSelectedRouteIndex(routeIndex);
    const selectedRoute = alternativeRoutes[routeIndex];
    setRouteCoordinates(selectedRoute.coordinates);
    setRouteDistance(selectedRoute.distance);
    setRouteDuration(selectedRoute.duration);
    setCoords(selectedRoute.coordinates);
    setNavigationInstructions(selectedRoute.instructions || []);
    setCurrentStepIndex(0);

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

  const StartTripApi = () => {
    const formdata = new FormData();
    const token = user.api_token;
    formdata.append('trip_id', item.id);
    setIsLoading(true);
    PostAPiwithToken({url: 'start-trip', Token: token}, formdata)
      .then(res => {
        setIsLoading(false);
        if (res.status === 'success') {
          Toast.show({
            type: 'success',
            text1: 'Your trip started successfully!',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
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

  const CompleteTripApi = () => {
    const formdata = new FormData();
    const token = user.api_token;
    formdata.append('trip_id', item.id);
    setIsLoading(true);
    PostAPiwithToken({url: 'complete-trip', Token: token}, formdata)
      .then(res => {
        setIsLoading(false);
        if (res.status === 'success') {
          navigation.navigate('Drawer_R', {screen: 'Trips_R'});
          bottomSheetRef.current.close();
          Toast.show({
            type: 'success',
            text1: 'Your trip completed successfully!',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
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

  const startLocationTracking = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Toast.show({
        type: 'error',
        text1: 'Location permission denied',
        text2: 'Please enable location services to track your trip.',
        topOffset: Platform.OS === 'ios' ? 50 : 0,
      });
      setCurrentLocation(pickupCords);
      return;
    }

    if (watchIdRef.current) {
      Geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = Geolocation.watchPosition(
      position => {
        const {latitude, longitude, heading, accuracy} = position.coords;

        if (accuracy > 20) {
          console.log('Ignoring low-accuracy update:', accuracy);
          return;
        }

        const newLocation = {latitude, longitude};
        const smoothedLocation = smoothLocation(newLocation, previousLocations);
        setCurrentLocation(smoothedLocation);
        setLastValidLocation(smoothedLocation);

        setPreviousLocations(prev => {
          const newLocs = [...prev, smoothedLocation].slice(-3);
          return newLocs;
        });

        let tempHeading = heading;
        if (heading === null || heading === undefined) {
          const prevLoc = previousLocations[previousLocations.length - 1];
          if (prevLoc) {
            tempHeading = calculateBearing(prevLoc, smoothedLocation);
          }
        }
        setCalculatedHeading(tempHeading);

        debouncedTruncateRoute(smoothedLocation);

        if (
          !hasReachedDropoff &&
          calculateDistance(smoothedLocation, droplocationCords) < 0.1
        ) {
          setHasReachedDropoff(true);
          Toast.show({
            type: 'success',
            text1: 'Drop-off Reached',
            text2: 'You have reached the drop-off location.',
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          setIsRideStarted(false);
          if (watchIdRef.current) {
            Geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
          }
          bottomSheetRef.current.open();
        }

        const currentRoute = alternativeRoutes[selectedRouteIndex];
        if (currentRoute && currentRoute.coordinates.length > 1) {
          let closestIndex = 0;
          let minDistance = Number.MAX_VALUE;

          currentRoute.coordinates.forEach((coord, index) => {
            const distance = calculateDistance(smoothedLocation, coord);
            if (distance < minDistance) {
              minDistance = distance;
              closestIndex = index;
            }
          });

          if (navigationInstructions.length > 0) {
            let currentStepFound = false;
            for (let i = 0; i < navigationInstructions.length; i++) {
              const step = navigationInstructions[i];
              const stepEnd = step.end_location;
              const distanceToStepEnd = calculateDistance(
                smoothedLocation,
                stepEnd,
              );
              if (distanceToStepEnd < 0.05) {
                if (i < navigationInstructions.length - 1) {
                  const nextStep = navigationInstructions[i + 1];
                  const distanceToNextStepStart = calculateDistance(
                    smoothedLocation,
                    nextStep.start_location,
                  );
                  if (distanceToNextStepStart < distanceToStepEnd) {
                    setCurrentStepIndex(i + 1);
                  }
                } else {
                  setCurrentDirection(null);
                }
                currentStepFound = true;
                break;
              }
            }
            if (
              !currentStepFound &&
              currentStepIndex < navigationInstructions.length - 1
            ) {
              const nextStep = navigationInstructions[currentStepIndex + 1];
              const distanceToNextStep = calculateDistance(
                smoothedLocation,
                nextStep.start_location,
              );
              if (distanceToNextStep < 0.05) {
                setPreviousLocations(prev => {
                  const lastLoc = prev[prev.length - 2];
                  if (
                    lastLoc &&
                    calculateDistance(lastLoc, nextStep.start_location) < 0.05
                  ) {
                    setCurrentStepIndex(currentStepIndex + 1);
                  }
                  return prev;
                });
              }
            }
          }

          if (minDistance < 0.05) {
            setCurrentDirection(null);
          } else {
            const nextWaypointIndex =
              closestIndex + 1 < currentRoute.coordinates.length
                ? closestIndex + 1
                : closestIndex;
            const nextWaypoint = currentRoute.coordinates[nextWaypointIndex];
            const bearing = calculateBearing(smoothedLocation, nextWaypoint);
            setBearing(bearing);

            if (tempHeading !== null && tempHeading !== undefined) {
              let newDirection = getRelativeDirection(bearing, tempHeading);
              const prevLoc = previousLocations[previousLocations.length - 2];
              if (
                prevLoc &&
                isMovingAway(smoothedLocation, prevLoc, nextWaypoint)
              ) {
                newDirection = 'back';
              }

              setDirectionBuffer(prev => {
                const newBuffer = [...prev, newDirection].slice(-3);
                if (
                  newBuffer.length === 3 &&
                  newBuffer.every(dir => dir === newBuffer[0])
                ) {
                  setCurrentDirection(newBuffer[0]);
                }
                return newBuffer;
              });
            }
          }

          if (
            mapViewRef.current &&
            tempHeading !== null &&
            (!lastValidLocation ||
              calculateDistance(smoothedLocation, lastValidLocation) > 0.01)
          ) {
            mapViewRef.current.animateCamera({
              center: smoothedLocation,
              heading: tempHeading,
              pitch: 0,
              zoom: 15,
            });
          }
        }
      },
      error => {
        console.log('watchPosition error:', error);
        Toast.show({
          type: 'error',
          text1: 'Location Error',
          text2: 'Unable to retrieve location. Please check GPS settings.',
          topOffset: Platform.OS === 'ios' ? 50 : 0,
        });
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 2000,
        fastestInterval: 1000,
        showLocationDialog: true,
        forceRequestLocation: true,
      },
    );
  };

  const debouncedTruncateRoute = debounce(newLocation => {
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

      if (minDistance < 0.02) {
        const truncatedCoords = currentRoute.coordinates.slice(closestIndex);
        setRouteCoordinates(truncatedCoords);
      }
    }
  }, 2000);

  useEffect(() => {
    const initializeLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Toast.show({
          type: 'error',
          text1: 'Location permission denied',
          text2: 'Please enable location services to track your trip.',
          topOffset: Platform.OS === 'ios' ? 50 : 0,
        });
        setCurrentLocation(pickupCords);
        return;
      }

      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude, accuracy} = position.coords;
          if (accuracy > 20) {
            setCurrentLocation(pickupCords);
          } else {
            const newLocation = {latitude, longitude};
            setCurrentLocation(newLocation);
            setLastValidLocation(newLocation);
            setPreviousLocations([newLocation]);
          }
        },
        error => {
          console.log('getCurrentPosition error:', error);
          setCurrentLocation(pickupCords);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 10,
          interval: 1000,
          fastestInterval: 1000,
        },
      );
    };

    initializeLocation();

    if (isRideStarted || item.status === 'started') {
      startLocationTracking();
    }

    return () => {
      if (watchIdRef.current) {
        Geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isRideStarted, item.status]);

  const stripHtml = html => {
    return html.replace(/<[^>]+>/g, '');
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
        }}
        rotateEnabled={true}>
        <Marker coordinate={pickupCords} title="Pickup Location">
          <Image source={images.mapcar} style={styles.markerIcon} />
        </Marker>

        <Marker coordinate={droplocationCords} title="Drop-off Location">
          <Image source={images.PlaceInicator} style={styles.markerIcon} />
        </Marker>

        <MapViewDirections
          origin={
            isRideStarted || item.status === 'started'
              ? currentLocation
              : pickupCords
          }
          destination={droplocationCords}
          apikey={Google_Map_Key}
          strokeWidth={5}
          strokeColor={routeColors[selectedRouteIndex]}
          alternatives={true}
          onReady={result => {
            const mainRoute = {
              coordinates: result.coordinates,
              distance: result.distance,
              duration: result.duration,
              instructions: result.legs[0].steps.map(step => ({
                instruction: stripHtml(step.html_instructions),
                distance: step.distance.text,
                duration: step.duration.text,
                start_location: {
                  latitude: step.start_location.lat,
                  longitude: step.start_location.lng,
                },
                end_location: {
                  latitude: step.end_location.lat,
                  longitude: step.end_location.lng,
                },
              })),
            };
            setAlternativeRoutes([mainRoute]);
            setCoords(result.coordinates);
            setRouteCoordinates(result.coordinates);
            setRouteDistance(result.distance);
            setRouteDuration(result.duration);
            setNavigationInstructions(mainRoute.instructions);
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

        {showAlternativeRoutes && (
          <>
            <MapViewDirections
              origin={
                isRideStarted || item.status === 'started'
                  ? currentLocation
                  : pickupCords
              }
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
                  instructions: result.legs[0].steps.map(step => ({
                    instruction: stripHtml(step.html_instructions),
                    distance: step.distance.text,
                    duration: step.duration.text,
                    start_location: {
                      latitude: step.start_location.lat,
                      longitude: step.start_location.lng,
                    },
                    end_location: {
                      latitude: step.end_location.lat,
                      longitude: step.end_location.lng,
                    },
                  })),
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
              origin={
                isRideStarted || item.status === 'started'
                  ? currentLocation
                  : pickupCords
              }
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
                  instructions: result.legs[0].steps.map(step => ({
                    instruction: stripHtml(step.html_instructions),
                    distance: step.distance.text,
                    duration: step.duration.text,
                    start_location: {
                      latitude: step.start_location.lat,
                      longitude: step.start_location.lng,
                    },
                    end_location: {
                      latitude: step.end_location.lat,
                      longitude: step.end_location.lng,
                    },
                  })),
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

        {routeCoordinates.length > 1 &&
          (isRideStarted || item.status === 'started') && (
            <Polyline
              coordinates={routeCoordinates}
              strokeWidth={5}
              strokeColor={routeColors[selectedRouteIndex]}
              lineDashPattern={[1]}
            />
          )}

        {(isRideStarted || item.status === 'started') && currentLocation && (
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
          {(isRideStarted || item.status === 'started') &&
            navigationInstructions.length > 0 && (
              <View style={styles.directionContainer}>
                {currentDirection && directionIcons[currentDirection] ? (
                  <Image
                    source={directionIcons[currentDirection]}
                    style={styles.directionArrow}
                  />
                ) : (
                  <View style={styles.directionArrowPlaceholder} />
                )}
                <Text style={styles.directionText}>
                  {navigationInstructions[currentStepIndex]?.instruction ||
                    'Follow the route'}
                </Text>
              </View>
            )}
          {!(isRideStarted || item.status === 'started') && (
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

      {showAlternativeRoutes &&
        alternativeRoutes.length > 1 &&
        !(isRideStarted || item.status === 'started') && (
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
                      style={{
                        ...styles.routeButtonText,
                        color:
                          selectedRouteIndex === index
                            ? 'white'
                            : routeColors[index],
                      }}>
                      Route {index + 1}
                    </Text>
                    <Text
                      style={{
                        ...styles.routeButtonSubText,
                        color:
                          selectedRouteIndex === index
                            ? 'white'
                            : routeColors[index],
                      }}>
                      {route.distance.toFixed(1)} km
                    </Text>
                  </TouchableOpacity>
                ),
            )}
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
              bottom: wp(25),
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
                source={user?.image ? {uri: user?.image} : images.avatar}
                resizeMode="contain"
                style={styles.driverimg}
                borderRadius={wp(5)}
              />
              <View style={{marginLeft: wp(2)}}>
                <Text style={[styles.usernameText, {color: Colors.black}]}>
                  {user?.name}
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
                {item?.pickup_location || 'Unknown Pickup Location'}
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
                {item?.destination_location || 'Unknown Destination Location'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {isRideStarted || item.status === 'started' ? (
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            setConfrimSout(true);
          }}>
          <Text style={styles.buttonText}>End Your Trip</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            setIsRideStarted(true);
            setShowAlternativeRoutes(false);
            StartTripApi();
          }}>
          <Text style={styles.buttonText}>Start Your Trip</Text>
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
        <Text style={styles.bottomSheetTitle}>Trip Completed</Text>
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
              {item?.pickup_location || 'Unknown Pickup Location'}
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
              {item?.destination_location || 'Unknown Destination Location'}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.payButton}
          onPress={() => {
            CompleteTripApi();
          }}>
          <Text style={styles.payButtonText}>Complete Trip</Text>
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
                Are you sure you want to End your Trip?
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
                  closemodalSout();
                  setIsRideStarted(false);
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

export default TripTrackMap_R;

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
  directionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  directionArrow: {
    width: wp(8),
    height: wp(8),
    resizeMode: 'contain',
    marginRight: wp(2),
  },
  directionArrowPlaceholder: {
    width: wp(8),
    height: wp(8),
    marginRight: wp(2),
  },
  directionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    maxWidth: wp(60),
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
    borderRadius: wp(4),
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
