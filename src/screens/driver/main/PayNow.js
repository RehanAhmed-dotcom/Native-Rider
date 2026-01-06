import {
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
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
import {PostAPiwithToken} from '../../../components/ApiRoot';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';
import Loader from '../../../components/Loader';
import {
  initPaymentSheet,
  presentPaymentSheet,
  isPlatformPaySupported,
  confirmPlatformPayPayment,
} from '@stripe/stripe-react-native';
const PayNow = ({navigation, route}) => {
  const [confirm, setConfrim] = useState(false);
  const user = useSelector(state => state.user.user);
  const [isloading, setIsLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const {code, tripresponse} = route.params;
  console.log('tripresponse', tripresponse);
  const closemodal = () => {
    setConfrim(false);
  };

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

  const _paymentIntentApi = () => {
    setIsLoading(true);
    const formdata = new FormData();
    formdata.append('amount', tripresponse.price);
    formdata.append('driver_id', tripresponse.driver_id);
    formdata.append('trip_id', tripresponse.id);
    formdata.append('promo_code', promoCode);

    PostAPiwithToken({url: 'payment-intent', Token: user?.api_token}, formdata)
      .then(res => {
        console.log('ressss of intent api', res);
        if (res.status == 'success') {
          setIsLoading(false);
          initializePaymentSheet(res);
        } else {
          setIsLoading(false);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message || 'Something went wrong',
            topOffset: Platform.OS === 'ios' ? 20 : 0,
            visibilityTime: 3000,
            autoHide: true,
            topOffset: Platform.OS === 'ios' ? 20 : 0,
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
    formdata.append('trip_id', response.trip_id);
    formdata.append('payment_Intent_id', response.payment_Intent_id);
    PostAPiwithToken({url: 'confirm-payment', Token: user?.api_token}, formdata)
      .then(res => {
        setIsLoading(false);
        if (res.status == 'success') {
          console.log('res of payment confirm api', res);
          _addintotripAPI();
          // navigation.navigate('Drawer',{screen:'Bookings'})
        } else {
          console.log('Error in payment confirm:', res);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message || 'Something went wrong',
            topOffset: Platform.OS === 'ios' ? 20 : 0,
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
  const _addintotripAPI = () => {
    const formdata = new FormData();
    const token = user.api_token;
    formdata.append('trip_id', tripresponse?.id);
    formdata.append('status', 'accepted');
    setIsLoading(true);
    PostAPiwithToken({url: 'join-trip', Token: token}, formdata)
      .then(res => {
        setIsLoading(false);
        if (res.status === 'success') {
          navigation.navigate('Drawer', {screen: 'Trips'});
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: `You are now an official member of the trip to ${tripresponse?.destination}`,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message || 'Something went wrong',
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
          });
        }
        console.log('response data-------', res);
      })
      .catch(err => {
        setIsLoading(false);
        console.log('api error', err);
      });
  };

  // const CompleteRideApi = () => {
  //     const formdata = new FormData();
  //     const token = user?.api_token
  //     formdata.append('ride_id', item.id);
  //     setIsLoading(true)
  //     PostAPiwithToken({ url: 'complete-ride', Token: token }, formdata)
  //         .then(res => {
  //             setIsLoading(false)
  //             console.log('res of register ', JSON.stringify(res));
  //             if (res.status == 'success') {
  //                 setIsLoading(false)
  //                 Toast.show({
  //                     type: 'success',
  //                     text1: 'Ride Completed successfully!',
  //                     text2: res.message,
  //                     topOffset: 80
  //                 })
  //                 navigation.navigate('Drawer')
  //             } else {
  //                 setIsLoading(false)
  //                 Toast.show({

  //                     type: 'error',
  //                     text1: res.message,
  //                     topOffset: 80
  //                 })
  //             }
  //         })
  //         .catch(err => {
  //             setIsLoading(false)
  //             console.log('api error', err);
  //         });
  // };
  const {top, bottom} = useSafeAreaInsets();
  return (
    <ImageBackground
      source={images.paymentbg}
      resizeMode="cover"
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS == 'ios' ? top : 0},
      ]}>
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios'
            ? ''
            : keyboardStatus === true
            ? 'height'
            : 'undefined'
        }
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        {isloading && <Loader />}

        <Header head="Payment" onPress={() => navigation.goBack()} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: Platform.OS === 'ios' ? wp(70) : wp(6),
          }}>
          <View
            style={{
              alignSelf: 'center',
              marginTop: wp(15),
              marginHorizontal: wp(20),
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.bold,
                color: Colors.black,
                textAlign: 'center',
                lineHeight: 22,
              }}>
              Please pay your fare first
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.bold,
                color: Colors.buttoncolor,
                textAlign: 'center',
                marginTop: wp(5),
              }}>
              Ride Price
            </Text>
            <Text
              style={[
                styles.paymentStyle,
                {fontSize: 18, textAlign: 'center'},
              ]}>
              $ {tripresponse?.price}
            </Text>
          </View>
          <View style={[styles.inputView, {marginTop: wp(4)}]}>
            <Text style={styles.labelStyle}>Promo Code</Text>
            <View style={styles.inputViewStyle}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={require('../../../assets/promoimg.jpeg')}
                  resizeMode="contain"
                  style={{width: wp(5), height: wp(6)}}
                />
                <TextInput
                  placeholder={'Enter Promo Code'}
                  placeholderTextColor={Colors.lightgrey}
                  keyboardType="default"
                  style={[styles.inputStyle, {width: wp(70)}]}
                  autoCapitalize="none"
                  value={promoCode}
                  maxLength={6}
                  onChangeText={text => setPromoCode(text)}
                />
              </View>
              <TouchableOpacity style={{paddingRight: wp(3)}}>
                <AntDesign name={'edit'} size={20} color={Colors.buttoncolor} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{marginTop: wp(15), marginBottom: wp(4)}}>
            <MainButton title="Pay Now" onPress={() => _paymentIntentApi()} />
          </View>
        </ScrollView>
        <Modal
          transparent={true}
          visible={confirm}
          onRequestClose={closemodal}
          animationType="none">
          <View style={styles.modalTopView}>
            <View style={styles.modalsecondView}>
              <TouchableOpacity
                onPress={() => closemodal()}
                style={{position: 'absolute', top: wp(4), right: wp(4)}}>
                <AntDesign name="close" size={20} color={Colors.black} />
              </TouchableOpacity>
              <View>
                <Image
                  source={images.paynowImg}
                  resizeMode="contain"
                  style={{width: wp(35), height: wp(35), alignSelf: 'center'}}
                />
              </View>
              <View
                style={{
                  alignSelf: 'center',
                  marginHorizontal: wp(10),
                  marginTop: wp(2),
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.bold,
                    color: Colors.black,
                    textAlign: 'center',
                  }}>
                  Payment Success
                </Text>

                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                    textAlign: 'center',
                    lineHeight: 20,
                    marginTop: wp(3),
                  }}>
                  Your money has been successfully sent to the rider
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  closemodal(), navigation.navigate('Feedback');
                }}
                style={{
                  width: wp(75),
                  height: wp(12),
                  borderRadius: wp(2),
                  backgroundColor: Colors.buttoncolor,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginTop: wp(6),
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.bold,
                    color: Colors.background,
                  }}>
                  Feedback The Rider
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};
export default PayNow;
