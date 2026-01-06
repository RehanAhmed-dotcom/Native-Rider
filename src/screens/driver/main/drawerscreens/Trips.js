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
import Loader from '../../../../components/Loader';
import {AllGetAPI} from '../../../../components/ApiRoot';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';

const Trips = ({navigation}) => {
  const {top} = useSafeAreaInsets();
  const user = useSelector(state => state.user.user);

  const [refreshing, setRefreshing] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [myTrips, setMyTrips] = useState([]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchtrips();
  };

  const fetchtrips = () => {
    setIsLoading(true);
    AllGetAPI({url: 'trips', Token: user?.api_token})
      .then(res => {
        setIsLoading(false);
        setRefreshing(false);
        console.log('response dataaaaaaaaa runner', JSON.stringify(res));
        if (res.status == 'success') {
          setMyTrips(res?.trips);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message,
          });
        }
      })
      .catch(err => {
        setRefreshing(false);
        setIsLoading(false);
        console.log('api error', err);
      });
  };

  useEffect(() => {
    fetchtrips();
  }, []);

  return (
    <View
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS == 'ios' ? top : 0},
      ]}>
      {isloading && <Loader />}

      <View style={styles.bottomHeaderView}>
        <Text style={styles.headerText}>Trips</Text>
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
        {myTrips?.length === 0 ? (
          <>
            <View
              style={{
                width: wp(90),
                paddingVertical: wp(6),
                paddingHorizontal: wp(5),
                backgroundColor: '#FFFFFF',
                borderRadius: wp(2),
                alignSelf: 'center',
                marginBottom: wp(5),
                elevation: 1,
                marginTop: wp(7),
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}>
              <Image
                source={images.tripImg}
                style={{width: wp(80), height: wp(100), resizeMode: 'contain'}}
              />
            </View>
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                fontFamily: fonts.bold,
                textAlign: 'center',
              }}>
              No trips are added yet!!!
            </Text>
          </>
        ) : (
          <View style={{marginTop: wp(4), marginBottom: wp(24)}}>
            <FlatList
              data={myTrips.sort((a, b) => new Date(b.date) - new Date(a.date))}
              // inverted
              renderItem={({item}) => {
                // Get the first three rider images or use a default image if none exist
                const riderImages = item?.accepted_riders.map(
                  rider => rider?.rider?.image,
                );
                // const defaultImage = images.tripImg; // Fallback image

                // Assign images, handling both local and remote cases
                const image1 = riderImages[0] ? {uri: riderImages[0]} : null;
                const image2 = riderImages[1] ? {uri: riderImages[1]} : null;
                const image3 = riderImages[2] ? {uri: riderImages[2]} : null;

                return (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('TripDetail', {item})}
                    style={{
                      width: wp(90),
                      paddingVertical: wp(3),
                      paddingHorizontal: wp(5),
                      backgroundColor: '#FFFFFF',
                      borderRadius: wp(2),
                      alignSelf: 'center',
                      marginBottom: wp(5),
                      elevation: 4,
                      shadowColor: '#000',
                      shadowOffset: {width: 0, height: 2},
                      shadowOpacity: 0.2,
                      shadowRadius: 3,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: fonts.bold,
                          color: Colors.black,
                        }}>
                        {item.title}
                      </Text>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Image
                            source={image1}
                            resizeMode="contain"
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: 10,
                              marginRight: -10,
                            }}
                          />
                          <Image
                            source={image2}
                            resizeMode="contain"
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: 10,
                              marginRight: -10,
                            }}
                          />
                          <Image
                            source={image3}
                            resizeMode="contain"
                            style={{width: 20, height: 20, borderRadius: 10}}
                          />
                        </View>
                        <Text
                          style={{
                            fontSize: 10,
                            color: '#4686D4',
                            fontFamily: fonts.bold,
                            marginLeft: 3,
                          }}>
                          +{item?.accepted_riders?.length} Going
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: fonts.medium,
                        color: '#585858',
                        lineHeight: 18,
                        marginTop: wp(2),
                      }}>
                      {item?.description}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                          source={require('../../../../assets/locationlight.png')}
                          resizeMode="contain"
                          style={{width: 12, height: 16}}
                        />
                        <Text
                          style={{
                            fontSize: 10,
                            color: '#9593A4',
                            fontFamily: fonts.bold,
                            marginLeft: 3,
                          }}>
                          {item?.destination_location} to{' '}
                          {item?.pickup_location}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: wp(2),
                        }}>
                        <Image
                          source={require('../../../../assets/timeIcon.png')}
                          resizeMode="contain"
                          style={{width: 12, height: 16}}
                        />
                        <Text
                          style={{
                            fontSize: 10,
                            color: '#9593A4',
                            fontFamily: fonts.bold,
                            marginLeft: 3,
                          }}>
                          {item.trip_time}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={item => item.id.toString()}
            />
          </View>
        )}
        <View style={{marginVertical: wp(5)}}></View>
      </ScrollView>
    </View>
  );
};

export default Trips;
