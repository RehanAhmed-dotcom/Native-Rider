import { StyleSheet, Text, View, Image } from 'react-native'
import React,{useEffect} from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Colors, images, styles } from '../constant/Index';
import Custom_Drawer from './Custom_Drawer';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import BottomNavigation from '../bottomnav/BottomNavigation';
import Search from '../screens/driver/main/drawerscreens/Search';
import Bookings from '../screens/driver/main/drawerscreens/Bookings';
import AboutUs from '../screens/driver/main/drawerscreens/AboutUs';
// import Emergency from '../screens/driver/main/drawerscreens/Emergency';
import SplashScreen from 'react-native-splash-screen';
import Referrals from '../screens/driver/main/drawerscreens/Referrals';
import Wallet from '../screens/driver/main/drawerscreens/Wallet';
import Trips from '../screens/driver/main/drawerscreens/Trips';
import Reservations from '../screens/driver/main/drawerscreens/Reservations';
import SupportChat from '../screens/driver/main/SupportChat';
import SharedRes from '../screens/driver/main/drawerscreens/SharedRes';
import Promotion_Discount from '../screens/driver/main/drawerscreens/Promotion_Discount';

const Drawer = () => {
  const drawer = createDrawerNavigator();
useEffect(() => {
          SplashScreen.hide();
        }, []);
  return (
    <drawer.Navigator
      drawerContent={props => <Custom_Drawer {...props} />}
      initialRouteName="BottomNavigation"

      screenOptions={{
        drawerActiveBackgroundColor:'white',
        // drawerInactiveBackgroundColor: '#FFFAFA',
        drawerActiveTintColor: Colors.buttoncolor,
        drawerInactiveTintColor: Colors.buttoncolor,
        drawerItemStyle: { flex: 1,
          pressOpacity: 1, 
          pressColor: 'rgba(0,0,0,0.2)' 
         },
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
      <drawer.Screen name="BottomNavigation" component={BottomNavigation}
        options={{
          // headerShown: false,
          drawerLabel: '',
          drawerIcon: ({focused }) => (
            <View
            style={styles.tabStyleView}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                <Text style={[styles.screenname,{color:focused?Colors.buttoncolor:Colors.black}]}>Home</Text>
              </View>
            </View>
          ),
        }}
      />
      {/* <drawer.Screen name="Search" component={Search}
        options={{
          // headerShown: false,
          drawerLabel: '',
          drawerIcon: ({focused }) => (
            <View
              style={styles.tabStyleView}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.screenname,{color:focused?Colors.buttoncolor:Colors.black}]}>Search</Text>
              </View>
            </View>
          ),
        }}

      /> */}
        <drawer.Screen name="Referrals" component={Referrals}
        options={{
          headerShown: false,
          drawerLabel: '',
          drawerIcon: ({focused }) => (
            <View
            style={styles.tabStyleView}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                <Text style={[styles.screenname,{color:focused?Colors.buttoncolor:Colors.black}]}>Referrals</Text>
              </View>
            </View>
          ),
        }}

      />
    
       <drawer.Screen name="Trips" component={Trips}
        options={{
          headerShown: false,
          drawerLabel: '',
          drawerIcon: ({focused }) => (
            <View
            style={styles.tabStyleView}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                <Text style={[styles.screenname,{color:focused?Colors.buttoncolor:Colors.black}]}>Trips</Text>
              </View>
            </View>
          ),
        }}

      />
           <drawer.Screen name="Wallet" component={Wallet}
        options={{
          headerShown: false,
          drawerLabel: '',
          drawerIcon: ({focused }) => (
            <View
            style={styles.tabStyleView}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                <Text style={[styles.screenname,{color:focused?Colors.buttoncolor:Colors.black}]}>Wallet</Text>
              </View>
            </View>
          ),
        }}

      />
      <drawer.Screen name="Bookings" component={Bookings}
        options={{
          headerShown: false,
          drawerLabel: '',
          drawerIcon: ({focused }) => (
            <View
            style={styles.tabStyleView}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                <Text style={[styles.screenname,{color:focused?Colors.buttoncolor:Colors.black}]}>Bookings</Text>
              </View>
            </View>
          ),
        }}

      />
           <drawer.Screen name="Reservations" component={Reservations}
        options={{
          headerShown: false,
          drawerLabel: '',
          drawerIcon: ({focused })=> (
            <View
            style={styles.tabStyleView}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                <Text style={[styles.screenname,{color:focused?Colors.buttoncolor:Colors.black}]}>Reservations</Text>
              </View>
            </View>
          ),
        }}

      />
               <drawer.Screen name="Promotion_Discount" component={Promotion_Discount}
        options={{
          headerShown: false,
          drawerLabel: '',
          drawerIcon: ({focused })=> (
            <View
            style={styles.tabStyleView}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                <Text style={[styles.screenname,{color:focused?Colors.buttoncolor:Colors.black}]}>Promotion & Discount</Text>
              </View>
            </View>
          ),
        }}
      />
      <drawer.Screen name="AboutUs" component={AboutUs}
        options={{
          headerShown: false,
          drawerLabel: '',
          drawerIcon:({focused }) => (
            <View
               style={styles.tabStyleView}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                <Text style={[styles.screenname,{color:focused?Colors.buttoncolor:Colors.black}]}>AboutUs</Text>
              </View>
            </View>
          ),
        }}

      />
           <drawer.Screen name="SupportChat" component={SupportChat}
        options={{
          headerShown: false,
          drawerLabel: '',
          drawerIcon: ({focused }) => (
            <View
            style={styles.tabStyleView}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                <Text style={[styles.screenname,{color:focused?Colors.buttoncolor:Colors.black}]}>Support Chat</Text>
              </View>
            </View>
          ),
        }}

      />
      {/* <drawer.Screen name="Emergency" component={Emergency}
        options={{
          headerShown: false,
          drawerLabel: '',
          drawerIcon: ({focused })=> (
            <View
            style={styles.tabStyleView}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                <Text style={[styles.screenname,{color:focused?Colors.buttoncolor:Colors.black}]}>Emergency</Text>
              </View>
            </View>
          ),
        }}

      /> */}
  
    </drawer.Navigator>
  )
}
export default Drawer