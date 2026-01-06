import { FlatList, Image, ImageBackground, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { images, fonts, Colors, styles } from '../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import MainButton from '../../../components/MainButton'
import Header from '../../../components/Header'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { PostAPiwithToken } from '../../../components/ApiRoot'
import Toast from 'react-native-toast-message'
import { useSelector } from 'react-redux'
import Loader from '../../../components/Loader'

const Payment_R = ({ navigation, route }) => {
    const user = useSelector(state => state.user.user)
    const { item } = route.params;
    console.log('itemdata', item)
    const [isloading, setIsLoading] = useState(false);

    const [confirm, setConfrim] = useState(false)
    const closemodal = () => {
        setConfrim(false)
    }

    const CompleteRideApi = () => {
        const formdata = new FormData();
        const token = user.api_token
        formdata.append('ride_id', item.id);
        setIsLoading(true)
        PostAPiwithToken({ url: 'complete-ride', Token: token }, formdata)
            .then(res => {
                setIsLoading(false)
                console.log('res of register ', JSON.stringify(res));
                if (res.status == 'success') {
                    setIsLoading(false)
                    Toast.show({
                        type: 'success',
                        text1: 'Ride Completed successfully!',
                        text2: res.message,
                        topOffset: Platform.OS === 'ios' ? 50 : 0,
                        visibilityTime: 3000,
                        autoHide: true,
                    })
                    navigation.navigate('PaymentComplete_R', { item })
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
    const { top, bottom } = useSafeAreaInsets();
    return (
        <ImageBackground source={images.paymentbg} resizeMode='cover' style={[styles.mainContainer,
        { paddingTop: Platform.OS == 'ios' ? top : 0 }]}>
            {isloading && <Loader />}

            <Header head="Payment" onPress={() => navigation.goBack()} />
            <ScrollView>
                <View style={{ alignSelf: 'center', marginTop: wp(15), marginHorizontal: wp(20) }}>
                    <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: Colors.black, textAlign: 'center', lineHeight: 22 }}>Request traveller for the
                        payment</Text>
                    <Text style={{ fontSize: 14, fontFamily: fonts.bold, color: Colors.buttoncolor, textAlign: 'center', marginTop: wp(5) }}>Ride Price</Text>
                    <Text style={[styles.paymentStyle, { fontSize: 18, textAlign: 'center' }]}>Rs {item?.fare}</Text>
                </View>
                <View style={{ marginTop: wp(25), marginBottom: wp(4) }}>
                    <MainButton
                        title="Send Request"
                        // onPress={() => setConfrim(true)}
                        onPress={() => CompleteRideApi()}
                    />
                </View>
            </ScrollView>
            <Modal
                transparent={true}
                visible={confirm}
                onRequestClose={closemodal}
                animationType="none">
                <View
                    style={styles.modalTopView}>
                    <View
                        style={styles.modalsecondView}>
                        <TouchableOpacity onPress={() => closemodal()} style={{ position: 'absolute', top: wp(4), right: wp(4) }}>
                            <AntDesign name='close' size={20} color={Colors.black} />
                        </TouchableOpacity>
                        <View>
                            <Image source={images.paynowImg} resizeMode='contain' style={{ width: wp(35), height: wp(35), alignSelf: 'center' }} />
                        </View>
                        <View style={{ alignSelf: 'center', marginHorizontal: wp(10), marginTop: wp(2) }}>
                            <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: Colors.black, textAlign: 'center' }}>Payment Success</Text>

                            <Text
                                style={{
                                    fontSize: 14,
                                    fontFamily: fonts.medium,
                                    color: Colors.black,
                                    textAlign: 'center',
                                    lineHeight: 20,
                                    marginTop: wp(3)
                                }}>
                                Your money has been successfully sent to
                                the rider
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => { closemodal(), navigation.navigate('Feedback') }} style={{
                                width: wp(75),
                                height: wp(12),
                                borderRadius: wp(2),
                                backgroundColor: Colors.buttoncolor,
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                marginTop: wp(6)
                            }}>
                            <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: Colors.background, }}>Feedback The Rider</Text>
                        </TouchableOpacity>


                    </View>
                </View>
            </Modal>
        </ImageBackground>
    )
}

