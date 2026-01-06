import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
import { images, fonts, Colors, styles } from '../constant/Index'
import AntDesign from 'react-native-vector-icons/AntDesign'
const Header = ({head,onPress}) => {
  return (
    <View style={styles.HeaderView}>
    <TouchableOpacity onPress={onPress} style={styles.arrowStyle}>
        <AntDesign name='left' size={20} color={'#2D3D54'} />
    </TouchableOpacity>
    <Text style={styles.headerText}>{head}</Text>
    {/* <Text style={{ width: wp(25), textAlign: 'center' }}></Text> */}
</View>
  )
}

export default Header
