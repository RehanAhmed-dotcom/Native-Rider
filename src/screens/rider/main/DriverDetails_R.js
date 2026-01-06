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
const DriverDetails_R = ({ navigation, route }) => {
    const user = useSelector(state => state.user.user)
    console.log('userdatadfsdf', user.vehicle_image_front)
    const { item, distance } = route.params;
    console.log('distance', distance)
    console.log('itemdetailsgfgfg', item)
    const { top, bottom } = useSafeAreaInsets();
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
                        <Text style={styles.paymentStyle}>Offer Price $ {parseInt(item?.offer_price)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={images.seatIcon} resizeMode='contain' style={{ width: wp(5), height: wp(5) }} />
                            <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, marginLeft: wp(2) }}>{item?.ride?.available_seats} seats available</Text>
                        </View>

                    </View>
                    <View style={{ marginTop: wp(2), marginHorizontal: wp(4) }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(3) }}>
                            <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>{item?.ride?.pickup_address}</Text>
                            <Image source={images.pickupIcon} resizeMode='contain' style={{ width: wp(5), height: wp(5) }} />
                        </View>
                        <View style={{ width: wp(80), height: wp(0.3), backgroundColor: Colors.grey, alignSelf: 'center', marginVertical: wp(2) }}></View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(3) }}>
                            <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>{item?.ride?.destination_address}</Text>
                            <Image source={images.dropoffIcon} resizeMode='contain' style={{ width: wp(5), height: wp(5) }} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: wp(4), borderBottomWidth: 1, borderColor: Colors.grey, paddingBottom: wp(4) }}>
                        <View>
                            <Image
                                source={user?.vehicle_image_front ? { uri: user?.vehicle_image_front } : images.carImg}
                                resizeMode="contain"
                                style={{ width: wp(30), height: wp(25) }}
                            />
                        </View>
                        <View>
                            <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black }}>{user?.vehicle_make} {user?.vehicle_type}</Text>
                            <Text style={{ fontSize: 18, fontFamily: fonts.bold, color: Colors.black, lineHeight: 18 }}>{user.license_plate}</Text>

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
                            <Text style={{ fontSize: 18, fontFamily: fonts.bold, color: Colors.black, lineHeight: 18 }}>{item?.ride?.time}</Text>

                        </View>
                        <View>
                            <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, textAlign: 'right' }}>Date</Text>
                            <Text style={{ fontSize: 18, fontFamily: fonts.bold, color: Colors.black, lineHeight: 18 }}>{moment(item?.ride?.date, 'MM-DD-YYYY').format('ll')}</Text>
                        </View>
                    </View>
                </View>
                {/* <View style={{ marginTop: wp(20) }}>
                    <MainButton
                        title="Request for the payment"
                        onPress={() => navigation.navigate('Payment_R')}
                    />
                </View>
                <TouchableOpacity style={{
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
                    <Text style={[styles.titleText, { color: '#FB5B58' }]}>Cancel Sharing</Text>
                </TouchableOpacity> */}
            </ScrollView>
        </View>
    )
}
export default DriverDetails_R