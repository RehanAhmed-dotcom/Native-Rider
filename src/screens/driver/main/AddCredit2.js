import { FlatList, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { images, fonts, Colors, styles } from '../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import MainButton from '../../../components/MainButton'
import Header from '../../../components/Header'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'


const AddCredit2 = ({navigation}) => {

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
                        <TouchableOpacity onPress={() => setonChangeTab('2')}>
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
                                        placeholder="Nadeem"
                                        placeholderTextColor={Colors.black}
                                        keyboardType='default'
                                        style={styles.inputStyle}
                                        autoCapitalize="none"
                                        editable={false}
                                    />
                                </View>
                            </View>
                            <View style={[styles.inputView, { marginTop: wp(4) }]}>
                                <Text style={styles.labelStyle}>Email Address</Text>
                                <View style={styles.inputViewStyle}>
                                    <Image source={images.gmailIcon} resizeMode='contain' style={{ width: wp(5), height: wp(6) }} />
                                    <TextInput
                                        placeholder="nadeem@gmail.com"
                                        placeholderTextColor={Colors.black}
                                        keyboardType="email-address"
                                        style={styles.inputStyle}
                                        autoCapitalize="none"
                                        editable={false}

                                    />
                                </View>
                            </View>
                            <View style={[styles.inputView, { marginTop: wp(4) }]}>
                                <View style={styles.inputRow}>
                                    <View style={{ width: wp(40) }}>
                                        <Text style={styles.label}>Exp. Date</Text>
                                        <TextInput
                                            style={styles.inputLong}
                                            placeholder="12/06/2027"
                                            placeholderTextColor={Colors.black}
                                            maxLength={9}
                                            keyboardType="numeric"
                                            editable={false}

                                        />
                                    </View>
                                    <View style={{ width: wp(40) }}>
                                        <Text style={styles.label}>CCV</Text>
                                        <TextInput
                                            style={styles.inputLong}
                                            placeholderTextColor={Colors.black}
                                            placeholder="3343"
                                            maxLength={4}
                                            keyboardType="numeric"
                                            editable={false}

                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={{ marginTop: wp(15) }}>
                                <MainButton
                                    title="Pay"
                                />
                            </View>
                        </View>
                    ) : (
                        <View>
                            <View style={[styles.inputView, { marginTop: wp(10) }]}>
                                <Text style={styles.labelStyle}>Full Name</Text>
                                <View style={styles.inputViewStyle}>
                                    <Image source={images.usernameIcon} resizeMode='contain' style={{ width: wp(5), height: wp(6) }} />
                                    <TextInput
                                        placeholder="Nadeem"
                                        placeholderTextColor={Colors.black}
                                        keyboardType='default'
                                        style={styles.inputStyle}
                                        autoCapitalize="none"
                                        editable={false}
                                    />
                                </View>
                            </View>
                            <View style={[styles.inputView, { marginTop: wp(4) }]}>
                                <Text style={styles.labelStyle}>Email Address</Text>
                                <View style={styles.inputViewStyle}>
                                    <Image source={images.gmailIcon} resizeMode='contain' style={{ width: wp(5), height: wp(6) }} />
                                    <TextInput
                                        placeholder="nadeem@gmail.com"
                                        placeholderTextColor={Colors.black}
                                        keyboardType="email-address"
                                        style={styles.inputStyle}
                                        autoCapitalize="none"
                                        editable={false}

                                    />
                                </View>
                            </View>
                            <View style={[styles.inputView, { marginTop: wp(4) }]}>
                                <View style={styles.inputRow}>
                                    <View style={{ width: wp(40) }}>
                                        <Text style={styles.label}>Exp. Date</Text>
                                        <TextInput
                                            style={styles.inputLong}
                                            placeholder="12/06/2027"
                                            placeholderTextColor={Colors.black}
                                            maxLength={9}
                                            keyboardType="numeric"
                                            editable={false}

                                        />
                                    </View>
                                    <View style={{ width: wp(40) }}>
                                        <Text style={styles.label}>CCV</Text>
                                        <TextInput
                                            style={styles.inputLong}
                                            placeholderTextColor={Colors.black}
                                            placeholder="3343"
                                            maxLength={4}
                                            keyboardType="numeric"
                                            editable={false}

                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={{ marginTop: wp(15) }}>
                                <MainButton
                                    title="Pay"
                                />
                            </View>
                        </View>
                    )

                    }

                </ScrollView>
            </Wrapper>
        </ImageBackground>
    )
}

export default AddCredit2
