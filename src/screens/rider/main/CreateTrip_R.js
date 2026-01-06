import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Platform,
  Modal,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../../components/Header';
import {fonts, images, styles, Colors} from '../../../constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../components/MainButton';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Formik} from 'formik';
import * as yup from 'yup';
import {AllGetAPI, PostAPiwithToken} from '../../../components/ApiRoot';
import {useSelector} from 'react-redux';
import Loader from '../../../components/Loader';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';

const _validationSchema = yup.object().shape({
  triptitle: yup.string().required('Trip title is required'),
  time: yup.string().required('Time is required'),
  fair: yup
    .string()
    .required('Offer fair is required')
    .matches(/^\d+$/, 'Offer fair must be a valid number'),
  dot: yup
    .object()
    .shape({
      day: yup.string().required('Day is required'),
      month: yup.string().required('Month is required'),
      year: yup.string().required('Year is required'),
    })
    .required('Date of trip is required'),
  description: yup.string().required('Trip description is required'),
});

const CreateTrip_R = ({navigation, route}) => {
  const user = useSelector(state => state.user.user);
  const {myData} = route.params;
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isloading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [confirm2, setConfrim2] = useState(true);
  const [baseprice, setBasePrice] = useState('');

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

  const closemodal2 = () => {
    setConfrim2(false);
  };

  const formatTime = date => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };

  const formatDate = date => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const handleTimeChange = (event, selectedTimeValue, setFieldValue) => {
    if (event.type === 'dismissed' || !selectedTimeValue) {
      setShowTimePicker(false);
      return;
    }

    const now = new Date();
    const isToday = isSameDay(selectedDate, now);

    if (isToday && selectedTimeValue < now) {
      setShowTimePicker(false);
      Toast.show({
        type: 'error',
        text1: 'Invalid Time',
        text2: 'You cannot select a past time for today',
        topOffset: Platform.OS === 'ios' ? 50 : 0,
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    setSelectedTime(selectedTimeValue);
    setShowTimePicker(false);
    setFieldValue('time', formatTime(selectedTimeValue));
  };

  const openTimePicker = () => {
    if (!showTimePicker) {
      setShowTimePicker(true);
    }
  };

  const fetchBasePrice = () => {
    AllGetAPI({url: 'get-base-fare', Token: user?.api_token})
      .then(res => {
        console.log('response data baseprice', res);
        setBasePrice(res.base_fare);
      })
      .catch(err => {
        console.log('api error', err);
      });
  };

  useEffect(() => {
    fetchBasePrice();
  }, []);

  const handleDateChange = (event, selectedDateValue, setFieldValue) => {
    if (event.type === 'dismissed' || !selectedDateValue) {
      setShowDatePicker(false);
      setFieldValue('dot', {
        day: selectedDate.getDate().toString(),
        month: (selectedDate.getMonth() + 1).toString(),
        year: selectedDate.getFullYear().toString(),
      });
      return;
    }

    setSelectedDate(selectedDateValue);
    setShowDatePicker(false);
    setFieldValue('dot', {
      day: selectedDateValue.getDate().toString(),
      month: (selectedDateValue.getMonth() + 1).toString(),
      year: selectedDateValue.getFullYear().toString(),
    });
  };

  const openDatePicker = () => {
    if (!showDatePicker) {
      setShowDatePicker(true);
    }
  };

  const isFutureDate = date => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const _createtripAPI = (triptitle, time, dot, description, fair) => {
    const formdata = new FormData();
    const token = user.api_token;
    const parsedOfferPrice = parseInt(fair);

    if (!parsedOfferPrice || parsedOfferPrice < baseprice) {
      setIsLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: fair
          ? `Fare amount must be greater than $${baseprice}.`
          : 'Please enter the fare amount.',
        topOffset: Platform.OS === 'ios' ? 50 : 0,
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    if (!dot || !dot.day || !dot.month || !dot.year) {
      setIsLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select a valid date for the trip',
      });
      return;
    }

    const formattedDate = `${dot.year}-${dot.month.padStart(
      2,
      '0',
    )}-${dot.day.padStart(2, '0')}`;
    console.log('Formatted date:', formattedDate);

    formdata.append('title', triptitle);
    formdata.append('date', formattedDate);
    formdata.append('seat', selectedSeats);
    formdata.append('trip_time', time);
    formdata.append('pickup_latitude', myData?.pickupLat);
    formdata.append('pickup_longitude', myData?.pickupLng);
    formdata.append('destination_latitude', myData?.dropoffLat);
    formdata.append('destination_longitude', myData?.dropoffLng);
    formdata.append('pickup_location', myData?.pickup);
    formdata.append('destination_location', myData?.dropoff);
    formdata.append('description', description);
    formdata.append('price', fair);

    setIsLoading(true);
    PostAPiwithToken({url: 'create-trip', Token: token}, formdata)
      .then(res => {
        setIsLoading(false);
        console.log('my trip res', res);

        if (res.status === 'success') {
          navigation.navigate('TripCode_R', {response: res});
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message || 'Something went wrong',
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('api error', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong with the API',
        });
      });
  };

  const getSeatsForVehicle = () => {
    return Array.from({length: 100}, (_, i) => ({
      label: `${i + 1}`,
      value: `${i + 1}`,
    }));
  };

  return (
    <Formik
      initialValues={{
        triptitle: '',
        time: '',
        fair: '',
        dot: {
          day: new Date().getDate().toString(),
          month: (new Date().getMonth() + 1).toString(),
          year: new Date().getFullYear().toString(),
        },
        description: '',
      }}
      validateOnMount={true}
      onSubmit={values => {
        _createtripAPI(
          values.triptitle,
          values.time,
          values.dot,
          values.description,
          values.fair,
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
        <View style={styles.mainContainer}>
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
            <Header head="Create Trip" onPress={() => navigation.goBack()} />
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{paddingBottom: wp(6)}}>
              <View style={{marginHorizontal: wp(20), marginTop: wp(4)}}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: fonts.medium,
                    color: '#7D7F88',
                    textAlign: 'center',
                    lineHeight: 19,
                  }}>
                  Create your trip, invite your friends and have fun!!!
                </Text>
              </View>
              <View style={[styles.inputView, {marginTop: wp(4)}]}>
                <Text style={styles.labelStyle}>Title</Text>
                <View style={styles.inputViewStyle}>
                  <Image
                    source={require('../../../assets/triptiltleImg.png')}
                    resizeMode="contain"
                    style={{width: wp(5), height: wp(6)}}
                  />
                  <TextInput
                    placeholder="Trip Title"
                    placeholderTextColor={Colors.lightgrey}
                    keyboardType="default"
                    style={styles.inputStyle}
                    onChangeText={handleChange('triptitle')}
                    onBlur={handleBlur('triptitle')}
                    value={values.triptitle}
                  />
                </View>
                {errors.triptitle && touched.triptitle && (
                  <Text style={[styles.errortxt]}>{errors.triptitle}</Text>
                )}
              </View>
              <View style={[styles.inputView, {marginTop: wp(4)}]}>
                <Text style={styles.labelStyle}>Number Of Seat</Text>
                <Dropdown
                  data={getSeatsForVehicle()}
                  labelField="label"
                  valueField="value"
                  placeholder="Select number of seats"
                  placeholderStyle={{color: Colors.lightgrey}}
                  value={selectedSeats}
                  itemTextStyle={{
                    fontSize: 14,
                    color: Colors.black,
                    fontFamily: fonts.medium,
                    textAlign: 'center',
                  }}
                  selectedTextStyle={{
                    fontSize: 14,
                    color: Colors.black,
                    fontFamily: fonts.medium,
                  }}
                  maxHeight={wp(70)}
                  containerStyle={{
                    width: wp(40),
                    alignSelf: 'flex-end',
                    marginRight: wp(10),
                    borderRadius: wp(4),
                    marginTop: wp(-6),
                  }}
                  itemContainerStyle={{
                    borderBottomWidth: 1,
                    borderColor: Colors.grey,
                    width: wp(30),
                    alignSelf: 'center',
                    borderTopLeftRadius: wp(4),
                    borderTopRightRadius: wp(4),
                  }}
                  onChange={item => {
                    setSelectedSeats(item.value);
                    setIsFocus(false);
                  }}
                  style={{
                    width: wp(90),
                    height: wp(13),
                    borderRadius: wp(7),
                    backgroundColor: Colors.inputColor,
                    alignSelf: 'center',
                    paddingLeft: wp(5),
                    flexDirection: 'row',
                    alignItems: 'center',
                    elevation: 2,
                    paddingRight: wp(3),
                    borderColor: Colors.buttoncolor,
                    borderWidth: 1,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                  }}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  renderLeftIcon={() => (
                    <Image
                      source={images.seatIcon}
                      resizeMode="contain"
                      style={{width: wp(6), height: wp(6), marginRight: wp(2)}}
                    />
                  )}
                />
              </View>

              <View style={[styles.inputView, {marginTop: wp(4)}]}>
                <Text style={styles.labelStyle}>Offer Fare (per seat)</Text>
                <View style={styles.inputViewStyle}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={images.priceIcon}
                      tintColor={Colors.buttoncolor}
                      resizeMode="contain"
                      style={{width: wp(5), height: wp(6)}}
                    />
                    <Text
                      style={{
                        fontFamily: fonts.medium,
                        fontSize: 14,
                        color: Colors.black,
                        marginLeft: wp(2),
                      }}>
                      $
                    </Text>
                    <TextInput
                      placeholder={'Enter your trip fare'}
                      placeholderTextColor={Colors.lightgrey}
                      keyboardType="number-pad"
                      style={[
                        styles.inputStyle,
                        {width: wp(63), marginLeft: 1},
                      ]}
                      autoCapitalize="none"
                      onChangeText={handleChange('fair')}
                      onBlur={handleBlur('fair')}
                      value={values.fair}
                    />
                  </View>
                </View>
                {errors.fair && touched.fair && (
                  <Text style={[styles.errortxt]}>{errors.fair}</Text>
                )}
              </View>

              <View style={[styles.inputView, {marginTop: wp(4)}]}>
                <Text style={styles.labelStyle}>Date of Trip</Text>
                <TouchableOpacity
                  onPress={openDatePicker}
                  style={styles.inputViewStyle}>
                  <Image
                    source={require('../../../assets/sheetTimeIcon.png')}
                    resizeMode="contain"
                    style={{width: wp(5), height: wp(6)}}
                  />
                  <TextInput
                    placeholder="Ex: DD/MM/YYYY"
                    placeholderTextColor={Colors.lightgrey}
                    style={styles.inputStyle}
                    value={
                      values.dot.day && values.dot.month && values.dot.year
                        ? `${values.dot.day.padStart(
                            2,
                            '0',
                          )}/${values.dot.month.padStart(2, '0')}/${
                            values.dot.year
                          }`
                        : ''
                    }
                    editable={false}
                    pointerEvents="none"
                  />
                </TouchableOpacity>
                {errors.dot && (
                  <Text style={[styles.errortxt]}>
                    {errors.dot.day ||
                      errors.dot.month ||
                      errors.dot.year ||
                      errors.dot}
                  </Text>
                )}
                {showDatePicker && (
                  <DateTimePicker
                    key="datePicker"
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                    minimumDate={new Date()}
                    onChange={(event, date) =>
                      handleDateChange(event, date, setFieldValue)
                    }
                  />
                )}
              </View>
              <View style={[styles.inputView, {marginTop: wp(4)}]}>
                <Text style={styles.labelStyle}>Time</Text>
                <TouchableOpacity
                  onPress={openTimePicker}
                  style={styles.inputViewStyle}>
                  <Image
                    source={require('../../../assets/sheetTimeIcon.png')}
                    resizeMode="contain"
                    style={{width: wp(5), height: wp(6)}}
                  />
                  <TextInput
                    placeholder="Ex: 6:00 AM"
                    placeholderTextColor={Colors.lightgrey}
                    style={styles.inputStyle}
                    value={values.time}
                    editable={false}
                    pointerEvents="none"
                  />
                </TouchableOpacity>
                {errors.time && touched.time && (
                  <Text style={[styles.errortxt]}>{errors.time}</Text>
                )}
              </View>

              {showTimePicker && (
                <DateTimePicker
                  value={selectedTime}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, date) =>
                    handleTimeChange(event, date, setFieldValue)
                  }
                />
              )}
              <View style={[styles.inputView, {marginTop: wp(4)}]}>
                <Text style={styles.labelStyle}>Trip Description</Text>
                <View
                  style={[
                    styles.inputViewStyle,
                    {
                      height: wp(30),
                      textAlignVertical: 'top',
                      alignItems: 'flex-start',
                      paddingTop: wp(3),
                    },
                  ]}>
                  <Image
                    source={images.desIcon}
                    resizeMode="contain"
                    style={{
                      width: wp(5),
                      height: wp(6),
                      textAlignVertical: 'top',
                    }}
                  />
                  <TextInput
                    placeholder="Write here..."
                    placeholderTextColor={Colors.lightgrey}
                    keyboardType="default"
                    style={[
                      styles.inputStyle,
                      {
                        textAlignVertical: 'top',
                        height: wp(25),
                        marginBottom: wp(5),
                      },
                    ]}
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                    multiline
                    value={values.description}
                  />
                </View>
                {errors.description && touched.description && (
                  <Text style={[styles.errortxt]}>{errors.description}</Text>
                )}
              </View>
              <View style={{marginTop: wp(10), marginBottom: wp(5)}}>
                <MainButton title="Create" onPress={handleSubmit} />
              </View>

              <Modal
                transparent={true}
                visible={confirm2}
                onRequestClose={closemodal2}
                animationType="none">
                <View style={styles.modalTopView}>
                  <View
                    style={[styles.modalsecondView, {paddingVertical: wp(4)}]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <View></View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: fonts.bold,
                          color: Colors.black,
                        }}>
                        Cancellation Policy
                      </Text>
                      <TouchableOpacity
                        onPress={() => closemodal2()}
                        style={{marginRight: wp(3)}}>
                        <AntDesign
                          name="close"
                          size={20}
                          color={Colors.black}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={{paddingHorizontal: wp(5), marginTop: wp(3)}}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: fonts.medium,
                          color: Colors.black,
                          lineHeight: 18,
                        }}>
                        1. Riders can cancel their trip up to 24 hours before
                        the scheduled time and receive a full refund.
                        Cancellations made less than 24 hours before the trip
                        are non-refundable, except in cases where the trip is
                        canceled by the driver.
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: fonts.medium,
                          color: Colors.black,
                          lineHeight: 18,
                        }}>
                        2. We know how disappointing it can be when a trip gets
                        canceled. That’s why, if your driver ever cancels a
                        ride, you’ll automatically get a full refund—no need to
                        request it. Your time and money matter, and we’re here
                        to make sure you’re always taken care of.
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => closemodal2()}
                      style={{
                        width: wp(40),
                        height: wp(12),
                        backgroundColor: Colors.buttoncolor,
                        borderRadius: wp(3),
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: wp(5),
                      }}>
                      <Text
                        style={[
                          styles.titleText,
                          {color: Colors.white, fontSize: 14},
                        ]}>
                        I Agreed
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      )}
    </Formik>
  );
};

export default CreateTrip_R;
