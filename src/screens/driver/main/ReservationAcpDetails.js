import { FlatList, Image, ImageBackground, Switch, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,Linking } from 'react-native'
import React, { useState, useRef } from 'react'
import { images, fonts, Colors, styles } from '../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import MainButton from '../../../components/MainButton'
import Header from '../../../components/Header'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { PostAPiwithToken } from '../../../components/ApiRoot'
import Toast from 'react-native-toast-message'
const ReservationAcpDetails = ({navigation,route}) => {
            const user = useSelector(state => state.user.user)
            console.log('userdatadfsdf', user.vehicle_image_front)
            const { item, distance } = route.params;
            console.log('distance', distance)
            console.log('my item dataaaa', item)
            const { top, bottom } = useSafeAreaInsets();


            const handleCallPress = () => {
                const phoneNumber = item?.driver?.phone; // e.g., "+10166299295"
                if (phoneNumber) {
                  // Keep the original phone number for the tel: scheme (including + sign for international calls)
                  const phoneUrl = `tel:${phoneNumber}`; // Use original phoneNumber to preserve + sign
                  console.log('Attempting to open dialer with URL:', phoneUrl); // Debug log
              
                  Linking.canOpenURL(phoneUrl)
                    .then(supported => {
                      console.log('Can open URL:', supported); // Debug log
                      if (supported) {
                        Linking.openURL(phoneUrl)
                          .catch(err => {
                            console.error('Failed to open dialer:', err);
                            Toast.show({
                              type: 'error',
                              text1: 'Error',
                              text2: 'Failed to open dialer',
                              topOffset: Platform.OS === 'ios' ? 50 : 0,
                              visibilityTime: 3000,
                              autoHide: true,
                            });
                          });
                      } else {
                        // Fallback: Try opening without checking canOpenURL (sometimes canOpenURL is unreliable)
                        Linking.openURL(phoneUrl)
                          .catch(err => {
                            console.error('Fallback failed to open dialer:', err);
                            Toast.show({
                              type: 'error',
                              text1: 'Error',
                              text2: 'Dialer not supported on this device',
                              topOffset: Platform.OS === 'ios' ? 50 : 0,
                              visibilityTime: 3000,
                              autoHide: true,
                            });
                          });
                      }
                    })
                    .catch(err => {
                      console.error('Error checking canOpenURL:', err);
                      Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'An error occurred while trying to make a call',
                        topOffset: Platform.OS === 'ios' ? 50 : 0,
                        visibilityTime: 3000,
                        autoHide: true,
                      });
                    });
                } else {
                  Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Driver phone number not available',
                    topOffset: Platform.OS === 'ios' ? 50 : 0,
                    visibilityTime: 3000,
                    autoHide: true,
                  });
                }
              };
    
                  const CancelOfferApi = (id) => {
                      const formdata = new FormData();
                      const token = user.api_token
                    //   formdata.append('ride_id', id);
                    formdata.append('reservation_id', id);
                      PostAPiwithToken({ url: 'offer-reservation-cancelled', Token: token }, formdata)
                          .then(res => {
                              console.log('res of cancel ', JSON.stringify(res));
                              if (res.status == 'success') {
                                  Toast.show({
                                      type: 'success',
                                      text1: 'Cancel Offer',
                                      text2: res.message,
                                             topOffset: Platform.OS === 'ios' ? 50 : 0,
                                                  visibilityTime: 3000,
                                                  autoHide: true,
                                  })
                                //   navigation.goBack()
                                getDriverOffers()
                              } else {
                                  Toast.show({
                                      type: 'error',
                                      text1: res.message,
                                             topOffset: Platform.OS === 'ios' ? 50 : 0,
                                                  visibilityTime: 3000,
                                                  autoHide: true,
                                  })
                              }
                          })
                          .catch(err => {
                              console.log('api error', err);
                          });
                  };
              
                  const AcceptOfferApi = (id) => {
                      const formdata = new FormData();
                      const token = user.api_token
                      formdata.append('reservation_id', id);
              
                      PostAPiwithToken({ url: 'accept-offer', Token: token }, formdata)
                          .then(res => {
                              console.log('res of accept offer ', JSON.stringify(res));
                              if (res.status == 'success') {
                                  Toast.show({
                                      type: 'success',
                                      text1: 'Accept Offer',
                                      text2: res.message,
                                              topOffset: Platform.OS === 'ios' ? 50 : 0,
                                                   visibilityTime: 3000,
                                                   autoHide: true,
                                  })
                                //   getDriverOffers()
                                navigation.goBack()
                                //   navigation.navigate('Payment_R')
              
                              } else {
                                  Toast.show({
                                      type: 'error',
                                      text1: res.message,
                                              topOffset: Platform.OS === 'ios' ? 50 : 0,
                                                   visibilityTime: 3000,
                                                   autoHide: true,
                                  })
                              }
                          })
                          .catch(err => {
                              console.log('api error', err);
                          });
                  };


                    const rideDate = moment(item.scheduled_date, 'ddd, MMM DD').toDate();
                  
                    // Get the current date
                    const currentDate = new Date();
                  
                    // Compare the dates (ignoring time)
                    const isToday = rideDate.toDateString() === currentDate.toDateString();
                    console.log('isToday', isToday);
  return (
    <View style={[styles.mainContainer,
        { paddingTop: Platform.OS == 'ios' ? top : 0 }]}>
            <View
                style={styles.bottomHeaderView}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ position: 'absolute', left: wp(4) }}
                    activeOpacity={0.7} >
                    <AntDesign name='left' size={20} color={'#2D3D54'} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Reservation Details</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Conversation', { item2: item })}
                    style={{ position: 'absolute', right: wp(4) }}
                    activeOpacity={0.7} >
                    <Image source={images.chatIcon} tintColor={Colors.buttoncolor} resizeMode='contain' style={{ width: wp(6), height: wp(6) }} />
                </TouchableOpacity>
                <TouchableOpacity
                onPress={handleCallPress}
                    style={{ position: 'absolute', right: wp(12) }}
                    activeOpacity={0.7} >
                    <Image source={images.callicon} resizeMode='contain' style={{ width: wp(5), height: wp(5) }} />
                </TouchableOpacity>
            </View>
            <ScrollView>
                <View
                    style={{ justifyContent: 'center', alignItems: 'center', marginTop: wp(8), }}>
                    <Image
                        source={item?.driver?.image ? { uri: item?.driver?.image } : images.avatar}
                        resizeMode="cover"
                        style={[
                            styles.profileStyle,
                            {
                                justifyContent: 'center', alignItems: 'center', opacity: 0.9,
                            },
                        ]}
                    />
                    <Text style={[styles.usernameText, { marginTop: wp(1) }]}>{item?.driver?.name}</Text>
                    <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, lineHeight: 15 }}>Driver</Text>
                </View>
                <View style={{ marginHorizontal: wp(5), marginTop: wp(5) }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={images.locIcon} resizeMode='contain' style={{ width: wp(5), height: wp(5) }} />
                            <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, marginLeft: wp(2) }}>{distance}km</Text>
                        </View>
                        <Text style={styles.paymentStyle}>Price $ {parseInt(item?.driver_offered_price?item?.driver_offered_price:item?.offered_price)}</Text>
                    </View>
                    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={images.seatIcon} resizeMode='contain' style={{ width: wp(5), height: wp(5) }} />
                            <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, marginLeft: wp(2) }}>{item?.ride?.available_seats} seats available</Text>
                        </View>

                    </View> */}

                            <View style={[styles.inputView, {marginTop: wp(4)}]}>
                                <Text style={styles.labelStyle}>Offer Price</Text>
                                <View style={styles.inputViewStyle}>
                                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Image
                                      source={images.priceIcon}
                                      tintColor={Colors.buttoncolor}
                                      resizeMode="contain"
                                      style={{width: wp(5), height: wp(6)}}
                                    />
                                    <Text
                                      style={{
                                        fontFamily: fonts.medium,
                                        fontSize: 14,
                                        color: Colors.black,
                                        marginLeft: wp(2),
                                      }}>
                                      $
                                    </Text>
                                    <TextInput
                                      placeholder={'400'}
                                      placeholderTextColor={Colors.lightgrey}
                                      keyboardType="number-pad"
                                      style={[styles.inputStyle, {width: wp(63), marginLeft: 1}]}
                                      autoCapitalize="none"
                                      value={
                                        item.final_price
                                          ? item.final_price
                                          : offeringprice
                                      }
                                      onChangeText={text => setOffeingrPrice(text)}
                                      editable={!item.final_price                                      }
                                    />
                                  </View>
                                  {!item.driver_offered_price && (
                                    <TouchableOpacity style={{paddingRight: wp(3)}}>
                                      <AntDesign
                                        name={'edit'}
                                        size={20}
                                        color={Colors.buttoncolor}
                                      />
                                    </TouchableOpacity>
                                  )}
                                </View>
                              </View>
                    <View style={{ marginTop: wp(4), marginHorizontal: wp(4) }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(3) }}>
                            <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>{item?.pickup_location}</Text>
                            <Image source={images.pickupIcon} resizeMode='contain' style={{ width: wp(5), height: wp(5) }} />
                        </View>
                        <View style={{ width: wp(80), height: wp(0.3), backgroundColor: Colors.grey, alignSelf: 'center', marginVertical: wp(2) }}></View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(3) }}>
                            <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>{item?.destination_location}</Text>
                            <Image source={images.dropoffIcon} resizeMode='contain' style={{ width: wp(5), height: wp(5) }} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: wp(4), borderBottomWidth: 1, borderColor: Colors.grey, paddingBottom: wp(4) }}>
                        <View>
                            <Image
                                source={item?.driver?.vehicle_image_front ? { uri: item?.driver?.vehicle_image_front } : images.carImg}
                                resizeMode="contain"
                                style={{ width: wp(30), height: wp(25) }}
                            />
                        </View>
                        <View>
                            <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black }}>{user?.vehicle_make} {item?.driver?.vehicle_type}</Text>
                            <Text style={{ fontSize: 18, fontFamily: fonts.bold, color: Colors.black, lineHeight: 18 }}>{item?.driver?.license_plate}</Text>

                        </View>
                        {/* <View>
                            <Text style={{ fontSize: 12, color: '#414141', fontFamily: fonts.medium, textAlign: 'right' }}>{item?.ride?.has_pets ? 'Yes has pets' : 'No pets'}</Text>
                            <Text style={{ fontSize: 12, color: '#414141', fontFamily: fonts.medium, textAlign: 'right' }}>{item?.ride?.is_smoking ? 'Yes Smoking' : 'No Smoking'}</Text>
                            <Text style={{ fontSize: 12, color: '#414141', fontFamily: fonts.medium, textAlign: 'right' }}>{item?.ride?.has_other_items ? 'Yes, Others Items' : 'No Smoking'}</Text>
                        </View> */}
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: wp(8), }}>

                        <View>
                            <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black }}>Time</Text>
                            <Text style={{ fontSize: 18, fontFamily: fonts.bold, color: Colors.black, lineHeight: 18 }}>{item?.scheduled_time                                }</Text>

                        </View>
                        <View>
                            <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, textAlign: 'right' }}>Date</Text>
                            <Text style={{ fontSize: 18, fontFamily: fonts.bold, color: Colors.black, lineHeight: 18 }}>{item?.scheduled_date}</Text>
                        </View>
                    </View>
                </View>

                <View style={{ marginTop: wp(10),marginBottom:wp(5) }}>
                    {/* <MainButton
                        title="Accepted"
                        disabled={true}

                    /> */}
                    {item.status=='completed'?
                        <View style={[styles.btnView,{backgroundColor:item.status=='accepted'?Colors.buttoncolor:'#22BB55'}]}  activeOpacity={0.7}>
                        <Text style={styles.titleText}>{item.status=='accepted'?'Accepted':'Completed'}</Text>

                    </View>
                    :
                          //  <View
                          //       style={{
                          //         alignItems: 'center',
                     
                          //         marginHorizontal: wp(5),
                          //         marginBottom: wp(5),
                          //       }}>
                          //       {isToday ? (
                          //         <TouchableOpacity
                          //           onPress={() =>
                          //             navigation.navigate('ResMapTrack', {item, distance})
                          //           }
                          //           disabled={item.status=='accepted'?true:false}
                          //           style={{
                          //             width: wp(90),
                          //             height: wp(13),
                          //             backgroundColor: item.status === 'accepted' ? '#A9A9A9' : Colors.buttoncolor,
                          //             borderRadius: wp(3),
                          //             alignSelf: 'center',
                          //             justifyContent: 'center',
                          //             alignItems: 'center',
                          //           }}>
                          //           <Text
                          //             style={[
                          //               styles.titleText,
                          //               {color: Colors.white, fontSize: 14},
                          //             ]}>

                          //            { item.status === 'accepted' ? 'Ride not started yet.' :'Track Your Ride'}
                          //           </Text>
                          //         </TouchableOpacity>
                          //       ) : (
                          //         <View
                          //           style={{
                          //             width: wp(90),
                          //             height: wp(13),
                          //             backgroundColor: Colors.white,
                          //             borderColor: Colors.buttoncolor,
                          //             borderWidth: 1,
                          //             borderRadius: wp(3),
                          //             alignSelf: 'center',
                          //             justifyContent: 'center',
                          //             alignItems: 'center',
                          //             marginTop: wp(3),
                          //           }}>
                          //           <Text
                          //             style={[
                          //               styles.titleText,
                          //               {color: Colors.black, fontSize: 14},
                          //             ]}>
                          //             Your Ride Will Continue on {item.scheduled_date}
                          //           </Text>
                          //         </View>
                          //       )}
                              
                          //     </View>
                            <View
                                                        style={{
                                                          flexDirection: 'row',
                                                          justifyContent: 'space-between',
                                                          alignItems: 'center',
                                                          marginTop: wp(4),
                                                          marginHorizontal:wp(5)
                                                        }}>
                                                        {item.status == 'started' ? (
                                                          <TouchableOpacity
                                                            onPress={() =>
                                                              navigation.navigate('ResMapTrack', {
                                                                item,
                                                              })
                                                            }
                                                            style={{
                                                              width: wp(80),
                                                              height: wp(12),
                                                              backgroundColor: Colors.buttoncolor,
                                                              borderRadius: wp(3),
                                                              alignSelf: 'center',
                                                              justifyContent: 'center',
                                                              alignItems: 'center',
                                                              marginLeft: wp(2),
                                                            }}>
                                                            <Text
                                                              style={[
                                                                styles.titleText,
                                                                {color: Colors.white, fontSize: 14},
                                                              ]}>
                                                              Track Ride
                                                            </Text>
                                                          </TouchableOpacity>
                                                        ) : item?.status == 'accepted' ? (
                                                          <TouchableOpacity
                                                            onPress={() =>
                                                              navigation.navigate('ResMapTrack', {
                                                                item,
                                                                distance,
                                                              })
                                                            }
                                                            style={{
                                                              width: wp(40),
                                                              height: wp(12),
                                                              backgroundColor: Colors.buttoncolor,
                                                              borderRadius: wp(3),
                                                              alignSelf: 'center',
                                                              justifyContent: 'center',
                                                              alignItems: 'center',
                                                            }}>
                                                            <Text
                                                              style={[
                                                                styles.titleText,
                                                                {color: Colors.white, fontSize: 14},
                                                              ]}>
                                                              {item?.status === 'accepted'
                                                                ? 'Pay Now'
                                                                : null}
                                                            </Text>
                                                          </TouchableOpacity>
                                                        ) : item?.status == 'paid' ? (
                                                          <View
                                                            style={{
                                                              width: wp(40),
                                                              height: wp(12),
                                                              backgroundColor: Colors.buttoncolor,
                                                              borderRadius: wp(3),
                                                              alignSelf: 'center',
                                                              justifyContent: 'center',
                                                              alignItems: 'center',
                                                            }}>
                                                            <Text
                                                              style={[
                                                                styles.titleText,
                                                                {color: Colors.white, fontSize: 14},
                                                              ]}>
                                                              {item?.status === 'paid' ? 'Paid' : null}
                                                            </Text>
                                                          </View>
                                                        ) : null}
                                                        {item.status == 'started' ? null : (
                                                          <TouchableOpacity
                                                            // onPress={() => {
                                                            //   setConfirm(true);
                                                            //   setSelectedRideId(item.id);
                                                            // }}
                                                            style={{
                                                              width: wp(40),
                                                              height: wp(13),
                                                              backgroundColor: Colors.white,
                                                              borderRadius: wp(3),
                                                              alignSelf: 'center',
                                                              justifyContent: 'center',
                                                              alignItems: 'center',
                                                              borderWidth: 1,
                                                              borderColor: '#D63544',
                          
                                                              // marginTop: wp(4),
                                                            }}>
                                                            <Text
                                                              style={[
                                                                styles.titleText,
                                                                {color: '#D63544', fontSize: 14},
                                                              ]}>
                                                              Cancel Ride
                                                            </Text>
                                                          </TouchableOpacity>
                                                        )}
                                                      </View>
}
                </View>
              
            </ScrollView>
        </View>
  )
}

export default ReservationAcpDetails