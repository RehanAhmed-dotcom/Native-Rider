import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../../components/Header';
import {fonts, images, styles} from '../../../constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../components/MainButton';
import Toast from 'react-native-toast-message';
import {PostAPiwithToken} from '../../../components/ApiRoot';
import Loader from '../../../components/Loader';
import {useSelector} from 'react-redux';

const TripCode_R = ({navigation, route}) => {
  const {response} = route.params;
  console.log('responsefdfdfdfdfdfdffd', response);
  const user = useSelector(state => state.user.user);

  const [isloading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const inputs = useRef([]);
  const [code, setCode] = useState('');

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

  const handleChangeText = (text, index) => {
    if (/^\d?$/.test(text)) {
      const updatedCode = code.split('');
      updatedCode[index] = text;
      const newCode = updatedCode.join('');
      setCode(newCode);

      // Move to next input
      if (text && index < inputs.current.length - 1) {
        inputs.current[index + 1].focus();
      }

      // Optionally blur last input
      if (index === inputs.current.length - 1 && text) {
        inputs.current[index].blur();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1].focus();
      const updatedCode = code.split('');
      updatedCode[index - 1] = ''; // Clear the previous digit
      setCode(updatedCode.join(''));
    }
  };

  const _createtripAPI = () => {
    const formdata = new FormData();
    const token = user.api_token;

    formdata.append('trip_code', code); // Send as single string
    formdata.append('trip_id', response?.trip?.id);

    setIsLoading(true);
    PostAPiwithToken({url: 'trip-update', Token: token}, formdata)
      .then(res => {
        setIsLoading(false);
        if (res.status === 'success') {
          navigation.navigate('Drawer_R', {screen: 'Trips_R'});
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Trip created successfully',
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message || 'Something went wrong',
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        }
        console.log('response data-------', res);
      })
      .catch(err => {
        setIsLoading(false);
        console.log('api error', err);
      });
  };

  return (
    <View style={styles.mainContainer}>
      {isloading && <Loader />}
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
        <Header head="Trip Code" onPress={() => navigation.goBack()} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{paddingBottom: wp(6)}}>
          <View
            style={{
              width: wp(90),
              // paddingVertical: wp(3),
              paddingHorizontal: wp(5),
              backgroundColor: '#FFFFFF',
              borderRadius: wp(2),
              alignSelf: 'center',
              marginBottom: wp(5),
              elevation: 1,
              marginTop: wp(7),
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.2,
              shadowRadius: 3,
            }}>
            <Image
              source={images.tripImg}
              style={{width: wp(80), height: wp(100), resizeMode: 'contain'}}
            />
          </View>
          <View style={{paddingHorizontal: wp(5)}}>
            <Text style={styles.subtitle}>
              Create your trip invitation code to invite your friends
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.medium,
                color: '#1A1E25',
                marginBottom: 5,
              }}>
              Trip Code
            </Text>

            <View style={styles.codeContainer}>
              {[...Array(6)].map((_, index) => (
                <TextInput
                  key={index}
                  ref={ref => (inputs.current[index] = ref)}
                  style={styles.codeInput}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={code[index] || ''}
                  onChangeText={text => handleChangeText(text, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                  autoFocus={index === 0}
                />
              ))}
            </View>
          </View>
          <View style={{marginVertical: wp(5)}}>
            <MainButton title="Continue" onPress={_createtripAPI} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default TripCode_R;
