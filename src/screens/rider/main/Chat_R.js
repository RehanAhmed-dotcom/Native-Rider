import { FlatList, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState,useEffect, useCallback } from 'react'
import { images, fonts, Colors, styles } from '../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import database from '@react-native-firebase/database';
import { useSelector } from 'react-redux'
import moment from 'moment'

const Chat_R = ({ navigation }) => {

  const user = useSelector(state => state.user.user);

  const [List, setList] = useState([]);
  console.log('user data', List);

  
  const _usersList = useCallback(async () => {
    try {
      database()
        .ref('users/' + user?.email.replace(/[^a-zA-Z0-9 ]/g, ''))
        .on('value', dataSnapshot => {
          let users = [];
          dataSnapshot.forEach(child => {
            const userData = child.val();
            console.log('Fetched user data:', userData); // Log full userData

            // Check if image is defined and where it is being accessed from
            users.push({
              ...userData,
              imageUrl: userData?.user?.image, // Access the image URL from the user object
            });
          });
          console.log('Processed users:', users); // Log processed user array

          // Sort the users based on timestamp in descending order
          users.sort((a, b) => b.timestamp - a.timestamp);
          setList(users);
        });
    } catch (error) {
      console.error('Error fetching user list:', error);
    }
  }, [user.email]);

  useEffect(() => {
    _usersList();
  }, []);

  const renderItem = ({item, index}) => {
    //   const user = Array.isArray(allusers) ? allusers.find((userObj) => userObj.id === item.user.id) : null;

    return (
      <>
        <TouchableOpacity
          onPress={() => navigation.navigate('Conversation_R', {item2: item})}
          style={[
            {
              width: wp(90),
              height: wp(20),
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignSelf: 'center',
              borderBottomWidth: 1,
              borderBottomColor: Colors.grey,
            },
          ]}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View>
              <Image
                resizeMode="contain"
                style={{width: wp(12), height: wp(12), borderRadius: wp(6)}}
                source={
                  item?.user?.image ? {uri: item?.user?.image} : images.avatar
                }
              />
            </View>

            <View style={{marginLeft: wp(2), marginTop: wp(2)}}>
              <Text style={styles.flattoptext}>{item?.user?.username}</Text>
              <>
                <Text
                  style={[styles.chatdic, {marginRight: wp(3)}]}
                  numberOfLines={1}>
                  {item?.latestMessage}
                </Text>
              </>
            </View>
          </View>
          <View style={{}}>
            <Text style={[styles.chatdic,{fontSize:10}]}>
              {moment(item.timestamp).subtract(0, 'days').calendar()}
              {/* {moment(item?.timestamp).format('hh:mm: A')} */}
            </Text>
            {item.counter > 0 ? (
              <>
                {/* style={userstyle.countrview} */}
                <View
                  style={{
                    width: wp(5),
                    height: wp(5),
                    borderRadius: wp(3),
                    backgroundColor: Colors.buttoncolor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'flex-end',
                  }}>
                  <Text
                    style={{
                      color: '#263238',
                      fontSize: 12,
                      fontFamily: fonts.regular,
                    }}>
                    {item?.counter}
                  </Text>
                </View>
              </>
            ) : null}
          </View>
        </TouchableOpacity>
      </>
    );
  };

  const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  const { top, bottom } = useSafeAreaInsets();
  return (
    <View style={[styles.mainContainer,
    { paddingTop: Platform.OS == 'ios' ? top : 0 }]}>
      <View
        style={styles.HeaderView}>
        <Text style={styles.headerText}>Messages</Text>
      </View>
      <ScrollView>
      <View
          style={{
            flex: 1,
            marginLeft: wp(2),
            marginBottom: wp(3),
            marginTop: wp(5),
          }}>
          <FlatList
            data={List}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            ListEmptyComponent={() => {
              return (
                <View style={{marginTop: wp(65)}}>
                  <View
                    style={{
                      paddingVertical: wp(2),
                      marginHorizontal: wp(3),
                      alignSelf: 'center',
                    }}>
                    {/* <Image
                                        resizeMode='contain' style={{ width: wp(12), height: wp(12), borderRadius: wp(6) }}
                                        source={images.avatar}
                                     /> */}
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: fonts.bold,
                        color: Colors.black,
                      }}>
                      No Chat Yet
                    </Text>
                  </View>
                </View>
              );
            }}
          />

        
        </View>
        {/* <View style={{}}>
          <FlatList
            data={notificationData}
            inverted
            renderItem={({ item }) => {
              return (
                <TouchableOpacity onPress={() => navigation.navigate('Conversation')} style={styles.messagesView}>
                  <View style={{ flexDirection: 'row', }}>
                    <View>
                      <Image
                        resizeMode='contain' style={{ width: wp(12), height: wp(12), borderRadius: wp(6) }}
                        source={item.image} />
                    </View>
                    <View style={{ marginLeft: wp(2), }}>
                      <Text style={styles.flattoptext}>{item?.username}</Text>
                      <>
                        <Text style={[styles.chatdic, { marginRight: wp(3) }]} numberOfLines={1}>
                          {item?.latestMessage}
                        </Text>
                      </>
                    </View>
                    <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end',marginBottom:wp(2),width:wp(18) }}>
                      <Text style={[styles.chatdic, { fontSize: 10,textAlign:'right',maxWidth:wp(20) }]} >
                        {item?.time}
                      </Text>
                    </View>
                  </View>

                </TouchableOpacity>
              )
            }}
          />
        </View> */}
      </ScrollView>
    </View>
  )
}

export default Chat_R
