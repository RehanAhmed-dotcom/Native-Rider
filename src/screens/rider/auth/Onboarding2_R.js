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

const Onboarding2_R = ({navigation}) => {
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
          source={images.onboardpicnew2}
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
          <Text style={[styles.onboardTextH, {paddingHorizontal: wp(10)}]}>
            Flexible Rides for Entrepreneurs{' '}
          </Text>
          <Text
            style={[
              styles.onboardTextH,
              {paddingHorizontal: wp(10), fontSize: 12, fontFamily: fonts.bold},
            ]}>
            Drive Your Business Forward
          </Text>
          <Text style={styles.onboardTextP}>
            Offer rides at your own price, optimize routes, and get secured
            payouts. Native Riders let entrepreneurs turn vehicle seats into
            income while connecting with riders.
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.navigate('Onboarding3_R')}>
          <Image
            source={images.countpic2}
            resizeMode="contain"
            style={styles.countStyle}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Onboarding2_R;
