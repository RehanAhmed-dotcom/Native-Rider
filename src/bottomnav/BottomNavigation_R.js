import React from 'react';
import { Animated, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
import { NavigationContainer } from '@react-navigation/native';
import { styles, Colors, images } from '../constant/Index';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Home_R from '../screens/rider/main/Home_R';
import WalletEarning_R from '../screens/rider/main/WalletEarning_R';
import Chat_R from '../screens/rider/main/Chat_R';
import Notification_R from '../screens/rider/main/Notification_R';
import Profile_R from '../screens/rider/main/Profile_R';
import Toast from 'react-native-toast-message';

const BottomNavigation_R = () => {

    const _renderIcon = (routeName, selectedTab) => {
        let icon;

        switch (routeName) {
            case 'WalletEarning_R':
                icon = images.wearning;
                break;
            case 'Chat_R':
                icon = images.chatIcon;
                break;
            case 'Notification_R':
                icon = images.notifyIcon;
                break;
            case 'Profile_R':
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
                    // if (routeName === 'WalletEarning_R') {
                    //     Toast.show({
                    //         type: 'info',
                    //         text1: 'Coming Soon',
                    //         text2: 'This feature is under development',
                    //     });
                    // } else {
                        navigate(routeName);
                    // }
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
            bgColor="white"
            initialRouteName="Home_R" // Start with the Home screen
            borderTopLeftRight

            renderCircle={({ selectedTab, navigate }) => (
                <Animated.View style={[styles.btnCircleUp, { backgroundColor: selectedTab == 'Home_R' ? Colors.buttoncolor : '#C6DEFB' }]}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigate('Home_R')} // Navigate to Home when pressed
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
                name="Home_R"
                position="CENTER"
                component={Home_R}
            />
            <CurvedBottomBar.Screen
                name="WalletEarning_R"
                position="LEFT"
                component={WalletEarning_R}
            />
            <CurvedBottomBar.Screen
                name="Chat_R"
                position="LEFT"
                component={Chat_R}
            />
            <CurvedBottomBar.Screen
                name="Notification_R"
                position="RIGHT"
                component={Notification_R}
            />
            <CurvedBottomBar.Screen
                name="Profile_R"
                position="RIGHT"
                component={Profile_R}
            />
        </CurvedBottomBar.Navigator>
    )
}

export default BottomNavigation_R
