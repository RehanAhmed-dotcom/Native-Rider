import { FlatList, Image, ImageBackground, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { images, fonts, Colors, styles } from '../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import MainButton from '../../../components/MainButton'
import Header from '../../../components/Header'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { PostAPiwithToken } from '../../../components/ApiRoot'
import Toast from 'react-native-toast-message'
import { useSelector } from 'react-redux'
import Loader from '../../../components/Loader'
const ResPayment_R = ({navigation, route }) => {
  const user = useSelector(state => state.user.user)
    const { item } = route.params;
    console.log('item fd f  data', item)
    const [isloading, setIsLoading] = useState(false);

    const [confirm, setConfrim] = useState(false)
    const closemodal = () => {
        setConfrim(false)
    }

    const CompleteRideApi = () => {
        const formdata = new FormData();
        const token = user.api_token
        formdata.append('reservation_id', item.id);
        setIsLoading(true)
        PostAPiwithToken({ url: 'compelete-reservation', Token: token }, formdata)
            .then(res => {
                setIsLoading(false)
                console.log('res of register ', JSON.stringify(res));
                if (res.status == 'success') {
                    setIsLoading(false)
                    Toast.show({
                        type: 'success',
                        text1: 'Ride Completed successfully!',
                        text2: res.message,
                        topOffset: Platform.OS === 'ios' ? 50 : 0,
                        visibilityTime: 3000,
                        autoHide: true,
                    })
                    navigation.navigate('ResPaymentComplete_R', { item })
                } else {
                    setIsLoading(false)
                    Toast.show({

                        type: 'error',
                        text1: res.message,
                        topOffset: Platform.OS === 'ios' ? 50 : 0,
                        visibilityTime: 3000,
                        autoHide: true,
                    })
                }
            })
            .catch(err => {
                setIsLoading(false)
                console.log('api error', err);
            });
    };
    const { top, bottom } = useSafeAreaInsets();
  return (
    <ImageBackground source={images.paymentbg} resizeMode='cover' style={[styles.mainContainer,
        { paddingTop: Platform.OS == 'ios' ? top : 0 }]}>
            {isloading && <Loader />}

            <Header head="Payment" onPress={() => navigation.goBack()} />
            <ScrollView>
                <View style={{ alignSelf: 'center', marginTop: wp(15), marginHorizontal: wp(20) }}>
                    <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: Colors.black, textAlign: 'center', lineHeight: 22 }}>Request traveller for the
                        payment</Text>
                    <Text style={{ fontSize: 14, fontFamily: fonts.bold, color: Colors.buttoncolor, textAlign: 'center', marginTop: wp(5) }}>Ride Price</Text>
                    <Text style={[styles.paymentStyle, { fontSize: 18, textAlign: 'center' }]}>${item?.final_price}</Text>
                </View>
                <View style={{ marginTop: wp(25), marginBottom: wp(4) }}>
                    <MainButton
                        title="Send Request"
                        // onPress={() => setConfrim(true)}
                        onPress={() => CompleteRideApi()}
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

export default ResPayment_R