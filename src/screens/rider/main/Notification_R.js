import { FlatList, Image, KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { images, fonts, Colors, styles } from '../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Entypo from 'react-native-vector-icons/Entypo'
import { AllGetAPI, PostAPiwithToken } from '../../../components/ApiRoot'
import { useIsFocused } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import moment from 'moment'
import Toast from 'react-native-toast-message'
import Loader from '../../../components/Loader'

const Notification_R = () => {
  const user = useSelector(state => state.user.user)
  const isFocused = useIsFocused();
  const [notifyData, setNotifyData] = useState([])
  const [isloading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // const notificationData = [
  //   {
  //     id: '1',
  //     title: 'Reached to destination',
  //     discription: 'You have successfuly reached your intended destination',
  //     status: 'Reached'
  //   },
  //   {
  //     id: '2',
  //     title: 'Booking Accepted',
  //     discription: 'The requested ride has been accepted',
  //     status: 'Accepted'

  //   },
  //   {
  //     id: '3',
  //     title: 'Booking Cancelled',
  //     discription: 'This driver is unable to accept your request at this time. Please try again to book another ride.',
  //     status: 'Cancelled'

  //   }, {
  //     id: '4',
  //     title: 'Amount Transferred',
  //     discription: 'Thank you for your payment—it’s truly appreciated and helps us continue delivering the best service and products to you!',
  //     status: 'paymentdone'

  //   }
  // ]


  const fetchNotificationData = () => {
    setIsLoading(true)
    AllGetAPI({ url: 'viewAllNotification', Token: user?.api_token })
      .then(res => {
        setRefreshing(false);
        setIsLoading(false)
        setNotifyData(res.data)
        console.log('response notify runner', res);
      })
      .catch(err => {
        setRefreshing(false);
        setIsLoading(false)
        console.log('api error', err);
      });
  };
  useEffect(() => {
    if (isFocused) {
      fetchNotificationData();
    }
  }, [isFocused]);

  const NotificationDelete = notificationId => {
    const formdata = new FormData();
    formdata.append('id', notificationId);
    const headers = {
      Authorization: `Bearer ${user?.api_token}`,
    };
    setIsLoading(true)
    PostAPiwithToken(
      { url: 'deleteNotification', Token: user.api_token },
      formdata,
    )
      .then(res => {
        setIsLoading(false)

        if (res.status === 'success') {
          console.log('response', res);
          // Service deleted successfully
          setIsLoading(false)

          // ToastAndroid.show(res.message, ToastAndroid.SHORT);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Your notification has been deleted',
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          fetchNotificationData();
        } else {
          setIsLoading(false)

          // Handle error
          console.log('Error deleting notification:', res.message);
        }
      })
      .catch(err => {
        setIsLoading(false)

        console.log('API error', err);
      });
  };
  const onRefresh = () => {
    setRefreshing(true);
    fetchNotificationData();
  };
  const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  const { top, bottom } = useSafeAreaInsets();
  return (
    <View style={[styles.mainContainer,
    { paddingTop: Platform.OS == 'ios' ? top : 0 }]}>
      {isloading && <Loader />}

      <View
        style={styles.HeaderView}>
        <Text style={styles.headerText}>Notification</Text>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ marginTop: wp(4),marginBottom:wp(17) }}>
          <FlatList
            data={notifyData}
            inverted
            renderItem={({ item }) => {
              return (
                <View style={styles.noficationView}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image source={images.infoIcon} resizeMode='contain' style={{ width: wp(6), height: wp(6) }} tintColor={item.type == 'ride_completed' ? '#4686D4' : item.type == 'ride_created' ? '#22BB55' : item.type == 'ride_cancel' ? 'red' : '#4686D4'} />
                      <Text style={styles.notiHeading}>{item.title}</Text>
                    </View>

                  </View>
                  <TouchableOpacity
                    onPress={() => NotificationDelete(item.id)}
                    style={{ position: 'absolute', top: wp(1), right: wp(1) }}>
                    <Entypo name="cross" size={20} color={'#666666'} />
                  </TouchableOpacity>
                  <View style={{ marginHorizontal: wp(9), width: wp(60) }}>
                    <Text numberOfLines={3} style={[styles.notiTExt, { lineHeight: 19 }]} >{item.message}</Text>
                  </View>
                  <TouchableOpacity
                    style={{ position: 'absolute', bottom: wp(3), right: wp(3) }}>
                    <Text style={[styles.chatdic, { fontSize: 10, textAlign: 'right', maxWidth: wp(20) }]} >
                      {moment(item?.time).format('hh:mm: A')}

                    </Text>

                  </TouchableOpacity>

                </View>
              )
            }}
          />
        </View>
      </ScrollView>
      <Text>Notification</Text>
    </View>
  )
}

export default Notification_R
