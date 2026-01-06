import { FlatList, Image, ImageBackground, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useRef } from 'react'
import { images, fonts, Colors, styles } from '../../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import MainButton from '../../../../components/MainButton'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
const AboutUs = ({ navigation }) => {
  const { top, bottom } = useSafeAreaInsets();
  return (
     <View style={[styles.mainContainer,
      { paddingTop: Platform.OS == 'ios' ? top : 0 }]}>
        <View
          style={styles.HeaderView}>
          <Text style={styles.headerText}>About Us</Text>
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ position: 'absolute', left: wp(4) }}
            activeOpacity={0.7} >
            <Image source={images.menuIcon} resizeMode='contain' style={{ width: wp(6), height: wp(6) }} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View>
          <Image source={images.logopic} style={{ width: wp(40), height: wp(40), alignSelf: 'center', marginTop: wp(5) }} />
          <View style={{ alignSelf:'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: wp(3) }}>
              <Image source={images.gmailIcon} resizeMode='contain' style={{ width: wp(8), height: wp(5) }} />
              <Text style={{ fontSize: 16, fontFamily: fonts.medium, color: Colors.black }}>nativerider@support.com</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: wp(2),}}>
              <Image source={images.usernumIcon} resizeMode='contain' style={{ width: wp(8), height: wp(5) }} />
              <Text style={{ fontSize: 16, fontFamily: fonts.medium, color: Colors.black }}>+1 412 312 3965</Text>
            </View>
          </View>
          <View style={{ marginHorizontal: wp(5), marginTop: wp(10),marginBottom:wp(5) }}>
            <Text
              style={[
                styles.infoStyle,
                { fontSize: 14, lineHeight: 26, fontFamily: fonts.medium,color:Colors.black },
              ]}>
               Thank you for joining Native Rider! Our innovative Transportation Management System (TMS) helps businesses optimize operations with increased visibility and real-time tracking—all from an easy-to-use mobile app. We’re here to streamline your ride management, improve efficiency, and provide valuable insights to make smarter, data-driven decisions. We’re excited to be part of your journey and look forward to helping your business move forward!
            </Text>
          </View>
  
                           <View>
                              {/* <Image source={images.logopic} style={{ width: wp(40), height: wp(40), alignSelf: 'center', marginTop: wp(5) }} /> */}
                               <Text style={styles.headerText}>Terms of Service</Text>
                              </View>
                              <View style={{paddingHorizontal:wp(4)}}>
                                  <Text style={{fontSize:16,fontFamily:fonts.bold,color:Colors.black}}>
                                  Disclaimer:
                                  </Text>
                                  <Text style={{fontSize:14,fontFamily:fonts.medium,color:Colors.black,lineHeight:18}}>
                                  Native Rider is a technology platform that connects independent transportation providers with individuals or groups seeking rides. We do not own vehicles, set prices, dispatch services, or provide transportation. All rides are offered and operated by third-party providers who are solely responsible for their services, licensing, and compliance with applicable laws. Native Rider does not assume liability for any actions or omissions of independent providers using our platform.
                                  </Text>
                              </View>
                              <View style={{ paddingHorizontal: wp(4),marginBottom:wp(5) }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.bold,
                    color: Colors.black,
                    marginBottom: 10,
                  }}
                >
                  Native Rider Provider Participation Agreement:
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                    lineHeight: 18,
                    marginBottom: 10,
                  }}
                >
                  This Agreement is entered into between Native Rider, LLC ("Platform") and
                  the undersigned Provider ("Driver" or "Operator").
                </Text>
          
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                    lineHeight: 18,
                    marginTop: 5,
                  }}
                >
                  1. Role of Native Rider
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                    lineHeight: 18,
                    marginLeft: 10,
                  }}
                >
                  Native Rider operates a digital platform allowing riders to connect with
                  independent transportation providers.{'\n'}
                  Native Rider does not control pricing, schedule rides, or employ drivers.
                </Text>
          
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                    lineHeight: 18,
                    marginTop: 10,
                  }}
                >
                  2. Subscription & Access
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                    lineHeight: 18,
                    marginLeft: 10,
                  }}
                >
                  Provider agrees to pay a monthly or annual subscription fee to access and
                  use the platform.{'\n'}
                  Access may be suspended or revoked at any time due to failure to comply
                  with terms or misrepresentation.
                </Text>
          
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                    lineHeight: 18,
                    marginTop: 10,
                  }}
                >
                  3. Licensing & Compliance
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                    lineHeight: 18,
                    marginLeft: 10,
                  }}
                >
                  Provider affirms they:{'\n'}
                  {'  • Are at least 21 years old\n'}
                  {'  • Hold valid driving and vehicle-for-hire credentials as required by local/state laws\n'}
                  {'  • Maintain vehicle insurance appropriate for commercial/passenger use\n'}
                  Provider is solely responsible for compliance with PUC, PPA, or other
                  local regulatory bodies.
                </Text>
          
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                    lineHeight: 18,
                    marginTop: 10,
                  }}
                >
                  4. Vet & Verify
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                    lineHeight: 18,
                    marginLeft: 10,
                  }}
                >
                  Provider agrees to supply:{'\n'}
                  {'  • Valid driver’s license\n'}
                  {'  • Vehicle registration and inspection certificate\n'}
                  {'  • Proof of insurance\n'}
                  {'  • Evidence of business registration (if applicable)\n'}
                  {'  • Any other documents reasonably requested by Native Rider for verification\n'}
                </Text>
          
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                    lineHeight: 18,
                  //   marginTop: 10,
                  }}
                >
                  5. Service Expectations
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                    lineHeight: 18,
                    marginLeft: 10,
                  }}
                >
                  Provider agrees to:{'\n'}
                  {'  • Maintain clean, safe vehicles\n'}
                  {'  • Provide courteous and lawful service to riders\n'}
                  {'  • Honor bookings and cancel only for valid reasons\n'}
                </Text>
          
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                    lineHeight: 18,
                  //   marginTop: 10,
                  }}
                >
                  6. Disclaimers & Liability
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                    lineHeight: 18,
                    marginLeft: 10,
                  }}
                >
                  Provider acknowledges that Native Rider is not liable for accidents,
                  incidents, or disputes arising from use of the platform.{'\n'}
                  Provider agrees to indemnify Native Rider against claims resulting from
                  their use of the platform.
                </Text>
          
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                    lineHeight: 18,
                    marginTop: 10,
                  }}
                >
                  7. Termination
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: Colors.black,
                    lineHeight: 18,
                    marginLeft: 10,
                  }}
                >
                  Either party may terminate this agreement at any time with written notice.
                  No refunds on prepaid fees unless otherwise required by law.
                </Text>
              </View>
          
          </View>
        </ScrollView>
      </View>
  )
}
export default AboutUs
