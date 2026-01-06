import { Image, ImageBackground, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useRef } from 'react'
import { images, fonts, Colors, styles } from '../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import MainButton from '../../../components/MainButton'
import Header from '../../../components/Header'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const PrivacyPolicy = ({ navigation }) => {
    const { top, bottom } = useSafeAreaInsets();

    return (
        <View 
            // source={images.privacyImg} 
            // resizeMode='cover' 
            style={[styles.mainContainer, { paddingTop: Platform.OS == 'ios' ? top : 0,backgroundColor:Colors.white }]}
        >
            <Header head="Privacy Policy" onPress={() => navigation.goBack()} />
            <ScrollView>
                <View style={{ marginHorizontal: wp(5), marginTop: wp(10) }}>
                    <Text style={{ fontSize: 16, fontFamily:fonts.bold, color: Colors.black,textAlign:'center',textDecorationLine:'underline' }}>
                        Native Riders LLC
                    </Text>
                    <Text style={{ fontSize: 16, fontFamily:fonts.bold, color: Colors.black, marginBottom: wp(4),textAlign:'center' ,textDecorationLine:'underline'}}>
                        Privacy Policy
                    </Text>

                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2),fontFamily: fonts.bold, textDecorationLine:'underline' }}>
                        • INTRODUCTION
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2),fontFamily:fonts.medium,lineHeight:18 }}>
                        When you use Native Riders you trust us with your personal data. We’re committed to keeping that trust. That starts with helping you understand our privacy practices.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2),fontFamily:fonts.medium,lineHeight:18 }}>
                        This notice describes the personal data we collect, how it’s used and shared, and your choices regarding this data.
                    </Text>

                    <Text style={{ fontSize: 14,color: Colors.black,marginBottom: wp(2),fontFamily: fonts.bold, textDecorationLine:'underline' }}>
                        • OVERVIEW
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2),fontFamily:fonts.medium,lineHeight:18 }}>
                        This notice describes how Native Riders and its affiliates collect and use personal data. This notice applies to all users of our apps, websites, features, or other services anywhere in the world. This notice specifically applies to:
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1), marginLeft: wp(4),fontFamily:fonts.medium,lineHeight:18 }}>
                        • Riders: individuals who request or receive transportation, including those who receive transportation requested by another individual
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), marginLeft: wp(4),fontFamily:fonts.medium,lineHeight:18 }}>
                        • Drivers: individuals who provide transportation to Riders individually or through partner transportation companies
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2),fontFamily:fonts.medium,lineHeight:18 }}>
                        Our practices are subject to applicable laws in the places in which we operate. This means that we engage in the practices described in this notice in a particular country or region only if permitted under the laws of those places.
                    </Text>

                    <Text style={{ fontSize: 14,color: Colors.black, marginBottom: wp(2),fontFamily: fonts.bold, textDecorationLine:'underline'  }}>
                        • DATA COLLECTION
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2),fontFamily:fonts.medium,lineHeight:18  }}>
                        Native Riders collect personal data:
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1), marginLeft: wp(4),fontFamily:fonts.medium,lineHeight:18  }}>
                        • provided by users to Native Riders, such as during account creation
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1), marginLeft: wp(4),fontFamily:fonts.medium,lineHeight:18  }}>
                        • created during use of our services, such as location, app usage, and device data
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), marginLeft: wp(4),fontFamily:fonts.medium,lineHeight:18  }}>
                        • from other sources, such as other users or account owners, business partners, vendors, insurance and financial solution providers, and governmental authorities
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2),fontFamily:fonts.medium,lineHeight:18  }}>
                        The following personal data is collected by or on behalf of Native Riders:
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1),fontFamily: fonts.bold }}>
                        1. Data provided by users. This includes:
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1), marginLeft: wp(4),fontFamily:fonts.medium,lineHeight:18 }}>
                        • User profile: We collect data when users create or update their Native Riders accounts. This may include their name, email, phone number, login name and password, address, profile picture, payment or banking information (including related payment verification information), driver’s license and other government identification documents (which may indicate document numbers as well as birth date, gender, and photo). This also includes vehicle or insurance information of drivers and delivery persons, and emergency contact information.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1), marginLeft: wp(4),fontFamily:fonts.medium,lineHeight:18 }}>
                        • Demographic data: We may collect demographic data about users, including through user surveys.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), marginLeft: wp(4),fontFamily:fonts.medium,lineHeight:18 }}>
                        • User content: We collect the data submitted by users when they contact Native Riders customer support.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1),fontFamily: fonts.bold  }}>
                        2. Data created during use of our services. This includes:
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1), marginLeft: wp(4),fontFamily:fonts.medium,lineHeight:18  }}>
                        • Location data (driver): We collect drivers’ precise or approximate location data, including to enable rides and deliveries, to enable ride/delivery tracking and safety features, to prevent and detect fraud, and to satisfy legal requirements. Native Riders collects this data when the Native Riders App is running in the foreground (app open and on-screen) or background (app open but not on-screen) of their mobile device.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1), marginLeft: wp(4),fontFamily:fonts.medium,lineHeight:18 }}>
                        • Location data (riders). We collect riders’ precise or approximate location data to enable and enhance use of our apps, including to improve pick-ups, enable safety features, and prevent and detect fraud.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1), marginLeft: wp(4),fontFamily:fonts.medium,lineHeight:18 }}>
                        • Transaction information: We collect transaction information related to the use of our services, including the type of services requested or provided, order details, payment transaction information (such as a restaurant’s or merchant's name and location and amount of transaction), delivery information, date and time the service was provided, amount charged, distance traveled, and payment method. Additionally, if someone uses your promotion code, we may associate your name with that person.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), marginLeft: wp(4),fontFamily:fonts.medium,lineHeight:18 }}>
                        • Usage data: We collect data about how users interact with our services. This includes data such as access dates and times, app features or pages viewed, app crashes and other system activity, and type of browser. We may also collect data regarding the third-party sites or services used before interacting with our services, which we use for marketing. (Please see "How We Use Data" below for more information on how we market our services to users). In some cases, we collect this data through cookies, pixels, tags, and similar tracking technologies that create and maintain unique identifiers.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1),fontFamily: fonts.bold  }}>
                        3. Data from other sources. These include:
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1), marginLeft: wp(4),fontFamily:fonts.medium,lineHeight:18 }}>
                        • Users participating in our referral programs. For example, when a user refers to another person, we receive the referred person’s personal data from that user.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), marginLeft: wp(4),fontFamily:fonts.medium,lineHeight:18 }}>
                        • Native Riders account owners who request services for or on behalf of other users, or who enable such users to request or receive services through their accounts.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2),fontFamily:fonts.medium,lineHeight:18 }}>
                        Native Riders may combine the data collected from these sources with other data in its possession.
                    </Text>

                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2),fontFamily: fonts.bold  }}>
                        • DATA USES
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2),fontFamily:fonts.medium,lineHeight:18 }}>
                        Native Riders personal data is used to enable reliable and convenient transportation, delivery, and other products and services. We also use such data:
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1), marginLeft: wp(4),fontFamily:fonts.medium,lineHeight:18 }}>
                        • to enhance the safety and security of our users and services
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1), marginLeft: wp(4),fontFamily:fonts.medium,lineHeight:18 }}>
                        • for customer support
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1), marginLeft: wp(4),fontFamily:fonts.medium,lineHeight:18 }}>
                        • for research and development
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1), marginLeft: wp(4),fontFamily:fonts.medium,lineHeight:18 }}>
                        • to enable communications between users
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1), marginLeft: wp(4),fontFamily:fonts.medium,lineHeight:18 }}>
                        • to send marketing and non-marketing communications to users
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), marginLeft: wp(4),fontFamily:fonts.medium,lineHeight:18 }}>
                        • in connection with legal proceedings
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2),fontFamily:fonts.medium,lineHeight:18 }}>
                        Native Riders does not sell or share user personal data with third parties for their direct marketing, except with users’ consent.
                    </Text>

                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2),fontFamily: fonts.bold  }}>
                        • Data sharing and disclosure
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2),fontFamily:fonts.medium,lineHeight:18}}>
                        Some of Native Riders’ services and features require that we share personal data with other users or at a user’s request. We may also share such data with our affiliates, subsidiaries, and partners, for legal reasons or in connection with claims or disputes.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2),fontFamily:fonts.medium,lineHeight:18 }}>
                        Native Riders may share personal data:
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1),fontFamily: fonts.bold }}>
                        1. With other users
                    </Text>
                    <Text style={{ fontSize:14, color: Colors.black, marginBottom: wp(1), marginLeft: wp(4),fontFamily:fonts.medium,lineHeight:18 }}>
                        This includes sharing:
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1), marginLeft: wp(6),fontFamily:fonts.medium,lineHeight:18 }}>
                        • riders’ first name, rating, and pickup and/or drop-off locations with drivers
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1), marginLeft: wp(6),fontFamily:fonts.medium,lineHeight:18 }}>
                        • riders’ first name with other riders in a carpool trip. Riders in carpool trips may also see the drop-off location of the other riders.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1), marginLeft: wp(6),fontFamily:fonts.medium,lineHeight:18 }}>
                        • delivery recipients’ first name, delivery address, and order information with their delivery person and restaurant or merchant. We may also share ratings and feedback, or other information to the extent required by law, with the restaurant partner and delivery person.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), marginLeft: wp(6),fontFamily:fonts.medium,lineHeight:18 }}>
                        • for drivers, we may share data with the rider(s), delivery recipient(s) and restaurants or merchants, including name and photo; vehicle make, model, color, license plate, and vehicle photo; location (before and during trip); average rating provided by users; total number of trips; period of time since they signed up to be a driver or delivery person; contact information (if permitted by applicable laws); and driver or delivery person profile, including compliments and other feedback submitted by past users.
                    </Text>
                    <Text style={{ fontSize: 14,  color: Colors.black, marginBottom: wp(1),fontFamily: fonts.bold }}>
                        2. At the user’s request
                    </Text>
                    <Text style={{ fontSize:14, color: Colors.black, marginBottom: wp(1), marginLeft: wp(4),fontFamily:fonts.medium,lineHeight:18 }}>
                        This includes sharing data with:
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1), marginLeft: wp(6),fontFamily:fonts.medium,lineHeight:18 }}>
                        • Other people at the user’s request. For example, we share a user’s ETA and location with a friend when requested by that user, or a user’s trip information when they split a fare with a friend.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1), marginLeft: wp(6),fontFamily:fonts.medium,lineHeight:18 }}>
                        • Native Riders’ business partners. For example, if a user requests a service through a partnership or promotional offering made by a third party, Native Riders may share certain data with those third parties. This may include, for example, other services, platforms, apps, or websites that integrate with our APIs; vehicle suppliers or services; those with an API or service with which we integrate; or restaurants, merchants or other Native Riders business partners and their users in connection with promotions, contests, or specialized services.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1), marginLeft: wp(6),fontFamily:fonts.medium,lineHeight:18 }}>
                        • Emergency services: We offer features that enable users to share their data with police, fire, and ambulance services in the event of an emergency or after certain incidents. For more information, please see the sections below titled “Choice and Transparency” and “Emergency Data Sharing”.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(1),fontFamily: fonts.bold  }}>
                        7. For legal reasons or in the event of a dispute
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), marginLeft: wp(4),fontFamily:fonts.medium,lineHeight:18 }}>
                        Native Riders may share users’ personal data if we believe it’s required by applicable law, regulation, operating license or agreement, legal process or governmental request, or where the disclosure is otherwise appropriate due to safety or similar concerns.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), marginLeft: wp(4),fontFamily:fonts.medium,lineHeight:18 }}>
                        This includes sharing personal data with law enforcement officials, public health officials, other government authorities, airports (if required by the airport authorities as a condition of operating on airport property), or other third parties as necessary to enforce our Terms of Service, user agreements, or other policies; to protect Native Riders’ rights or property or the rights, safety, or property of others; or in the event of a claim or dispute relating to the use of our services. In the event of a dispute relating to use of another person’s credit card, we may be required by law to share your personal data, including trip or order information, with the owner of that credit card.
                    </Text>
                    <Text style={{ fontSize: 14,color: Colors.black, marginBottom: wp(1),fontFamily: fonts.bold   }}>
                        8. With consent
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2), marginLeft: wp(4),fontFamily:fonts.medium,lineHeight:18 }}>
                        Native Riders may share a user’s personal data other than as described in this notice if we notify the user and they consent to the sharing.
                    </Text>

                    <Text style={{ fontSize: 14, color: Colors.black,  marginBottom: wp(2),fontFamily: fonts.bold  }}>
                        • Updates to this notice
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(2),fontFamily:fonts.medium,lineHeight:18  }}>
                        We may occasionally update this notice. If we make significant changes, we will notify users in advance of the changes through the App or through other means, such as email. We encourage users to periodically review this notice for the latest information on our privacy practices.
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginBottom: wp(4),fontFamily:fonts.medium,lineHeight:18  }}>
                        Use of our services after an update constitutes consent to the updated notice to the extent permitted by law.
                    </Text>
                </View>
            </ScrollView>
        </View>
    )
}

export default PrivacyPolicy