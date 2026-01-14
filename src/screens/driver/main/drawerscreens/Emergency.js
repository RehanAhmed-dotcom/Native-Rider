import {
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Linking,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {images, fonts, Colors, styles} from '../../../../constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../../components/MainButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../../../components/Header';
import PhoneInput from 'react-native-phone-number-input';
import Geolocation from '@react-native-community/geolocation';
import {
  AllGetAPI,
  PostAPiwithToken,
  DeleteAPiwithToken,
} from '../../../../components/ApiRoot';
import {useSelector} from 'react-redux';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Toast from 'react-native-toast-message';

const Emergency = ({navigation}) => {
  const user = useSelector(state => state.user.user);
  const [Contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const phoneInput = useRef(null);
  const [value, setValue] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [name, setName] = useState('');

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

  const fetchEmergencyNumber = () => {
    AllGetAPI({url: 'emergency-numbers', Token: user?.api_token})
      .then(res => {
        console.log('response dataaaaaaaaa runner', res);
        setContacts(res.emergency_numbers);
      })
      .catch(err => {
        console.log('api error', err);
      });
  };

  useEffect(() => {
    fetchEmergencyNumber();
  }, []);

  const AddEmergencyNum = () => {
    const formdata = new FormData();
    const token = user.api_token;
    formdata.append('name', name);
    formdata.append('number', value);

    PostAPiwithToken({url: 'store-emergency-numbers', Token: token}, formdata)
      .then(res => {
        console.log('res of register ', res);
        setModalVisible(false);
        fetchEmergencyNumber();
        setName('');
        setValue('');
      })
      .catch(err => {
        console.log('api error', err);
      });
  };

  const deleteEmergencyContact = () => {
    const formdata = new FormData();
    const token = user.api_token;
    formdata.append('emergency_number_id', selectedContact);

    PostAPiwithToken({url: 'delete-emergency-numbers', Token: token}, formdata)
      .then(res => {
        if (res.status === 'success') {
          setDeleteModalVisible(false);
          fetchEmergencyNumber();
          setSelectedContact(null);
        }
        console.log('res of delete number ', res);
      })
      .catch(err => {
        console.log('api error', err);
      });
  };

  const requestLocationPermission = async () => {
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      const result = await request(permission);
      return result === RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const selectContact = contactId => {
    if (selectedContact === contactId) {
      setSelectedContact(null);
    } else {
      setSelectedContact(contactId);
    }
  };

  const sendMessageToSelected = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Location permission is required to share your location.',
      );
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const locationLink = `https://maps.google.com/?q=${latitude},${longitude}`;
        const message = `My current location: ${locationLink}`;
        const encodedMessage = encodeURIComponent(message);

        const contact = Contacts.find(c => c.id === selectedContact);
        if (contact) {
          const smsUrl =
            Platform.OS === 'ios'
              ? `sms:${contact.number}&body=${encodedMessage}`
              : `sms:${contact.number}?body=${encodedMessage}`;

          Linking.openURL(smsUrl).catch(err => {
            console.error('Error opening messaging app:', err);
            Alert.alert(
              'Error',
              `Unable to open messaging app for ${contact.name}.`,
            );
          });
        }
      },
      error => {
        console.error('Location error:', error);
        Alert.alert('Error', 'Unable to fetch location.');
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const renderItem = ({item}) => {
    const isSelected = selectedContact === item.id;
    return (
      <TouchableOpacity
        style={[styles.contactItem]}
        onPress={() => selectContact(item.id)}>
        <View>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactPhone}>{item.number}</Text>
        </View>
        <Ionicons
          name={
            isSelected ? 'checkmark-circle-sharp' : 'checkmark-circle-outline'
          }
          color={Colors.buttoncolor}
          size={28}
        />
      </TouchableOpacity>
    );
  };

  const {top, bottom} = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS == 'ios' ? top : 0},
      ]}>
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
        <View style={styles.HeaderView}>
          <Text style={styles.headerText}>Emergency</Text>
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{position: 'absolute', left: wp(4)}}
            activeOpacity={0.7}>
            <Image
              source={images.menuIcon}
              resizeMode="contain"
              style={{width: wp(6), height: wp(6)}}
            />
          </TouchableOpacity>
          {selectedContact !== null && (
            <TouchableOpacity
              onPress={() => setDeleteModalVisible(true)}
              style={{position: 'absolute', right: wp(4)}}
              activeOpacity={0.7}>
              <Ionicons name="trash-outline" color={Colors.red} size={28} />
            </TouchableOpacity>
          )}
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{paddingBottom: wp(20)}}>
          <View style={{alignSelf: 'center', marginTop: wp(15)}}>
            <Image
              source={images.emergencyGroup}
              style={{width: wp(75), height: wp(75), alignSelf: 'center'}}
            />
          </View>
          {!Contacts || Contacts.length === 0 ? (
            <View style={{marginHorizontal: wp(15), marginTop: wp(10)}}>
              <Text
                style={[
                  {
                    fontSize: 16,
                    lineHeight: 26,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                    textAlign: 'center',
                  },
                ]}>
                Add 3 contacts that you want add in case of an emergency during
                your ride
              </Text>
            </View>
          ) : (
            <View style={{}}>
              <FlatList
                data={Contacts}
                inverted
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
              />
            </View>
          )}
          {Contacts.length < 3 ? (
            <View style={{marginTop: wp(7), marginBottom: wp(5)}}>
              {selectedContact == null ? (
                <MainButton
                  title="Add Contacts"
                  onPress={() => setModalVisible(true)}
                />
              ) : null}
            </View>
          ) : null}
          {selectedContact !== null ? (
            <View style={{marginBottom: wp(30)}}>
              <MainButton
                title="Send Message"
                onPress={sendMessageToSelected}
              />
            </View>
          ) : null}
        </ScrollView>
        <Modal visible={modalVisible} animationType="slide" transparent={false}>
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
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
              <Header
                head="Emergency Contacts"
                onPress={() => setModalVisible(false)}
              />
              <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{paddingBottom: wp(6)}}>
                <View style={{marginTop: wp(2)}}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.medium,
                      color: Colors.black,
                      textAlign: 'center',
                    }}>
                    You can select only 3 emergency contacts
                  </Text>
                </View>
                <View style={{marginTop: wp(20)}}>
                  <View style={[styles.inputView, {marginTop: wp(4)}]}>
                    <Text style={styles.labelStyle}>Full Name</Text>
                    <View style={styles.inputViewStyle}>
                      <Image
                        source={images.usernameIcon}
                        resizeMode="contain"
                        style={{width: wp(5), height: wp(6)}}
                      />
                      <TextInput
                        placeholder="Full Name"
                        placeholderTextColor={Colors.lightgrey}
                        keyboardType="default"
                        style={styles.inputStyle}
                        onChangeText={text => setName(text)}
                        value={name}
                      />
                    </View>
                  </View>
                  <View style={[styles.inputView, {marginTop: wp(4)}]}>
                    <Text style={styles.labelStyle}>Phone Number</Text>
                    <View style={[styles.inputViewStyle, {paddingLeft: wp(2)}]}>
                      <PhoneInput
                        ref={phoneInput}
                        defaultValue={value}
                        defaultCode="US"
                        layout="first"
                        onChangeText={text => {
                          setValue(text);
                        }}
                        onChangeFormattedText={formattedText =>
                          setValue(formattedText)
                        }
                        withDarkTheme={false}
                        autoFocus={false}
                        placeholder="Enter Number"
                        placeholderTextColor="black"
                        containerStyle={styles.phoneContainerStyle}
                        textContainerStyle={styles.phonetextContainer}
                        textInputStyle={{
                          color: 'black',
                          fontFamily: fonts.medium,
                          fontSize: 14,
                        }}
                        codeTextStyle={{
                          display: 'none',
                        }}
                        textInputProps={{
                          placeholder: 'Enter your phone number',
                          placeholderTextColor: Colors.lightgrey,
                          fontFamily: fonts.medium,
                          height: wp(12),
                        }}
                      />
                    </View>
                  </View>
                </View>
                <View style={{marginTop: wp(40), marginBottom: wp(5)}}>
                  <MainButton
                    title="Submit"
                    onPress={() => AddEmergencyNum()}
                  />
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </Modal>
        <Modal
          visible={deleteModalVisible}
          animationType="slide"
          transparent={true}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              // alignContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <View
              style={{
                margin: wp(5),
                backgroundColor: 'white',
                borderRadius: 20,
                padding: wp(5),
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}>
              <Text
                style={{
                  marginBottom: wp(5),
                  textAlign: 'center',
                  fontFamily: fonts.medium,
                  fontSize: 16,
                  color: Colors.black,
                }}>
                Are you sure you want to delete this emergency contact?
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: wp(70),
                }}>
                <TouchableOpacity
                  onPress={() => deleteEmergencyContact()}
                  style={{
                    width: wp(30),
                    height: wp(12),
                    borderRadius: wp(2),
                    backgroundColor: Colors.buttoncolor,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: Colors.white,
                      fontFamily: fonts.bold,
                    }}>
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setDeleteModalVisible(false)}
                  style={{
                    width: wp(30),
                    height: wp(12),
                    borderRadius: wp(2),
                    backgroundColor: Colors.white,
                    borderWidth: 1,
                    borderColor: '#FB5B58',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#FB5B58',
                      fontFamily: fonts.bold,
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Emergency;
