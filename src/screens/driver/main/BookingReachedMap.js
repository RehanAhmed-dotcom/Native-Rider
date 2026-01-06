import {
  FlatList,
  Image,
  ImageBackground,
  Modal,
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import RBSheet from 'react-native-raw-bottom-sheet';
import {PostAPiwithToken} from '../../../components/ApiRoot';
import Loader from '../../../components/Loader';
import {
  initPaymentSheet,
  presentPaymentSheet,
  isPlatformPaySupported,
  confirmPlatformPayPayment,
} from '@stripe/stripe-react-native';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';

const BookingReachedMap = ({navigation, route}) => {
  const user = useSelector(state => state.user.user);
  const [isloading, setIsLoading] = useState(false);
  const {item, distance} = route.params;
      const [promoCode, setPromoCode] = useState('')

  console.log('my item data for payment', item);
  const {top, bottom} = useSafeAreaInsets();
  const refRBSheet = useRef();
  useEffect(() => {
    if (refRBSheet.current) {
      refRBSheet.current.open();
    }
  }, []);

  const _paymentIntentApi = () => {
    setIsLoading(true);
    const formdata = new FormData();
    formdata.append(
      'amount',
      item?.offer[0]?.offer_price ? item?.offer[0]?.offer_price : item?.fare,
    );
    formdata.append('driver_id', item.user_id);
    formdata.append('ride_id', item.id);
    formdata.append('promo_code', promoCode);


    PostAPiwithToken({url: 'payment-intent', Token: user?.api_token}, formdata)
      .then(res => {
        console.log('ressss of intent api', res);
        if (res.status == 'success') {
          setIsLoading(false);
          initializePaymentSheet(res);
          refRBSheet.current.close()
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

  const initializePaymentSheet = async responce => {
    const {error} = await initPaymentSheet({
      customerId: responce.customer,
      customerEphemeralKeySecret: responce.ephemeralKey,
      paymentIntentClientSecret: responce.client_secret,
      merchantDisplayName: 'arenachat.ro',
      allowsDelayedPaymentMethods: true,
      style: 'alwaysDark',
      returnURL: 'arenachat://stripe-redirect',
    });
    if (!error) {
      openPaymentSheet(responce);
    } else {
      console.log('initializePaymentSheet Error:', error);
    }
  };

  const openPaymentSheet = async responce => {
    console.log('my response', responce);
    const {error} = await presentPaymentSheet();
    if (error) {
      console.log('presentPaymentSheet Error:', error);
    } else {
      _paymentConfirmApi(responce);
    }
  };

  const _paymentConfirmApi = response => {
    setIsLoading(true);
    const formdata = new FormData();
    formdata.append('amount', response.amount);
    formdata.append('customer_id', response.customer_id);
    formdata.append('ride_id', response.ride_id);
    formdata.append('payment_Intent_id', response.payment_Intent_id);
    PostAPiwithToken({url: 'confirm-payment', Token: user?.api_token}, formdata)
      .then(res => {
        setIsLoading(false);
        if (res.status == 'success') {
          console.log('res of payment confirm api', res);
          // navigation.navigate('Drawer', {screen: 'Bookings'});
          navigation.navigate('PaymentCompleteRide',{response})
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        } else {
          console.log('Error in payment confirm:', res);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('api error', err);
      });
  };
  return (
    <ImageBackground
      source={images.reachedbackground}
      resizeMode="cover"
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS == 'ios' ? top : 0},
      ]}>
      {isloading && <Loader />}
      {/* <Header head="Requesting..." onPress={() => navigation.goBack()} /> */}
      <ScrollView></ScrollView>
      <RBSheet
        ref={refRBSheet}
        height={440}
        draggable={true}
        openDuration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: Colors.white,
            shadowOffset: {height: 2, width: 2},
            shadowOpacity: 0.2,
            shadowColor: '#4686D4',
            elevation: 2,
          },
        }}>
        <View
          style={[styles.PickupView, {marginTop: wp(5), marginBottom: wp(2)}]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: wp(3),
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.medium,
                color: Colors.black,
              }}>
              {item.pickup_address}
            </Text>
            <Image
              source={images.pickupIcon}
              resizeMode="contain"
              style={{width: wp(6), height: wp(6)}}
            />
          </View>
          <View
            style={{
              width: wp(80),
              height: wp(0.3),
              backgroundColor: Colors.grey,
              alignSelf: 'center',
              marginVertical: wp(3),
            }}></View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: wp(3),
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.medium,
                color: Colors.black,
              }}>
              {item.destination_address}
            </Text>
            <Image
              source={images.dropoffIcon}
              resizeMode="contain"
              style={{width: wp(6), height: wp(6)}}
            />
          </View>
        </View>
        <View style={{marginHorizontal: wp(6), marginTop: wp(3)}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={
                  item?.user?.image ? {uri: item?.user?.image} : images.chatpic1
                }
                resizeMode="contain"
                style={styles.driverimg}
                borderRadius={wp(5)}
              />
              <View style={{marginLeft: wp(2)}}>
                <Text style={styles.usernameText}>{item?.user?.name}</Text>
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
                  item?.user?.vehicle_image_front
                    ? {uri: item?.user?.vehicle_image_front}
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
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                {/* (5mins away) */}
              </Text>
            </View>
            <Text style={styles.paymentStyle}>
              Price $
              {item.offer[0]?.offer_price
                ? item.offer[0]?.offer_price
                : item?.fare}
            </Text>
          </View>
        </View>
          <View style={[styles.inputView, { marginTop: wp(4) }]}>
                                    <Text style={styles.labelStyle}>Promo Code</Text>
                                    <View style={styles.inputViewStyle}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Image source={require('../../../assets/promoimg.jpeg')}  resizeMode='contain' style={{ width: wp(5), height: wp(6) }} />
                                            <TextInput
                                                placeholder={'Enter Promo Code'}
                                                placeholderTextColor={Colors.lightgrey}
                                                keyboardType='default'
                                                style={[styles.inputStyle, { width: wp(70) }]}
                                                autoCapitalize="none"
                                                value={promoCode}

                                                maxLength={6}
                                                onChangeText={(text) => setPromoCode(text)}
                                            />
                                        </View>
                                        <TouchableOpacity
                                            style={{ paddingRight: wp(3) }}>
                                            <AntDesign
                                                name={'edit'}
                                                size={20}
                                                color={Colors.buttoncolor} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
        <View style={{marginTop: wp(12), marginBottom: wp(4)}}>
          <MainButton
            title="Pay Now"
            onPress={() => {
          _paymentIntentApi();
              // navigation.navigate('PayNow')
            }}
          />
        </View>
      </RBSheet>
    </ImageBackground>
  );
};

export default BookingReachedMap;
