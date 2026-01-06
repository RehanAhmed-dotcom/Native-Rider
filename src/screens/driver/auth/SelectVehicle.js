import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { images, fonts, Colors, styles } from '../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import MainButton from '../../../components/MainButton'
import Header from '../../../components/Header'

const SelectVehicle = ({ navigation }) => {
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const vehicles = ['Sedan', 'SUV', 'Van', 'Sprinter', 'Bus'];
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.vehicleOption,
                selectedVehicle === item && styles.selectedOption,
            ]}
            onPress={() => setSelectedVehicle(item)}
        >
            <Text style={styles.vehicleText}>{item}</Text>
            <View style={styles.radioButton}>
                {selectedVehicle === item && <View style={styles.radioSelected} />}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.mainContainer}>
            <Header head="Select Vehicle" onPress={() => navigation.goBack()} />
            <View style={{ marginVertical: wp(5) }}>
                <Image source={images.logopic} style={{ width: wp(35), height: wp(35), alignSelf: 'center' }} />

            </View>
            <FlatList
                data={vehicles}
                renderItem={renderItem}
                keyExtractor={(item) => item}
                inverted
                // contentContainerStyle={styles.listContainer}
            />
           
           <View style={{ marginVertical: wp(10) }}>
                <MainButton
                    title="Continue"
                    onPress={()=>navigation.navigate('Onboarding1')}
                />
            </View>
        </View>
    )
}

export default SelectVehicle
