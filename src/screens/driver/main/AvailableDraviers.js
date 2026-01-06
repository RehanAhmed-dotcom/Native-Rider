import { FlatList, Image, ImageBackground, Switch, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { images, fonts, Colors, styles } from '../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import MainButton from '../../../components/MainButton'
import Header from '../../../components/Header'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { PostAPiwithToken } from '../../../components/ApiRoot'
import { useSelector } from 'react-redux'
import Toast from 'react-native-toast-message'
import Loader from '../../../components/Loader'
import moment from 'moment'
const AvailableDraviers = ({ navigation, route }) => {
    const user = useSelector(state => state.user.user)
    const { formData, toggleStates, selectedVehicle} = route.params;
    console.log('formData', formData)
    const [isloading, setIsLoading] = useState(false);

    const [Driverdata, setDriverdata] = useState([])
    console.log('driver data ', Driverdata)


    const getDrivers = () => {
        const formdata = new FormData();
        const token = user.api_token
        formdata.append('seats_required', formData?.selectedSeats);
        // formdata.append('max_fare', 200);
        formdata.append('date', formData?.SelectedTime2);
        formdata.append('time', formData?.SelectedTime);
        formdata.append('pickup_latitude', formData?.pickupLat);
        formdata.append('pickup_longitude', formData?.pickupLng);
        formdata.append('destination_latitude', formData?.dropoffLat);
        formdata.append('destination_longitude', formData?.dropoffLng);
        formdata.append('pickup_address', formData?.pickup);
        formdata.append('destination_address', formData?.dropoff);
        // formdata.append('vehicle_type', selectedVehicle);

        setIsLoading(true)
        PostAPiwithToken({ url: 'show-available-rides', Token: token }, formdata)
            .then(res => {
                setIsLoading(false)
                console.log('res of register ', JSON.stringify(res));
                if (res.status == 'success') {
                    setIsLoading(false)
                    setDriverdata(res.rides)
                } else {
                    setIsLoading(false)
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
                setIsLoading(false)
                console.log('api error', err);
            });
    };
    useEffect(() => {
        getDrivers()
    }, [])

    const haversineDistance = (lat1, lon1, lat2, lon2) => {
        const toRadians = (degrees) => degrees * (Math.PI / 180);

        const R = 6371; // Radius of the Earth in kilometers
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c; // Distance in kilometers
        return distance.toFixed(2); // Round to 2 decimal places
    };
    const calculateEstimatedTime = (distance, averageSpeed = 50) => {
        // Time = Distance / Speed
        const timeInHours = distance / averageSpeed;
        const timeInMinutes = timeInHours * 60;
        return Math.round(timeInMinutes); // Round to the nearest minute
    };
    const { top, bottom } = useSafeAreaInsets();
    const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    // Filter Driverdata to show only current or upcoming trips
    const currentDateTime = new Date();
    const filtered = Driverdata.filter((item) => {
      // Combine date and time into a single Date object
      const tripDateTime = moment(
        `${item.date} ${item.time}`,
        'MM/DD/YYYY hh:mm a'
      ).toDate();

      // Return true if the trip is current or upcoming
      return tripDateTime >= currentDateTime;
    });

    setFilteredData(filtered);
  }, [Driverdata]);

    return (
        <View style={[styles.mainContainer,
        { paddingTop: Platform.OS == 'ios' ? top : 0 }]}>
            {isloading && <Loader />}

            <Header head="Available Drivers" onPress={() => navigation.goBack()} />
            <ScrollView>
                {filteredData?.length === 0 ? (
                    <View style={{ marginTop: wp(60) }}>
                        {/* <Image source={item.image} resizeMode='contain' style={{ width: wp(80), height: wp(80), alignSelf: 'center' }} /> */}
                        <Text
                            style={{
                                fontSize: 20,
                                fontFamily: fonts.bold,
                                color: Colors.black,
                                textAlign: 'center',
                                marginTop: wp(4),
                            }}>
                            No Drivers Found!
                        </Text>
                    </View>
                ) : (
                    <View style={{ marginTop: wp(3) }}>
                        <FlatList
                            data={filteredData}
                            keyExtractor={(item) => item.id}
                            inverted
                            renderItem={({ item }) => {
                                const pickupLat = parseFloat(item?.pickup_latitude);
                                const pickupLng = parseFloat(item?.pickup_longitude);
                                const dropoffLat = parseFloat(item?.destination_latitude);
                                const dropoffLng = parseFloat(item?.destination_longitude);

                                // Calculate distance
                                const distance = haversineDistance(pickupLat, pickupLng, dropoffLat, dropoffLng);
                                const estimatedTime = calculateEstimatedTime(distance);

                                return (
                                    <View>
                                        <TouchableOpacity activeOpacity={0.8} style={[styles.DriverView]} onPress={() => navigation.navigate('RiderDetails', { item, distance, estimatedTime })}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Image source={item?.user?.image ? { uri: item?.user?.image } : images.avatar}
                                                        resizeMode='contain' style={styles.driverimg} borderRadius={wp(5)} />
                                                    <View style={{ marginLeft: wp(2) }}>
                                                        <Text style={styles.usernameText}>{item?.user?.name}</Text>
                                                        <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, lineHeight: 15 }}>Driver</Text>
                                                    </View>
                                                </View>
                                                <View>
                                                    <Image
                                                        source={item?.user?.vehicle_image_front ? { uri: item?.user?.vehicle_image_front } : images.carImg2}
                                                        resizeMode="contain"
                                                        style={{ width: wp(25), height: wp(15) }}
                                                    />
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Image source={images.locIcon} resizeMode='contain' style={{ width: wp(5), height: wp(5) }} />
                                                    <Text style={{ fontSize: 13, fontFamily: fonts.medium, color: Colors.black, marginLeft: wp(2) }}>{distance}km</Text>
                                                    <Text style={{ fontSize: 11, fontFamily: fonts.medium, color: Colors.black, lineHeight: 16 }}> ({estimatedTime} mins)</Text>

                                                </View>
                                                <Text style={styles.paymentStyle}>Price ${item.fare}</Text>
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
                                                    <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black }}>{item?.destination_address}</Text>
                                                </View>
                                            </View>
                                            {/* navigation.navigate('Requesting', { typenew: 'notFriend' }) */}

                                            <TouchableOpacity onPress={() => navigation.navigate('Requesting', { typenew: 'notFriend', item })} activeOpacity={0.7} style={{ width: wp(80), height: wp(13), backgroundColor: Colors.buttoncolor, borderRadius: wp(3), alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginTop: wp(4) }}>
                                                <Text style={styles.titleText}>Request For Booking</Text>
                                            </TouchableOpacity>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }}
                        />
                    </View>
                )}
            </ScrollView>
        </View>
    )
}

export default AvailableDraviers
