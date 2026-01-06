import { Image, ImageBackground, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useRef } from 'react'
import { images, fonts, Colors, styles } from '../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import MainButton from '../../../components/MainButton'
import Header from '../../../components/Header'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const Terms = ({ navigation }) => {
    const { top, bottom } = useSafeAreaInsets();

    return (
        <View style={[styles.mainContainer, { paddingTop: Platform.OS == 'ios' ? top : 0, backgroundColor: Colors.white }]}>
            <Header head="Terms & Conditions" onPress={() => navigation.goBack()} />
            <ScrollView>
                <View style={{ marginHorizontal: wp(5), marginTop: wp(10) }}>
                    <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: Colors.black, textAlign: 'center', textDecorationLine: 'underline' }}>
                        Native Riders LLC
                    </Text>
                    <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: Colors.black, marginBottom: wp(4), textAlign: 'center', textDecorationLine: 'underline' }}>
                        Terms and Conditions
                    </Text>

                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.bold, textDecorationLine: 'underline' }}>
                        • Contractual Relationship
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.medium, lineHeight: 18 }}>
                        Native Riders LLC provides a personalized multipurpose digital platform that enables you to conveniently find, request, or receive transportation from third-party providers that meet your needs and interests. On the other hand, Native Riders provide a personalized booking and management service to manage drivers to provide transportation services.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.medium, lineHeight: 18 }}>
                        These Terms and Conditions (“Terms”) govern your access or use, from within Pennsylvania, of Native Rider’s platform and any related content or services (collectively, the “Services,” as more fully defined below in Section 3) made available in Pennsylvania by Native Riders LLC. PLEASE READ THESE TERMS CAREFULLY, AS THEY CONSTITUTE A LEGAL AGREEMENT BETWEEN YOU AND Native Riders. In these Terms, the words “including” and "include” mean “including, but not limited to.”
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.medium, lineHeight: 18 }}>
                        By accessing or using the Services, you confirm your agreement to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Services. These Terms expressly supersede prior agreements or arrangements with you regarding the use of the Services.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.medium, lineHeight: 18 }}>
                        Native Riders may immediately terminate these Terms or any Services with respect to you, or generally cease offering or deny access to the Services or any portion thereof, at any time for any reason.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.medium, lineHeight: 18 }}>
                        IMPORTANT: PLEASE BE ADVISED THAT THIS AGREEMENT CONTAINS PROVISIONS THAT GOVERN HOW CLAIMS BETWEEN YOU AND NATIVE RIDERS CAN BE BROUGHT, INCLUDING THE ARBITRATION AGREEMENT (SEE SECTION 2 BELOW). PLEASE REVIEW THE ARBITRATION AGREEMENT BELOW CAREFULLY, AS IT REQUIRES YOU TO RESOLVE ALL DISPUTES WITH NATIVE RIDERS ON AN INDIVIDUAL BASIS AND, WITH LIMITED EXCEPTIONS, THROUGH FINAL AND BINDING ARBITRATION (AS DESCRIBED IN SECTION 2 BELOW). BY ENTERING INTO THIS AGREEMENT, YOU EXPRESSLY ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTAND ALL OF THE TERMS OF THIS AGREEMENT AND HAVE TAKEN TIME TO CONSIDER THE CONSEQUENCES OF THIS IMPORTANT DECISION.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.medium, lineHeight: 18 }}>
                        Native Riders may make changes to these Terms from time to time. If Native Rider makes changes, it will provide you with notice of such changes, such as by sending an email, providing a notice through the Services, or updating the date at the top of these Terms. Unless Native Rider says otherwise in its notice, the amended Terms will be effective immediately and your continued access to and use of the Services after Native Rider provides such notice will confirm your acceptance of the changes. If you do not agree to the amended Terms, you must stop accessing and using the Services.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.medium, lineHeight: 18 }}>
                        Native Rider’s collection and use of personal information in connection with the Services is described in Native Rider’s Privacy Policy.
                    </Text>

                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.bold, textDecorationLine: 'underline' }}>
                        • Conditions of Use
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.medium, lineHeight: 18 }}>
                        By using this App, you certify that you have read and reviewed this Agreement and that you agree to comply with its terms. If you do not want to be bound by the terms of this Agreement, you are advised to leave the App. Native Riders only grants use and access of this website, its products, and its services to those who have accepted its terms.
                    </Text>

                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.bold, textDecorationLine: 'underline' }}>
                        • Privacy Policy
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.medium, lineHeight: 18 }}>
                        Before you continue using our App, we advise you to read our privacy policy regarding our user data collection. It will help you better understand our practices.
                    </Text>

                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.bold, textDecorationLine: 'underline' }}>
                        • Arbitration Agreement
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.medium, lineHeight: 18 }}>
                        By agreeing to the Terms, you agree that you are required to resolve any claim that you may have against Native Riders on an individual basis in arbitration, and not as a class, collective, coordinated, consolidated, mass and/or representative action. This Arbitration Agreement will preclude you from bringing any class, collective, coordinated, consolidated, mass and/or representative action against Native Riders and also preclude you from participating in or recovering relief in any current or future class, collective, coordinated, consolidated, mass and/or representative action brought against Native Riders by someone else. Thus, the parties agree that the Arbitrator shall not conduct any form of class, collective, coordinated, consolidated, mass and/or representative arbitration, nor join, coordinate, or consolidate claims of multiple individuals against Native Riders in a single proceeding.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.medium, lineHeight: 18 }}>
                        Unless you and Native Riders otherwise agree, the arbitration will be conducted in the county where you reside. Your right to a hearing will be determined by the applicable arbitration provider’s rules. Subject to the applicable arbitration provider’s rules, the Arbitrator will have the discretion to direct a reasonable exchange of information by the parties, consistent with the expedited nature of the arbitration.
                    </Text>

                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.bold, textDecorationLine: 'underline' }}>
                        • The Platform and Services
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.medium, lineHeight: 18 }}>
                        Native Riders operates a personalized multipurpose digital platform that is accessed in a number of forms, including mobile and/or web-based applications (“Applications”).
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.medium, lineHeight: 18 }}>
                        YOU ACKNOWLEDGE THAT YOUR ABILITY TO PROVIDE, REQUEST, AND IF APPLICABLE, OBTAIN TRANSPORTATION, DOES NOT ESTABLISH NATIVE RIDERS AS A PROVIDER OF TRANSPORTATION, LOGISTICS OR DELIVERY SERVICES OR AS A TRANSPORTATION OR PROPERTY CARRIER.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.medium, lineHeight: 18 }}>
                        NATIVE RIDERS IS NOT A COMMON OR MOTOR CARRIER, DOES NOT TRANSPORT YOU, PLATFORM AND NOT TO THE GENERAL PUBLIC.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.medium, lineHeight: 18 }}>
                        YOU ACKNOWLEDGE THAT INDEPENDENT THIRD-PARTY PROVIDERS, INCLUDING DRIVERS, ARE NOT ACTUAL AGENTS, APPARENT AGENTS, OSTENSIBLE AGENTS, OR EMPLOYEES OF NATIVE RIDERS IN ANY WAY.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.medium, lineHeight: 18 }}>
                        YOU ALSO ACKNOWLEDGE THAT ANY SAFETY RELATED EFFORT, FEATURE, PROCESS, POLICY, STANDARD OR OTHER EFFORT UNDERTAKEN BY NATIVE RIDERS IN THE INTEREST OF PUBLIC SAFETY (WHETHER REQUIRED BY APPLICABLE REGULATIONS OR NOT) IS NOT AN INDICIA OF AN EMPLOYMENT, ACTUAL AGENCY, APPARENT AGENCY, OR OSTENSIBLE AGENCY RELATIONSHIP WITH AN INDEPENDENT THIRD-PARTY DRIVER.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.bold }}>
                        License
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.medium, lineHeight: 18 }}>
                        Subject to your compliance with these Terms, Native Rider grants you a limited, non-exclusive, non-sublicensable, revocable, non-transferable license to: (i) access and use the Applications on your personal device solely in connection with your use of the Services; and (ii) access and use any content, information and related materials that may be made available
                    </Text>

                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.bold, textDecorationLine: 'underline' }}>
                        • Access and Use of the Services
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1), fontFamily: fonts.bold }}>
                        User Accounts
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), marginLeft: wp(4), fontFamily: fonts.medium, lineHeight: 18 }}>
                        In order to use most aspects of the Services, you must register for and maintain an active personal user Services account (“Account”). You must be at least 18 years of age, or the age of legal majority in your jurisdiction (if different than 18), to obtain an Account, unless a specific Service permits otherwise. You cannot register for or maintain an Account if you have previously been banned from accessing or using the Services. Account registration requires you to submit to Native Riders certain personal information, such as your name, address, mobile phone number and age, as well as at least one valid payment method supported by Native Riders. For more information regarding Native Riders’ use of your personal information, please see our Privacy Policy. You agree to maintain accurate, complete, and up-to-date information in your Account, including a valid phone number, address and payment method. Your failure to comply with these Terms (including policies and supplemental terms) including, without limitation, your failure to maintain accurate, complete, and up-to-date Account information, including having an invalid or expired payment method on file, may result in your inability to access or use the Services. You are responsible for all activity that occurs under your Account, and you agree to maintain the security and secrecy of your Account username and password at all times. Unless otherwise permitted by Native Riders in writing, you may only possess one Account.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1), fontFamily: fonts.bold }}>
                        Text Messaging and Telephone Calls
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), marginLeft: wp(4), fontFamily: fonts.medium, lineHeight: 18 }}>
                        You agree that Native Riders, may contact you by telephone or text messages (including by an automatic telephone dialing system and/or with an artificial or pre-recorded voice) at any of the phone numbers provided by you or on your behalf in connection with an Native Riders’ account, including for marketing purposes. You understand that you are not required to provide this consent as a condition of purchasing any property, goods or services. You also understand that you may opt out of receiving text messages from Native Riders at any time, either by replying “STOP”, texting the word “STOP” to 89203.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), marginLeft: wp(4), fontFamily: fonts.medium, lineHeight: 18 }}>
                        You agree that Native Riders may contact you using any of the phone numbers you provided in connection with a Native Riders’ account (including via text or voice-recorded message) or your email address in the case of suspected fraud or unlawful activity.
                    </Text>

                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.bold, textDecorationLine: 'underline' }}>
                        • Payment
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.medium, lineHeight: 18 }}>
                        You understand that use of the Services may result in charges to you for the services you receive or provide from Native Riders. Native Riders will enable your payment of the applicable Charges for services or goods obtained through your use of the Services. Charges will include applicable taxes where required by law. Charges may include other applicable fees, product return fees, cancellation fees, estimated or actual tolls, and/or surcharges. Further, you acknowledge and agree that Charges applicable in certain geographical areas may increase substantially during times of high demand or due to other marketplace factors.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.medium, lineHeight: 18 }}>
                        All Charges and payments will be enabled by Native Riders using the preferred payment method designated in your Account, after which you will receive a receipt. If your primary Account payment method is determined to be expired, invalid or otherwise not able to be charged, you agree that Native Riders may use a secondary payment method in your Account, if available. Charges paid by you are final and non-refundable, unless otherwise determined by Native Riders.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1), fontFamily: fonts.bold }}>
                        Damage, Cleaning, Lost and Found, and Violation of Terms
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), marginLeft: wp(4), fontFamily: fonts.medium, lineHeight: 18 }}>
                        Native Riders may charge you a fee on behalf of Third-Party Providers if, during your use of the Services, you have caused damage to a vehicle or property that requires repair or cleaning (“Repair” or “Cleaning”). The amount of such fee shall be determined, in Native Rider’s sole discretion, based on the type of damage and the severity. Native Riders reserves the right to verify or otherwise require documentation of damages prior to processing a fee. In the event that a Repair or Cleaning request is verified by Native Riders in Native Rider’s reasonable discretion, Native Riders reserves the right to facilitate payment for the reasonable cost of such Repair or Cleaning using your payment method designated in your Account. Such amounts, as well as those pertaining to lost and found goods, will be transferred by Native Riders to a Third-Party Provider, if applicable, and are non-refundable.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), marginLeft: wp(4), fontFamily: fonts.medium, lineHeight: 18 }}>
                        Additionally, if you fail to comply with these Terms, you may be responsible for Charges, including without limitation, for transactions that could not be completed properly, arising out of or in connection with your failure to comply with these Terms.
                    </Text>

                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.bold, textDecorationLine: 'underline' }}>
                        • Disclaimers; Limitation of Liability; Indemnity
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1), fontFamily: fonts.bold }}>
                        Disclaimer
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), marginLeft: wp(4), fontFamily: fonts.medium, lineHeight: 18 }}>
                        THE SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE.” NATIVE RIDERS DISCLAIMS ALL REPRESENTATIONS AND WARRANTIES, EXPRESS, IMPLIED, OR STATUTORY, NOT EXPRESSLY SET OUT IN THESE TERMS, INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN ADDITION, NATIVE RIDERS MAKES NO REPRESENTATION, WARRANTY, OR GUARANTEE REGARDING THE RELIABILITY, TIMELINESS, QUALITY, SUITABILITY, OR AVAILABILITY OF THE SERVICES OR ANY SERVICES OR GOODS REQUESTED THROUGH THE USE OF THE SERVICES.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), marginLeft: wp(4), fontFamily: fonts.medium, lineHeight: 18 }}>
                        NATIVE RIDERS DO NOT CONTROL, MANAGE OR DIRECT ANY THIRD-PARTY PROVIDERS INCLUDING DRIVERS. THIRD-PARTY PROVIDERS ARE NOT ACTUAL AGENTS, APPARENT AGENTS, OSTENSIBLE AGENTS, OR EMPLOYEES OF NATIVE RIDERS.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), marginLeft: wp(4), fontFamily: fonts.medium, lineHeight: 18 }}>
                        NATIVE RIDERS DOE NOT CONTROL, ENDORSE OR TAKE RESPONSIBILITY FOR ANY USER CONTENT OR THIRD-PARTY CONTENT AVAILABLE ON OR LINKED TO BY THE SERVICES. NATIVE RIDERS CANNOT AND DOES NOT REPRESENT OR WARRANT THAT THE SERVICES OR SERVERS ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1), fontFamily: fonts.bold }}>
                        Indemnity
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), marginLeft: wp(4), fontFamily: fonts.medium, lineHeight: 18 }}>
                        You agree to indemnify and hold Native Riders and its affiliates and their officers, directors, employees, and agents harmless from and against any and all actions, claims, demands, losses, liabilities, costs, damages, and expenses (including attorneys’ fees), arising out of or in connection with: (i) your use of the Services or services or goods obtained through your use of the Services; (ii) your breach or violation of any of these Terms; or (iii) your violation of the rights of any third party, including Third-Party Providers.
                    </Text>

                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), fontFamily: fonts.bold, textDecorationLine: 'underline' }}>
                        • Other Provisions
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1), fontFamily: fonts.bold }}>
                        Choice of Law
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), marginLeft: wp(4), fontFamily: fonts.medium, lineHeight: 18 }}>
                        These Terms shall be governed by and construed in accordance with the laws of the state in which your dispute arises, without regard to the choice or conflict of law principles of any jurisdiction, except as may be otherwise provided in the Arbitration Agreement in Section 2 above or in supplemental terms applicable to your region. This Choice of Law provision applies only to the interpretation of these Terms, and these provisions shall not be interpreted as generally extending any state’s law to you if your dispute did not arise in that state.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), marginLeft: wp(4), fontFamily: fonts.medium, lineHeight: 18 }}>
                        Any dispute, claim, or controversy arising out of or relating to incidents or accidents resulting in personal injury (including but not limited to sexual assault or harassment claims) that you allege occurred in connection with your use of the Services, whether before or after the date you agreed to the Terms, shall be governed by and construed in accordance with the laws of the state in which the incident or accident occurred.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1), fontFamily: fonts.bold }}>
                        Choice of Forum
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), marginLeft: wp(4), fontFamily: fonts.medium, lineHeight: 18 }}>
                        Any dispute, claim or controversy arising out of or relating to these Terms or the existence, breach, termination, enforcement, interpretation or validity thereof, shall be brought exclusively in the state and federal courts of the state in which the dispute, claim or controversy arose, notwithstanding that other courts may have jurisdiction over the parties and subject matter, except as may be otherwise provided by the Arbitration Agreement above or in supplemental terms applicable to your region.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(4), marginLeft: wp(4), fontFamily: fonts.medium, lineHeight: 18 }}>
                        Notwithstanding the foregoing, any dispute, claim, or controversy arising out of or relating to incidents or accidents resulting in personal injury (including but not limited to sexual assault or harassment claims) that you allege occurred in connection with your use of the Services, whether before or after the date you agreed to the Terms, shall be brought exclusively in the state or federal courts in the State in which the incident or accident occurred, notwithstanding that other courts may have jurisdiction over the parties and subject matter, and except as may be otherwise provided in the Arbitration Agreement above or in supplemental terms applicable to your region, to the extent permitted by law.
                    </Text>
                </View>
            </ScrollView>
        </View>
    )
}

export default Terms