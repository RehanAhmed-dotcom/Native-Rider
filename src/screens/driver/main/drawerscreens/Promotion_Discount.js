import {
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {images, fonts, Colors, styles} from '../../../../constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainButton from '../../../../components/MainButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import Clipboard from '@react-native-clipboard/clipboard';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import Loader from '../../../../components/Loader';
import {AllGetAPI} from '../../../../components/ApiRoot';
import moment from 'moment';

const Promotion_Discount = ({navigation}) => {
  const user = useSelector(state => state.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [promotions, setPromotions] = useState([]);

  const fetchpromotions = () => {
    setIsLoading(true);
    AllGetAPI({url: 'promotions', Token: user?.api_token})
      .then(res => {
        setIsLoading(false);
        setRefreshing(false);
        console.log(
          'response dataaaaaaaaa total promotions',
          JSON.stringify(res),
        );
        if (res.status === 'success') {
          setIsLoading(false);
          setRefreshing(false);
          setPromotions(res.data);
        } else {
          setIsLoading(false);
          setRefreshing(false);

          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message,
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        setRefreshing(false);
        console.log('api error', err);
      });
  };

  useEffect(() => {
    fetchpromotions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchpromotions();
  };

  const copyToClipboard = promoCode => {
    Clipboard.setString(promoCode);
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Promo code copied to clipboard!',
      topOffset: Platform.OS === 'ios' ? 50 : 0,
      visibilityTime: 2000,
      autoHide: true,
    });
  };
  const {top, bottom} = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS == 'ios' ? top : 0},
      ]}>
      {isLoading && <Loader />}
      <View style={styles.HeaderView}>
        <Text style={styles.headerText}>Discount & Promotions</Text>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{position: 'absolute', left: wp(4)}}
          activeOpacity={0.7}>
          <Image
            source={images.menuIcon}
            resizeMode="contain"
            style={{width: wp(6), height: wp(6)}}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{alignSelf: 'center', marginTop: wp(3)}}>
          {promotions?.length === 0 ? (
            <View style={{marginTop: wp(60)}}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: fonts.bold,
                  color: Colors.black,
                  textAlign: 'center',
                  marginTop: wp(4),
                  marginHorizontal: wp(14),
                  lineHeight: 25,
                }}>
                No Promotions Found!
              </Text>
            </View>
          ) : (
            <FlatList
              data={promotions}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              renderItem={({item}) => {
                return (
                  <>
                    {item?.image_only_mode === '0' ? (
                      <View
                        style={[styles.DriverView, {paddingVertical: wp(4)}]}>
                        <View
                          style={{
                            marginBottom: wp(2),
                            width: wp(60),
                            alignSelf: 'center',
                          }}>
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: fonts.bold,
                              color: Colors.buttoncolor,
                              textAlign: 'center',
                            }}
                            numberOfLines={2}>
                            {item.title}
                          </Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <Image
                            source={
                              item.image
                                ? {uri: item.image}
                                : require('../../../../assets/imagenull.png')
                            }
                            style={{width: wp(30), height: wp(30)}}
                            resizeMode="contain"
                          />
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              width: wp(50),
                              marginLeft: wp(3),
                            }}>
                            <View style={{justifyContent: 'space-around'}}>
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: Colors.black,
                                  fontFamily: fonts.medium,
                                }}>
                                Promo Code:
                              </Text>
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: Colors.black,
                                  fontFamily: fonts.medium,
                                }}>
                                Get Discount:
                              </Text>
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: Colors.black,
                                  fontFamily: fonts.medium,
                                }}>
                                Expiry Date:
                              </Text>
                            </View>
                            <View style={{justifyContent: 'space-around'}}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <Text
                                  style={{
                                    fontSize: 14,
                                    color: Colors.buttoncolor,
                                    fontFamily: fonts.bold,
                                  }}>
                                  {item?.promo_code}
                                </Text>
                                <TouchableOpacity
                                  onPress={() =>
                                    copyToClipboard(item?.promo_code)
                                  }
                                  style={{marginLeft: wp(2)}}>
                                  <Feather
                                    name="copy"
                                    size={wp(4.5)}
                                    color={Colors.buttoncolor}
                                  />
                                </TouchableOpacity>
                              </View>
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: Colors.buttoncolor,
                                  fontFamily: fonts.bold,
                                }}>
                                {item?.discount_percentage}%
                              </Text>
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: Colors.buttoncolor,
                                  fontFamily: fonts.bold,
                                }}>
                                {moment(item?.expiry_date).format('MMM Do YY')}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    ) : (
                      <View
                        style={{
                          width: wp(90),
                          borderRadius: wp(2),
                          backgroundColor: Colors.white,
                          elevation: 2,
                          alignSelf: 'center',
                          marginTop: wp(1),
                          shadowOffset: {height: 2, width: 2},
                          shadowOpacity: 0.2,
                          marginBottom: wp(4),
                          shadowColor: '#4686D4',
                        }}>
                        <Image
                          source={
                            item.image
                              ? {uri: item.image}
                              : require('../../../../assets/imagenull.png')
                          }
                          style={{width: wp(90), height: wp(45)}}
                          resizeMode="cover"
                          borderRadius={wp(2)}
                        />
                      </View>
                    )}
                  </>
                );
              }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Promotion_Discount;
