// import {Platform, SafeAreaView, StyleSheet, Text, View} from 'react-native';
// import React, {useEffect} from 'react';
// import StackNavigation from './src/navigation/StackNavigation';
// import Toast from 'react-native-toast-message';
// import {Provider} from 'react-redux';
// import {PersistGate} from 'reduxjs-toolkit-persist/integration/react';
// import persistStore from 'redux-persist/es/persistStore';
// import Store from './src/redux/Store';
// import {requestNotifications} from 'react-native-permissions';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import 'react-native-get-random-values';
// import messaging from '@react-native-firebase/messaging';
// import PushNotification from 'react-native-push-notification';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import {StripeProvider} from '@stripe/stripe-react-native';
// const persistor = persistStore(Store);

// const App = () => {
//   useEffect(() => {
//     requestNotifications(['alert', 'sound']).then(({status, settings}) => {});
//   }, []);

//   useEffect(() => {
//     const unsubscribe = messaging().onMessage(async remoteMessage => {
//       console.log('Foreground notification:', remoteMessage);

//       // Display the notification using PushNotification (or any other method)
//       PushNotification.localNotification({
//         channelId: 'fcm_fallback_notification_channel',
//         title: remoteMessage.notification.title,
//         message: remoteMessage.notification.body,
//       });
//     });

//     return unsubscribe;
//   }, []);

//   useEffect(() => {
//     const requestPermission = async () => {
//       const authStatus = await messaging().requestPermission();
//       const enabled =
//         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//       if (enabled) {
//         console.log('Notification permission granted:', authStatus);
//       }
//     };

//     requestPermission();
//   }, []);
//   const toastConfig = {
//     success: ({text1, props, ...rest}) => (
//       <View
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           backgroundColor: '#FFFFFF',
//           width: wp(100),
//           padding: 25,
//           borderBottomLeftRadius: 30,
//           borderBottomRightRadius: 30,
//           elevation: 2,
//           // marginHorizontal: 20,
//           marginTop: 0,
//         }}>
//         {/* Custom Image/Icon */}
//         {/* <Image
//           source={ require('../../../Documents/MyProjects/nativerider/src/assets/checkIcon.png')}
//           style={{ width: 20, height: 20, marginRight: 10 }}
//         /> */}
//         <Icon
//           name="check-circle"
//           size={24}
//           color="#22BB55"
//           style={{marginRight: 10}}
//         />
//         {/* Text Content */}
//         <View>
//           <Text style={{fontWeight: 'bold', color: '#22BB55'}}>{text1}</Text>
//           {rest.text2 && (
//             <Text style={{color: '#000000', fontSize: 12}}>{rest.text2}</Text>
//           )}
//         </View>
//       </View>
//     ),
//     error: ({text1, text2, ...rest}) => (
//       <View
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           backgroundColor: '#FFFFFF',
//           width: wp(100),
//           padding: 25,
//           borderBottomLeftRadius: 30,
//           borderBottomRightRadius: 30,
//           paddingHorizontal: wp(4),
//           elevation: 2,
//           // marginHorizontal: 20,

//           marginTop: 0,
//         }}>
//         <Icon name="error" size={24} color="red" style={{marginRight: 10}} />
//         <View>
//           <Text style={{fontWeight: 'bold', color: 'red'}}>{text1}</Text>
//           {text2 && (
//             <Text style={{color: '#000000', fontSize: 12, marginRight: wp(4)}}>
//               {text2}
//             </Text>
//           )}
//         </View>
//       </View>
//     ),
//   };
//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,

//         backgroundColor: '#FAFCF7',
//       }}>
//       <StripeProvider
//         publishableKey="pk_live_51RayjmJR6p2mx5FeglMSgj8HXAUk5ObFEYAgYpqJgJoBPh0mb0PYxuLUYzxAeyztw4w4NDyLrs5bmg7D7JSG66xL00ykkzYtke"
//         // merchantIdentifier=""
//       >
//         <Provider store={Store}>
//           <PersistGate persistor={persistor}>
//             <>
//               <StackNavigation />
//               <Toast config={toastConfig} />
//             </>
//           </PersistGate>
//         </Provider>
//       </StripeProvider>
//     </SafeAreaView>
//   );
// };
// export default App;

import React, {useEffect} from 'react';
import {Platform, StatusBar, StyleSheet, Text, View} from 'react-native';
import StackNavigation from './src/navigation/StackNavigation';
import Toast from 'react-native-toast-message';
import {Provider} from 'react-redux';
import {PersistGate} from 'reduxjs-toolkit-persist/integration/react';
import persistStore from 'redux-persist/es/persistStore';
import Store from './src/redux/Store';
import {requestNotifications} from 'react-native-permissions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import 'react-native-get-random-values';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StripeProvider} from '@stripe/stripe-react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

const persistor = persistStore(Store);

const App = () => {
  useEffect(() => {
    requestNotifications(['alert', 'sound']).then(({status, settings}) => {});
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification:', remoteMessage);

      PushNotification.localNotification({
        channelId: 'fcm_fallback_notification_channel',
        title: remoteMessage.notification?.title,
        message: remoteMessage.notification?.body,
      });
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Notification permission granted:', authStatus);
      }
    };

    requestPermission();
  }, []);

  const toastConfig = {
    success: ({text1, props, ...rest}) => (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          width: wp(100),
          padding: 25,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.2,
          shadowRadius: 3,
        }}>
        <Icon
          name="check-circle"
          size={24}
          color="#22BB55"
          style={{marginRight: 10}}
        />
        <View>
          <Text style={{fontWeight: 'bold', color: '#22BB55'}}>{text1}</Text>
          {rest.text2 && (
            <Text style={{color: '#000000', fontSize: 12}}>{rest.text2}</Text>
          )}
        </View>
      </View>
    ),
    error: ({text1, text2, ...rest}) => (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          width: wp(100),
          padding: 25,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          paddingHorizontal: wp(4),
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.2,
          shadowRadius: 3,
        }}>
        <Icon name="error" size={24} color="red" style={{marginRight: 10}} />
        <View>
          <Text style={{fontWeight: 'bold', color: 'red'}}>{text1}</Text>
          {text2 && (
            <Text style={{color: '#000000', fontSize: 12, marginRight: wp(4)}}>
              {text2}
            </Text>
          )}
        </View>
      </View>
    ),
  };

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FAFCF7"
        translucent={false}
      />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#FAFCF7',
        }}
        edges={['bottom']}>
        <StripeProvider publishableKey="pk_live_51RayjmJR6p2mx5FeglMSgj8HXAUk5ObFEYAgYpqJgJoBPh0mb0PYxuLUYzxAeyztw4w4NDyLrs5bmg7D7JSG66xL00ykkzYtke">
          <Provider store={Store}>
            <PersistGate persistor={persistor}>
              <>
                <StackNavigation />
                <Toast config={toastConfig} />
              </>
            </PersistGate>
          </Provider>
        </StripeProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
