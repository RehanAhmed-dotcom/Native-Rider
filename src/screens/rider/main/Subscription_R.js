import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  BackHandler,
  ImageBackground,
  Modal,
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

import Toast from 'react-native-toast-message';
import {AllGetAPI, PostAPiwithToken} from '../../../components/ApiRoot';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '../../../redux/Auth';
import Loader from '../../../components/Loader';
import {
  initPaymentSheet,
  presentPaymentSheet,
  isPlatformPaySupported,
  confirmPlatformPayPayment,
} from '@stripe/stripe-react-native';
const Subscription_R = ({navigation}) => {
  const user = useSelector(state => state.user.user);

  console.log('my user sub data', user);
  const dispatch = useDispatch();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subprice, setSub_price] = useState('50');
  const [confirmSout, setConfrimSout] = useState(false);
  const closemodalSout = () => {
    setConfrimSout(false);
  };
  const [confreetrail, setConfreetrail] = useState(false);
  const closeFreeTrail = () => {
    setConfreetrail(false);
  };
  const [isTrialActive, setIsTrialActive] = useState(true);
  console.log('mytrail', isTrialActive);
  console.log('my sub', isSubscribed);
  const checkTrialPeriod = () => {
    if (user?.created_at) {
      const createdAt = new Date(user.created_at);
      const trialEndDate = new Date(createdAt);
      trialEndDate.setDate(createdAt.getDate() + 5);
      const currentDate = new Date();
      if (currentDate > trialEndDate) {
        setIsTrialActive(false);
      } else {
        setIsTrialActive(true);
      }
    }
  };
  const _paymentIntentApi = () => {
    setIsLoading(true);
    PostAPiwithToken({url: 'subscribe', Token: user?.api_token})
      .then(res => {
        console.log('ressss of intent api', res);
        setIsLoading(false);

        if (res.status == 'success') {
          setIsLoading(false);
          initializePaymentSheet(res);
        } else {
          setIsLoading(false);
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
    PostAPiwithToken({url: 'confirm-subscription', Token: user?.api_token})
      .then(res => {
        setIsLoading(false);
        if (res.status == 'success') {
          subscriptionstatus_api();
          _editAPI();
          console.log('res of payment confirm sub api', res);
          //   navigation.navigate('RefferalCode_R')
        } else {
          console.log('Error in payment confirm:', res);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('api error', err);
      });
  };

  const subscriptionstatus_api = () => {
    setIsLoading(true);
    AllGetAPI({url: 'subscription-status', Token: user?.api_token})
      .then(res => {
        setIsLoading(false);
        console.log('response of subscriptions', JSON.stringify(res));
        if (res.status === 'success') {
          setIsLoading(false);
          setIsSubscribed(res.subscribed);
        } else {
          setIsLoading(false);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        setRefreshing(false);
        console.log('api error', err);
      });
  };

  useEffect(() => {
    checkTrialPeriod();

    subscriptionstatus_api();
  }, []);

  const _cancelSubscriptionApi = () => {
    setIsLoading(true);
    PostAPiwithToken({url: 'cancel-subscription', Token: user?.api_token})
      .then(res => {
        console.log('ressss of  cancel subscription api', res);
        setIsLoading(false);

        if (res.status == 'success') {
          setIsLoading(false);
          subscriptionstatus_api(),
            Toast.show({
              type: 'success',
              text1: 'Success',
              text2: res.message,
              topOffset: Platform.OS === 'ios' ? 50 : 0,
              visibilityTime: 3000,
              autoHide: true,
            });
        } else {
          setIsLoading(false);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message,
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
  const _editAPI = () => {
    const token = user?.api_token;

    const formdata = new FormData();
    formdata.append('subscribed', '1');
    setIsLoading(true);

    PostAPiwithToken({url: 'edit', Token: token}, formdata)
      .then(res => {
        setIsLoading(false);
        // console.log('my Response:', res);
        if (res?.status === 'success') {
          console.log('Response Data:', res);
          dispatch(setUser(res.userdata));
        } else {
          const errorMessage =
            res?.message?.email || res?.message || 'An error occurred.';
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: errorMessage,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });

          console.error('Error Response:', res);
        }
      })
      .catch(err => {
        setIsLoading(false);

        console.error('API Error:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong. Please try again later.',
          topOffset: Platform.OS === 'ios' ? 50 : 0,
          visibilityTime: 3000,
          autoHide: true,
        });
      });
  };
  const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  const {top} = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS === 'ios' ? top : 0},
      ]}>
      {isLoading && <Loader />}
      <View
        style={[
          styles.bottomHeaderView,
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: wp(4),
          },
        ]}>
        <TouchableOpacity
          style={{}}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <AntDesign name="left" size={20} color={'#2D3D54'} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Subscription</Text>

        {/* <TouchableOpacity
          style={{}}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <Text
            style={{
              fontSize: 12,
              color: Colors.black,
              fontFamily: fonts.medium,
            }}>
            Skip
          </Text>
        </TouchableOpacity> */}
        <Text></Text>
      </View>
      <Wrapper behavior="padding" style={{flex: 1}}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{paddingBottom: wp(6)}}>
          <View
            style={{
              width: wp(90),
              height: wp(80),
              borderRadius: wp(3),
              backgroundColor: Colors.white,
              alignSelf: 'center',
              marginTop: wp(3),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../../../assets/subscribeImg.png')}
              resizeMode="contain"
              style={{width: wp(80), height: wp(75)}}
            />
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: wp(5),
            }}>
            <Text
              style={{
                fontSize: 12,
                color: Colors.black,
                fontFamily: fonts.medium,
              }}>
              Unlock exclusive content—subscribe today!
            </Text>
          </View>
          {!isTrialActive || !isSubscribed ? (
            <ImageBackground
              source={require('../../../assets/sub_back.png')}
              resizeMode="cover"
              style={{
                width: wp(90),
                height: wp(15),
                alignSelf: 'center',
                justifyContent: 'center',
                paddingHorizontal: wp(4),
                marginTop: wp(5),
              }}
              borderRadius={wp(3)}>
              <TouchableOpacity
                onPress={() => setConfreetrail(true)}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.white,
                    fontFamily: fonts.bold,
                  }}>
                  5 Days of free trial
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.white,
                    fontFamily: fonts.bold,
                  }}>
                  $0.00
                </Text>
              </TouchableOpacity>
            </ImageBackground>
          ) : null}
          <ImageBackground
            source={require('../../../assets/sub_back.png')}
            resizeMode="cover"
            style={{
              width: wp(90),
              height: wp(15),
              alignSelf: 'center',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: wp(4),
              flexDirection: 'row',
              marginTop: wp(5),
            }}
            borderRadius={wp(3)}>
            <Text
              style={{
                fontSize: 14,
                color: Colors.white,
                fontFamily: fonts.bold,
              }}>
              Monthly
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: Colors.white,
                fontFamily: fonts.bold,
              }}>
              ${subprice}/month
            </Text>
          </ImageBackground>
          {!isSubscribed ? (
            <View
              style={{
                alignSelf: 'center',
                marginTop: wp(25),
                marginBottom: wp(5),
              }}>
              <MainButton
                title="Subscribe Now!"
                onPress={() => _paymentIntentApi()}
              />
            </View>
          ) : (
            <TouchableOpacity
              // onPress={()=>_cancelSubscriptionApi()}
              onPress={() => setConfrimSout(true)}
              style={{
                width: wp(90),
                height: wp(13),
                backgroundColor: '#FB5B58',
                borderRadius: wp(3),
                marginTop: wp(25),
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={[styles.titleText, {color: Colors.white, fontSize: 14}]}>
                Cancel Subscription
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </Wrapper>
      <Modal
        transparent={true}
        visible={confirmSout}
        onRequestClose={closemodalSout}
        animationType="none">
        <View style={styles.modalTopView}>
          <View style={styles.modalsecondView}>
            <View>
              <Image
                source={require('../../../assets/unsubscribe.png')}
                resizeMode="contain"
                style={{width: wp(35), height: wp(35), alignSelf: 'center'}}
              />
            </View>
            <View
              style={{
                alignSelf: 'center',
                marginHorizontal: wp(17),
                marginTop: wp(5),
              }}>
              <Text style={styles.modalText}>
                Are you sure you want to cancel your Subscription?
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
                  _cancelSubscriptionApi(), closemodalSout();
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
      <Modal
        transparent={true}
        visible={confreetrail}
        onRequestClose={closeFreeTrail}
        animationType="none">
        <View style={styles.modalTopView}>
          <View style={[styles.modalsecondView, {paddingTop: wp(5)}]}>
            <TouchableOpacity
              onPress={() => closeFreeTrail()}
              style={{
                position: 'absolute',
                top: wp(3),
                right: wp(3),
                width: wp(8),
                height: wp(8),
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}>
              <AntDesign name={'close'} size={20} color={'black'} />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 18,
                fontFamily: fonts.bold,
                color: Colors.black,
                textAlign: 'center',
              }}>
              Subscription
            </Text>
            <View>
              <Image
                source={require('../../../assets/trailpic.png')}
                resizeMode="cover"
                style={{width: wp(75), height: wp(40), alignSelf: 'center'}}
              />
            </View>
            <View
              style={{
                alignSelf: 'center',
                marginHorizontal: wp(5),
                marginTop: wp(5),
              }}>
              <Text style={[styles.modalText, {fontFamily: fonts.medium}]}>
                After 5 days trial, you’ll need to update to monthly
                subscription
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                closeFreeTrail();
              }}
              style={{
                width: wp(80),
                height: wp(12),
                backgroundColor: Colors.buttoncolor,
                borderRadius: wp(3),
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: wp(6),
              }}>
              <Text style={[styles.titleText, {fontSize: 14}]}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Subscription_R;
