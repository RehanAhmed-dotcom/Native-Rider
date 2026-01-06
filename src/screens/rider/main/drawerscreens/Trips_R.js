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
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import MainButton from '../../../../components/MainButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Loader from '../../../../components/Loader';
import {AllGetAPI} from '../../../../components/ApiRoot';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import moment from 'moment';

const Trips_R = ({navigation}) => {
  const user = useSelector(state => state.user.user);

  const [refreshing, setRefreshing] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [myTrips, setMyTrips] = useState([]);
  const onRefresh = () => {
    fetchtrips();
  };
  const tripsdata = [
    {
      id: 1,
      titletext: 'Sakardo Fun Trip',
      image1: require('../../../../assets/trip1.png'),
      image2: require('../../../../assets/trip2.png'),
      image3: require('../../../../assets/trip3.png'),
      people: '20 Going',
      text: 'On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer sur la mise en page elle-même. Lavantage du Lorem....',
      location: 'sakardo, Pakistan',
      time: '12:00 PM',
    },
    {
      id: 2,
      titletext: 'Sakardo Fun Trip',
      image1: require('../../../../assets/trip1.png'),
      image2: require('../../../../assets/trip2.png'),
      image3: require('../../../../assets/trip3.png'),
      people: '20 Going',
      text: 'On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer sur la mise en page elle-même. Lavantage du Lorem....',
      location: 'sakardo, Pakistan',
      time: '12:00 PM',
    },
  ];
  const fetchtrips = () => {
    setIsLoading(true);
    AllGetAPI({url: 'driver-trips', Token: user?.api_token})
      .then(res => {
        setIsLoading(false);
        setRefreshing(false);
        console.log('response dataaaaaaaaa tripssss', JSON.stringify(res));
        if (res.status == 'success') {
          setRefreshing(false);
          setIsLoading(false);
          setMyTrips(res?.trips);
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
    fetchtrips();
  }, []);

  const {top} = useSafeAreaInsets();

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
        {myTrips.length === 0 ? (
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
              // inverted={true}
              renderItem={({item}) => {
                const riderImages = item?.trip_riders.map(
                  rider => rider?.rider?.image,
                );
                // const defaultImage = images.tripImg; // Fallback image

                // Assign images, handling both local and remote cases
                const image1 = riderImages[0] ? {uri: riderImages[0]} : null;
                const image2 = riderImages[1] ? {uri: riderImages[1]} : null;
                const image3 = riderImages[2] ? {uri: riderImages[2]} : null;

                return (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('TripDetails', {item})}
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
                    {/* <ImageBackground source={require('../../../../assets/mytripImage.png')} resizeMethod='contain' style={{width:wp(83),height:212,alignSelf:'center'}} borderRadius={9}>
  <View style={{width:wp(15),height:wp(18),backgroundColor:'#009B3A1A',borderRadius:9,margin:10,justifyContent:'center',alignItems:'center',paddingHorizontal:10}}>
  <Text style={{textAlign:'center',fontSize:16,color:'#009B3A'}}>{moment(item.date).format('DD MMM')}</Text>
  </View>
                                  </ImageBackground> */}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: wp(3),
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
                          {item?.destination_location}
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
            />
          </View>
        )}
      </ScrollView>
      <View style={{position: 'absolute', bottom: wp(10), alignSelf: 'center'}}>
        <MainButton
          title="Create Trip"
          onPress={() => navigation.navigate('Trips1_R')}
        />
      </View>
    </View>
  );
};

export default Trips_R;
