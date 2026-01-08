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
import Feather from 'react-native-vector-icons/Feather';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {Dropdown} from 'react-native-element-dropdown';
import * as yup from 'yup';
import {Formik} from 'formik';
import {PostAPiwithToken} from '../../../components/ApiRoot';
import Toast from 'react-native-toast-message';
import Loader from '../../../components/Loader';
import {setUser} from '../../../redux/Auth';
import {useDispatch} from 'react-redux';

const VehicleRegistration = ({navigation, route}) => {
  const {user_res} = route.params;
  const [isloading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [vehicleType, setVehicleType] = useState(null);
  const [vehicleMake, setVehicleMake] = useState(null);
  const [vehicleModel, setVehicleModel] = useState(null);
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [insuranceImage, setInsuranceImage] = useState(null);
  const [registrationImage, setRegistrationImage] = useState(null);
  const [LicenseplateImage, setLicensePlateImage] = useState(null);
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

  // const selectImage = async (setFieldValue, imageType) => {
  //   try {
  //     const image = await ImageCropPicker.openPicker({
  //       width: 400,
  //       height: 400,
  //       cropping: true,
  //       compressImageQuality: 1,
  //     });
  //     if (image && image.path) {
  //       setFieldValue(imageType, image.path);
  //     } else {
  //       console.error('No image path found');
  //     }
  //   } catch (error) {
  //     console.log('Image selection canceled or failed', error);
  //   }
  // };
  const selectImage = async (setFieldValue, imageType) => {
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
  
      // Resize / crop-like behavior (400x400)
      const resized = await ImageResizer.createResizedImage(
        asset.uri,
        400,
        400,
        'JPEG',
        100,
        0,
        undefined,
        false,
        { mode: 'cover' } // mimics cropping
      );
  
      setFieldValue(imageType, resized.uri);
    } catch (error) {
      console.log('Image selection canceled or failed', error);
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

  const _validationSchema = yup.object({
    frontImage: yup.string().required('Front Image is required'),
    backImage: yup.string().required('Back Image is required'),
    insuranceImage: yup.string().required('Insurance Image is required'),
    registrationImage: yup.string().required('Registration Image is required'),
    vehicleType: yup.string().required('Vehicle Type is required'),
    vehicleMake: yup.string().required('Vehicle Make is required'),
    vehicleModel: yup.string().required('Vehicle Model is required'),
    Licenseplate: yup.string().required('License Plate number is required'),
    driverLicenseImage: yup
      .string()
      .required('Driver License Image is required'),
  });
  const _registerAPI = (
    frontImage,
    backImage,
    insuranceImage,
    registrationImage,
    vehicleType,
    vehicleMake,
    vehicleModel,
    Licenseplate,
    driverLicenseImage,
  ) => {
    const token = user_res?.userdata?.api_token;

    const formdata = new FormData();

    {
      frontImage &&
        formdata.append('vehicle_image_front', {
          uri: frontImage,
          type: 'image/jpeg',
          name: `image${new Date()}.jpg`,
        });
    }
    {
      backImage &&
        formdata.append('vehicle_image_back', {
          uri: backImage,
          type: 'image/jpeg',
          name: `image${new Date()}.jpg`,
        });
    }
    {
      insuranceImage &&
        formdata.append('insurance', {
          uri: insuranceImage,
          type: 'image/jpeg',
          name: `image${new Date()}.jpg`,
        });
    }
    {
      registrationImage &&
        formdata.append('registration', {
          uri: registrationImage,
          type: 'image/jpeg',
          name: `image${new Date()}.jpg`,
        });
    }
    formdata.append('vehicle_type', vehicleType);
    formdata.append('vehicle_make', vehicleMake);
    formdata.append('vehicle_model', vehicleModel);
    formdata.append('license_plate', Licenseplate);

    // {
    //   LicenseplateImage &&
    //     formdata.append('license_plate', {
    //       uri: LicenseplateImage,
    //       type: 'image/jpeg',
    //       name: `image${new Date()}.jpg`,
    //     });
    // }
    {
      driverLicenseImage &&
        formdata.append('driver_license', {
          uri: driverLicenseImage,
          type: 'image/jpeg',
          name: `image${new Date()}.jpg`,
        });
    }
    setIsLoading(true);
    PostAPiwithToken({url: 'edit', Token: token}, formdata)
      .then(res => {
        setIsLoading(false);
        console.log('response data-------', res);
        if (res.status == 'success') {
          setIsLoading(false);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          console.log('mydata', res);
          // navigation.navigate('AccountVerifyOtp_R', { userres: res })
          dispatch(setUser(res?.userdata));
        } else {
          setIsLoading(false);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message.email
              ? res?.message?.email
              : res.message?.email
              ? res.message?.email
              : res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        }
        console.log('res of register ', res);
      })
      .catch(err => {
        setIsLoading(false);
        console.log('api error', err);
      });
  };

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
  const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  const {top, bottom} = useSafeAreaInsets();
  return (
    <Formik
      initialValues={{
        frontImage: '',
        backImage: '',
        insuranceImage: '',
        registrationImage: '',
        vehicleType: '',
        vehicleMake: '',
        vehicleModel: '',
        Licenseplate: '',
        driverLicenseImage: '',
      }}
      validateOnMount={true}
      onSubmit={values => {
        _registerAPI(
          values.frontImage,
          values.backImage,
          values.insuranceImage,
          values.registrationImage,
          values.vehicleType,
          values.vehicleMake,
          values.vehicleModel,
          values.Licenseplate,
          values.driverLicenseImage,
        );
      }}
      validationSchema={_validationSchema}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        touched,
        errors,
        isValid,
        setFieldValue,
      }) => (
        <View
          style={[
            styles.mainContainer,
            {paddingTop: Platform.OS == 'ios' ? top : 0},
          ]}>
          <KeyboardAvoidingView
            behavior={
              Platform.OS === 'ios'
                ? 'padding'
                : keyboardStatus === true
                ? 'height'
                : 'undefined'
            }
            style={{flex: 1}}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
            {isloading && <Loader />}
            <Header
              head="Add Your Vehicle"
              onPress={() => navigation.goBack()}
            />
            <Wrapper behavior="padding" style={{flex: 1}}>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{paddingBottom: wp(6)}}>
                <View style={{marginHorizontal: wp(5), marginTop: wp(7)}}>
                  <Text style={styles.labelStyle}>
                    Vehicle Images (Front / Back)
                  </Text>
                  <View style={styles.rowContainer}>
                    <TouchableOpacity
                      style={styles.uploadBox}
                      onPress={() => selectImage(setFieldValue, 'frontImage')}>
                      {values.frontImage ? (
                        <>
                          <Image
                            source={{uri: values.frontImage}}
                            resizeMode="cover"
                            style={{
                              width: wp(42),
                              height: wp(19),
                              borderRadius: 5,
                            }}
                          />
                          <View
                            style={{
                              position: 'absolute',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Feather name="camera" size={22} color={'white'} />
                          </View>
                        </>
                      ) : (
                        <>
                          <Image
                            source={images.uploadIcon}
                            resizeMode="contain"
                            style={{width: wp(6), height: wp(6)}}
                          />
                          <Text style={styles.uploadText}>
                            Upload Front Image
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.uploadBox}
                      onPress={() => selectImage(setFieldValue, 'backImage')}>
                      {values.backImage ? (
                        <>
                          <Image
                            source={{uri: values.backImage}}
                            resizeMode="cover"
                            style={{
                              width: wp(42),
                              height: wp(19),
                              borderRadius: 5,
                            }}
                          />
                          <View
                            style={{
                              position: 'absolute',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Feather name="camera" size={22} color={'white'} />
                          </View>
                        </>
                      ) : (
                        <>
                          <Image
                            source={images.uploadIcon}
                            resizeMode="contain"
                            style={{width: wp(6), height: wp(6)}}
                          />
                          <Text style={styles.uploadText}>
                            Upload Back Image
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                  {touched.frontImage && errors.frontImage && (
                    <Text
                      style={[
                        styles.errortxt,
                        {position: 'absolute', right: wp(6), bottom: wp(0)},
                      ]}>
                      {errors.frontImage}
                    </Text>
                  )}
                  {touched.backImage && errors.backImage && (
                    <Text style={styles.errortxt}>{errors.backImage}</Text>
                  )}
                </View>
                <View style={{marginHorizontal: wp(5), marginTop: wp(3)}}>
                  <Text style={styles.labelStyle}>Insurance</Text>
                  <TouchableOpacity
                    style={styles.uploadBox2}
                    onPress={() =>
                      selectImage(setFieldValue, 'insuranceImage')
                    }>
                    {values.insuranceImage ? (
                      <>
                        <Image
                          source={{uri: values.insuranceImage}}
                          resizeMode="cover"
                          style={{
                            width: wp(88),
                            height: wp(18),
                            borderRadius: 5,
                          }}
                        />
                        <View
                          style={{
                            position: 'absolute',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Feather name="camera" size={22} color={'white'} />
                        </View>
                      </>
                    ) : (
                      <>
                        <Image
                          source={images.uploadIcon}
                          resizeMode="contain"
                          style={{width: wp(6), height: wp(6)}}
                        />
                        <Text style={styles.uploadText}>Upload Insurance</Text>
                      </>
                    )}
                  </TouchableOpacity>
                  {touched.insuranceImage && errors.insuranceImage && (
                    <Text style={styles.errortxt}>{errors.insuranceImage}</Text>
                  )}
                </View>
                <View style={{marginHorizontal: wp(5), marginTop: wp(3)}}>
                  <Text style={styles.labelStyle}>Registration</Text>
                  <TouchableOpacity
                    style={styles.uploadBox2}
                    onPress={() =>
                      selectImage(setFieldValue, 'registrationImage')
                    }>
                    {values.registrationImage ? (
                      <>
                        <Image
                          source={{uri: values.registrationImage}}
                          resizeMode="cover"
                          style={{
                            width: wp(88),
                            height: wp(18),
                            borderRadius: 5,
                          }}
                        />
                        <View
                          style={{
                            position: 'absolute',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Feather name="camera" size={22} color={'white'} />
                        </View>
                      </>
                    ) : (
                      <>
                        <Image
                          source={images.uploadIcon}
                          resizeMode="contain"
                          style={{width: wp(6), height: wp(6)}}
                        />
                        <Text style={styles.uploadText}>
                          Upload Registration
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                  {touched.registrationImage && errors.registrationImage && (
                    <Text style={styles.errortxt}>
                      {errors.registrationImage}
                    </Text>
                  )}
                </View>
                <View style={{marginHorizontal: wp(5), marginTop: wp(3)}}>
                  <Text style={styles.labelStyle}>Vehicle Type</Text>
                  {/* <Dropdown
                  data={vehicleTypes}
                  labelField="label"
                  valueField="value"
                  placeholder="Select"
                  placeholderStyle={{ color: Colors.lightgrey }}
                  value={vehicleType}
                  itemTextStyle={{ fontSize: 14, color: Colors.black, fontFamily: fonts.medium, textAlign: 'center' }}
                  selectedTextStyle={{ fontSize: 14, color: Colors.black, fontFamily: fonts.medium }}
                  maxHeight={wp(65)}
                  containerStyle={{ width: wp(40), alignSelf: 'flex-end', marginRight: wp(10), borderRadius: wp(4) }}
                  itemContainerStyle={{ borderBottomWidth: 1, borderColor: Colors.grey, width: wp(40), borderTopLeftRadius: wp(4), borderTopRightRadius: wp(4) }}
                  onChange={(item) => setFieldValue('vehicleType', item.value)}
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
                      onChangeText={handleChange('vehicleType')}
                      onBlur={handleBlur('vehicleType')}
                      value={values.vehicleType}
                    />
                  </View>
                  {touched.vehicleType && errors.vehicleType && (
                    <Text style={styles.errortxt}>{errors.vehicleType}</Text>
                  )}
                </View>
                <View style={{marginHorizontal: wp(5), marginTop: wp(3)}}>
                  <Text style={styles.labelStyle}>Vehicle Modal</Text>
                  {/* <Dropdown
                  data={vehicleMakes}
                  labelField="label"
                  valueField="value"
                  placeholder="Select"
                  placeholderStyle={{ color: Colors.lightgrey }}
                  value={vehicleMake}
                  itemTextStyle={{ fontSize: 14, color: Colors.black, fontFamily: fonts.medium, textAlign: 'center' }}
                  selectedTextStyle={{ fontSize: 14, color: Colors.black, fontFamily: fonts.medium }}
                  maxHeight={wp(65)}
                  containerStyle={{ width: wp(40), alignSelf: 'flex-end', marginRight: wp(10), borderRadius: wp(4) }}
                  itemContainerStyle={{ borderBottomWidth: 1, borderColor: Colors.grey, width: wp(40), borderTopLeftRadius: wp(4), borderTopRightRadius: wp(4) }}
                  onChange={(item) => setFieldValue('vehicleMake', item.value)}
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
                      onChangeText={handleChange('vehicleMake')}
                      onBlur={handleBlur('vehicleMake')}
                      value={values.vehicleMake}
                    />
                  </View>
                  {touched.vehicleMake && errors.vehicleMake && (
                    <Text style={styles.errortxt}>{errors.vehicleMake}</Text>
                  )}
                </View>
                <View style={{marginHorizontal: wp(5), marginTop: wp(3)}}>
                  <Text style={styles.labelStyle}>Year</Text>
                  {/* <Dropdown
                  data={vehicleModels}
                  labelField="label"
                  valueField="value"
                  placeholder="Select"
                  placeholderStyle={{ color: Colors.lightgrey }}
                  value={vehicleModel}
                  itemTextStyle={{ fontSize: 14, color: Colors.black, fontFamily: fonts.medium, textAlign: 'center' }}
                  selectedTextStyle={{ fontSize: 14, color: Colors.black, fontFamily: fonts.medium }}
                  maxHeight={wp(65)}
                  containerStyle={{ width: wp(40), alignSelf: 'flex-end', marginRight: wp(10), borderRadius: wp(4) }}
                  itemContainerStyle={{ borderBottomWidth: 1, borderColor: Colors.grey, width: wp(40), borderTopLeftRadius: wp(4), borderTopRightRadius: wp(4) }}
                  onChange={(item) => setFieldValue('vehicleModel', item.value)}
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
                      onChangeText={handleChange('vehicleModel')}
                      onBlur={handleBlur('vehicleModel')}
                      value={values.vehicleModel}
                      maxLength={4}
                    />
                  </View>
                  {touched.vehicleModel && errors.vehicleModel && (
                    <Text style={styles.errortxt}>{errors.vehicleModel}</Text>
                  )}
                </View>
                <View style={[styles.inputView, {marginTop: wp(4)}]}>
                  <Text style={styles.labelStyle}>License Plate Number</Text>
                  <View style={styles.inputViewStyle}>
                    <Image
                      source={images.plate}
                      resizeMode="contain"
                      tintColor={'grey'}
                      style={{width: wp(5), height: wp(5)}}
                    />
                    <TextInput
                      placeholder="License plate"
                      placeholderTextColor={Colors.lightgrey}
                      keyboardType="default"
                      style={styles.inputStyle}
                      onChangeText={handleChange('Licenseplate')}
                      onBlur={handleBlur('Licenseplate')}
                      value={values.Licenseplate}
                    />
                  </View>
                  {errors.Licenseplate && touched.Licenseplate && (
                    <Text style={[styles.errortxt]}>{errors.Licenseplate}</Text>
                  )}
                </View>
                {/* <View style={{ marginHorizontal: wp(5), marginTop: wp(3) }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.labelStyle}>License Plate</Text>
                  <Image source={images.licenseplateIcon} resizeMode='contain' style={{ width: wp(4), height: wp(4), marginLeft: wp(1) }} />
                </View>
                <TouchableOpacity style={styles.uploadBox2} onPress={() => selectImage(setFieldValue, 'LicenseplateImage')}>
                  {values.LicenseplateImage ? (
                    <>
                      <Image source={{ uri: values.LicenseplateImage }} resizeMode="cover" style={{ width: wp(88), height: wp(18), borderRadius: 5 }} />
                      <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
                        <Feather name='camera' size={22} color={'white'} />
                      </View>
                    </>
                  ) :
                    <>
                      <Image source={images.uploadIcon} resizeMode='contain' style={{ width: wp(6), height: wp(6) }} />
                      <Text style={styles.uploadText}>Upload license plate</Text>
                      <Image source={images.uploadTag} resizeMode='contain' style={{ width: wp(4), height: wp(4), marginLeft: wp(1) }} />

                    </>
                  }

                </TouchableOpacity>
                {touched.LicenseplateImage && errors.LicenseplateImage && (
                  <Text style={styles.errortxt}>{errors.LicenseplateImage}</Text>
                )}
              </View> */}
                <View style={{marginHorizontal: wp(5), marginTop: wp(3)}}>
                  <Text style={styles.labelStyle}>Driver’s License</Text>
                  <TouchableOpacity
                    style={styles.uploadBox2}
                    onPress={() =>
                      selectImage(setFieldValue, 'driverLicenseImage')
                    }>
                    {values.driverLicenseImage ? (
                      <>
                        <Image
                          source={{uri: values.driverLicenseImage}}
                          resizeMode="cover"
                          style={{
                            width: wp(88),
                            height: wp(18),
                            borderRadius: 5,
                          }}
                        />
                        <View
                          style={{
                            position: 'absolute',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Feather name="camera" size={22} color={'white'} />
                        </View>
                      </>
                    ) : (
                      <>
                        <Image
                          source={images.uploadIcon}
                          resizeMode="contain"
                          style={{width: wp(6), height: wp(6)}}
                        />
                        <Text style={styles.uploadText}>
                          Upload driver’s license
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                  {touched.driverLicenseImage && errors.driverLicenseImage && (
                    <Text style={styles.errortxt}>
                      {errors.driverLicenseImage}
                    </Text>
                  )}
                </View>
                <View style={{marginTop: wp(7), marginBottom: wp(5)}}>
                  <MainButton title="Submit" onPress={handleSubmit} />
                </View>
              </ScrollView>
            </Wrapper>
          </KeyboardAvoidingView>
        </View>
      )}
    </Formik>
  );
};

export default VehicleRegistration;
