import {
  FlatList,
  Image,
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
import SplashScreen from 'react-native-splash-screen';
import {useDispatch} from 'react-redux';
import {
  setOnboarding,
  setOnboardingFalse,
} from '../../../redux/OnboardingSlice';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {setUserType} from '../../../redux/Auth';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
const Onboarding1 = ({navigation}) => {
  const dispatch = useDispatch();
  const insects = useSafeAreaInsets();
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <View style={[styles.mainContainer, {marginTop: insects.top}]}>
      <TouchableOpacity
        onPress={() => dispatch(setUserType(null))}
        style={[styles.arrowStyle, {top: wp(4), right: wp(4)}]}>
        <AntDesign name="left" size={20} color={'#2D3D54'} />
      </TouchableOpacity>
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
          source={images.onboardpic1}
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
            {' '}
            Welcome to {'\n'}
            Native Rider Business{' '}
          </Text>
          <Text
            style={[
              styles.onboardTextH,
              {paddingHorizontal: wp(10), fontSize: 12, fontFamily: fonts.bold},
            ]}>
            Affordable & Convenient Rides at Your Fingertips{' '}
          </Text>

          <Text style={styles.onboardTextP}>
            Book or join rides with ease. Connect with drivers and travel safely
            wherever you need to go.
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.navigate('Onboarding2')}>
          <Image
            source={images.countpic1}
            resizeMode="contain"
            style={styles.countStyle}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Onboarding1;
