import {
  FlatList,
  Image,
  ImageBackground,
  Switch,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {images, fonts, Colors, styles} from '../../../constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../components/MainButton';
import Header from '../../../components/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
const UtilityOption_R = ({navigation, route}) => {
  const {formData} = route.params;
  console.log('myhome res', formData);

  const [toggleStates, setToggleStates] = useState({
    pets: 0,
    smoke: 0,
    otherItems: 0,
  });
  console.log('toggle statess', toggleStates);
  const [utilityOption, setUtilityOption] = useState('');

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

  const handleToggle = key => {
    setToggleStates(prev => ({
      ...prev,
      [key]: prev[key] === 0 ? 1 : 0, // Toggle between 0 and 1
    }));
  };

  const {top, bottom} = useSafeAreaInsets();
  return (
    <ImageBackground
      source={images.mapBackground}
      resizeMode="cover"
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS === 'ios' ? top : 0},
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
        <View
          style={[
            styles.bottomHeaderView,
            {backgroundColor: 'rgba(255,255,255,.6)'},
          ]}>
          <Text style={styles.headerText}>Utility Options</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{position: 'absolute', left: wp(4)}}
            activeOpacity={0.7}>
            <AntDesign name="left" size={20} color="#2D3D54" />
          </TouchableOpacity>
        </View>

        {/* <View style={{flex: 1}}> */}
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.utitityMainView}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: wp(1),
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.bold,
                  color: Colors.black,
                }}>
                Add any instructions that you want to bring them with you...
              </Text>
            </View>
            {/* <View style={styles.utilitysectionView}>
              <View style={{ width: wp(62) }}>
                <Text style={styles.utilityText}>
                  Do you have any pets that you want to bring in with your ride?
                </Text>
              </View>
              <Switch
                value={toggleStates.pets === 1}
                onValueChange={() => handleToggle('pets')}
                trackColor={{ false: Colors.lightgrey, true: Colors.buttoncolor }}
                thumbColor={toggleStates.pets === 1 ? Colors.buttoncolor : Colors.gray}
              />
            </View>
            <View style={styles.utilitysectionView}>
              <View style={{ width: wp(62) }}>
                <Text style={styles.utilityText}>Do you smoke?</Text>
              </View>
              <Switch
                value={toggleStates.smoke === 1}
                onValueChange={() => handleToggle('smoke')}
                trackColor={{ false: Colors.lightgrey, true: Colors.buttoncolor }}
                thumbColor={toggleStates.smoke === 1 ? Colors.buttoncolor : Colors.gray}
              />
            </View>
            <View style={styles.utilitysectionView}>
              <View style={{ width: wp(62) }}>
                <Text style={styles.utilityText}>
                  Do you have any other items that you want to bring in with your
                  ride?
                </Text>
              </View>
              <Switch
                value={toggleStates.otherItems === 1}
                onValueChange={() => handleToggle('otherItems')}
                trackColor={{ false: Colors.lightgrey, true: Colors.buttoncolor }}
                thumbColor={toggleStates.otherItems === 1 ? Colors.buttoncolor : Colors.gray}
              />
            </View> */}
            <View
              style={{
                width: wp(90),
                height: wp(45),
                borderRadius: wp(3),
                elevation: 2,
                backgroundColor: 'white',
                alignSelf: 'center',
                marginBottom: wp(3),
                marginTop: wp(3),
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}>
              <TextInput
                style={{
                  paddingHorizontal: wp(3),
                  color: Colors.black,
                  fontFamily: fonts.regular,
                  fontSize: 13,
                }}
                multiline
                placeholder="Write here..."
                placeholderTextColor={Colors.lightgrey}
                value={utilityOption}
                onChangeText={text => setUtilityOption(text)}
              />
            </View>
            <View style={{marginVertical: wp(5)}}>
              <MainButton
                title="Continue"
                onPress={() =>
                  navigation.navigate('OfferPrice_R', {formData, utilityOption})
                }
              />
            </View>
          </View>
        </ScrollView>
        {/* </View> */}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default UtilityOption_R;
