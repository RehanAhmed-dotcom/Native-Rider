import { FlatList, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View , RefreshControl, } from 'react-native'
import React, { useState,useEffect } from 'react'
import { images, fonts, Colors, styles } from '../../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Loader from '../../../../components/Loader'
import Toast from 'react-native-toast-message'
import { AllGetAPI } from '../../../../components/ApiRoot'
import { useSelector } from 'react-redux'
import moment from 'moment'

const Wallet = ({navigation}) => {
   const user = useSelector(state => state.user.user);
    
    const { top, bottom } = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [walletTransation, setWalletTranasition]=useState('')
    const transactionData = [
      {
        id: '1',
        title: 'Frontier hotel',
        amount: '57',
        date: "07/25/2025",
      },
      {
        id: '2',
        title: 'Central Park',
        amount: '57',
        date: "07/25/2025",
      },
      {
        id: '3',
        title: 'Frontier hotel',
        amount: '57',
        date: "07/25/2025",
  
      }, {
        id: '4',
        title: 'Central Park',
        amount: '57',
        date: "07/25/2025",
      },
      {
        id: '5',
        title: 'Frontier hotel',
        amount: '57',
        date: "07/25/2025",
  
      }, {
        id: '6',
        title: 'Central Park',
        amount: '57',
        date: "07/25/2025",
      },
    ]
  
      const fetchwalletTransition = () => {
        setIsLoading(true);
        AllGetAPI({url: 'show-payment-request', Token: user?.api_token})
          .then(res => {
            setIsLoading(false);
            setRefreshing(false);
            console.log('response stripe balcance data driver', JSON.stringify(res));
            if (res.status == 'success') {
              setWalletTranasition(res.payment_requests              )
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
          fetchwalletTransition();
        }, []);
      const onRefresh = () => {
        setRefreshing(true);
        fetchwalletTransition();
   
      };
  return (
       <View style={[styles.mainContainer,
       { paddingTop: Platform.OS == 'ios' ? top : 0 }]}>
               {isLoading && <Loader />}
         <View
                style={styles.HeaderView}>
                <Text style={styles.headerText}>Wallet</Text>
                <TouchableOpacity
                  onPress={() => navigation.openDrawer()}
                  style={{ position: 'absolute', left: wp(4) }}
                  activeOpacity={0.7} >
                  <Image source={images.menuIcon} resizeMode='contain' style={{ width: wp(6), height: wp(6) }} />
                </TouchableOpacity>
              </View>
            <ScrollView
                 refreshControl={
                   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                 }>
           {/* <View style={styles.walletTopView}>
             <View>
               <Text style={styles.paymentStyle}>$876</Text>
             <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: '#666666' }}>Current Balance</Text>
   
             </View>
             <View>
               <Text style={styles.paymentStyle}>$769</Text>
               <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: '#666666' }}>Pending Balance</Text>
   
             </View>
             <View>
               <Image source={images.walletPic} resizeMode='contain' style={{ width: wp(20), height: wp(20) }} />
             </View>
           </View> */}
           {/* <View style={styles.graphView}>
             <Image source={images.graphpic} resizeMode='contain' style={{ width: wp(82), height: wp(60) }} />
           </View> */}
   
           <View style={{ flex: 1, marginHorizontal: wp(4),marginBottom:wp(25),marginTop:wp(3) }}>
             <Text style={{ fontSize: 14, fontFamily: fonts.bold, color: Colors.black }}>Transactions</Text>
             <FlatList
               data={walletTransation}
               inverted
   
               renderItem={({ item }) => {
                 return (
                   <View style={styles.transactionView}>
                     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                       <Image source={images.transactionIcon} resizeMode='contain' style={{ width: wp(14), height: wp(14) }} />
                       <View>
                       <Text style={styles.notiHeading}>Transaction Id</Text>
                         <Text style={[styles.notiHeading,{fontFamily:fonts.medium}]}>{item.payment_Intent_id}</Text>
                         <Text style={[styles.chatdic, { marginLeft: wp(2) }]}> {moment(item.updated_at).subtract(1, 'days').calendar()}</Text>
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

export default Wallet




