import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image,
  Keyboard,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import database from '@react-native-firebase/database';
import {images, fonts, Colors, styles} from '../../../../constant/Index';
import ArrowBack from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import {
  senderMsgSupport,
  recieverMsgSupport,
} from '../../../../lib/MessageUtil';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const SupportChat_R = ({navigation, route}) => {
  //   const { item } = route.params;
  const {user} = useSelector(state => state.user);
  console.log('user nameddddd', user);
  const {top} = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const guestData = {
    username: 'admin',
    email: 'admin@gmail.com',
    id: 12345678,
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

  const sanitizeEmail = email => email.replace(/[^a-zA-Z0-9]/g, '');

  const checkUser = emailCheck => {
    return sanitizeEmail(user?.email) === emailCheck;
  };

  const _getMessages = () => {
    database()
      .ref('messegesSupport')
      .child(sanitizeEmail(user?.email))
      .child(sanitizeEmail(guestData?.email))
      .on('value', snapshot => {
        let msgs = [];
        snapshot.forEach(child => {
          msgs.push({
            sendBy: child?.val()?.messege?.sender,
            msg: child?.val()?.messege?.msg,
            date: child?.val()?.messege?.date,
            id: child?.val()?.messege?._id,
          });
        });
        setMessages(msgs.reverse());
      });
  };

  const _updateChatCount = () => {
    database()
      .ref('UsersSupport/' + sanitizeEmail(user?.email))
      .child(sanitizeEmail(guestData?.email))
      .update({counter: 0});
  };

  const _chatUsers = () => {
    const myUser = {
      username: `${user?.name} ${user?.lastname || ''}`,
      email: user?.email,
      id: user?.id,
    };

    database()
      .ref('UsersSupport/' + sanitizeEmail(user?.email))
      .child(sanitizeEmail(guestData?.email))
      .set({
        latestMessage: message,
        timestamp: database.ServerValue.TIMESTAMP,
        counter: 0,
        user: guestData,
      });

    database()
      .ref('UsersSupport/' + sanitizeEmail(guestData.email))
      .child(sanitizeEmail(user?.email))
      .once('value', snapshot => {
        const counts = snapshot?.val()?.counter || 0;
        database()
          .ref('UsersSupport/' + sanitizeEmail(guestData.email))
          .child(sanitizeEmail(user?.email))
          .set({
            latestMessage: message,
            timestamp: database.ServerValue.TIMESTAMP,
            counter: counts + 1,
            user: myUser,
          });
      });
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    setMessage('');
    const variabele = await database()
      .ref('messegesSupport/' + sanitizeEmail(user?.email))
      .child(sanitizeEmail(guestData?.email))
      .push();
    const childKey = variabele.key;

    senderMsgSupport(
      message,
      sanitizeEmail(user?.email),
      sanitizeEmail(guestData?.email),
      Date.now(),
      childKey,
    );

    recieverMsgSupport(
      message,
      sanitizeEmail(user?.email),
      sanitizeEmail(guestData?.email),
      Date.now(),
      childKey,
    );

    _chatUsers();
  };

  useEffect(() => {
    _getMessages();
    _updateChatCount();
  }, []);

  const renderItem = ({item}) => (
    <View
      style={{
        flexDirection: 'row',
        alignSelf: checkUser(item.sendBy) ? 'flex-end' : 'flex-start',
        marginVertical: 5,
        marginHorizontal: 10,
      }}>
      <View
        style={{
          backgroundColor: checkUser(item.sendBy)
            ? Colors.buttoncolor
            : 'white',
          padding: 10,
          borderRadius: 10,
          maxWidth: 290,
        }}>
        <Text
          style={{
            color: checkUser(item.sendBy) ? 'white' : 'black',
            fontFamily: fonts.medium,
            lineHeight: 19,
          }}>
          {item.msg}
        </Text>
        <Text
          style={{
            color: checkUser(item.sendBy) ? 'white' : '#A1A1A1',
            fontSize: 10,
            marginTop: 5,
            fontFamily: fonts.medium,
            textAlign: 'right',
          }}>
          {/* {moment(Number(item.date)).format('DD-MM-YYYY HH:mm')} */}
          {moment(Number(item.date)).subtract(0, 'days').calendar()}
        </Text>
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.mainContainer,
        {paddingTop: Platform.OS == 'ios' ? top : 0},
      ]}>
      {/* <StatusBar translucent backgroundColor={'transparent'} barStyle={'dark-content'} /> */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp(0) : hp(2)}>
        <View style={styles.HeaderView}>
          <Text style={styles.headerText}>Customer Service</Text>
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{position: 'absolute', left: wp(4)}}
            activeOpacity={0.7}>
            <Image
              source={images.menuIcon}
              resizeMode="contain"
              style={{width: wp(6), height: wp(6)}}
            />
          </TouchableOpacity>
        </View>
        {messages?.length === 0 ? (
          <View
            style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <Image
              source={require('../../../../assets/customerpic.png')}
              resizeMode="contain"
              style={{width: wp(80), height: wp(50), alignSelf: 'center'}}
            />
            <Text
              style={{
                fontSize: 10,
                fontFamily: fonts.bold,
                color: Colors.black,
                textAlign: 'center',
                marginTop: wp(4),
                marginHorizontal: wp(6),
                lineHeight: 25,
              }}>
              Hi customer, thanks for contacting us. We understand there may be
              a problem with your order. We’re looking into it right now, and
              we’ll get back to you as soon as we find out what’s going on.
            </Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            inverted
            renderItem={renderItem}
            keyExtractor={item => item.id}
            style={{flex: 1}}
          />
        )}
        <View style={{marginBottom: wp(20)}}></View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            position: 'absolute',
            bottom: Platform.OS === 'ios' && isKeyboardVisible ? wp(73) : wp(5),
            alignSelf: 'center',
            width: wp(90),
            paddingHorizontal: wp(4),
            height: wp(13),
            borderWidth: 1,
            borderRadius: wp(2),
            borderColor: Colors.buttoncolor,
          }}>
          {/* <View
          style={{
            padding: 10,
            backgroundColor: Colors.white,
            borderTopWidth: 1,
            borderColor: '#EDF1F3',
          }}
        > */}
          <TextInput
            placeholder="Type your message..."
            placeholderTextColor={'#A1A1A1'}
            multiline
            style={styles.inputtext}
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
        </View>
        {/* </View> */}
      </KeyboardAvoidingView>
    </View>
  );
};

export default SupportChat_R;
