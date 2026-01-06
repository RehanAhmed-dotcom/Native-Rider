import { FlatList, Image, ImageBackground, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { images, fonts, Colors, styles } from '../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import MainButton from '../../../components/MainButton'
import Header from '../../../components/Header'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'

const PaymentComplete_R = ({navigation,route}) => {
    const [confirm, setConfrim] = useState(false)
    const {item}=route.params;
    console.log('itemdata',item)
    const closemodal = () => {
        setConfrim(false)
    }
    const { top, bottom } = useSafeAreaInsets();
    return (
        <ImageBackground source={images.paybackground} resizeMode='cover' style={[styles.mainContainer,
        { paddingTop: Platform.OS == 'ios' ? top : 0 }]}>
            <Header head="Successful" onPress={() => navigation.goBack()} />
            <ScrollView>
                <View style={{ alignSelf: 'center', marginTop: wp(15), marginHorizontal: wp(20) }}>
                    <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: Colors.black, textAlign: 'center' }}>Payment Successfully</Text>
                    <Text style={{ fontSize: 14, fontFamily: fonts.bold, color: Colors.buttoncolor, textAlign: 'center',marginTop:wp(5) }}>Ride Price</Text>
                    <Text style={[styles.paymentStyle, { fontSize: 18, textAlign: 'center' }]}>Rs {item?.fare}</Text>
                </View>
                <View style={{ marginTop: wp(25), marginBottom: wp(4) }}>
                    <MainButton
                        title="Back to home"
                        // onPress={() => setConfrim(true)}
                        onPress={()=>navigation.navigate('Drawer_R')}
                    />
                </View>
            </ScrollView>
            <Modal
                transparent={true}
                visible={confirm}
                onRequestClose={closemodal}
                animationType="none">
                <View
                    style={styles.modalTopView}>
                    <View
                        style={styles.modalsecondView}>
                        <TouchableOpacity onPress={() => closemodal()} style={{ position: 'absolute', top: wp(4), right: wp(4) }}>
                            <AntDesign name='close' size={20} color={Colors.black} />
                        </TouchableOpacity>
                        <View>
                            <Image source={images.paynowImg} resizeMode='contain' style={{ width: wp(35), height: wp(35), alignSelf: 'center' }} />
                        </View>
                        <View style={{ alignSelf: 'center', marginHorizontal: wp(10), marginTop: wp(2) }}>
                            <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: Colors.black, textAlign: 'center' }}>Payment Success</Text>

                            <Text
                                style={{
                                    fontSize: 14,
                                    fontFamily: fonts.medium,
                                    color: Colors.black,
                                    textAlign: 'center',
                                    lineHeight: 20,
                                    marginTop: wp(3)
                                }}>
                                Your money has been successfully sent to
                                the rider
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => { closemodal(), navigation.navigate('Feedback') }} style={{
                                width: wp(75),
                                height: wp(12),
                                borderRadius: wp(2),
                                backgroundColor: Colors.buttoncolor,
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                marginTop: wp(6)
                            }}>
                            <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: Colors.background, }}>Feedback The Rider</Text>
                        </TouchableOpacity>


                    </View>
                </View>
            </Modal>
        </ImageBackground>
    )
}

export default PaymentComplete_R