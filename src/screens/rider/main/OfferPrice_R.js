import {
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {images, fonts, Colors, styles} from '../../../constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../components/MainButton';
import Header from '../../../components/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {AllGetAPI, PostAPiwithToken} from '../../../components/ApiRoot';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import Loader from '../../../components/Loader';
const OfferPrice_R = ({navigation, route}) => {
  const user = useSelector(state => state.user.user);
  const [isloading, setIsLoading] = useState(false);

  const {formData, utilityOption} = route.params;
  console.log('formdataafffffffffff', user.vehicle_type);
  // const [price, setPrice] = useState(0);
  const [offerprice, setOfferPrice] = useState('');
  console.log('my offer price', offerprice);
  const [baseprice, setBasePrice] = useState('');

  const [keyboardStatus, setKeyboardStatus] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // const increasePrice = () => {
  //     setPrice(prevPrice => prevPrice + 10);
  // };

  // const decreasePrice = () => {
  //     setPrice(prevPrice => (prevPrice > 0 ? prevPrice - 10 : 0));
  // };
  const fetchBasePrice = () => {
    AllGetAPI({url: 'get-base-fare', Token: user?.api_token})
      .then(res => {
        console.log('response data baseprice', res);
        setBasePrice(res.base_fare);
      })
      .catch(err => {
        console.log('api error', err);
      });
  };

  useEffect(() => {
    fetchBasePrice();
  }, []);

  const handleNextPress = () => {
    const parsedOfferPrice = parseInt(offerprice);
    if (parsedOfferPrice && parsedOfferPrice > baseprice) {
      createRide();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: parsedOfferPrice
          ? `Fare amount must be greater than $${baseprice}.`
          : 'Please enter the fare amount.',
        topOffset: Platform.OS === 'ios' ? 50 : 0,
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };
  const createRide = () => {
    const formdata = new FormData();
    const token = user.api_token;
    formdata.append('available_seats', formData?.selectedSeats);
    formdata.append('fare', offerprice);
    formdata.append('date', formData.SelectedTime2);
    formdata.append('time', formData.SelectedTime);
    formdata.append('pickup_latitude', formData.pickupLat);
    formdata.append('pickup_longitude', formData.pickupLng);
    formdata.append('destination_latitude', formData.dropoffLat);
    formdata.append('destination_longitude', formData.dropoffLng);
    formdata.append('pickup_address', formData.pickup);
    formdata.append('destination_address', formData.dropoff);
    formdata.append('vehicle_type', user?.vehicle_type);
    formdata.append('utility_options', utilityOption);
    // formdata.append('is_smoking', toggleStates?.smoke);
    // formdata.append('has_other_items', toggleStates?.otherItems);

    setIsLoading(true);

    PostAPiwithToken({url: 'create-ride', Token: token}, formdata)
      .then(res => {
        console.log('res of register dfdfdfd ', res);
        setIsLoading(false);
        if (res.status == 'success') {
          setIsLoading(false);
          Toast.show({
            type: 'success',
            text1: 'Ride Created',
            text2: 'Ride created successfully',
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          navigation.navigate('Drawer_R');
          setPrice('');
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('api error', err);
      });
  };

  const {top, bottom} = useSafeAreaInsets();
  return (
    <ImageBackground
      source={images.offerpricebg}
      resizeMode="cover"
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS == 'ios' ? top : 0},
      ]}>
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : keyboardStatus === true
            ? 'height'
            : 'undefined'
        }
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        {isloading && <Loader />}
        <Header head="Offer Price" onPress={() => navigation.goBack()} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{paddingBottom: wp(10)}}>
          <View style={{marginTop: wp(4), marginHorizontal: wp(20)}}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.medium,
                color: Colors.black,
                textAlign: 'center',
              }}>
              Offer the price amount you want for sharing the ride
            </Text>
          </View>
          <View style={[styles.inputView, {marginTop: wp(4)}]}>
            <Text style={styles.labelStyle}>Offer Fare</Text>
            <View style={styles.inputViewStyle}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={images.priceIcon}
                  tintColor={Colors.buttoncolor}
                  resizeMode="contain"
                  style={{width: wp(5), height: wp(6)}}
                />
                <View
                  style={[
                    styles.inputContainer,
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: wp(70),
                      borderWidth: 0,
                      borderTopColor: 'white',
                    },
                  ]}>
                  <Text style={{color: Colors.black, fontSize: 14}}>$</Text>
                  <TextInput
                    placeholder="Enter the fare amount"
                    placeholderTextColor={Colors.lightgrey}
                    keyboardType="number-pad"
                    style={[styles.inputStyle, {flex: 1, marginLeft: -1}]}
                    autoCapitalize="none"
                    value={offerprice}
                    onChangeText={text =>
                      setOfferPrice(text.replace(/[^0-9]/g, ''))
                    } // Keep only digits
                  />
                </View>
              </View>
              <TouchableOpacity style={{paddingRight: wp(3)}}>
                <AntDesign name={'edit'} size={20} color={Colors.buttoncolor} />
              </TouchableOpacity>
            </View>
          </View>
          {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: wp(5), marginTop: wp(3) }}>
                    <TouchableOpacity onPress={decreasePrice} style={styles.priceView}>
                        <View style={styles.priceInnerView}>
                            <AntDesign name='minus' size={20} color={Colors.white} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.priceView2}>
                        <Text style={{ fontSize: 18, fontFamily: fonts.bold, color: Colors.buttoncolor }}>${price}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={increasePrice} style={styles.priceView}>
                        <View style={styles.priceInnerView}>
                            <AntDesign name='plus' size={20} color={Colors.white} />
                        </View>
                    </TouchableOpacity>
                </View> */}
          {/* <View style={[styles.PickupView, { marginTop: wp(10), marginBottom: wp(1) }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(3) }}>
                        <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>Philadelphia</Text>
                        <Image source={images.pickupIcon} resizeMode='contain' style={{ width: wp(6), height: wp(6) }} />
                    </View>
                    <View style={{ width: wp(80), height: wp(0.3), backgroundColor: Colors.grey, alignSelf: 'center', marginVertical: wp(3) }}></View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(3) }}>
                        <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>New York</Text>
                        <Image source={images.dropoffIcon} resizeMode='contain' style={{ width: wp(6), height: wp(6) }} />
                    </View>
                </View> */}
          <View
            style={[
              styles.PickupView,
              {marginTop: wp(10), marginBottom: wp(1)},
            ]}>
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
                {formData?.pickup}
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
                {formData?.dropoff}
              </Text>
            </View>
          </View>
          <View style={{marginTop: wp(20)}}>
            <MainButton title="Continue" onPress={() => handleNextPress()} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};
export default OfferPrice_R;
