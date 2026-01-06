import { FlatList, Image, ImageBackground, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useRef } from 'react'
import { images, fonts, Colors, styles } from '../../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import MainButton from '../../../../components/MainButton'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Toast from 'react-native-toast-message'
const Search_R = ({navigation}) => {
  const { top, bottom } = useSafeAreaInsets();
  return (
    <View style={[styles.mainContainer,
    { paddingTop: Platform.OS == 'ios' ? top : 0 }]}>
      <View
        style={styles.bottomHeaderView}>
        <Text style={styles.headerText}>Search</Text>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{ position: 'absolute', left: wp(4) }}
          activeOpacity={0.7} >
          <Image source={images.menuIcon} resizeMode='contain' style={{ width: wp(6), height: wp(6) }} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={[styles.inputView, { marginTop: wp(4) }]}>
          <View style={styles.searchViewStyle}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome name='map-marker' size={20} color={Colors.lightgrey} />
              <TextInput
                placeholder="Search"
                placeholderTextColor={Colors.lightgrey}
                keyboardType='default'
                style={styles.inputStyle}
                autoCapitalize="none"
                  onFocus={() => Toast.show({
                                  type: 'success',
                                  text1: 'Coming soon',
                                })}
              />
            </View>
            <AntDesign name='close' size={20} color={Colors.lightgrey} />

          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default Search_R