import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import {images, fonts, Colors, styles} from '../../../constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../components/MainButton';
import Header from '../../../components/Header';
import { launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PhoneInput from 'react-native-phone-number-input';
import {Dropdown} from 'react-native-element-dropdown';
import {useDispatch, useSelector} from 'react-redux';
import {PostAPiwithToken} from '../../../components/ApiRoot';
import Loader from '../../../components/Loader';
import Toast from 'react-native-toast-message';
import {setUser} from '../../../redux/Auth';

const EditVehicelInfo_R = ({navigation}) => {
  const user = useSelector(state => state.user.user);
  const [isloading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const [vehicleType, setVehicleType] = useState(user?.vehicle_type);
  const [vehicleMake, setVehicleMake] = useState(user?.vehicle_make);
  const [vehicleModel, setVehicleModel] = useState(user?.vehicle_model);
  const [Licenseplate, setLicensePlate] = useState(user.license_plate);

  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [insuranceImage, setInsuranceImage] = useState(null);
  const [registrationImage, setRegistrationImage] = useState(null);
  // const [LicenseplateImage, setLicensePlateImage] = useState(null);
  const [driverLicenseImage, setDriverLicenseImage] = useState(null);

  const [keyboardStatus, setKeyboardStatus] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  const selectImage = async setter => {
    // try {
    //   const image = await ImageCropPicker.openPicker({
    //     width: 400,
    //     height: 400,
    //     cropping: true,
    //     compressImageQuality: 1,
    //   });
    //   setter(image.path);
    // } catch (error) {
    //   console.log('Image selection canceled or failed', error);
    // }
   try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 1,
      });
  
      if (result.didCancel) return;
  
      const asset = result.assets?.[0];
      if (!asset?.uri) {
        console.error('No image selected');
        return;
      }
  
      // Resize to 400x400 (Play-safe alternative to cropping)
      const resized = await ImageResizer.createResizedImage(
        asset.uri,
        400,
        400,
        'JPEG',
        100,
        0
      );
  
      // setFieldValue('image', resized.uri);
      setter( resized.uri)
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };
  const vehicleTypes = [
    {label: 'Sedan', value: 'Sedan'},
    {label: 'SUV', value: 'SUV'},
    {label: 'Van', value: 'Van'},
    {label: 'Sprinter', value: 'Sprinter'},
    {label: 'Bus', value: 'Bus'},
    {label: 'Tow Truck', value: 'Tow Truck'},
  ];

  const vehicleMakes = [
    {label: 'Toyota', value: 'Toyota'},
    {label: 'Honda', value: 'Honda'},
    {label: 'Ford', value: 'Ford'},
    {label: 'Chevrolet', value: 'Chevrolet'},
    {label: 'Jeep', value: 'Jeep'},
    {label: 'Dodge', value: 'Dodge'},
    {label: 'Mercedes-Benz', value: 'Mercedes-Benz'},
    {label: 'Freightliner', value: 'Freightliner'},
    {label: 'Blue Bird', value: 'Blue Bird'},
    {label: 'Thomas Built Buses', value: 'Thomas Built Buses'},
    {label: 'Volvo', value: 'Volvo'},
  ];

  const vehicleModels = [
    {label: '2024', value: '2024'},
    {label: '2023', value: '2023'},
    {label: '2022', value: '2022'},
    {label: '2021', value: '2021'},
  ];
  renderVehicle = () => {
    return (
      <View>
        <Image
          source={images.sedanIcon}
          style={{width: wp(5), height: wp(5), marginHorizontal: wp(2)}}
        />
      </View>
    );
  };
  renderMakes = () => {
    return (
      <View>
        <Image
          source={images.vehiclemakeIcon}
          style={{width: wp(5), height: wp(5), marginHorizontal: wp(2)}}
        />
      </View>
    );
  };

  const _editAPI = () => {
    const token = user?.api_token;
    const formdata = new FormData();
    if (frontImage) {
      formdata.append('vehicle_image_front', {
        uri: frontImage,
        type: 'image/jpeg',
        name: `image_${Date.now()}.jpg`,
      });
    }
    if (backImage) {
      formdata.append('vehicle_image_back', {
        uri: backImage,
        type: 'image/jpeg',
        name: `image_${Date.now()}.jpg`,
      });
    }
    if (insuranceImage) {
      formdata.append('insurance', {
        uri: insuranceImage,
        type: 'image/jpeg',
        name: `image_${Date.now()}.jpg`,
      });
    }
    if (registrationImage) {
      formdata.append('registration', {
        uri: registrationImage,
        type: 'image/jpeg',
        name: `image_${Date.now()}.jpg`,
      });
    }
    if (vehicleType) {
      formdata.append('vehicle_type', vehicleType);
    }
    if (vehicleMake) {
      formdata.append('vehicle_make', vehicleMake);
    }
    if (vehicleModel) {
      formdata.append('vehicle_model', vehicleModel);
    }
    if (Licenseplate) {
      formdata.append('license_plate', Licenseplate);
    }

    if (driverLicenseImage) {
      formdata.append('driver_license', {
        uri: driverLicenseImage,
        type: 'image/jpeg',
        name: `image_${Date.now()}.jpg`,
      });
    }
    setIsLoading(true);
    PostAPiwithToken({url: 'edit', Token: token}, formdata)
      .then(res => {
        setIsLoading(false);
        // console.log('my Response:', res);
        if (res?.status === 'success') {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res?.message || 'Profile updated successfully.',
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          console.log('Response Data:', res);
          dispatch(setUser(res.userdata));
          if (
            user?.vehicle_image_front === null ||
            user?.vehicle_image_back === null ||
            user?.registration === null ||
            user?.vehicle_type === null ||
            user?.vehicle_make === null ||
            user?.vehicle_model === null ||
            user?.license_plate === null ||
            user?.driver_license === null
          ) {
            navigation.goBack();
          } else {
            if (!user?.ssn_number) {
              navigation.navigate('ConnectAccount_R');
            } else {
              navigation.goBack();
            }
          }
        } else {
          const errorMessage =
            res?.message?.email || res?.message || 'An error occurred.';
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: errorMessage,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });

          console.error('Error Response:', res);
        }
      })
      .catch(err => {
        setIsLoading(false);

        console.error('API Error:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong. Please try again later.',
          topOffset: Platform.OS === 'ios' ? 50 : 0,
          visibilityTime: 3000,
          autoHide: true,
        });
      });
  };

  const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  const {top, bottom} = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS == 'ios' ? top : 0},
      ]}>
      {isloading && <Loader />}
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios'
            ? ''
            : keyboardStatus === true
            ? 'height'
            : 'undefined'
        }
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <Header head="Edit Vehicle Info" onPress={() => navigation.goBack()} />
        <Wrapper behavior="padding" style={{flex: 1}}>
          <ScrollView contentContainerStyle={{paddingBottom: wp(6)}}>
            <View style={{marginHorizontal: wp(5), marginTop: wp(7)}}>
              <Text style={styles.labelStyle}>
                Vehicle Images (Front / Back)
              </Text>
              <View style={styles.rowContainer}>
                {frontImage ? (
                  <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={() => selectImage(setFrontImage)}>
                    <Image
                      source={
                        frontImage ? {uri: frontImage} : images.vehicleImg
                      }
                      resizeMode="cover"
                      style={{width: wp(42), height: wp(19), borderRadius: 5}}
                    />
                    <TouchableOpacity
                      onPress={() => selectImage(setFrontImage)}
                      style={{
                        position: 'absolute',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        width: wp(42),
                        height: wp(19),
                        borderRadius: 5,
                        backgroundColor: 'rgba(0,0,0,.4)',
                      }}>
                      <Feather name="camera" size={25} color={'white'} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={() => selectImage(setFrontImage)}>
                    <Image
                      source={
                        user?.vehicle_image_front
                          ? {uri: user?.vehicle_image_front}
                          : images.vehicleImg
                      }
                      resizeMode="cover"
                      style={{width: wp(42), height: wp(19), borderRadius: 5}}
                    />
                    <TouchableOpacity
                      onPress={() => selectImage(setFrontImage)}
                      style={{
                        position: 'absolute',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        width: wp(42),
                        height: wp(19),
                        borderRadius: 5,
                        backgroundColor: 'rgba(0,0,0,.4)',
                      }}>
                      <Feather name="camera" size={25} color={'white'} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}
                {backImage ? (
                  <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={() => selectImage(setBackImage)}>
                    <Image
                      source={backImage ? {uri: backImage} : images.vehicle2Img}
                      resizeMode="cover"
                      style={{width: wp(42), height: wp(19), borderRadius: 5}}
                    />
                    <TouchableOpacity
                      onPress={() => selectImage(setBackImage)}
                      style={{
                        position: 'absolute',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        width: wp(42),
                        height: wp(19),
                        borderRadius: 5,
                        backgroundColor: 'rgba(0,0,0,.4)',
                      }}>
                      <Feather name="camera" size={25} color={'white'} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={() => selectImage(setBackImage)}>
                    <Image
                      source={
                        user?.vehicle_image_back
                          ? {uri: user?.vehicle_image_back}
                          : images.vehicle2Img
                      }
                      resizeMode="cover"
                      style={{width: wp(42), height: wp(19), borderRadius: 5}}
                    />
                    <TouchableOpacity
                      onPress={() => selectImage(setBackImage)}
                      style={{
                        position: 'absolute',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        width: wp(42),
                        height: wp(19),
                        borderRadius: 5,
                        backgroundColor: 'rgba(0,0,0,.4)',
                      }}>
                      <Feather name="camera" size={25} color={'white'} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={{marginHorizontal: wp(5), marginTop: wp(3)}}>
              <Text style={styles.labelStyle}>Insurance</Text>
              {insuranceImage ? (
                <TouchableOpacity
                  style={styles.uploadBox2}
                  onPress={() => selectImage(setInsuranceImage)}>
                  <Image
                    source={
                      insuranceImage ? {uri: insuranceImage} : images.regImg
                    }
                    resizeMode="cover"
                    style={{width: wp(88), height: wp(19), borderRadius: 5}}
                  />
                  <TouchableOpacity
                    onPress={() => selectImage(setInsuranceImage)}
                    style={{
                      position: 'absolute',
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      width: wp(88),
                      height: wp(19),
                      borderRadius: 5,
                      backgroundColor: 'rgba(0,0,0,.4)',
                    }}>
                    <Feather name="camera" size={25} color={'white'} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.uploadBox2}
                  onPress={() => selectImage(setInsuranceImage)}>
                  <Image
                    source={
                      user?.insurance ? {uri: user?.insurance} : images.regImg
                    }
                    resizeMode="cover"
                    style={{width: wp(88), height: wp(19), borderRadius: 5}}
                  />
                  <TouchableOpacity
                    onPress={() => selectImage(setInsuranceImage)}
                    style={{
                      position: 'absolute',
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      width: wp(88),
                      height: wp(19),
                      borderRadius: 5,
                      backgroundColor: 'rgba(0,0,0,.4)',
                    }}>
                    <Feather name="camera" size={25} color={'white'} />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
            </View>
            <View style={{marginHorizontal: wp(5), marginTop: wp(3)}}>
              <Text style={styles.labelStyle}>Registration</Text>
              {registrationImage ? (
                <TouchableOpacity
                  style={styles.uploadBox2}
                  onPress={() => selectImage(setRegistrationImage)}>
                  <Image
                    source={
                      registrationImage
                        ? {uri: registrationImage}
                        : images.licenseImg
                    }
                    resizeMode="cover"
                    style={{width: wp(88), height: wp(19), borderRadius: 5}}
                  />
                  <TouchableOpacity
                    onPress={() => selectImage(setRegistrationImage)}
                    style={{
                      position: 'absolute',
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      width: wp(88),
                      height: wp(19),
                      borderRadius: 5,
                      backgroundColor: 'rgba(0,0,0,.4)',
                    }}>
                    <Feather name="camera" size={25} color={'white'} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.uploadBox2}
                  onPress={() => selectImage(setRegistrationImage)}>
                  <Image
                    source={
                      user?.registration
                        ? {uri: user?.registration}
                        : images.licenseImg
                    }
                    resizeMode="cover"
                    style={{width: wp(88), height: wp(19), borderRadius: 5}}
                  />
                  <TouchableOpacity
                    onPress={() => selectImage(setRegistrationImage)}
                    style={{
                      position: 'absolute',
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      width: wp(88),
                      height: wp(19),
                      borderRadius: 5,
                      backgroundColor: 'rgba(0,0,0,.4)',
                    }}>
                    <Feather name="camera" size={25} color={'white'} />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
            </View>
            <View style={{marginHorizontal: wp(5), marginTop: wp(3)}}>
              <Text style={styles.labelStyle}>Vehicle Type</Text>
              {/* <Dropdown
                            data={vehicleTypes}
                            labelField="label"
                            valueField="value"
                            placeholder="Sedan"
                            placeholderStyle={{ color: Colors.black }}
                            value={vehicleType}
                            itemTextStyle={{ fontSize: 14, color: Colors.black, fontFamily: fonts.medium, textAlign: 'center' }}
                            selectedTextStyle={{ fontSize: 14, color: Colors.black, fontFamily: fonts.medium }}
                            maxHeight={wp(65)}
                            containerStyle={{ width: wp(40), alignSelf: 'flex-end', marginRight: wp(10), borderRadius: wp(4) }}
                            itemContainerStyle={{ borderBottomWidth: 1, borderColor: Colors.grey, width: wp(40), borderTopLeftRadius: wp(4), borderTopRightRadius: wp(4) }}
                            onChange={(item) => setVehicleType(item.value)}
                            renderLeftIcon={renderVehicle}
                            style={styles.dropdown}
                        /> */}
              <View style={styles.inputViewStyle}>
                <Image
                  source={images.sedanIcon}
                  resizeMode="contain"
                  style={{width: wp(5), height: wp(6)}}
                />
                <TextInput
                  placeholder="Sedan, SUV ,Sprinter, Bus etc."
                  placeholderTextColor={Colors.lightgrey}
                  keyboardType="default"
                  style={styles.inputStyle}
                  onChangeText={text => setVehicleType(text)}
                  // onBlur={handleBlur('vehicleType')}
                  value={vehicleType}
                />
              </View>
            </View>
            <View style={{marginHorizontal: wp(5), marginTop: wp(3)}}>
              <Text style={styles.labelStyle}>Vehicle Modal</Text>
              {/* <Dropdown
                            data={vehicleMakes}
                            labelField="label"
                            valueField="value"
                            placeholder="Toyota"
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
                        /> */}

              <View style={styles.inputViewStyle}>
                <Image
                  source={images.vehiclemakeIcon}
                  resizeMode="contain"
                  style={{width: wp(5), height: wp(6)}}
                />
                <TextInput
                  placeholder="Toyota, Honda ,Ford  etc."
                  placeholderTextColor={Colors.lightgrey}
                  keyboardType="default"
                  style={styles.inputStyle}
                  onChangeText={text => setVehicleMake(text)}
                  // onBlur={handleBlur('vehicleType')}
                  value={vehicleMake}
                />
              </View>
            </View>
            <View style={{marginHorizontal: wp(5), marginTop: wp(3)}}>
              <Text style={styles.labelStyle}>Year</Text>
              {/* <Dropdown
                            data={vehicleModels}
                            labelField="label"
                            valueField="value"
                            placeholder='2022'
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

                        /> */}
              <View style={styles.inputViewStyle}>
                <Image
                  source={images.sedanIcon}
                  resizeMode="contain"
                  style={{width: wp(5), height: wp(6)}}
                />
                <TextInput
                  placeholder="2025, 2024, 2023 etc."
                  placeholderTextColor={Colors.lightgrey}
                  keyboardType="number-pad"
                  style={styles.inputStyle}
                  onChangeText={text => setVehicleModel(text)}
                  value={vehicleModel}
                />
              </View>
            </View>
            <View style={{marginHorizontal: wp(5), marginTop: wp(3)}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.labelStyle}>License Plate</Text>
                <Image
                  source={images.licenseplateIcon}
                  resizeMode="contain"
                  style={{width: wp(4), height: wp(4), marginLeft: wp(1)}}
                />
              </View>
              <View style={styles.inputViewStyle}>
                <Image
                  source={images.plate}
                  resizeMode="contain"
                  style={{width: wp(5), height: wp(6)}}
                />
                <TextInput
                  placeholder="Licence Plate"
                  placeholderTextColor={Colors.lightgrey}
                  keyboardType="default"
                  style={styles.inputStyle}
                  onChangeText={text => setLicensePlate(text)}
                  value={Licenseplate}
                />
              </View>
            </View>
            <View style={{marginHorizontal: wp(5), marginTop: wp(3)}}>
              <Text style={styles.labelStyle}>Driver’s License</Text>
              {driverLicenseImage ? (
                <TouchableOpacity
                  style={styles.uploadBox2}
                  onPress={() => selectImage(setDriverLicenseImage)}>
                  <Image
                    source={
                      driverLicenseImage
                        ? {uri: driverLicenseImage}
                        : images.driverLngImg
                    }
                    resizeMode="cover"
                    style={{width: wp(88), height: wp(19), borderRadius: 5}}
                  />
                  <TouchableOpacity
                    onPress={() => selectImage(setDriverLicenseImage)}
                    style={{
                      position: 'absolute',
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      width: wp(88),
                      height: wp(19),
                      borderRadius: 5,
                      backgroundColor: 'rgba(0,0,0,.4)',
                    }}>
                    <Feather name="camera" size={25} color={'white'} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.uploadBox2}
                  onPress={() => selectImage(setDriverLicenseImage)}>
                  <Image
                    source={
                      user?.driver_license
                        ? {uri: user?.driver_license}
                        : images.driverLngImg
                    }
                    resizeMode="cover"
                    style={{width: wp(88), height: wp(19), borderRadius: 5}}
                  />
                  <TouchableOpacity
                    onPress={() => selectImage(setDriverLicenseImage)}
                    style={{
                      position: 'absolute',
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      width: wp(88),
                      height: wp(19),
                      borderRadius: 5,
                      backgroundColor: 'rgba(0,0,0,.4)',
                    }}>
                    <Feather name="camera" size={25} color={'white'} />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
            </View>
            <View style={{marginTop: wp(7), marginBottom: wp(5)}}>
              <MainButton title="Update" onPress={() => _editAPI()} />
            </View>
          </ScrollView>
        </Wrapper>
      </KeyboardAvoidingView>
    </View>
  );
};

export default EditVehicelInfo_R;
