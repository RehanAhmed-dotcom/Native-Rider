import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { images, fonts, Colors, styles } from '../../../constant/Index';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MainButton from '../../../components/MainButton';
import Header from '../../../components/Header';
import Toast from 'react-native-toast-message';
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useSelector } from 'react-redux';
import { AllGetAPI } from '../../../components/ApiRoot';

const SelectMainVehicle = ({ navigation, route }) => {
      const user = useSelector(state => state.user.user);
    
    const { formData, toggleStates } = route.params;
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [confirmSout, setConfirmSout] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState('');
    const [isFocus, setIsFocus] = useState(false);
    const [allVehicles, setAllVehicles] = useState([]);

      const fetchVehicles = async () => {
        // setIsLoading(true);
        try {
          const res = await AllGetAPI({
            url: 'vehicle-types',
            Token: user?.api_token,
          });
  console.log('my vehicles',res)
          if (res.status === 'success') {
            setAllVehicles(res?.vehicle_types)
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
        } catch (err) {
          console.error('API error:', err);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to fetch bookings',
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        //   setRefreshing(false);
        //   setIsLoading(false);
        }
      };
    
      useEffect(() => {
        fetchVehicles(); 
        // const intervalId = setInterval(fetchBookings, 4000); 
    
        // return () => clearInterval(intervalId); 
      }, []);

    // const vehicles = ['Sedan', 'SUV', 'Van', 'Sprinter', 'Bus'];
    const getSeatsForVehicle = () => {
        return Array.from({ length: 100 }, (_, i) => ({
          label: `${i + 1}`,
          value: `${i + 1}`,
        }));
      };

    // const getSeatsForVehicle = (vehicle) => {
    //     switch (vehicle) {
    //         case 'Sedan':
    //             return Array.from({ length: 7 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` }));
    //         case 'SUV':
    //             return Array.from({ length: 9 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` }));
    //         case 'Van':
    //             return Array.from({ length: 10 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` }));
    //         case 'Sprinter':
    //             return Array.from({ length: 20 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` }));
    //         case 'Bus':
    //             return Array.from({ length: 30 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` }));
    //         default:
    //             return [];
    //     }
    // };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.vehicleOption,
                selectedVehicle === item && styles.selectedOption,
            ]}
            onPress={() => {
                setSelectedVehicle(item);
                setConfirmSout(true);
            }}
        >
            <Text style={styles.vehicleText}>{item}</Text>
            <View style={styles.radioButton}>
                {selectedVehicle === item && <View style={styles.radioSelected} />}
            </View>
        </TouchableOpacity>
    );

    const closemodalSout = () => {
        setConfirmSout(false);
    };

    return (
        <View style={styles.mainContainer}>
            <Header head="Select Vehicle" onPress={() => navigation.goBack()} />
            <View style={{ marginVertical: wp(5) }}>
                <Image source={images.logopic} style={{ width: wp(35), height: wp(35), alignSelf: 'center' }} />
            </View>
            <FlatList
                data={allVehicles}
                renderItem={renderItem}
                inverted
                keyExtractor={(item) => item}
            />

            <View style={{ marginVertical: wp(10) }}>
                <MainButton
                    title="Continue"
                    onPress={() => {
                        selectedVehicle && selectedSeats ? navigation.navigate('AvailableDraviers', { formData, toggleStates, selectedVehicle, selectedSeats })
                            :
                            Toast.show({
                                type: 'error',
                                text1: 'No Selection',
                                text2: 'Please select vehicle and number of seats first',
                                topOffset: Platform.OS === 'ios' ? 50 : 0,
                                visibilityTime: 3000,
                                autoHide: true,
                            })
                    }}
                />
            </View>
            <Modal
                transparent={true}
                visible={confirmSout}
                onRequestClose={closemodalSout}
                animationType="none">
                    {/* <TouchableWithoutFeedback onPress={closemodalSout}> */}
                <View style={styles.modalTopView}>
                    <View style={{ width: wp(95),paddingVertical:wp(10), backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderRadius: wp(3) }}>
                        <Dropdown
                            data={getSeatsForVehicle()}
                            labelField="label"
                            valueField="value"
                            placeholder="Select number of seats"
                            placeholderStyle={{ color: Colors.black }}
                            value={selectedSeats}
                            itemTextStyle={{ fontSize: 14, color: Colors.black, fontFamily: fonts.medium, textAlign: 'center' }}
                            selectedTextStyle={{ fontSize: 14, color: Colors.black, fontFamily: fonts.medium }}
                            maxHeight={wp(70)}
                            containerStyle={{ width: wp(40), alignSelf: 'flex-end', marginRight: wp(10), borderRadius: wp(4), marginTop: wp(-6) }}
                            itemContainerStyle={{ borderBottomWidth: 1, borderColor: Colors.grey, width: wp(30), alignSelf: 'center', borderTopLeftRadius: wp(4), borderTopRightRadius: wp(4) }}
                            onChange={(item) => { setSelectedSeats(item.value); setIsFocus(false) }}
                            style={styles.dropdownHome}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            renderRightIcon={() => (
                                <AntDesign name={isFocus ? 'up':'down'} size={20} color={Colors.buttoncolor}/>
                              
                            )}
                            renderLeftIcon={() => (
                                <Image
                                    source={images.seatIcon}
                                    resizeMode='contain'
                                    style={{ width: wp(6), height: wp(6), marginRight: wp(3) }}
                                />
                            )}
                        />
                        <TouchableOpacity onPress={closemodalSout} style={{width:wp(75),height:wp(12),marginTop:wp(10),backgroundColor:Colors.buttoncolor,borderRadius:wp(3),justifyContent:'center',alignItems:'center',alignSelf:'center'}}>
                            <Text style={{fontSize:14,fontFamily:fonts.medium,color:'white'}}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* </TouchableWithoutFeedback> */}
            </Modal>
        </View>
    );
};

export default SelectMainVehicle;