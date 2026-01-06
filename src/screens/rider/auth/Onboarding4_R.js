import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {images, fonts, Colors, styles} from '../../../constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useDispatch} from 'react-redux';
import {setOnboarding, setOnboardingR} from '../../../redux/OnboardingSlice';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Onboarding4_R = ({navigation}) => {
  const dispatch = useDispatch();
  const {top} = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS === 'ios' ? top : 0},
      ]}>
      <TouchableOpacity
        onPress={() => dispatch(setOnboardingR())}
        style={{
          position: 'absolute',
          top: Platform.OS == 'ios' ? wp(8) : wp(4),
          right: wp(4),
        }}>
        <Text style={{fontSize: 12, color: 'black', fontFamily: fonts.medium}}>
          Skip
        </Text>
      </TouchableOpacity>
      <View
        style={{
          justifyContent: 'space-around',
          alignItems: 'center',
          flex: 1,
          marginVertical: wp(15),
        }}>
        <Image
          source={images.customerpic}
          resizeMode="contain"
          style={styles.onboardingImgView}
        />
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: wp(10),
          }}>
          <Text style={styles.onboardTextH}>
            Monitor and Support {'\n'}
            Anytime
          </Text>
          <Text
            style={[
              styles.onboardTextH,
              {paddingHorizontal: wp(5), fontSize: 12, fontFamily: fonts.bold},
            ]}>
            Stay In Control with 24/7 Support
          </Text>
          <Text style={styles.onboardTextP}>
            Track Rides in real time and get help whenever you need. Native
            Rider ensures smooth and secure journeys for your business or event.
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.navigate('GetStarted_R')}>
          <Image
            source={images.countpic3}
            resizeMode="contain"
            style={styles.countStyle}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Onboarding4_R;
