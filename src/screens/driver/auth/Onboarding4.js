import {
  FlatList,
  Image,
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
import {setOnboarding} from '../../../redux/OnboardingSlice';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Onboarding4 = ({navigation}) => {
  const dispatch = useDispatch();
  const insects = useSafeAreaInsets();

  return (
    <View style={[styles.mainContainer, {marginTop: insects.top}]}>
      <TouchableOpacity
        onPress={() => dispatch(setOnboarding())}
        style={{position: 'absolute', top: wp(4), right: wp(4)}}>
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
          source={images.onboardingD4}
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
            Safety First, Always{' '}
          </Text>
          <Text
            style={[
              styles.onboardTextH,
              {paddingHorizontal: wp(10), fontSize: 12, fontFamily: fonts.bold},
            ]}>
            Ride with Confidence{' '}
          </Text>

          <Text style={styles.onboardTextP}>
            Add emergency contacts, track your ride live, and reach out to
            support anytime. Your safety is our priority.
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.navigate('GetStarted')}>
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

export default Onboarding4;
