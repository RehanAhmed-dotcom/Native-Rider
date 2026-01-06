import {
  FlatList,
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
import {useDispatch} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {setOnboarding, setOnboardingR} from '../../../redux/OnboardingSlice';
import {setUserType} from '../../../redux/Auth';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Onboarding1_R = ({navigation}) => {
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
      <TouchableOpacity
        onPress={() => dispatch(setUserType(null))}
        style={[
          styles.arrowStyle,
          {top: Platform.OS == 'ios' ? wp(8) : wp(4), right: wp(4)},
        ]}>
        <AntDesign name="left" size={20} color={'#2D3D54'} />
      </TouchableOpacity>
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
          <Text style={styles.onboardTextH}>
            {' '}
            Welcome to {'\n'}
            Native Rider Business{' '}
          </Text>
          <Text style={styles.onboardTextP}>
            Create access codes and manage group rides effortlessly.
            Streamlining employee or client travel with real time trip tracking
            and seamless booking.
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.navigate('Onboarding2_R')}>
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

export default Onboarding1_R;
