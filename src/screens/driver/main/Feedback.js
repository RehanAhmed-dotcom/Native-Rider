import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  Modal,
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
import Header from '../../../components/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Rating, AirbnbRating} from 'react-native-ratings';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';
import {PostAPiwithToken} from '../../../components/ApiRoot';
import Loader from '../../../components/Loader';

const Feedback = ({navigation, route}) => {
  const {item} = route.params;
  console.log('my ittttm', item);

  const user = useSelector(state => state.user.user);
  console.log('my user data', user);

  const [rating, setRating] = useState(4);
  const [review, setReview] = useState('');
  const [isloading, setIsLoading] = useState(false);

  const giveFeedBack = () => {
    const formdata = new FormData();
    const token = user.api_token;
    formdata.append('ride_id', item?.id);
    formdata.append('rating', rating);
    formdata.append('feedback_text', review);
    setIsLoading(true);
    PostAPiwithToken({url: 'feedback', Token: token}, formdata)
      .then(res => {
        setIsLoading(false);
        console.log('res of register ', res);
        if (res.status == 'success') {
          setIsLoading(false);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          }),
            navigation.navigate('Drawer', {screen: 'Bookings'});
        } else {
          setIsLoading(false);
          Toast.show({
            type: 'error',
            text1: 'error',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        }
      })

      .catch(err => {
        setIsLoading(false);
        console.log('api error', err);
      });
  };

  const {top, bottom} = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS == 'ios' ? top : 0},
      ]}>
      {isloading && <Loader />}

      <Header head="Feedback" onPress={() => navigation.goBack()} />
      <ScrollView>
        <View style={{marginHorizontal: wp(25), marginTop: wp(5)}}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.medium,
              color: Colors.black,
              textAlign: 'center',
              lineHeight: 22,
            }}>
            How was our service? Please feedback us
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'space-around',
            alignItems: 'center',
            flex: 1,
            marginTop: wp(15),
          }}>
          <Image
            source={images.feedbackImg}
            resizeMode="cover"
            style={{width: wp(70), height: wp(60), alignSelf: 'center'}}
          />
        </View>
        <View
          style={{
            width: wp(60),
            height: wp(0.4),
            backgroundColor: Colors.grey,
            alignSelf: 'center',
          }}></View>
        <View style={{alignItems: 'center', marginTop: wp(5)}}>
          <AirbnbRating
            starContainerStyle={{marginLeft: wp(2)}}
            count={5}
            reviews={['Bad', 'OK', 'Good', 'Very Good', 'Excelent']}
            defaultRating={4}
            size={20}
            showRating
            minValue={1}
            onFinishRating={value => setRating(value)}
          />
        </View>
        <Text
          style={[styles.labelStyle, {marginLeft: wp(7), marginTop: wp(4)}]}>
          Feedback
        </Text>
        <View
          style={{
            width: wp(85),
            height: wp(35),
            borderRadius: wp(3),
            elevation: 2,
            backgroundColor: 'white',
            alignSelf: 'center',
            marginBottom: wp(3),
            borderWidth: 1,
            borderColor: Colors.buttoncolor,
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
            placeholder="Write your feedback"
            placeholderTextColor={Colors.lightgrey}
            value={review}
            onChangeText={text => setReview(text)}
          />
        </View>
        <View style={{marginTop: wp(5), marginBottom: wp(4)}}>
          <MainButton
            title="Submit"
            onPress={() => {
              if (rating && review) {
                giveFeedBack();
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'All fields required',
                  text2: 'Please fill all fields',
                  topOffset: Platform.OS === 'ios' ? 50 : 0,
                  visibilityTime: 3000,
                  autoHide: true,
                });
              }
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Feedback;
