import {
  FlatList,
  Image,
  Modal,
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
import MainButton from '../../../components/MainButton';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {setOnboarding, setOnboardingR} from '../../../redux/OnboardingSlice';
import {useDispatch} from 'react-redux';

const GetStarted_R = ({navigation}) => {
  const dispatch = useDispatch();

  const [confirm, setConfrim] = useState(false);
  const closemodal = () => {
    setConfrim(false);
  };
  return (
    <View style={styles.mainContainer}>
      <View
        style={{
          justifyContent: 'space-around',
          alignItems: 'center',
          flex: 1,
          marginVertical: wp(15),
        }}>
        <Image
          source={images.startedpic}
          resizeMode="cover"
          style={styles.onboardingImgView}
        />
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: wp(10),
          }}>
          <Text style={styles.onboardTextH}>Join a growing community</Text>
          <Text style={styles.onboardTextP}>
            where your ride experience can turn into meaningful connections.
          </Text>
        </View>
        <View style={{marginVertical: wp(10)}}>
          <MainButton
            title="Get Started"
            onPress={() => dispatch(setOnboardingR())}
          />
        </View>
      </View>
      <Modal
        transparent={true}
        visible={confirm}
        // onRequestClose={closemodal}
        animationType="none">
        <View style={styles.modalTopView}>
          <View style={styles.modalsecondView}>
            {/* <TouchableOpacity onPress={() => closemodal()} style={{ position: 'absolute', top: wp(4), right: wp(4) }}>
                            <AntDesign name='close' size={20} color={Colors.black} />
                        </TouchableOpacity> */}
            <View>
              <Image
                source={images.LocationIcon}
                resizeMode="contain"
                style={{width: wp(25), height: wp(25), alignSelf: 'center'}}
              />
            </View>
            <View style={{alignSelf: 'center', marginHorizontal: wp(10)}}>
              <Text style={styles.modalText}>Enable your location</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: fonts.medium,
                  color: Colors.lightgrey,
                  textAlign: 'center',
                  lineHeight: 20,
                }}>
                Choose your location to start find the request around you
              </Text>
            </View>
            <TouchableOpacity
              style={{
                width: wp(75),
                height: wp(12),
                borderRadius: wp(2),
                backgroundColor: Colors.buttoncolor,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: wp(5),
              }}
              onPress={() => {
                closemodal();
                setTimeout(() => {
                  navigation.navigate('Welcome_R');
                }, 200);
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.bold,
                  color: Colors.background,
                }}>
                {/* Use my location */}
                Continue
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => {
                closemodal(), navigation.navigate('Welcome_R');
              }}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: wp(5),
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.medium,
                  color: Colors.lightgrey,
                }}>
                Skip for now
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GetStarted_R;
