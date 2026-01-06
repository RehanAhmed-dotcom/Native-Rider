import { FlatList, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { images, fonts, Colors, styles } from '../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const WalletEarning = () => {
  const { top, bottom } = useSafeAreaInsets();

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
  return (
    <View style={[styles.mainContainer,
    { paddingTop: Platform.OS == 'ios' ? top : 0 }]}>
      <View
        style={styles.HeaderView}>
        <Text style={styles.headerText}>Wallet/Earnings</Text>
      </View>
      <ScrollView>
        <View style={styles.walletTopView}>
          <View>
            <Text style={styles.paymentStyle}>$87,430</Text>
            <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: '#666666' }}>Current Balance</Text>
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
            data={transactionData}
            inverted

            renderItem={({ item }) => {
              return (
                <View style={styles.transactionView}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={images.transactionIcon} resizeMode='contain' style={{ width: wp(14), height: wp(14) }} />
                    <View>
                      <Text style={styles.notiHeading}>{item.title}</Text>
                      <Text style={[styles.chatdic, { marginLeft: wp(2) }]}>{item.time}</Text>
                    </View>
                  </View>
                  <Text style={styles.paymentStyle}>${item.price}</Text>
                </View>
              )
            }}
          />
        </View>
      </ScrollView>
    </View>
  )
}

export default WalletEarning
