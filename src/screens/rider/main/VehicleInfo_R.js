import { Modal, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { images, fonts, Colors, styles } from '../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import MainButton from '../../../components/MainButton'
import Header from '../../../components/Header'
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from 'react-native-vector-icons/Feather'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import PhoneInput from 'react-native-phone-number-input';
import ImageCropPicker from 'react-native-image-crop-picker';
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux'

const VehicleInfo_R = ({ navigation }) => {
    const user = useSelector(state => state.user.user)

    console.log('my data', user)
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleImagePress = (image) => {
        setSelectedImage(image);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedImage(null);
    };

    const [vehicleType, setVehicleType] = useState(user.vehicle_type);
    // console.log('type',vehicleType)
    const [vehicleMake, setVehicleMake] = useState(user.vehicle_make);
    const [vehicleModel, setVehicleModel] = useState(user.vehicle_model);
    console.log('modal',vehicleModel)
    const [Licenseplate, setLicensePlate] = useState(user.license_plate);

    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [insuranceImage, setInsuranceImage] = useState(null);
    const [registrationImage, setRegistrationImage] = useState(null);
    const [driverLicenseImage, setDriverLicenseImage] = useState(null);
    const selectImage = async (setter) => {
        try {
            const image = await ImageCropPicker.openPicker({
                width: 400,
                height: 400,
                cropping: true,
                compressImageQuality: 1,
            });
            setter(image.path);
        } catch (error) {
            console.log("Image selection canceled or failed", error);
        }
    };
    const vehicleTypes = [
        { label: "Sedan", value: "sedan" },
        { label: "SUV", value: "suv" },
        { label: "Van", value: "van" },
        { label: "Sprinter", value: "sprinter" },
        { label: "Bus", value: "bus" },

    ];

    const vehicleMakes = [
        { label: "Toyota", value: "toyota" },
        { label: "Honda", value: "honda" },
    ];

    const vehicleModels = [
        { label: "2024", value: "2024" },
        { label: "2023", value: "2023" },
        { label: "2022", value: "2022" },
        { label: "2021", value: "2021" },

    ];
    renderVehicle = () => {
        return (
            <View>
                <Image source={images.sedanIcon} style={{ width: wp(5), height: wp(5), marginHorizontal: wp(2) }} />
            </View>
        )
    }
    renderMakes = () => {
        return (
            <View>
                <Image source={images.vehiclemakeIcon} style={{ width: wp(5), height: wp(5), marginHorizontal: wp(2) }} />
            </View>
        )
    }
    const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
    const { top, bottom } = useSafeAreaInsets();
    return (
        <View style={[styles.mainContainer,
        { paddingTop: Platform.OS == 'ios' ? top : 0 }]}>
            <View
                style={styles.HeaderView}>
                <Text style={styles.headerText}>Vehicle Info</Text>
                <TouchableOpacity
                    style={{ position: 'absolute', right: wp(4) }}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('EditVehicelInfo_R')}
                >

                    <Text style={{ fontSize: 10, color: '#4686D4', fontFamily: fonts.medium }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrowStyle}>
                    <AntDesign name='left' size={20} color={'#2D3D54'} />
                </TouchableOpacity>
            </View>
            <Wrapper behavior="padding" style={{ flex: 1 }}>

                <ScrollView>
                    <View style={{ marginHorizontal: wp(5), marginTop: wp(5) }}>
                        <Text style={styles.labelStyle}>Vehicle Images (Front / Back)</Text>
                        <View style={styles.rowContainer}>
                            <TouchableOpacity style={styles.uploadBox} onPress={() => handleImagePress(user?.vehicle_image_front ? { uri: user?.vehicle_image_front } : images.vehicleImg)} >

                                <Image source={user?.vehicle_image_front ? { uri: user?.vehicle_image_front } : images.vehicleImg} resizeMode="cover" style={{ width: wp(42), height: wp(19), borderRadius: 5 }} />
                                {/* <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
                                            <Feather name='camera' size={22} color={'white'} />
                                        </View> */}

                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleImagePress(user?.vehicle_image_back ? { uri: user?.vehicle_image_back } : images.vehicle2Img)} style={styles.uploadBox} >
                                <Image source={user?.vehicle_image_back ? { uri: user?.vehicle_image_back } : images.vehicle2Img} resizeMode="cover" style={{ width: wp(42), height: wp(19), borderRadius: 5 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ marginHorizontal: wp(5), marginTop: wp(3) }}>
                        <Text style={styles.labelStyle}>Insurance</Text>
                        <TouchableOpacity onPress={() => handleImagePress(user?.insurance ? { uri: user?.insurance } : images.regImg)} style={styles.uploadBox2}>
                            <Image source={user?.insurance ? { uri: user?.insurance } : images.regImg} resizeMode="cover" style={{ width: wp(88), height: wp(18), borderRadius: 5 }} />
                            <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
                                {/* <Feather name='camera' size={22} color={'white'} /> */}
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginHorizontal: wp(5), marginTop: wp(3) }}>
                        <Text style={styles.labelStyle}>Registration</Text>
                        <TouchableOpacity onPress={() => handleImagePress(user?.registration ? { uri: user?.registration } : images.licenseImg)} style={styles.uploadBox2} >

                            <Image source={user?.registration ? { uri: user?.registration } : images.licenseImg} resizeMode="cover" style={{ width: wp(88), height: wp(18), borderRadius: 5 }} />
                            <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
                                {/* <Feather name='camera' size={22} color={'white'} /> */}
                            </View>

                        </TouchableOpacity>
                    </View>
                    <View style={{ marginHorizontal: wp(5), marginTop: wp(3) }}>
                        <Text style={styles.labelStyle}>Vehicle Type</Text>
                        <Dropdown
                            data={vehicleTypes}
                            labelField="label"
                            valueField="value"
                            placeholder={vehicleType}
                            placeholderStyle={{ color: Colors.black }}
                            disable
                            value={vehicleType}
                            itemTextStyle={{ fontSize: 14, color: Colors.black, fontFamily: fonts.medium, textAlign: 'center' }}
                            selectedTextStyle={{ fontSize: 14, color: Colors.black, fontFamily: fonts.medium }}
                            maxHeight={wp(65)}
                            containerStyle={{ width: wp(40), alignSelf: 'flex-end', marginRight: wp(10), borderRadius: wp(4) }}
                            itemContainerStyle={{ borderBottomWidth: 1, borderColor: Colors.grey, width: wp(40), borderTopLeftRadius: wp(4), borderTopRightRadius: wp(4) }}
                            onChange={(item) => setVehicleType(item.value)}
                            renderLeftIcon={renderVehicle}
                            style={styles.dropdown}
                        />

                    </View>
                    <View style={{ marginHorizontal: wp(5), marginTop: wp(3) }}>
                        <Text style={styles.labelStyle}>Vehicle Modal</Text>
                        <Dropdown
                            data={vehicleMakes}
                            labelField="label"
                            valueField="value"
                            disable

                            placeholder={vehicleMake}
                            placeholderStyle={{ color: Colors.black }}
                            value={vehicleMake}
                            itemTextStyle={{ fontSize: 14, color: Colors.black, fontFamily: fonts.medium, textAlign: 'center' }}
                            selectedTextStyle={{ fontSize: 14, color: Colors.black, fontFamily: fonts.medium }}
                            maxHeight={wp(65)}
                            containerStyle={{ width: wp(40), alignSelf: 'flex-end', marginRight: wp(10), borderRadius: wp(4) }}
                            itemContainerStyle={{ borderBottomWidth: 1, borderColor: Colors.grey, width: wp(40), borderTopLeftRadius: wp(4), borderTopRightRadius: wp(4) }}
                            onChange={(item) => setVehicleMake(item.value)}
                            renderLeftIcon={renderMakes}
                            style={styles.dropdown}
                        />
                    </View>
                    <View style={{ marginHorizontal: wp(5), marginTop: wp(3) }}>
                        <Text style={styles.labelStyle}>Year</Text>
                        <Dropdown
                            data={vehicleModels}
                            labelField="label"
                            valueField="value"
                            placeholder={vehicleModel}
                            disable

                            placeholderStyle={{ color: Colors.black }}
                            value={vehicleModel}
                            itemTextStyle={{ fontSize: 14, color: Colors.black, fontFamily: fonts.medium, textAlign: 'center' }}
                            selectedTextStyle={{ fontSize: 14, color: Colors.black, fontFamily: fonts.medium }}
                            maxHeight={wp(65)}
                            containerStyle={{ width: wp(40), alignSelf: 'flex-end', marginRight: wp(10), borderRadius: wp(4) }}
                            itemContainerStyle={{ borderBottomWidth: 1, borderColor: Colors.grey, width: wp(40), borderTopLeftRadius: wp(4), borderTopRightRadius: wp(4) }}
                            onChange={(item) => setVehicleModel(item.value)}
                            style={styles.dropdown}
                            renderLeftIcon={renderVehicle}

                        />
                    </View>
                    <View style={{ marginHorizontal: wp(5), marginTop: wp(3) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.labelStyle}>License Plate</Text>
                            <Image source={images.licenseplateIcon} resizeMode='contain' style={{ width: wp(4), height: wp(4), marginLeft: wp(1) }} />

                        </View>
                        <View style={styles.inputViewStyle}>
                            <Image source={images.plate} resizeMode='contain' style={{ width: wp(5), height: wp(6) }} />
                            <TextInput
                                // placeholder="nadeem@gmail.com"
                                placeholderTextColor={Colors.lightgrey}
                                keyboardType='default'
                                style={styles.inputStyle}
                                autoCapitalize="none"
                                editable={false}
                                value={Licenseplate}


                            />
                        </View>
                    </View>
                    <View style={{ marginHorizontal: wp(5), marginTop: wp(3), marginBottom: wp(4) }}>
                        <Text style={styles.labelStyle}>Driver’s License</Text>
                        <TouchableOpacity onPress={() => handleImagePress(user?.driver_license ? { uri: user?.driver_license } : images.driverLngImg)} style={styles.uploadBox2} >

                            <Image source={user?.driver_license ? { uri: user?.driver_license } : images.driverLngImg} resizeMode="cover" style={{ width: wp(88), height: wp(18), borderRadius: 5 }} />
                            <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
                            </View>

                        </TouchableOpacity>
                    </View>
                    {/* <View style={{ marginTop: wp(7), marginBottom: wp(5) }}>
            <MainButton
              title="Submit"
              onPress={() => navigation.navigate('AccountVerification_R')}
            />
          </View> */}
                </ScrollView>
            </Wrapper>
            <Modal visible={isModalVisible} transparent={true} animationType="fade">
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                        <AntDesign name="close" size={30} color="white" />
                    </TouchableOpacity>
                    <Image source={selectedImage} style={styles.fullImage} resizeMode='contain' />
                </View>
            </Modal>
        </View>
    )
}

export default VehicleInfo_R
