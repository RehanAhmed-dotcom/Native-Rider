import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Colors, images, styles} from '../constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Custom_Drawer_R from './Custom_Drawer_R';
import BottomNavigation_R from '../bottomnav/BottomNavigation_R';
import Search_R from '../screens/rider/main/drawerscreens/Search_R';
import Bookings_R from '../screens/rider/main/drawerscreens/Bookings_R';
import AboutUs_R from '../screens/rider/main/drawerscreens/AboutUs_R';
import Emergency_R from '../screens/rider/main/drawerscreens/Emergency_R';
import OfferRequests_R from '../screens/rider/main/drawerscreens/OfferRequests_R';
import ChangePassword_R from '../screens/rider/main/ChangePassword_R';
import SplashScreen from 'react-native-splash-screen';
import Trips_R from '../screens/rider/main/drawerscreens/Trips_R';
import Reservation_R from '../screens/rider/main/drawerscreens/Reservation_R';
import SupportChat_R from '../screens/rider/main/drawerscreens/SupportChat_R';
import TermsofServices from '../screens/rider/main/drawerscreens/TermsofServices';
import Rate_Reviews from '../screens/rider/main/drawerscreens/Rate_Reviews';

const Drawer_R = () => {
  const drawer = createDrawerNavigator();
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <drawer.Navigator
      drawerContent={props => <Custom_Drawer_R {...props} />}
      initialRouteName="BottomNavigation_R"
      screenOptions={{
        drawerActiveBackgroundColor: 'white',
        // drawerInactiveBackgroundColor: '#FFFAFA',
        drawerActiveTintColor: Colors.buttoncolor,
        drawerInactiveTintColor: Colors.buttoncolor,

        drawerItemStyle: {flex: 1},
        headerShown: false,
        drawerLabelStyle: {
          fontSize: 16,
        },
        drawerStyle: {
          backgroundColor: Colors.white,
          width: 180,
          borderTopRightRadius: wp(10),
          borderBottomRightRadius: wp(10),
          overflow: 'hidden',
        },
      }}>
      <drawer.Screen
        name="BottomNavigation_R"
        component={BottomNavigation_R}
        options={{
          // headerShown: false,
          drawerLabel: '',
          drawerIcon: ({focused}) => (
            <View style={styles.tabStyleView}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.screenname,
                    {color: focused ? Colors.buttoncolor : Colors.black},
                  ]}>
                  Home
                </Text>
              </View>
            </View>
          ),
        }}
      />
      <drawer.Screen
        name="Trips_R"
        component={Trips_R}
        options={{
          headerShown: false,
          drawerLabel: '',
          drawerIcon: ({focused}) => (
            <View style={styles.tabStyleView}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.screenname,
                    {color: focused ? Colors.buttoncolor : Colors.black},
                  ]}>
                  Trips
                </Text>
              </View>
            </View>
          ),
        }}
      />
      <drawer.Screen
        name="Bookings_R"
        component={Bookings_R}
        options={{
          headerShown: false,
          drawerLabel: '',
          drawerIcon: ({focused}) => (
            <View style={styles.tabStyleView}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.screenname,
                    {color: focused ? Colors.buttoncolor : Colors.black},
                  ]}>
                  Bookings
                </Text>
              </View>
            </View>
          ),
        }}
      />
      <drawer.Screen
        name="AboutUs_R"
        component={AboutUs_R}
        options={{
          headerShown: false,
          drawerLabel: '',
          drawerIcon: ({focused}) => (
            <View style={styles.tabStyleView}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.screenname,
                    {color: focused ? Colors.buttoncolor : Colors.black},
                  ]}>
                  AboutUs
                </Text>
              </View>
            </View>
          ),
        }}
      />
      {/* <drawer.Screen
        name="TermsofServices"
        component={TermsofServices}
        options={{
          headerShown: false,
          drawerLabel: '',
          drawerIcon: ({focused}) => (
            <View style={styles.tabStyleView}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.screenname,
                    {color: focused ? Colors.buttoncolor : Colors.black},
                  ]}>
                  Terms of Service
                </Text>
              </View>
            </View>
          ),
        }}
      />
      */}
      <drawer.Screen
        name="OfferRequests_R"
        component={OfferRequests_R}
        options={{
          headerShown: false,
          drawerLabel: '',
          drawerIcon: ({focused}) => (
            <View style={styles.tabStyleView}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.screenname,
                    {color: focused ? Colors.buttoncolor : Colors.black},
                  ]}>
                  Requests
                </Text>
              </View>
            </View>
          ),
        }}
      />

      <drawer.Screen
        name="Reservation_R"
        component={Reservation_R}
        options={{
          headerShown: false,
          drawerLabel: '',
          drawerIcon: ({focused}) => (
            <View style={styles.tabStyleView}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.screenname,
                    {
                      color: focused ? Colors.buttoncolor : Colors.black,
                      lineHeight: 20,
                    },
                  ]}>
                  Reservation
                </Text>
              </View>
            </View>
          ),
        }}
      />
      <drawer.Screen
        name="Rate_Reviews"
        component={Rate_Reviews}
        options={{
          headerShown: false,
          drawerLabel: '',
          drawerIcon: ({focused}) => (
            <View style={styles.tabStyleView}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.screenname,
                    {
                      color: focused ? Colors.buttoncolor : Colors.black,
                      lineHeight: 20,
                    },
                  ]}>
                  Rate/Reviews
                </Text>
              </View>
            </View>
          ),
        }}
      />
      <drawer.Screen
        name="SupportChat_R"
        component={SupportChat_R}
        options={{
          headerShown: false,
          drawerLabel: '',
          drawerIcon: ({focused}) => (
            <View style={styles.tabStyleView}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.screenname,
                    {
                      color: focused ? Colors.buttoncolor : Colors.black,
                      lineHeight: 20,
                    },
                  ]}>
                  Support Chat
                </Text>
              </View>
            </View>
          ),
        }}
      />
      <drawer.Screen
        name="ChangePassword_R"
        component={ChangePassword_R}
        options={{
          headerShown: false,
          drawerLabel: '',
          drawerIcon: ({focused}) => (
            <View style={styles.tabStyleView}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.screenname,
                    {
                      color: focused ? Colors.buttoncolor : Colors.black,
                      lineHeight: 20,
                    },
                  ]}>
                  Change Password
                </Text>
              </View>
            </View>
          ),
        }}
      />
    </drawer.Navigator>
  );
};

export default Drawer_R;
