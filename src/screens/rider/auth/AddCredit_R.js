import { FlatList, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { images, fonts, Colors, styles } from '../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import MainButton from '../../../components/MainButton'
import Header from '../../../components/Header'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Toast from 'react-native-toast-message'
const AddCredit_R = ({navigation}) => {

    const [onchangeTab, setonChangeTab] = useState('1');

    const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
    const { top, bottom } = useSafeAreaInsets();
    return (
        <ImageBackground source={images.stripebackground} resizeMode='cover' style={[styles.mainContainer,
            { paddingTop: Platform.OS == 'ios' ? top : 0 }]}>
                <Header head="Add Credit/Debit Card" onPress={() => navigation.goBack()} />
                <Wrapper behavior="padding" style={{ flex: 1 }}>
                    <ScrollView>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: wp(3), marginHorizontal: wp(5) }}>
                            <TouchableOpacity onPress={() => setonChangeTab('1')}>
                                <ImageBackground source={images.viewfill} resizeMode='contain' tintColor={onchangeTab == '1' ? Colors.buttoncolor : '#C6DEFB'} style={{ justifyContent: 'center', alignItems: 'center', width: wp(45), height: wp(14) }}>
                                    <Text style={{ fontSize: 14, fontFamily: fonts.bold, color: onchangeTab == '1' ? Colors.white : Colors.buttoncolor }}>Bank Account</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Toast.show({
                                type: 'success',
                                text1: 'Comming Soon',
                                text2: '',
                                topOffset: Platform.OS === 'ios' ? 50 : 0,
                                visibilityTime: 3000,
                                autoHide: true,
                            })}>
                                <ImageBackground source={images.viewunfill} resizeMode='contain' tintColor={onchangeTab == '2' ? Colors.buttoncolor : '#C6DEFB'} style={{ justifyContent: 'center', alignItems: 'center', width: wp(45), height: wp(14) }}>
                                    <Text style={{ fontSize: 14, fontFamily: fonts.bold, color: onchangeTab == '2' ? Colors.white : Colors.buttoncolor }}>Stripe Account</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>
                        {onchangeTab == '1' ? (
                            <View>
                                <View style={[styles.inputView, { marginTop: wp(10) }]}>
                                    <Text style={styles.labelStyle}>Full Name</Text>
                                    <View style={styles.inputViewStyle}>
                                        <Image source={images.usernameIcon} resizeMode='contain' style={{ width: wp(5), height: wp(6) }} />
                                        <TextInput
                                            placeholder="Full Name"
                                            placeholderTextColor={Colors.lightgrey}
                                            keyboardType='default'
                                            style={styles.inputStyle}
                                            autoCapitalize="none"
                                        />
                                    </View>
                                </View>
                                <View style={[styles.inputView, { marginTop: wp(4) }]}>
                                    <Text style={styles.labelStyle}>Email Address</Text>
                                    <View style={styles.inputViewStyle}>
                                        <Image source={images.gmailIcon} resizeMode='contain' style={{ width: wp(5), height: wp(6) }} />
                                        <TextInput
                                            placeholder="e-mail"
                                            placeholderTextColor={Colors.lightgrey}
                                            keyboardType="email-address"
                                            style={styles.inputStyle}
                                            autoCapitalize="none"
                                        />
                                    </View>
                                </View>
                                <View style={[styles.inputView, { marginTop: wp(4) }]}>
                                    <View style={styles.inputRow}>
                                        <View style={{ width: wp(40) }}>
                                            <Text style={styles.labelStyle}>Exp. Date</Text>
                                            <TextInput
                                                style={styles.inputLong}
                                                placeholder="Exp. date"
                                                placeholderTextColor={Colors.lightgrey}
                                                maxLength={5}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                        <View style={{ width: wp(40) }}>
                                            <Text style={styles.labelStyle}>CCV</Text>
                                            <TextInput
                                                style={styles.inputLong}
                                                placeholderTextColor={Colors.lightgrey}
                                                placeholder="CCV"
                                                maxLength={4}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={{ marginTop: wp(15), marginBottom: wp(5), }}>
                                    <MainButton
                                        title="Add Card"
                                        onPress={() => navigation.navigate('Drawer_R')}
                                    />
                                </View>
                            </View>
                        ) : (
                            Toast.show({
                                type: 'success',
                                text1: 'Comming Soon',
                                text2: '',
                                topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
                            })
                        )
                        }
                        {/* <View>
        <Image source={images.bankcardImg} resizeMode='cover' style={{width:wp(70),height:wp(55),alignSelf:'center',flex:1,justifyContent:'flex-end',alignItems:'flex-end'}}/>
    </View> */}
                    </ScrollView>
                </Wrapper>
            </ImageBackground>
    )
}

export default AddCredit_R
