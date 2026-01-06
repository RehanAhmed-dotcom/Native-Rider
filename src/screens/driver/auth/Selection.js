import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {images, fonts, Colors, styles} from '../../../constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../components/MainButton';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';
import {useDispatch} from 'react-redux';
import {setUserType} from '../../../redux/Auth';
import SplashScreen from 'react-native-splash-screen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
const Selection = ({navigation}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  const {top} = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS === 'ios' ? top : 0},
      ]}>
      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          flex: 1,
          paddingVertical: wp(10),
        }}>
        <Image
          source={images.logopic}
          style={{width: wp(50), height: wp(50)}}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          style={{justifyContent: 'center', alignItems: 'center'}}
          onPress={() => setSelectedOption('Driver')}>
          <View
            style={[
              styles.selectionView,
              {
                borderWidth: selectedOption == 'Driver' ? 1 : 0,
                borderColor:
                  selectedOption == 'Rider'
                    ? Colors.buttoncolor
                    : Colors.background,
              },
            ]}>
            {selectedOption === 'Driver' ? (
              <View style={styles.checkboxstyle}>
                <FontAwesome5
                  name="check"
                  color={Colors.background}
                  size={18}
                />
              </View>
            ) : null}
            <Image
              source={images.riderpic}
              resizeMode="contain"
              style={styles.imgStyle}
            />
          </View>
          <Text style={styles.selectionText}>Driver</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setSelectedOption('Rider')}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: wp(3),
          }}>
          <View
            style={[
              styles.selectionView,
              {
                borderWidth: selectedOption == 'Rider' ? 1 : 0,
                borderColor:
                  selectedOption == 'Driver'
                    ? Colors.buttoncolor
                    : Colors.background,
              },
            ]}>
            {selectedOption === 'Rider' ? (
              <View style={styles.checkboxstyle}>
                <FontAwesome5
                  name="check"
                  color={Colors.background}
                  size={18}
                />
              </View>
            ) : null}
            <Image
              source={images.driverpic}
              resizeMode="contain"
              style={styles.imgStyle}
            />
          </View>
          <Text style={styles.selectionText}>Rider</Text>
        </TouchableOpacity>
      </View>
      <View style={{marginVertical: wp(10)}}>
        <MainButton
          title="Continue"
          onPress={() => {
            selectedOption
              ? // selectedOption == 'Driver' ? navigation.navigate('Onboarding1') : navigation.navigate('Onboarding1_R'),
                dispatch(setUserType(selectedOption))
              : Toast.show({
                  type: 'error',
                  text1: 'No Selection',
                  text2: 'Please select your type first',
                  topOffset: Platform.OS === 'ios' ? 50 : 0,
                  visibilityTime: 3000,
                  autoHide: true,
                });
          }}
        />
      </View>
    </View>
  );
};
export default Selection;
