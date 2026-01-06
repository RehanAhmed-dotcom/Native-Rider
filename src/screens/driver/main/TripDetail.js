import {
  FlatList,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {images, fonts, Colors, styles} from '../../../constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../components/MainButton';
import Header from '../../../components/Header';
import Toast from 'react-native-toast-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const TripDetail = ({navigation, route}) => {
  const {item} = route.params;
  console.log('my item details', item);
  const {top} = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS == 'ios' ? top : 0},
      ]}>
      <Header head="Trips" onPress={() => navigation.goBack()} />
      <View style={{marginVertical: wp(5)}}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fonts.bold,
            color: Colors.black,
            alignSelf: 'center',
          }}>
          {item.title}
        </Text>
      </View>
      <View
        style={{
          width: wp(90),
          paddingVertical: wp(6),
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
        <Text
          style={{
            fontSize: 12,
            fontFamily: fonts.medium,
            color: '#585858',
            lineHeight: 21,
          }}>
          {item?.description}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderBottomColor: '#D2D2D2',
            paddingBottom: wp(1),
            marginTop: wp(5),
          }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 14,
              fontFamily: fonts.medium,
              width: wp(70),
              color: '#898A8D',
              alignSelf: 'center',
            }}>
            {item?.driver?.vehicle_type}
          </Text>
          <Image
            source={require('../../../assets/carIcon.png')}
            resizeMode="contain"
            style={{width: 24, height: 10}}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderBottomColor: '#D2D2D2',
            paddingBottom: wp(1),
            marginTop: wp(5),
          }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 14,
              width: wp(70),

              fontFamily: fonts.medium,
              color: '#898A8D',
              alignSelf: 'center',
            }}>
            {item?.available_seats} seats available
          </Text>
          <Image
            source={require('../../../assets/seatsIcon.png')}
            resizeMode="contain"
            style={{width: 24, height: 18}}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderBottomColor: '#D2D2D2',
            paddingBottom: wp(1),
            marginTop: wp(5),
          }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 14,
              width: wp(70),
              fontFamily: fonts.medium,
              color: '#898A8D',
              alignSelf: 'center',
            }}>
            {item?.pickup_location} to {item?.destination_location}
          </Text>
          <Image
            source={require('../../../assets/locationlight.png')}
            resizeMode="contain"
            style={{width: 24, height: 18}}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderBottomColor: '#D2D2D2',
            paddingBottom: wp(1),
            marginTop: wp(5),
          }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 14,
              fontFamily: fonts.medium,
              width: wp(70),
              color: '#898A8D',
              alignSelf: 'center',
            }}>
            {item?.trip_time}
          </Text>
          <Image
            source={require('../../../assets/timeIcon.png')}
            resizeMode="contain"
            style={{width: 24, height: 14}}
          />
        </View>
      </View>
      <View
        style={{
          width: wp(90),
          paddingVertical: wp(3),
          paddingHorizontal: wp(5),
          backgroundColor: '#FFFFFF',
          borderRadius: wp(2),
          alignSelf: 'center',
          marginBottom: wp(5),
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.2,
          shadowRadius: 3,
        }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: fonts.bold,
            color: Colors.black,
          }}>
          Trip Invitation Code
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontFamily: fonts.bold,
            color: '#4686D4',
          }}>
          {item.trip_code}
        </Text>
      </View>
      {item.status == 'completed' ? (
        // <View
        //   style={{
        //     width: wp(90),
        //     height: wp(13),
        //     backgroundColor: '#22BB55',
        //     borderRadius: wp(3),
        //     alignSelf: 'center',
        //     justifyContent: 'center',
        //     alignItems: 'center',
        //     marginTop: wp(15),
        //   }}>
        //   <Text style={[styles.titleText, {color: Colors.white, fontSize: 14}]}>
        //     Completed
        //   </Text>
        // </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('TripFeedBack', {item})}
          style={{
            width: wp(90),
            height: wp(13),
            backgroundColor: Colors.buttoncolor,
            borderRadius: wp(3),
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: wp(15),
          }}>
          <Text style={[styles.titleText, {color: Colors.white, fontSize: 14}]}>
            Rate Us
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={{marginTop: wp(15), marginBottom: wp(5)}}>
          {item.status == 'started' ? (
            <MainButton
              title="Track your trip"
              onPress={() => navigation.navigate('TrackTripMap', {item})}
            />
          ) : item.status == 'cancelled' ? (
            <View
              style={{
                width: wp(90),
                height: wp(13),
                backgroundColor: '#FB5B58',
                borderRadius: wp(3),
                marginTop: wp(15),
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={[styles.titleText, {color: Colors.white, fontSize: 14}]}>
                Cancelled
              </Text>
            </View>
          ) : (
            <MainButton
              title="Want To Go"
              onPress={() =>
                item.is_booked == '1'
                  ? Toast.show({
                      type: 'error',
                      position: 'top',
                      text1: 'Already Booked',
                      text2: 'You already booked this trip',
                      visibilityTime: 3000,
                      autoHide: true,
                      topOffset: Platform.OS === 'ios' ? 50 : 0,
                    })
                  : navigation.navigate('TripCode', {tripresponse: item})
              }
            />
          )}
        </View>
      )}
    </View>
  );
};

export default TripDetail;
