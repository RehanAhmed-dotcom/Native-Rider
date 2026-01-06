import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {images, fonts, Colors, styles} from '../../../constant/Index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import {useSelector} from 'react-redux';
import {recieverMsg, senderMsg} from '../../../components/ChatComponent';
import moment from 'moment';
import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';
import {PostAPiwithToken} from '../../../components/ApiRoot';

const Conversation = ({navigation, route}) => {
  const {item} = route.params;
  const item2 = route.params.item2;
  const user = useSelector(state => state.user.user);
  console.log('itemmmmm', item);
  console.log('itemmmmm2', item2);

  const dataToUse = item;
  const scrollViewRef = useRef();
  const flatListRef = useRef();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [stickyDate, setStickyDate] = useState('');
  const [itemLayouts, setItemLayouts] = useState([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const guestData = {
    username: dataToUse?.name || item2?.user?.username || item2?.driver?.name,
    email: dataToUse?.email || item2?.user?.email || item2?.driver?.email,
    image: dataToUse?.image || item2?.user?.image || item2?.driver?.image,
    id: dataToUse?.id || item2?.user?.id || item2?.driver?.id,
  };

  const userData2 = {
    username: user?.name,
    email: user?.email,
    image: user?.image,
    id: user?.id,
  };

  const [keyboardStatus, setKeyboardStatus] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // Request notification permission
  const requestNotificationPermission = async () => {
    try {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission granted');
        } else {
          console.log('Notification permission denied');
        }
      } else if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
          console.log('Authorization status:', authStatus);
        } else {
          console.log('Notification permission denied on iOS');
        }
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  // Store FCM token
  const storeFcmToken = async () => {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const fcmToken = await messaging().getToken();
      console.log('FCM Token:', fcmToken);

      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('fcmToken', fcmToken);
      await PostAPiwithToken(
        {
          url: 'store-fcm-token',
          Token: user.api_token,
        },
        formData,
      ).then(res => {
        console.log('FCM token stored:', res);
      });
    } catch (error) {
      console.error('Error storing FCM token:', error);
    }
  };

  // Handle token refresh
  useEffect(() => {
    const unsubscribe = messaging().onTokenRefresh(async token => {
      console.log('FCM Token refreshed:', token);
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('fcmToken', token);
      await PostAPiwithToken(
        {
          url: 'store-fcm-token',
          Token: user.api_token,
        },
        formData,
      );
    });
    return unsubscribe;
  }, []);

  // Handle foreground notifications
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Message received in foreground:', remoteMessage);
      // Optionally display a notification using Notifee or Alert
      // Example: Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
    });
    return unsubscribe;
  }, []);

  // Handle notification opened from background or quit state
  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
          // Navigate to the chat screen if needed
          // Example: navigation.navigate('Conversation', { item: remoteMessage.data });
        }
      });

    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background:',
        remoteMessage,
      );
      // Navigate to the chat screen
      // Example: navigation.navigate('Conversation', { item: remoteMessage.data });
    });
    return unsubscribe;
  }, []);

  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = itemLayouts.findIndex(
      layout => offsetY <= layout.y + layout.height,
    );
    if (index >= 0 && index < messages.length) {
      const formattedDate = formatDate(messages[index].date);
      setStickyDate(formattedDate);
    }
  };

  const formatDate = date => {
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'days').startOf('day');
    const providedDate = moment(date);
    if (providedDate.isSame(today, 'day')) {
      return 'Today';
    } else if (providedDate.isSame(yesterday, 'day')) {
      return 'Yesterday';
    } else {
      return moment(date).format('MMM D, YYYY');
    }
  };

  const handleItemLayout = index => event => {
    const layout = event.nativeEvent.layout;
    setItemLayouts(prevLayouts => {
      const updatedLayouts = [...prevLayouts];
      updatedLayouts[index] = layout;
      return updatedLayouts;
    });
  };

  useEffect(() => {
    const onKeyboardDidShow = e => {
      setKeyboardHeight(e.endCoordinates.height);
      setKeyboardVisible(true);
    };

    const onKeyboardDidHide = () => {
      setKeyboardHeight(0);
      setKeyboardVisible(false);
    };

    const showSubscription = Keyboard.addListener(
      'keyboardDidShow',
      onKeyboardDidShow,
    );
    const hideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      onKeyboardDidHide,
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const _chatUsers = async () => {
    try {
      const userRef = database()
        .ref('users/' + user.email.replace(/[^a-zA-Z0-9 ]/g, ''))
        .child(guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''));
      const guestRef = database()
        .ref('users/' + guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''))
        .child(user.email.replace(/[^a-zA-Z0-9 ]/g, ''));
      await userRef.set({
        latestMessage: message,
        timestamp: database.ServerValue.TIMESTAMP,
        counter: 0,
        user: guestData,
      });
      await guestRef.transaction(currentData => {
        if (currentData) {
          return {
            ...currentData,
            latestMessage: message,
            timestamp: database.ServerValue.TIMESTAMP,
            counter: (currentData.counter || 0) + 1,
            user: userData2,
          };
        }
        return {
          latestMessage: message,
          timestamp: database.ServerValue.TIMESTAMP,
          counter: 1,
          user: userData2,
        };
      });
    } catch (error) {
      console.error('Error in creating chat:', error);
    }
  };

  const _updateChatCount = async () => {
    try {
      const userRef = database()
        .ref('users/' + user.email.replace(/[^a-zA-Z0-9 ]/g, ''))
        .child(guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''));
      await userRef.update({counter: 0});
    } catch (error) {
      console.error('Error in updating chat count:', error);
    }
  };

  const Send_notifi = async () => {
    try {
      const data = new FormData();
      data.append('userId', item2?.user?.id || dataToUse?.id);
      data.append('title', `${user?.name} messaged you`);
      data.append('message', message);
      data.append('type', 'message');
      data.append(
        'chatId',
        `${user.email.replace(/[^a-zA-Z0-9 ]/g, '')}_${guestData.email.replace(
          /[^a-zA-Z0-9 ]/g,
          '',
        )}`,
      );

      const response = await PostAPiwithToken(
        {
          url: 'chat-notifications',
          Token: user.api_token,
        },
        data,
      );
      console.log('Notification API response:', response);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const _getMeesages = async () => {
    try {
      database()
        .ref('messeges')
        .child(user.email.replace(/[^a-zA-Z0-9 ]/g, ''))
        .child(guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''))
        .on('value', dataSnapshot => {
          let msgs = [];
          dataSnapshot.forEach(child => {
            msgs.push({
              sendBy: child.val().messege.sender,
              receivedBy: child.val().messege.reciever,
              msg: child.val().messege.msg,
              date: child.val().messege.date,
            });
            return undefined;
          });
          setMessages(msgs.reverse());
        });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    requestNotificationPermission();
    storeFcmToken();
    _getMeesages();
    _updateChatCount();
  }, []);

  const handleSend = async () => {
    try {
      if (message) {
        const msg = {
          message,
          sender: user.email.replace(/[^a-zA-Z0-9 ]/g, ''),
          receiver: guestData.email.replace(/[^a-zA-Z0-9 ]/g, ''),
          date: Date.now(),
        };
        await senderMsg(msg.message, msg.sender, msg.receiver, msg.date);
        await _chatUsers();
        await recieverMsg(msg.message, msg.sender, msg.receiver, msg.date);
        await _chatUsers();
        await Send_notifi(); // Ensure this is awaited
        setMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const ChatList = ({item, index}) => {
    const isMe = item.sendBy === user.email.replace(/[^a-zA-Z0-9 ]/g, '');
    const isLastItem = index === messages?.length - 1;
    return (
      <>
        {item.receivedBy === user.email.replace(/[^a-zA-Z0-9 ]/g, '') && (
          <View style={{marginHorizontal: wp(4)}}>
            <View style={[styles.myMessagereceive]}>
              <Image
                source={
                  guestData?.image ? {uri: guestData.image} : images.avatar
                }
                style={[styles.avatar, {}]}
              />
              <View style={[styles.userBubble]}>
                <Text style={[styles.messageText, {color: 'black'}]}>
                  {item.msg}
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.messageTime,
                {textAlign: 'left', marginLeft: wp(14), marginTop: wp(-1)},
              ]}>
              {moment(item.date).subtract(0, 'days').calendar()}
            </Text>
          </View>
        )}
        {item.sendBy === user.email.replace(/[^a-zA-Z0-9 ]/g, '') && (
          <View style={{marginHorizontal: wp(4)}}>
            <View style={[styles.myMessage]}>
              <View style={[styles.myBubble]}>
                <Text style={[styles.messageText, {color: 'white'}]}>
                  {item.msg}
                </Text>
              </View>
              <Image
                source={
                  userData2?.image ? {uri: userData2.image} : images.avatar
                }
                style={[styles.avatar, {marginLeft: wp(2)}]}
              />
            </View>
            <Text
              style={[
                styles.messageTime,
                {textAlign: 'right', marginRight: wp(16), marginTop: wp(-1)},
              ]}>
              {moment(item.date).subtract(0, 'days').calendar()}
            </Text>
          </View>
        )}
      </>
    );
  };

  const {top, bottom} = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS === 'ios' ? top : 0},
      ]}>
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : keyboardStatus === true
            ? 'height'
            : 'undefined'
        }
        style={{flex: 1, paddingBottom: keyboardStatus ? wp(6) : wp(0)}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp(0) : hp(2)}>
        <Header head="Conversation" onPress={() => navigation.goBack()} />
        <View
          style={{
            flex: 1,
            marginLeft: wp(2),
            marginBottom: isKeyboardVisible ? wp(8) : wp(1),
            marginTop: wp(4),
          }}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({item, index}) => (
              <View
                style={{marginBottom: wp(1)}}
                onLayout={handleItemLayout(index)}>
                <ChatList item={item} index={index} />
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            inverted
          />
          <View style={{marginBottom: wp(18)}}></View>
        </View>

        {/* <View> */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            position: 'absolute',
            bottom: Platform.OS === 'ios' && isKeyboardVisible ? wp(65) : wp(5),
            alignSelf: 'center',
            width: wp(90),
            paddingHorizontal: wp(4),
            height: wp(13),
            borderWidth: 1,
            borderRadius: wp(2),
            borderColor: Colors.buttoncolor,
          }}>
          <TextInput
            style={styles.inputtext}
            placeholder="Type your message"
            placeholderTextColor={'grey'}
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity
            onPress={handleSend}
            style={[
              styles.sendButton,
              {backgroundColor: message ? '#3A7BD5' : '#C6DEFB'},
            ]}>
            <Image
              source={images.rightarrow}
              resizeMode="contain"
              style={{width: wp(6), height: wp(6)}}
              tintColor={Colors.white}
            />
          </TouchableOpacity>
          {/* </View> */}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Conversation;
