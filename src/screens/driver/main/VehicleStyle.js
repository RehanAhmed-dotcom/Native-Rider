import { FlatList, Image, ImageBackground, Switch, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useRef } from 'react'
import { images, fonts, Colors, styles } from '../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import MainButton from '../../../components/MainButton'
import Header from '../../../components/Header'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Toast from 'react-native-toast-message'
import AntDesign from 'react-native-vector-icons/AntDesign'
const VehicleStyle = ({ navigation, route }) => {
    const { formData, toggleStates } = route.params;

    const vehicleData = [
        { id: '1', type: 'Corolla GLi', price: '450', image: images.carImg },
        { id: '2', type: 'Corolla GLi', price: '350', image: images.carImg },
        { id: '3', type: 'Corolla GLi', price: '650', image: images.carImg },
    ];
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [price, setSelectedVehicleprice] = useState(null);

    console.log('idd',selectedVehicleId)
   
    const handleSelectVehicle = (id,price) => {
        setSelectedVehicleId(id); // Update the selected vehicle
        setSelectedVehicleprice(price); 

    };
    const { top, bottom } = useSafeAreaInsets();

    return (
        <ImageBackground source={images.mapBackground} resizeMode='cover' style={[styles.mainContainer,
        { paddingTop: Platform.OS == 'ios' ? top : 0 }]}>
            <View
                style={[styles.bottomHeaderView, { backgroundColor: 'rgba(255,255,255,.6)', }]}>
                <Text style={styles.headerText}>Select Your Style Of Ride</Text>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ position: 'absolute', left: wp(4) }}
                    activeOpacity={0.7} >
                    <AntDesign name='left' size={20} color={'#2D3D54'} />

                </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
                <View style={styles.utitityMainView}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, fontFamily: fonts.bold, color: Colors.black }}>Rides</Text>
                    </View>
                    <FlatList
                        data={vehicleData}
                        inverted

                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            const isSelected = selectedVehicleId === item.id; // Check if this vehicle is selected
                            return (
                                <TouchableOpacity
                                    style={[
                                        styles.RideStyleView,
                                        { borderColor: isSelected ? Colors.buttoncolor : Colors.border, borderWidth: isSelected ? 1 : 0 },
                                    ]}
                                    onPress={() => handleSelectVehicle(item.id,item.price)}
                                >
                                    {/* Checkbox in the top-right corner */}
                                    {isSelected && (
                                        <View
                                            style={{
                                                position: 'absolute',
                                                top: 5,
                                                right: 5,
                                                width: wp(6),
                                                height: wp(6),
                                                backgroundColor: Colors.buttoncolor,
                                                borderRadius: wp(3),
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderRadius: wp(3)
                                            }}
                                        >
                                            <FontAwesome6 name="check" color={Colors.background} size={16} />
                                        </View>
                                    )}

                                    {/* Vehicle Information */}
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Image
                                                source={images.PolygonIcon}
                                                resizeMode="contain"
                                                style={{ width: wp(3), height: wp(3) }}
                                            />
                                            <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: '#7D7D7D', marginLeft: wp(1) }}>
                                                {item.type}
                                            </Text>
                                        </View>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                color: Colors.black,
                                                fontFamily: fonts.bold,
                                                marginLeft: wp(5),
                                            }}
                                        >
                                            Rs {item.price}
                                        </Text>
                                    </View>
                                    <View>
                                        <Image
                                            source={item.image}
                                            resizeMode="contain"
                                            style={{ width: wp(25), height: wp(15) }}
                                        />
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                    />

                    <View style={{ marginVertical: wp(5) }}>
                        <MainButton
                            title="Continue"
                            onPress={() => {
                                selectedVehicleId ? navigation.navigate('AvailableDraviers',{formData,toggleStates,price}) :
                                    Toast.show({
                                        type: 'error',
                                        text1: 'No Selection',
                                        text2: 'Please select style of ride.',
                                        topOffset: Platform.OS === 'ios' ? 50 : 0,
                                        visibilityTime: 3000,
                                        autoHide: true,
                                    })
                            }}
                        />
                    </View>
                </View>
            </View>
        </ImageBackground>
    )
}

export default VehicleStyle
