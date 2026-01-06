import { FlatList, Image, ImageBackground, Switch, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
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

const OfferDriverDetail = ({navigation,route}) => {
        const user = useSelector(state => state.user.user)
        console.log('userdatadfsdf', user.vehicle_image_front)
        const { item, distance } = route.params;
        console.log('distance', distance)
        console.log('my item dataaaa', item)
        const { top, bottom } = useSafeAreaInsets();

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
                    <Text style={styles.headerText}>Driver Details</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Conversation_R', { item2: item })}
                        style={{ position: 'absolute', right: wp(4) }}
                        activeOpacity={0.7} >
                        <Image source={images.chatIcon} tintColor={Colors.buttoncolor} resizeMode='contain' style={{ width: wp(6), height: wp(6) }} />
                    </TouchableOpacity>
                    <TouchableOpacity
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
                        <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, lineHeight: 15 }}>Rider</Text>
                    </View>
                    <View style={{ marginHorizontal: wp(5), marginTop: wp(5) }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={images.locIcon} resizeMode='contain' style={{ width: wp(5), height: wp(5) }} />
                                <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, marginLeft: wp(2) }}>{distance}km</Text>
                            </View>
                            <Text style={styles.paymentStyle}>Offer Price $ {parseInt(item?.driver_offered_price)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={images.seatIcon} resizeMode='contain' style={{ width: wp(5), height: wp(5) }} />
                                <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, marginLeft: wp(2) }}>{item?.ride?.available_seats} seats available</Text>
                            </View>
    
                        </View>
                        <View style={{ marginTop: wp(2), marginHorizontal: wp(4) }}>
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
                            <View>
                                <Text style={{ fontSize: 12, color: '#414141', fontFamily: fonts.medium, textAlign: 'right' }}>{item?.ride?.has_pets ? 'Yes has pets' : 'No pets'}</Text>
                                <Text style={{ fontSize: 12, color: '#414141', fontFamily: fonts.medium, textAlign: 'right' }}>{item?.ride?.is_smoking ? 'Yes Smoking' : 'No Smoking'}</Text>
                                <Text style={{ fontSize: 12, color: '#414141', fontFamily: fonts.medium, textAlign: 'right' }}>{item?.ride?.has_other_items ? 'Yes, Others Items' : 'No Smoking'}</Text>
                            </View>
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
                    <View style={{ marginTop: wp(20) }}>
                        <MainButton
                            title="Accept Offer"
                            onPress={() => AcceptOfferApi(item?.id)}
                        />
                    </View>
                    <TouchableOpacity
                    onPress={()=>CancelOfferApi(item?.id)}
                    style={{
                        width: wp(90),
                        height: wp(13),
                        borderRadius: wp(2),
                        borderColor: '#FB5B58',
                        borderWidth: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        marginVertical: wp(5)
                    }} activeOpacity={0.7}>
                        <Text style={[styles.titleText, { color: '#FB5B58' }]}>Cancel Offer</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
  )
}

export default OfferDriverDetail