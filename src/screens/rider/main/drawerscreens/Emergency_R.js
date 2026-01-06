import { FlatList, Image, ImageBackground, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useRef } from 'react'
import { images, fonts, Colors, styles } from '../../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import MainButton from '../../../../components/MainButton'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
const Emergency_R = ({navigation}) => {
      const { top, bottom } = useSafeAreaInsets();
  return (
    <View style={[styles.mainContainer,
      { paddingTop: Platform.OS == 'ios' ? top : 0 }]}>
          <View
              style={styles.bottomHeaderView}>
              <Text style={styles.headerText}>Emergency</Text>
              <TouchableOpacity
                  onPress={() => navigation.openDrawer()}
                  style={{ position: 'absolute', left: wp(4) }}
                  activeOpacity={0.7} >
                  <Image source={images.menuIcon} resizeMode='contain' style={{ width: wp(6), height: wp(6) }} />
              </TouchableOpacity>
          </View>
          <ScrollView>
              <Image source={images.logopic} style={{ width: wp(40), height: wp(40), alignSelf: 'center', marginTop: wp(5) }} />
              <View style={{ marginHorizontal: wp(15), marginTop: wp(10) }}>
                  <Text
                      style={[
                          { fontSize: 16, lineHeight: 26, fontFamily: fonts.medium, color: Colors.black, textAlign: 'center' },
                      ]}>
                      Add 3 contacts that you want add
                      incase of an emergency during
                      your ride
                  </Text>
              </View>
              <View style={{ marginTop: wp(50),marginBottom:wp(5) }}>
                  <MainButton
                      title="Add Contacts"
                      onPress={()=>navigation.navigate('EmergencyContacts_R')}
                  />
              </View>
          </ScrollView>
      </View>
  )
}

export default Emergency_R