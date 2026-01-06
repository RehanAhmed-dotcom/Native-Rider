import { ImageBackground, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState,useEffect } from 'react'
import { images, fonts, Colors, styles } from '../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
const Splash = ({navigation}) => {
    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('Selection');
        }, 3000);
    }, []);
    return (
        <ImageBackground source={images.splash} style={{ flex: 1 }}>

        </ImageBackground>
    )
}
export default Splash