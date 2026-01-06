import { FlatList, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useRef } from 'react'
import { images, fonts, Colors, styles } from '../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import MainButton from '../../../components/MainButton'
import Header from '../../../components/Header'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import PhoneInput from 'react-native-phone-number-input';
import { Formik } from 'formik';
import * as yup from 'yup';
const AccountVerification_R = ({ navigation }) => {
    const phoneInput = useRef(null);
    const [value, setValue] = useState('');

    const _validation = yup.object({
        phone: yup.string().required('Phone number is required'),
    });

    const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
    const { top, bottom } = useSafeAreaInsets();
    return (
        <Formik
            initialValues={{
                phone: '',
            }}
            validateOnMount={true}
            onSubmit={values => {
                // console.log('values', values);
                navigation.navigate('AccountVerifyOtp_R')
            }}
            validationSchema={_validation}>
            {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                touched,
                errors,
                isValid,
            }) => (
                <View style={[styles.mainContainer,
                { paddingTop: Platform.OS == 'ios' ? top : 0 }]}>
                    <Header head="Account Verification" onPress={() => navigation.goBack()} />
                    <Wrapper behavior="padding" style={{ flex: 1 }}>

                        <ScrollView>
                            <View style={{ marginTop: wp(4), paddingHorizontal: wp(10) }}>
                                <Text style={[styles.onboardTextP, { color: '#7D7F88' }]}>Please verify account to get the full NR Experience.</Text>
                            </View>
                            <View style={{ marginTop: wp(16) }}>
                                <Image source={images.logopic} style={{ width: wp(50), height: wp(50), alignSelf: 'center' }} />
                            </View>
                            <View style={[styles.inputView, { marginTop: wp(25) }]}>
                                <Text style={styles.labelStyle}>Phone Number</Text>
                                <View style={[styles.inputViewStyle, { paddingLeft: wp(2) }]}>
                                    <PhoneInput
                                        ref={phoneInput}
                                        defaultValue={value}
                                        defaultCode="US"
                                        layout="first"
                                        onChangeText={text => {
                                            setValue(text);
                                        }}
                                        onChangeFormattedText={text => {
                                            handleChange('phone')(text);
                                        }}
                                        withDarkTheme={false}
                                        autoFocus={false}
                                        placeholder="Enter Number"
                                        placeholderTextColor="black"
                                        containerStyle={styles.phoneContainerStyle}
                                        textContainerStyle={styles.phonetextContainer}
                                        textInputStyle={{
                                            color: 'black',
                                            fontFamily: fonts.medium,
                                            fontSize: 14
                                        }}
                                        codeTextStyle={{
                                            display: 'none',
                                        }}
                                        textInputProps={{
                                            placeholder: 'Enter your phone number',
                                            placeholderTextColor: Colors.lightgrey,
                                            fontFamily: fonts.medium,
                                            height: wp(12),
                                        }}
                                    />
                                </View>
                                {errors.phone && touched.phone && (
                                    <Text style={[styles.errortxt]}>{errors.phone}</Text>
                                )}
                            </View>
                            <View style={{
                                alignSelf: 'center',
                                marginTop: wp(20),
                                marginBottom: wp(5),
                            }}>
                                <MainButton
                                    title="Send OTP"
                                    onPress={handleSubmit}
                                />
                            </View>
                        </ScrollView>
                    </Wrapper>
                </View>
            )}
        </Formik>
    )
}

export default AccountVerification_R