export default Payment_R

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   SafeAreaView,
//   ScrollView,
//   Platform,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import Header from '../../../components/Header';
// import { fonts, images, styles, Colors } from '../../../constant/Index';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import MainButton from '../../../components/MainButton';
// import Toast from 'react-native-toast-message';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { Formik } from 'formik';
// import * as yup from 'yup';
// import { PostAPiwithToken } from '../../../components/ApiRoot';
// import { useSelector } from 'react-redux';
// import Loader from '../../../components/Loader';
// import { Dropdown } from 'react-native-element-dropdown';

// const _validationSchema = yup.object().shape({
//   triptitle: yup.string().required('Trip title is required'),
//   time: yup.string().required('Time is required'),
//   fair: yup
//     .string()
//     .required('Offer fair is required')
//     .matches(/^\d+$/, 'Offer fair must be a valid number'),
//   dot: yup
//     .object()
//     .shape({
//       day: yup.string().required('Day is required'),
//       month: yup.string().required('Month is required'),
//       year: yup.string().required('Year is required'),
//     })
//     .required('Date of trip is required'),
//   description: yup.string().required('Trip description is required'),
// });

// const CreateTrip_R = ({ navigation, route }) => {
//   const user = useSelector(state => state.user.user);
//   const { myData } = route.params;
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [timePickerMode, setTimePickerMode] = useState(null);
//   const [startTime, setStartTime] = useState(new Date());
//   const [endTime, setEndTime] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [isloading, setIsLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedSeats, setSelectedSeats] = useState(null);
//   const [isFocus, setIsFocus] = useState(false);

//   const formatTime = date => {
//     let hours = date.getHours();
//     let minutes = date.getMinutes();
//     const ampm = hours >= 12 ? 'PM' : 'AM';
//     hours = hours % 12;
//     hours = hours ? hours : 12;
//     minutes = minutes < 10 ? '0' + minutes : minutes;
//     return `${hours}:${minutes} ${ampm}`;
//   };

