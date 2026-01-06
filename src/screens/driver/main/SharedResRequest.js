import { FlatList, Image, ImageBackground, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { images, fonts, Colors, styles } from '../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import MainButton from '../../../components/MainButton'
import Header from '../../../components/Header'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useSelector } from 'react-redux'
import { AllGetAPI, PostAPiwithToken } from '../../../components/ApiRoot'
import Toast from 'react-native-toast-message'
import Loader from '../../../components/Loader'
const SharedResRequest = ({navigation,route}) => {
        const user = useSelector(state => state.user.user)
    
        const { item } = route.params;
        console.log('item user', item)
        const [offerprice, setOfferPrice] = useState('')
        const [myselectedSeats, setSelectedSeats] = useState('')
            const [baseprice, setBasePrice] = useState('');
    
        const [confirm, setConfrim] = useState(false)
        const [isloading, setIsLoading] = useState(false);
    
        const closemodal = () => {
            setConfrim(false)
        }
        const closemodal2 = () => {
            setConfrim2(false)
        }
        const [confirm2, setConfrim2] = useState(false)
        useEffect(() => {
            if (confirm2) {
                const timer = setTimeout(() => {
                    setConfrim2(false);
                    navigation.navigate('ReachedMap');
                }, 4000);
                return () => clearTimeout(timer);
            }
        }, [confirm2]);
    
        const SendOfferPriceApi = () => {
            const formdata = new FormData();
            const token = user.api_token
            formdata.append('ride_id', item?.id);
            formdata.append('seats_requested', myselectedSeats);
            formdata.append('offer_price', offerprice ? offerprice : item.fare);
            formdata.append('driver_id', item?.user?.id);
            formdata.append('rider_id', user?.id);
    
    
            
            setIsLoading(true)
            PostAPiwithToken({ url: 'send-offer', Token: token }, formdata)
                .then(res => {
                    setIsLoading(false)
                    console.log('res of send offer ', JSON.stringify(res));
                    if (res.status == 'success') {
                        setIsLoading(false)
                        Toast.show({
                            type: 'success',
                            text1: 'Offer Price Sent',
                            text2: res.message,
                                   topOffset: Platform.OS === 'ios' ? 50 : 0,
                                      visibilityTime: 3000,
                                      autoHide: true,
                        })
                        navigation.navigate('Drawer')
                    } else {
                        setIsLoading(false)
                        Toast.show({
                            type: 'error',
                            text1: 'Error',
                            text2: res.message,
                                 topOffset: Platform.OS === 'ios' ? 50 : 0,
                                    visibilityTime: 3000,
                                    autoHide: true,
                        })
                    }
                })
                .catch(err => {
                    setIsLoading(false)
                    console.log('api error', err);
                });
        };
    
        // const handleOffer = () => {
        //     const offerPriceNumber = parseFloat(offerprice);
        //     const fareNumber = parseFloat(item?.fare);
        //     const seatsNumber = parseInt(myselectedSeats);
    
        //     // Validate number of seats
        //     if (!myselectedSeats || isNaN(seatsNumber) || seatsNumber <= 0) {
        //         Toast.show({
        //             type: 'error',
        //             text1: 'Error',
        //             text2: 'Please enter  number of seats',
        //                    topOffset: Platform.OS === 'ios' ? 50 : 0,
        //                       visibilityTime: 3000,
        //                       autoHide: true,
        //         });
        //         return;
        //     }
    
        //     // Validate offer price if provided
        //     if (offerprice && (isNaN(offerPriceNumber) || offerPriceNumber <= fareNumber)) {
        //         Toast.show({
        //             type: 'error',
        //             text1: 'Error',
        //             text2: 'Offer price should be greater than fare',
        //                  topOffset: Platform.OS === 'ios' ? 50 : 0,
        //                     visibilityTime: 3000,
        //                     autoHide: true,
        //         });
        //         return;
        //     }
    
        //     SendOfferPriceApi();
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



            const createReservation = () => {
              const formdata = new FormData();
              const token = user.api_token;
        
          const parsedOfferPrice = parseInt(offerprice); 
            // Validate fare
            if (!parsedOfferPrice || parsedOfferPrice < baseprice) {
              setIsLoading(false);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: offerprice ? `Fare amount must be greater than $${baseprice}.` : 'Please enter the fare amount.',
                topOffset: Platform.OS === 'ios' ? 50 : 0,
                visibilityTime: 3000,
                autoHide: true,     
              });
              navigation.navigate('Drawer', { screen: 'SharedReservation' });
              return; // Stop execution if fare is invalid
            }
        
        
            //   formdata.append('pickup_latitude', item?.pickup_latitude);
            //   formdata.append('pickup_longitude', item?.pickup_longitude);
            //   formdata.append('destination_latitude', item?.destination_latitude);
            //   formdata.append('destination_longitude', item?.destination_longitude);
            //   formdata.append('pickup_location', item?.pickup_location);
            //   formdata.append('destination_location', item?.destination_location);
            //   formdata.append('ride_type', item.ride_type);
            //   formdata.append('offered_price', offerprice);
            //   formdata.append('scheduled_date', item.scheduled_date || '');
            //   formdata.append('scheduled_time', item.scheduled_time || '');
            //   formdata.append('comments', item.comments);
              formdata.append('seats', myselectedSeats);
              formdata.append('reservation_id', item.id);
              formdata.append('offered_fare', offerprice);
            //   formdata.append('driver_id', item.driver_id);
              formdata.append('rider_id', item.rider_id);

              setIsLoading(true);
              PostAPiwithToken({ url: 'shared-reservation-join', Token: token }, formdata)
                .then(res => {
                  setIsLoading(false);
                  console.log('res of register ', JSON.stringify(res));
                  if (res.status === 'success') {
                    Toast.show({
                      type: 'success',
                      text1: 'Success',
                      text2: res.message,
                      topOffset: Platform.OS === 'ios' ? 50 : 0,
                      visibilityTime: 3000,
                      autoHide: true,
                    });
                    navigation.navigate('Drawer', { screen: 'SharedReservation' });
                    setSelectedSeats('')
                    setOfferPrice('');
                  } else {
                    setIsLoading(false);
                    Toast.show({
                      type: 'error',
                      text1: 'error',
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
    
        const { top, bottom } = useSafeAreaInsets();
  return (
    <ImageBackground source={images.mapBackground} resizeMode='cover' style={[styles.mainContainer,
        { paddingTop: Platform.OS == 'ios' ? top : 0 }]}>
            {isloading && <Loader />}

            <View
                style={[styles.bottomHeaderView, { backgroundColor: 'rgba(255,255,255,.6)', }]}>
                <Text style={styles.headerText}>Reservation Request</Text>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ position: 'absolute', left: wp(4) }}
                    activeOpacity={0.7} >
                    <AntDesign name='left' size={20} color={'#2D3D54'} />
                </TouchableOpacity>
            </View>
            <ScrollView>
                <View style={[styles.PickupView, { marginTop: wp(10), marginBottom: wp(2) }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(3) }}>
                        <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>{item?.pickup_location}</Text>
                        <Image source={images.pickupIcon} resizeMode='contain' style={{ width: wp(6), height: wp(6) }} />
                    </View>
                    <View style={{ width: wp(80), height: wp(0.3), backgroundColor: Colors.grey, alignSelf: 'center', marginVertical: wp(3) }}></View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(3) }}>
                        <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>{item?.destination_location}</Text>
                        <Image source={images.dropoffIcon} resizeMode='contain' style={{ width: wp(6), height: wp(6) }} />
                    </View>
                </View>
            </ScrollView>
            <View style={{ flex: 1 }}>
                <View style={styles.utitityMainView}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        {/* <Text style={{ fontSize: 14, fontFamily: fonts.bold, color: Colors.black }}>Select Ride</Text> */}
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: Colors.grey }}>
                        <Image
                            source={item?.driver?.vehicle_image_front ? { uri: item?.driver?.vehicle_image_front } : images.carImg}
                            resizeMode="contain"
                            style={{ width: wp(50), height: wp(35) }}
                        />
                        <View>
                            <Text style={[styles.paymentStyle, { color: Colors.black }]}>Price ${item.offered_price}</Text>
                            <Text style={{ color: Colors.black, fontSize: 12, fontFamily: fonts.medium }}>{item?.user?.vehicle_make} {item?.user?.vehicle_type}</Text>
                        </View>
                    </View>
                    <View>
                        <View style={[styles.inputView, { marginTop: wp(4) }]}>
                            <Text style={styles.labelStyle}>Offer Fare</Text>
                            <View style={styles.inputViewStyle}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={images.priceIcon} tintColor={Colors.buttoncolor} resizeMode='contain' style={{ width: wp(5), height: wp(6) }} />
                                    <TextInput
                                        placeholder={item.offered_price}
                                        placeholderTextColor={Colors.lightgrey}
                                        keyboardType='number-pad'
                                        style={[styles.inputStyle, { width: wp(70) }]}
                                        autoCapitalize="none"
                                        value={offerprice}
                                        onChangeText={(text) => setOfferPrice(text)}
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
                    </View>
                    <View>
                        <View style={[styles.inputView, { marginTop: wp(4) }]}>
                            <Text style={styles.labelStyle}>Number of Seats (Required)</Text>
                            <View style={styles.inputViewStyle}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={images.priceIcon} tintColor={Colors.buttoncolor} resizeMode='contain' style={{ width: wp(5), height: wp(6) }} />
                                    <TextInput
                                        placeholder={'Enter number of seats'}
                                        placeholderTextColor={Colors.lightgrey}
                                        keyboardType='number-pad'
                                        style={[styles.inputStyle, { width: wp(70) }]}
                                        autoCapitalize="none"
                                        value={myselectedSeats}
                                        onChangeText={(text) => setSelectedSeats(text)}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* {typenew == 'friend' ? (
                        <TouchableOpacity onPress={() => setConfrim(true)} style={[styles.PickupView, { marginTop: wp(4) }]} >
                            <View style={{ alignItems: 'center', paddingHorizontal: wp(3) }}>
                                <Text style={{ fontSize: 14, fontFamily: fonts.bold, color: Colors.black }}>Ridesharing Requests</Text>
                                <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: Colors.black }}>Severus Snape</Text>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => Toast.show({
                            type: 'success',
                            text1: 'Coming Soon',
                        })} style={[styles.PickupView, { marginTop: wp(4) }]} >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(3) }}>
                                <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>Book the same ride with friends</Text>
                                <Image source={images.rightarrow} resizeMode='contain' style={{ width: wp(7), height: wp(7) }} />
                            </View>
                        </TouchableOpacity>
                    )} */}

                    <View style={{ marginVertical: wp(5), marginBottom: wp(4) }}>
                        <MainButton
                            title="Request"
                            onPress={() => {
                                const seatsNumber = parseInt(myselectedSeats);
                                if (!myselectedSeats || isNaN(seatsNumber) || seatsNumber <= 0) {
                                    Toast.show({
                                        type: 'error',
                                        text1: 'Error',
                                        text2: 'Please enter number of seats',
                                        topOffset: 80
                                    });
                                    return;
                                }
                                if (item?.passengers == '0') {
                                    Toast.show({
                                        type: 'error',
                                        text1: 'Error',
                                        text2: 'No seats available, please find another ride.',
                                              topOffset: Platform.OS === 'ios' ? 50 : 0,
                                                 visibilityTime: 3000,
                                                 autoHide: true,
                                    });
                                    return;
                                }
                                // if (item.is_booked == '1') {
                                //     Toast.show({
                                //         type: 'error',
                                //         text1: 'Error',
                                //         text2: 'You already booked this ride',
                                //             topOffset: Platform.OS === 'ios' ? 50 : 0,
                                //                visibilityTime: 3000,
                                //                autoHide: true,
                                //     });
                                //     return;
                                // }
                                if (parseInt(item.passengers) < seatsNumber) {
                                    Toast.show({
                                        type: 'error',
                                        text1: 'Error',
                                        text2: 'Not enough seats available. Please select fewer seats or choose another option.',
                                               topOffset: Platform.OS === 'ios' ? 50 : 0,
                                                  visibilityTime: 3000,
                                                  autoHide: true,
                                    });
                                    return;
                                }
                                // offerprice ? handleOffer() :
                                createReservation();
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
                <View
                    style={styles.modalTopView}>
                    <View
                        style={styles.modalsecondView}>
                        <TouchableOpacity onPress={() => closemodal()} style={{ position: 'absolute', top: wp(4), right: wp(4) }}>
                            <AntDesign name='close' size={20} color={Colors.black} />
                        </TouchableOpacity>
                        <View>
                            <Image source={images.sharewithfriends} resizeMode='contain' style={{ width: wp(45), height: wp(45), alignSelf: 'center' }} />
                        </View>
                        <View style={{ alignSelf: 'center', marginHorizontal: wp(10), marginTop: wp(2) }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontFamily: fonts.medium,
                                    color: Colors.black,
                                    textAlign: 'center',
                                    lineHeight: 20
                                }}>
                                Select the contacts lets you pick the
                                one you want to share withe native
                                riders. You can share more anytime
                            </Text>
                        </View>
                        <TouchableOpacity style={{
                            width: wp(75),
                            height: wp(12),
                            borderRadius: wp(2),
                            backgroundColor: Colors.buttoncolor,
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            marginTop: wp(6)
                        }} onPress={() => { closemodal(), navigation.navigate('SelectContactsForRide') }}>
                            <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: Colors.background, }}>Select Contacts</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                transparent={true}
                visible={confirm2}
                onRequestClose={closemodal2}
                animationType="none">
                <View
                    style={styles.modalTopView}>
                    <View
                        style={[styles.modalsecondView, { paddingVertical: wp(7) }]}>
                        <TouchableOpacity onPress={() => closemodal2()} style={{ position: 'absolute', top: wp(4), right: wp(4) }}>
                            <AntDesign name='close' size={20} color={Colors.black} />
                        </TouchableOpacity>
                        <View style={{ alignSelf: 'flex-start', marginLeft: wp(5), marginTop: wp(2), width: wp(50) }}>
                            <Text style={[styles.onboardTextH, { textAlign: 'left' }]}>Your booking has been
                                Accepted!</Text>
                        </View>
                        <View style={{ marginTop: wp(10), marginRight: wp(5) }}>
                            <Image source={images.acceptrequestImg} resizeMode='contain' style={{ width: wp(55), height: wp(55), alignSelf: 'flex-end' }} />
                        </View>
                    </View>
                </View>
            </Modal>
        </ImageBackground>
  )
}

export default SharedResRequest