import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { images, fonts, Colors, styles } from '../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

const LightButton = ({onPress1,title1}) => {
  return (
    <TouchableOpacity style={styles.btn2View} onPress={onPress1} activeOpacity={0.4}>
    <Text style={styles.title2Text}>{title1}</Text>
</TouchableOpacity>
  )
}

export default LightButton