//   const formatDate = date => {
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   const handleTimeChange = (event, selectedTime, setFieldValue) => {
//     if (event.type === 'dismissed' || !selectedTime) {
//       setShowTimePicker(false);
//       setTimePickerMode(null);
//       return;
//     }

//     if (timePickerMode === 'start') {
//       setStartTime(selectedTime);
//       setTimePickerMode('end');
//       setShowTimePicker(true);
//     } else if (timePickerMode === 'end') {
//       setEndTime(selectedTime);
//       const formattedTime = `${formatTime(startTime)} to ${formatTime(selectedTime)}`;
//       setFieldValue('time', formattedTime);
//       setShowTimePicker(false);
//       setTimePickerMode(null);
//     }
//   };

//   const openTimePicker = () => {
//     if (!showTimePicker && !timePickerMode) {
//       setTimePickerMode('start');
//       setShowTimePicker(true);
//     }
//   };

//   const handleDateChange = (event, selectedDateValue, setFieldValue) => {
//     if (event.type === 'dismissed' || !selectedDateValue) {
//       setShowDatePicker(false);
//       setFieldValue('dot', {
//         day: selectedDate.getDate().toString(),
//         month: (selectedDate.getMonth() + 1).toString(),
//         year: selectedDate.getFullYear().toString(),
//       });
//       return;
//     }

//     setSelectedDate(selectedDateValue);
//     setShowDatePicker(false);
//     setFieldValue('dot', {
//       day: selectedDateValue.getDate().toString(),
//       month: (selectedDateValue.getMonth() + 1).toString(),
//       year: selectedDateValue.getFullYear().toString(),
//     });
//   };

//   const openDatePicker = () => {
//     if (!showDatePicker) {
//       setShowDatePicker(true);
//     }
//   };

//   const isValidTimeRange = (start, end) => {
//     return end > start;
//   };

//   const isFutureDate = date => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     return date > today;
//   };

//   const _createtripAPI = (triptitle, time, dot, description, fair) => {
//     const formdata = new FormData();
//     const token = user.api_token;

//     if (!dot || !dot.day || !dot.month || !dot.year) {
//       setIsLoading(false);
//       Toast.show({
//         type: 'error',
//         text1: 'Error',
//         text2: 'Please select a valid date for the trip',
//       });
//       return;
//     }

//     const formattedDate = `${dot.year}-${dot.month.padStart(2, '0')}-${dot.day.padStart(2, '0')}`;
//     console.log('Formatted date:', formattedDate);

//     formdata.append('title', triptitle);
//     formdata.append('date', formattedDate);
//     formdata.append('seat', selectedSeats);
//     formdata.append('trip_time', time);
//     formdata.append('pickup_latitude', myData?.pickupLat);
//     formdata.append('pickup_longitude', myData?.pickupLng);
//     formdata.append('destination_latitude', myData?.dropoffLat);
//     formdata.append('destination_longitude', myData?.dropoffLng);
//     formdata.append('pickup_location', myData?.pickup);
//     formdata.append('destination_location', myData?.dropoff);
//     formdata.append('description', description);
//     formdata.append('price', fair);

//     setIsLoading(true);
//     PostAPiwithToken({ url: 'create-trip', Token: token }, formdata)
//       .then(res => {
//         setIsLoading(false);
//         if (res.status === 'success') {
//           navigation.navigate('TripCode_R', { response: res });
//         } else {
//           Toast.show({
//             type: 'error',
//             text1: 'Error',
//             text2: res.message || 'Something went wrong',
//           });
//         }
//         console.log('response data-------', res);
//       })
//       .catch(err => {
//         setIsLoading(false);
//         console.log('api error', err);
//         Toast.show({
//           type: 'error',
//           text1: 'Error',
//           text2: 'Something went wrong with the API',
//         });
//       });
//   };

//   const getSeatsForVehicle = vehicle => {
//     switch (vehicle) {
//       case 'Sedan':
//         return Array.from({ length: 7 }, (_, i) => ({
//           label: `${i + 1}`,
//           value: `${i + 1}`,
//         }));
//       case 'SUV':
//         return Array.from({ length: 9 }, (_, i) => ({
//           label: `${i + 1}`,
//           value: `${i + 1}`,
//         }));
//       case 'Van':
//         return Array.from({ length: 10 }, (_, i) => ({
//           label: `${i + 1}`,
//           value: `${i + 1}`,
//         }));
//       case 'Sprinter':
//         return Array.from({ length: 20 }, (_, i) => ({
//           label: `${i + 1}`,
//           value: `${i + 1}`,
//         }));
//       case 'Bus':
//         return Array.from({ length: 30 }, (_, i) => ({
//           label: `${i + 1}`,
//           value: `${i + 1}`,
//         }));
//       case 'Tow Truck':
//         return Array.from({ length: 3 }, (_, i) => ({
//           label: `${i + 1}`,
//           value: `${i + 1}`,
//         }));
//       default:
//         return [];
//     }
//   };

//   return (
//     <Formik
//       initialValues={{
//         triptitle: '',
//         time: '',
//         fair: '',
//         dot: {
//           day: new Date().getDate().toString(),
//           month: (new Date().getMonth() + 1).toString(),
//           year: new Date().getFullYear().toString(),
//         },
//         description: '',
//       }}
//       validateOnMount={true}
//       onSubmit={values => {
//         _createtripAPI(
//           values.triptitle,
//           values.time,
//           values.dot,
//           values.description,
//           values.fair
//         );
//       }}
//       validationSchema={_validationSchema}
//     >
//       {({
//         handleChange,
//         handleBlur,
//         handleSubmit,
//         values,
//         touched,
//         errors,
//         isValid,
//         setFieldValue,
//       }) => (
//         <View style={styles.mainContainer}>
//           {isloading && <Loader />}
//           <Header head="Create Trip" onPress={() => navigation.goBack()} />
//           <ScrollView>
//             <View style={{ marginHorizontal: wp(20), marginTop: wp(4) }}>
//               <Text
//                 style={{
//                   fontSize: 12,
//                   fontFamily: fonts.medium,
//                   color: '#7D7F88',
//                   textAlign: 'center',
//                   lineHeight: 19,
//                 }}>
//                 Create your trip, invite your friends and have fun!!!
//               </Text>
//             </View>
//             <View style={[styles.inputView, { marginTop: wp(4) }]}>
//               <Text style={styles.labelStyle}>Title</Text>
//               <View style={styles.inputViewStyle}>
//                 <Image
//                   source={require('../../../assets/triptiltleImg.png')}
//                   resizeMode="contain"
//                   style={{ width: wp(5), height: wp(6) }}
//                 />
//                 <TextInput
//                   placeholder="Trip Title"
//                   placeholderTextColor={Colors.lightgrey}
//                   keyboardType="default"
//                   style={styles.inputStyle}
//                   onChangeText={handleChange('triptitle')}
//                   onBlur={handleBlur('triptitle')}
//                   value={values.triptitle}
//                 />
//               </View>
//               {errors.triptitle && touched.triptitle && (
//                 <Text style={[styles.errortxt]}>{errors.triptitle}</Text>
//               )}
//             </View>
//             <View style={[styles.inputView, { marginTop: wp(4) }]}>
//               <Text style={styles.labelStyle}>Time</Text>
//               <TouchableOpacity
//                 onPress={openTimePicker}
//                 style={styles.inputViewStyle}>
//                 <Image
//                   source={require('../../../assets/sheetTimeIcon.png')}
//                   resizeMode="contain"
//                   style={{ width: wp(5), height: wp(6) }}
//                 />
//                 <TextInput
//                   placeholder="Ex: 6:00 AM to 2:00 PM"
//                   placeholderTextColor={Colors.lightgrey}
//                   style={styles.inputStyle}
//                   value={values.time}
//                   editable={false}
//                   pointerEvents="none"
//                 />
//               </TouchableOpacity>
//               {errors.time && touched.time && (
//                 <Text style={[styles.errortxt]}>{errors.time}</Text>
//               )}
//             </View>

//             {showTimePicker && timePickerMode && (
//               <DateTimePicker
//                 key={timePickerMode}
//                 value={timePickerMode === 'start' ? startTime : endTime}
//                 mode="time"
//                 display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                 onChange={(event, date) =>
//                   handleTimeChange(event, date, setFieldValue)
//                 }
//               />
//             )}

//             <View style={[styles.inputView, { marginTop: wp(4) }]}>
//               <Text style={styles.labelStyle}>Offer Fair</Text>
//               <View style={styles.inputViewStyle}>
//                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                   <Image
//                     source={images.priceIcon}
//                     tintColor={Colors.buttoncolor}
//                     resizeMode="contain"
//                     style={{ width: wp(5), height: wp(6) }}
//                   />
//                   <Text
//                     style={{
//                       fontFamily: fonts.medium,
//                       fontSize: 14,
//                       color: Colors.black,
//                       marginLeft: wp(2),
//                     }}>
//                     $
//                   </Text>
//                   <TextInput
//                     placeholder={'400'}
//                     placeholderTextColor={Colors.lightgrey}
//                     keyboardType="number-pad"
//                     style={[styles.inputStyle, { width: wp(63), marginLeft: 1 }]}
//                     autoCapitalize="none"
//                     onChangeText={handleChange('fair')}
//                     onBlur={handleBlur('fair')}
//                     value={values.fair}
//                   />
//                 </View>
//                 {errors.fair && touched.fair && (
//                   <Text style={[styles.errortxt]}>{errors.fair}</Text>
//                 )}
//               </View>
//             </View>
//             <View style={[styles.inputView, { marginTop: wp(4) }]}>
//               <Text style={styles.labelStyle}>Number Of Seat</Text>
//               <Dropdown
//                 data={getSeatsForVehicle(user.vehicle_type)}
//                 labelField="label"
//                 valueField="value"
//                 placeholder="Select number of seats"
//                 placeholderStyle={{ color: Colors.lightgrey }}
//                 value={selectedSeats}
//                 itemTextStyle={{
//                   fontSize: 14,
//                   color: Colors.black,
//                   fontFamily: fonts.medium,
//                   textAlign: 'center',
//                 }}
//                 selectedTextStyle={{
//                   fontSize: 14,
//                   color: Colors.black,
//                   fontFamily: fonts.medium,
//                 }}
//                 maxHeight={wp(70)}
//                 containerStyle={{
//                   width: wp(40),
//                   alignSelf: 'flex-end',
//                   marginRight: wp(10),
//                   borderRadius: wp(4),
//                   marginTop: wp(-6),
//                 }}
//                 itemContainerStyle={{
//                   borderBottomWidth: 1,
//                   borderColor: Colors.grey,
//                   width: wp(30),
//                   alignSelf: 'center',
//                   borderTopLeftRadius: wp(4),
//                   borderTopRightRadius: wp(4),
//                 }}
//                 onChange={item => {
//                   setSelectedSeats(item.value);
//                   setIsFocus(false);
//                 }}
//                 style={{
//                   width: wp(90),
//                   height: wp(13),
//                   borderRadius: wp(7),
//                   backgroundColor: Colors.inputColor,
//                   alignSelf: 'center',
//                   paddingLeft: wp(5),
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   elevation: 2,
//                   paddingRight: wp(3),
//                   borderColor: Colors.buttoncolor,
//                   borderWidth: 1,
//                 }}
//                 onFocus={() => setIsFocus(true)}
//                 onBlur={() => setIsFocus(false)}
//                 renderLeftIcon={() => (
//                   <Image
//                     source={images.seatIcon}
//                     resizeMode="contain"
//                     style={{ width: wp(6), height: wp(6), marginRight: wp(2) }}
//                   />
//                 )}
//               />
//             </View>
//             <View style={[styles.inputView, { marginTop: wp(4) }]}>
//               <Text style={styles.labelStyle}>Date of Trip</Text>
//               <TouchableOpacity
//                 onPress={openDatePicker}
//                 style={styles.inputViewStyle}>
//                 <Image
//                   source={require('../../../assets/sheetTimeIcon.png')}
//                   resizeMode="contain"
//                   style={{ width: wp(5), height: wp(6) }}
//                 />
//                 <TextInput
//                   placeholder="Ex: DD/MM/YYYY"
//                   placeholderTextColor={Colors.lightgrey}
//                   style={styles.inputStyle}
//                   value={
//                     values.dot.day && values.dot.month && values.dot.year
//                       ? `${values.dot.day.padStart(
//                           2,
//                           '0'
//                         )}/${values.dot.month.padStart(2, '0')}/${
//                           values.dot.year
//                         }`
//                       : ''
//                   }
//                   editable={false}
//                   pointerEvents="none"
//                 />
//               </TouchableOpacity>
//               {errors.dot && (
//                 <Text style={[styles.errortxt]}>
//                   {errors.dot.day ||
//                     errors.dot.month ||
//                     errors.dot.year ||
//                     errors.dot}
//                 </Text>
//               )}
//               {showDatePicker && (
//                 <DateTimePicker
//                   key="datePicker"
//                   value={selectedDate}
//                   mode="date"
//                   display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
//                   minimumDate={new Date()}
//                   onChange={(event, date) =>
//                     handleDateChange(event, date, setFieldValue)
//                   }
//                 />
//               )}
//             </View>
//             <View style={[styles.inputView, { marginTop: wp(4) }]}>
//               <Text style={styles.labelStyle}>Trip Description</Text>
//               <View
//                 style={[
//                   styles.inputViewStyle,
//                   {
//                     height: wp(30),
//                     textAlignVertical: 'top',
//                     alignItems: 'flex-start',
//                     paddingTop: wp(3),
//                   },
//                 ]}>
//                 <Image
//                   source={images.desIcon}
//                   resizeMode="contain"
//                   style={{
//                     width: wp(5),
//                     height: wp(6),
//                     textAlignVertical: 'top',
//                   }}
//                 />
//                 <TextInput
//                   placeholder="Write here..."
//                   placeholderTextColor={Colors.lightgrey}
//                   keyboardType="default"
//                   style={[
//                     styles.inputStyle,
//                     {
//                       textAlignVertical: 'top',
//                       height: wp(25),
//                       marginBottom: wp(5),
//                     },
//                   ]}
//                   onChangeText={handleChange('description')}
//                   onBlur={handleBlur('description')}
//                   multiline
//                   value={values.description}
//                 />
//               </View>
//               {errors.description && touched.description && (
//                 <Text style={[styles.errortxt]}>{errors.description}</Text>
//               )}
//             </View>
//             <View style={{ marginTop: wp(10), marginBottom: wp(5) }}>
//               <MainButton title="Create" onPress={handleSubmit} />
//             </View>
//           </ScrollView>
//         </View>
//       )}
//     </Formik>
//   );
// };

// export default CreateTrip_R;