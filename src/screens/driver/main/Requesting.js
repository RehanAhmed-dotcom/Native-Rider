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
  KeyboardAvoidingView,
  Keyboard,
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
import {useSelector} from 'react-redux';
import {PostAPiwithToken} from '../../../components/ApiRoot';
import Toast from 'react-native-toast-message';
import Loader from '../../../components/Loader';

const Requesting = ({navigation, route}) => {
  const user = useSelector(state => state.user.user);
  const {typenew, item} = route.params;
  console.log('item user', user);
  const [offerprice, setOfferPrice] = useState('');
  const [myselectedSeats, setSelectedSeats] = useState('');
  const [confirm, setConfrim] = useState(false);
  const [confirm2, setConfrim2] = useState(false);
  const [isloading, setIsLoading] = useState(false);

  // ScrollView and input refs
  const scrollViewRef = useRef(null);
  const offerPriceInputRef = useRef(null);
  const seatsInputRef = useRef(null);
  const [inputPositions, setInputPositions] = useState({});

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

  const closemodal = () => {
    setConfrim(false);
  };
  const closemodal2 = () => {
    setConfrim2(false);
  };

  useEffect(() => {
    if (confirm2) {
      const timer = setTimeout(() => {
        setConfrim2(false);
        navigation.navigate('ReachedMap');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [confirm2]);

  // Handle input focus and scroll to position
  const handleInputFocus = inputName => {
    if (scrollViewRef.current && inputPositions[inputName]) {
      scrollViewRef.current.scrollTo({
        y: inputPositions[inputName],
        animated: true,
      });
    }
  };

  // Store input position on layout
  const handleInputLayout = (inputName, event) => {
    const {y} = event.nativeEvent.layout;
    setInputPositions(prev => ({...prev, [inputName]: y}));
  };

  const SendOfferPriceApi = () => {
    const formdata = new FormData();
    const token = user.api_token;
    formdata.append('ride_id', item?.id);
    formdata.append('seats_requested', myselectedSeats);
    formdata.append('offer_price', offerprice ? offerprice : item.fare);
    formdata.append('driver_id', item?.user?.id);
    formdata.append('rider_id', user?.id);

    setIsLoading(true);
    PostAPiwithToken({url: 'send-offer', Token: token}, formdata)
      .then(res => {
        setIsLoading(false);
        console.log('res of send offer ', JSON.stringify(res));
        if (res.status == 'success') {
          Toast.show({
            type: 'success',
            text1: 'Offer Price Sent',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          navigation.navigate('Drawer');
        } else {
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

  const {top, bottom} = useSafeAreaInsets();

  return (
    <ImageBackground
      source={images.mapBackground}
      resizeMode="cover"
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS == 'ios' ? top : 0},
      ]}>
      {isloading && <Loader />}
      <View
        style={[
          styles.bottomHeaderView,
          {backgroundColor: 'rgba(255,255,255,.6)'},
        ]}>
        <Text style={styles.headerText}>Requesting...</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{position: 'absolute', left: wp(4)}}
          activeOpacity={0.7}>
          <AntDesign name="left" size={20} color={'#2D3D54'} />
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : keyboardStatus === true
            ? 'height'
            : 'undefined'
        }
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        {/* <ScrollView
          ref={scrollViewRef}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{paddingBottom: bottom + hp(10)}}> */}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{paddingBottom: wp(6)}}>
          <View style={{width: wp(100), height: hp(100)}}>
            <View
              style={[
                styles.PickupView,
                {marginTop: wp(10), marginBottom: wp(2)},
              ]}>
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
                  {item?.pickup_address}
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
                  {item?.destination_address}
                </Text>
                <Image
                  source={images.dropoffIcon}
                  resizeMode="contain"
                  style={{width: wp(6), height: wp(6)}}
                />
              </View>
            </View>

            <View style={{flex: 1}}>
              <View style={styles.utitityMainView}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.bold,
                      color: Colors.black,
                    }}>
                    Select Ride
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderColor: Colors.grey,
                  }}>
                  <Image
                    source={
                      item?.user?.vehicle_image_front
                        ? {uri: item?.user?.vehicle_image_front}
                        : images.carImg
                    }
                    resizeMode="contain"
                    style={{width: wp(50), height: wp(35)}}
                  />
                  <View>
                    <Text style={[styles.paymentStyle, {color: Colors.black}]}>
                      Price ${item?.fare}
                    </Text>
                    <Text
                      style={{
                        color: Colors.black,
                        fontSize: 12,
                        fontFamily: fonts.medium,
                      }}>
                      {item?.user?.vehicle_make} {item?.user?.vehicle_type}
                    </Text>
                  </View>
                </View>
                <View
                  onLayout={event => handleInputLayout('offerPrice', event)}>
                  <View style={[styles.inputView, {marginTop: wp(4)}]}>
                    <Text style={styles.labelStyle}>Offer Fare</Text>
                    <View style={styles.inputViewStyle}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                          source={images.priceIcon}
                          tintColor={Colors.buttoncolor}
                          resizeMode="contain"
                          style={{width: wp(5), height: wp(6)}}
                        />
                        <TextInput
                          ref={offerPriceInputRef}
                          placeholder={item.fare}
                          placeholderTextColor={Colors.lightgrey}
                          keyboardType="number-pad"
                          style={[styles.inputStyle, {width: wp(70)}]}
                          autoCapitalize="none"
                          value={offerprice}
                          onChangeText={text => setOfferPrice(text)}
                          onFocus={() => handleInputFocus('offerPrice')}
                        />
                      </View>
                      <TouchableOpacity style={{paddingRight: wp(3)}}>
                        <AntDesign
                          name={'edit'}
                          size={20}
                          color={Colors.buttoncolor}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View onLayout={event => handleInputLayout('seats', event)}>
                  <View style={[styles.inputView, {marginTop: wp(4)}]}>
                    <Text style={styles.labelStyle}>
                      Number of Seats (Required)
                    </Text>
                    <View style={styles.inputViewStyle}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                          source={images.priceIcon}
                          tintColor={Colors.buttoncolor}
                          resizeMode="contain"
                          style={{width: wp(5), height: wp(6)}}
                        />
                        <TextInput
                          ref={seatsInputRef}
                          placeholder={'Enter number of seats'}
                          placeholderTextColor={Colors.lightgrey}
                          keyboardType="number-pad"
                          style={[styles.inputStyle, {width: wp(70)}]}
                          autoCapitalize="none"
                          value={myselectedSeats}
                          onChangeText={text => setSelectedSeats(text)}
                          onFocus={() => handleInputFocus('seats')}
                        />
                      </View>
                    </View>
                  </View>
                </View>
                {typenew == 'friend' ? (
                  <TouchableOpacity
                    onPress={() => setConfrim(true)}
                    style={[styles.PickupView, {marginTop: wp(4)}]}>
                    <View
                      style={{alignItems: 'center', paddingHorizontal: wp(3)}}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: fonts.bold,
                          color: Colors.black,
                        }}>
                        Ridesharing Requests
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: fonts.medium,
                          color: Colors.black,
                        }}>
                        Severus Snape
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      Toast.show({
                        type: 'success',
                        text1: 'Coming Soon',
                      })
                    }
                    style={[styles.PickupView, {marginTop: wp(4)}]}>
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
                        Book the same ride with friends
                      </Text>
                      <Image
                        source={images.rightarrow}
                        resizeMode="contain"
                        style={{width: wp(7), height: wp(7)}}
                      />
                    </View>
                  </TouchableOpacity>
                )}

                <View style={{marginVertical: wp(5), marginBottom: wp(4)}}>
                  <MainButton
                    title="Request"
                    onPress={() => {
                      const seatsNumber = parseInt(myselectedSeats);
                      if (
                        !myselectedSeats ||
                        isNaN(seatsNumber) ||
                        seatsNumber <= 0
                      ) {
                        Toast.show({
                          type: 'error',
                          text1: 'Error',
                          text2: 'Please enter number of seats',
                          topOffset: 80,
                        });
                        return;
                      }
                      if (item?.available_seats == '0') {
                        Toast.show({
                          type: 'error',
                          text1: 'Error',
                          text2:
                            'No seats available, please find another ride.',
                          topOffset: Platform.OS === 'ios' ? 50 : 0,
                          visibilityTime: 3000,
                          autoHide: true,
                        });
                        return;
                      }
                      if (item.is_booked == '1') {
                        Toast.show({
                          type: 'error',
                          text1: 'Error',
                          text2: 'You already booked this ride',
                          topOffset: Platform.OS === 'ios' ? 50 : 0,
                          visibilityTime: 3000,
                          autoHide: true,
                        });
                        return;
                      }
                      if (parseInt(item.available_seats) < seatsNumber) {
                        Toast.show({
                          type: 'error',
                          text1: 'Error',
                          text2:
                            'Not enough seats available. Please select fewer seats or choose another option.',
                          topOffset: Platform.OS === 'ios' ? 50 : 0,
                          visibilityTime: 3000,
                          autoHide: true,
                        });
                        return;
                      }
                      SendOfferPriceApi();
                    }}
                  />
                </View>
              </View>
            </View>
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
                      source={images.sharewithfriends}
                      resizeMode="contain"
                      style={{
                        width: wp(45),
                        height: wp(45),
                        alignSelf: 'center',
                      }}
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
                        fontSize: 14,
                        fontFamily: fonts.medium,
                        color: Colors.black,
                        textAlign: 'center',
                        lineHeight: 20,
                      }}>
                      Select the contacts lets you pick the one you want to
                      share withe native riders. You can share more anytime
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: wp(75),
                      height: wp(12),
                      borderRadius: wp(2),
                      backgroundColor: Colors.buttoncolor,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      marginTop: wp(6),
                    }}
                    onPress={() => {
                      closemodal(),
                        navigation.navigate('SelectContactsForRide');
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: fonts.bold,
                        color: Colors.background,
                      }}>
                      Select Contacts
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <Modal
              transparent={true}
              visible={confirm2}
              onRequestClose={closemodal2}
              animationType="none">
              <View style={styles.modalTopView}>
                <View
                  style={[styles.modalsecondView, {paddingVertical: wp(7)}]}>
                  <TouchableOpacity
                    onPress={() => closemodal2()}
                    style={{position: 'absolute', top: wp(4), right: wp(4)}}>
                    <AntDesign name="close" size={20} color={Colors.black} />
                  </TouchableOpacity>
                  <View
                    style={{
                      alignSelf: 'flex-start',
                      marginLeft: wp(5),
                      marginTop: wp(2),
                      width: wp(50),
                    }}>
                    <Text style={[styles.onboardTextH, {textAlign: 'left'}]}>
                      Your booking has been Accepted!
                    </Text>
                  </View>
                  <View style={{marginTop: wp(10), marginRight: wp(5)}}>
                    <Image
                      source={images.acceptrequestImg}
                      resizeMode="contain"
                      style={{
                        width: wp(55),
                        height: wp(55),
                        alignSelf: 'flex-end',
                      }}
                    />
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Requesting;
