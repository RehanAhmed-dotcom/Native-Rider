import {
  FlatList,
  Image,
  ImageBackground,
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
import React, {useState, useRef, useEffect} from 'react';
import {images, fonts, Colors, styles} from '../../../constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../components/MainButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Header from '../../../components/Header';
import Toast from 'react-native-toast-message';
const EmergencyaddContacts = ({navigation}) => {
  const [selectedContacts, setSelectedContacts] = useState([]);

  const contacts = [
    {id: '1', name: 'Ron Weasley', phone: '0308 - XXXXXXX'},
    {id: '2', name: 'Hermione Granger', phone: '0308 - XXXXXXX'},
    {id: '3', name: 'Ginny Weasley', phone: '0308 - XXXXXXX'},
  ];
  const toggleContact = id => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(
        selectedContacts.filter(contactId => contactId !== id),
      );
    } else if (selectedContacts.length < 3) {
      setSelectedContacts([...selectedContacts, id]);
    }
  };

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

  const renderItem = ({item}) => {
    const isSelected = selectedContacts.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.contactItem, isSelected && styles.selectedContact]}
        onPress={() => toggleContact(item.id)}>
        <View>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactPhone}>{item.phone}</Text>
        </View>
        {isSelected ? (
          <View
            style={{
              width: wp(7),
              height: wp(7),
              borderRadius: wp(4),
              backgroundColor: Colors.buttoncolor,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FontAwesome6 name="check" color={Colors.background} size={18} />
          </View>
        ) : (
          <View
            style={{
              width: wp(7),
              height: wp(7),
              borderRadius: wp(4),
              // backgroundColor: Colors.buttoncolor,
              borderWidth: 1,
              borderColor: 'black',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FontAwesome6 name="check" color={Colors.black} size={18} />
          </View>
        )}
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
            ? 'padding'
            : keyboardStatus === true
            ? 'height'
            : 'undefined'
        }
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <Header head="Emergency Contacts" onPress={() => navigation.goBack()} />

        <ScrollView>
          <View style={{alignSelf: 'center', marginTop: wp(10)}}>
            <Image
              source={images.emergencyGroup}
              style={{width: wp(75), height: wp(75)}}
            />
          </View>

          <View style={{marginHorizontal: wp(15), marginBottom: wp(2)}}>
            <Text
              style={[
                {
                  fontSize: 14,
                  lineHeight: 16,
                  fontFamily: fonts.bold,
                  color: Colors.black,
                  textAlign: 'center',
                },
              ]}>
              All emergency contacts
            </Text>
          </View>
          <View style={{marginTop: wp(5)}}>
            <FlatList
              data={contacts}
              inverted
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          </View>
          {selectedContacts ? (
            <View style={{marginTop: wp(10), marginBottom: wp(5)}}>
              <MainButton
                title="Send Notification"
                onPress={() => {
                  Toast.show({
                    type: 'success',
                    text1: 'Comming Soon',
                    text2: '',
                    topOffset: Platform.OS === 'ios' ? 50 : 0,
                    visibilityTime: 3000,
                    autoHide: true,
                  });
                }}
              />
            </View>
          ) : (
            <View></View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default EmergencyaddContacts;
