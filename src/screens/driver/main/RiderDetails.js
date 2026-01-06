import { FlatList, Image, ImageBackground, Switch, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Linking } from 'react-native'
import React, { useState, useRef } from 'react'
import { images, fonts, Colors, styles } from '../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import MainButton from '../../../components/MainButton'
import Header from '../../../components/Header'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'
import moment from 'moment'
import Toast from 'react-native-toast-message'
const RiderDetails = ({ navigation, route }) => {
    const { item,distance,estimatedTime } = route.params;
    const { top, bottom } = useSafeAreaInsets();
    console.log('itemdetail',item)
      const handleCallPress = () => {
        const phoneNumber = item?.user?.phone?item?.user?.phone:item?.driver?.phone; // e.g., "+10166299295"
        if (phoneNumber) {
          // Keep the original phone number for the tel: scheme (including + sign for international calls)
          const phoneUrl = `tel:${phoneNumber}`; // Use original phoneNumber to preserve + sign
          console.log('Attempting to open dialer with URL:', phoneUrl); // Debug log
    
          Linking.canOpenURL(phoneUrl)
            .then(supported => {
              console.log('Can open URL:', supported); // Debug log
              if (supported) {
                Linking.openURL(phoneUrl).catch(err => {
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
                Linking.openURL(phoneUrl).catch(err => {
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

    return (
        <View style={[styles.mainContainer,
        { paddingTop: Platform.OS == 'ios' ? top : 0 }]}>
            <View
                style={[styles.HeaderView]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ position: 'absolute', left: wp(4) }}
                    activeOpacity={0.7} >
                    <AntDesign name='left' size={20} color={'#2D3D54'} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Driver Detail</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Conversation',{item2:item})}
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
                        source={{uri:item?.user?.image?item?.user?.image:item?.driver?.image}}
                        resizeMode="cover"
                        style={[
                            styles.profileStyle,
                            {
                                justifyContent: 'center', alignItems: 'center', opacity: 0.9,
                            },
                        ]}
                    />
                    <Text style={[styles.usernameText, { marginTop: wp(1) }]}>{item?.user?.name?item?.user?.name:item?.driver?.name}</Text>
                    <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, lineHeight: 15 }}>Driver</Text>
                </View>
                <View style={{ marginHorizontal: wp(5), marginTop: wp(5) }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={images.locIcon} resizeMode='contain' style={{ width: wp(5), height: wp(5) }} />
                            <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, marginLeft: wp(2) }}>{distance}km  ({estimatedTime} mins)</Text>
                        </View>
                        <Text style={styles.paymentStyle}>Price $ {item?.fare}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={images.seatIcon} resizeMode='contain' style={{ width: wp(5), height: wp(5) }} />
                            <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, marginLeft: wp(2) }}> Available seats</Text>
                        </View>
                        <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>{item?.available_seats}</Text>

                    </View>
                    <View style={{ marginTop: wp(2), }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Image source={images.pickupIcon} resizeMode='contain' style={{ width: wp(5), height: wp(5) }} />
                                <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, marginLeft: wp(2) }}>From</Text>
                            </View>
                            <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>{item?.pickup_address}</Text>
                        </View>
                        <View style={{ width: wp(80), height: wp(0.3), backgroundColor: Colors.grey, alignSelf: 'center', marginVertical: wp(2) }}></View>
                        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(3) }}>
                                                                    <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>{item.dropoff}</Text>
                                                                    <Image source={images.dropoffIcon} resizeMode='contain' style={{ width: wp(5), height: wp(5) }} />
                                                                </View> */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Image source={images.dropoffIcon} resizeMode='contain' style={{ width: wp(4.5), height: wp(4.5) }} />

                                <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, marginLeft: wp(2) }}>To</Text>
                            </View>
                            <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>{item?.destination_address
                            }</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: wp(4), borderBottomWidth: 1, borderColor: Colors.grey, paddingBottom: wp(4) }}>
                        <View>
                            <Image
                                 source={item?.user?.vehicle_image_front ? { uri: item?.user?.vehicle_image_front } :item?.driver?.vehicle_image_front?{uri:item?.driver?.vehicle_image_front}: images.carImg}
                                resizeMode="contain"
                                style={{ width: wp(30), height: wp(25) }}
                            />
                        </View>
                        <View>
                            <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: Colors.black }}>{item?.user?.vehicle_make} {item?.user?.vehicle_type}</Text>
                            <Text style={{ fontSize: 18, fontFamily: fonts.bold, color: Colors.black, lineHeight: 18 }}>{item?.user?.license_plate}</Text>
                        </View>
                        <View style={{width:wp(45)}}>
                            {/* <Text style={{ fontSize: 12, color: '#414141', fontFamily: fonts.medium, textAlign: 'right' }}>{item.availableSeats}{item?.has_pets?'Yes has pets':'No pets'}</Text>
                            <Text style={{ fontSize: 12, color: '#414141', fontFamily: fonts.medium, textAlign: 'right' }}>{item?.is_smoking?'Yes Smoking':'No Smoking'}</Text>
                         // <Text style={{ fontSize: 12, color: '#414141', fontFamily: fonts.medium, textAlign: 'right' }}>{item?.has_other_items?'Yes, Others Items':'No Smoking'}</Text> */}
                         <Text style={{ fontSize: 12, color: '#414141', fontFamily: fonts.medium, textAlign: 'right' ,lineHeight:17,}} numberOfLines={5}>{item?.utility_options}</Text>

                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: wp(8), }}>

                        <View>
                            <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black }}>Time</Text>
                            <Text style={{ fontSize: 18, fontFamily: fonts.bold, color: Colors.black, lineHeight: 18 }}>{item?.time}</Text>

                        </View>
                        <View>
                            <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, textAlign: 'right' }}>Date</Text>
                            <Text style={{ fontSize: 18, fontFamily: fonts.bold, color: Colors.black, lineHeight: 18 }}>{moment(item?.date, 'MM-DD-YYYY').format('ll')}</Text>
                        </View>
                    </View>

                </View>
                <View style={{ marginVertical: wp(20) }}>
                    <MainButton
                        title="Request for ride"
                        onPress={() => navigation.navigate('Requesting', { typenew: 'notFriend',item })}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

export default RiderDetails
