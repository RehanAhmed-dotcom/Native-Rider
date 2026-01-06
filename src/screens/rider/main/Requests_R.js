import { FlatList, Image, ImageBackground, Switch, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useRef } from 'react'
import { images, fonts, Colors, styles } from '../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import MainButton from '../../../components/MainButton'
import Header from '../../../components/Header'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
const Requests_R = ({ navigation }) => {
    const DriversData = [
        { id: '1', username: 'Ron Weasely', price: '450', userimage: images.chatpic1, image: images.carImg2, distance: '800m  (5mins away)', availableSeats: '3', picup: 'Philadelphia', dropoff: 'New York' },
        { id: '2', username: 'Hermione Granger', price: '350', userimage: images.chatpic3, image: images.carImg2, distance: '800m  (5mins away)', availableSeats: '4', picup: 'Philadelphia', dropoff: 'New York' },
        { id: '3', username: 'Severus Snape', price: '650', userimage: images.chatpic5, image: images.carImg2, distance: '800m  (5mins away)', availableSeats: '2', picup: 'Philadelphia', dropoff: 'New York', },
    ];

    const { top, bottom } = useSafeAreaInsets();
    return (
        <View style={[styles.mainContainer,
        { paddingTop: Platform.OS == 'ios' ? top : 0 }]}>
            <Header head="Requests" onPress={() => navigation.goBack()} />
            <ScrollView>
                <View style={{ marginTop: wp(3) }}>
                    <FlatList
                        data={DriversData}
            inverted

                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            return (
                                <View>
                                    <TouchableOpacity activeOpacity={0.8} style={[styles.DriverView]} onPress={() => navigation.navigate('DriverDetails_R', { item })}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image source={item.userimage} resizeMode='contain' style={styles.driverimg} borderRadius={wp(5)} />
                                                <View style={{ marginLeft: wp(2) }}>
                                                    <Text style={styles.usernameText}>{item.username}</Text>
                                                    <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, lineHeight: 15 }}>Rider</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Image
                                                    source={item.image}
                                                    resizeMode="contain"
                                                    style={{ width: wp(25), height: wp(15) }}
                                                />
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image source={images.locIcon} resizeMode='contain' style={{ width: wp(5), height: wp(5) }} />
                                                <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, marginLeft: wp(2) }}>{item.distance}</Text>
                                            </View>
                                            <Text style={styles.paymentStyle}>Rs {item.price}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image source={images.seatIcon} resizeMode='contain' style={{ width: wp(5), height: wp(5) }} />
                                                <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, marginLeft: wp(2) }}> Available seats</Text>
                                            </View>
                                            <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>{item.availableSeats}</Text>

                                        </View>
                                        <View style={{ marginTop: wp(2), }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Image source={images.pickupIcon} resizeMode='contain' style={{ width: wp(5), height: wp(5) }} />
                                                    <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, marginLeft: wp(2) }}>From</Text>
                                                </View>
                                                <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>{item.picup}</Text>
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
                                                <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>{item.dropoff}</Text>
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: wp(2), marginTop: wp(5) }}>

                                            <TouchableOpacity onPress={() => navigation.navigate('Drawer_R', { screen: 'Bookings_R' })} style={styles.modalbutton1}>
                                                <Text style={[styles.titleText, { fontSize: 14 }]}>Accept</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.modalbutton2}>
                                                <Text style={[styles.titleText, { color: '#D63544', fontSize: 14 }]}>Decline</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

export default Requests_R