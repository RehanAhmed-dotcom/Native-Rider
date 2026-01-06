import { FlatList, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View , RefreshControl, } from 'react-native'
import React, { useState,useEffect } from 'react'
import { images, fonts, Colors, styles } from '../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Loader from '../../../components/Loader'
import Toast from 'react-native-toast-message'
import { AllGetAPI } from '../../../components/ApiRoot'
import { useSelector } from 'react-redux'
import moment from 'moment'

const WalletEarning_R = () => {

    const user = useSelector(state => state.user.user);
  
  const { top, bottom } = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [walletBalance, setWalletBalance]=useState('')
  const transactionData = [
    {
      id: '1',
      title: 'Frontier hotel',
      price: '57',
      time: 'Today at 09:20 am',
    },
    {
      id: '2',
      title: 'Central Park',
      price: '57',
      time: 'Today at 09:20 am',
    },
    {
      id: '3',
      title: 'Frontier hotel',
      price: '57',
      time: 'Yesterday at 09:20 am',

    }, {
      id: '4',
      title: 'Central Park',
      price: '57',
      time: 'Monday at 09:20 am',
    },
    {
      id: '5',
      title: 'Frontier hotel',
      price: '57',
      time: 'Yesterday at 09:20 am',

    }, {
      id: '6',
      title: 'Central Park',
      price: '57',
      time: 'Monday at 09:20 am',
    },
  ]

    const fetchwalletEarning = () => {
      setIsLoading(true);
      AllGetAPI({url: 'stripe-balance', Token: user?.api_token})
        .then(res => {
          setIsLoading(false);
          setRefreshing(false);
          console.log('response stripe balcance data driver', JSON.stringify(res));
          if (res.status == 'success') {
            setWalletBalance(res)
            setRefreshing(false);
            setIsLoading(false);
        
          } else {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: res.message,
            });
            setRefreshing(false);
            setIsLoading(false);
          }
        })
        .catch(err => {
          setRefreshing(false);
          setIsLoading(false);
          console.log('api error', err);
        });
    };
      useEffect(() => {
        fetchwalletEarning();
      }, []);
    const onRefresh = () => {
      setRefreshing(true);
      fetchwalletEarning();
 
    };
  return (
    <View style={[styles.mainContainer,
    { paddingTop: Platform.OS == 'ios' ? top : 0 }]}>
            {isLoading && <Loader />}
      <View
        style={styles.HeaderView}>
        <Text style={styles.headerText}>Wallet/Earnings</Text>
      </View>
         <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }>
        <View style={styles.walletTopView}>
          <View>
            <Text style={styles.paymentStyle}>${walletBalance.available_balance}</Text>
          <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: '#666666' }}>Current Balance</Text>

          </View>
          <View>
            <Text style={styles.paymentStyle}>${walletBalance.pending_balance}</Text>
            <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: '#666666' }}>Pending Balance</Text>

          </View>
          <View>
            <Image source={images.walletPic} resizeMode='contain' style={{ width: wp(20), height: wp(20) }} />
          </View>
        </View>
        {/* <View style={styles.graphView}>
          <Image source={images.graphpic} resizeMode='contain' style={{ width: wp(82), height: wp(60) }} />
        </View> */}

        <View style={{ flex: 1, marginHorizontal: wp(4),marginBottom:wp(25),marginTop:wp(3) }}>
          <Text style={{ fontSize: 14, fontFamily: fonts.bold, color: Colors.black }}>Transactions</Text>
          <FlatList
            data={walletBalance?.transaction_list}
            inverted

            renderItem={({ item }) => {
              return (
                <View style={styles.transactionView}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={images.transactionIcon} resizeMode='contain' style={{ width: wp(14), height: wp(14) }} />
                    <View>
                    <Text style={styles.notiHeading}>Transaction Id</Text>
                      <Text style={[styles.notiHeading,{fontFamily:fonts.medium}]}>{item.id}</Text>
                      <Text style={[styles.chatdic, { marginLeft: wp(2) }]}> {moment(item.date).subtract(1, 'days').calendar()}</Text>
                    </View>
                  </View>
                  <Text style={styles.paymentStyle}>${item.amount}</Text>
                </View>
              )
            }}
          />
        </View>
      </ScrollView>
    </View>
  )
}

export default WalletEarning_R
