import React from 'react';
import { Animated, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
import { NavigationContainer } from '@react-navigation/native';
import { images, styles,Colors } from '../constant/Index';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Home from '../screens/driver/main/Home';
// import WalletEarning from '../screens/driver/main/WalletEarning';
import Chat from '../screens/driver/main/Chat';
import Notification from '../screens/driver/main/Notification';
import Profile from '../screens/driver/main/Profile';
import Toast from 'react-native-toast-message';
import Emergency from '../screens/driver/main/drawerscreens/Emergency';

const BottomNavigation = () => {
    const _renderIcon = (routeName, selectedTab) => {
        let icon;

        switch (routeName) {
            case 'Emergency':
                icon = images.EngyIcon;
                break;
            case 'Chat':
                icon = images.chatIcon;
                break;
            case 'Notification':
                icon = images.notifyIcon;
                break;
            case 'Profile':
                icon = images.profileIcon;
                break;
        }
        return (
            <Image
                source={icon}
                resizeMode="contain"
                style={{ height: wp(7), width: wp(7) }}
                tintColor={routeName === selectedTab ? '#4686D4' : '#C6DEFB'}
            />
        );
    };

  const renderTabBar = ({ routeName, selectedTab, navigate }) => {
         return (
             <TouchableOpacity
                 onPress={() => {
                    //  if (routeName === 'WalletEarning') {
                    //      Toast.show({
                    //          type: 'info',
                    //          text1: 'Coming Soon',
                    //          text2: 'This feature is under development',
                    //      });
                    //  } else {
                         navigate(routeName);
                    //  }
                 }}
                 style={styles.tabbarItem}>
                 {_renderIcon(routeName, selectedTab)}
             </TouchableOpacity>
         );
     };

    return (
        <CurvedBottomBar.Navigator
            type="DOWN"
            style={[styles.bottomBar, styles.customBarStyle]}
            shadowStyle={styles.shadow}
            circlePosition="CENTER"
            height={65}
            circleWidth={80}
            bgColor={Colors.inputColor}
            initialRouteName="Home" // Start with the Home screen
            borderTopLeftRight
            renderCircle={({ selectedTab, navigate }) => (
                <Animated.View style={[styles.btnCircleUp,{backgroundColor:selectedTab=='Home'?Colors.buttoncolor:'#C6DEFB'}]}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigate('Home')} // Navigate to Home when pressed
                    >
                        <Entypo name="home" color={"#FFFFFF"} size={30} />
                    </TouchableOpacity>
                </Animated.View>
            )}
            tabBar={renderTabBar}
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: true,
            }}>
            {/* Render Home Screen directly */}
            <CurvedBottomBar.Screen
                name="Home"
                position="CENTER"
                component={Home}
            />
            <CurvedBottomBar.Screen
                name="Emergency"
                position="LEFT"
                component={Emergency}
            />
            <CurvedBottomBar.Screen
                name="Chat"
                position="LEFT"
                component={Chat}
            />
            <CurvedBottomBar.Screen
                name="Notification"
                position="RIGHT"
                component={Notification}
            />
            <CurvedBottomBar.Screen
                name="Profile"
                position="RIGHT"
                component={Profile}
            />
        </CurvedBottomBar.Navigator>
    );
};

export default BottomNavigation;
