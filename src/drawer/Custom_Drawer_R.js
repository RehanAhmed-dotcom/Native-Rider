import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {images, fonts, Colors, styles} from '../constant/Index';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setUser, setUserType} from '../redux/Auth';
import {setOnboardingFalse} from '../redux/OnboardingSlice';
import Toast from 'react-native-toast-message';
import {AllGetAPI, PostAPiwithToken} from '../components/ApiRoot';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import DeleteIcon from 'react-native-vector-icons/MaterialIcons';
const Custom_Drawer_R = props => {
  const dispatch = useDispatch();
  const usertype = useSelector(state => state.user.usertype);
  const user = useSelector(state => state.user.user);
  const [confirmdelete, setConfrimDelete] = useState(false);
  const [myType, setMyType] = useState(null);
  const [confirm, setConfrim] = useState(false);
  const [confirmSout, setConfrimSout] = useState(false);
  const navigation = useNavigation();
  const closemodaldelete = () => {
    setConfrimDelete(false);
  };
  const closemodal = () => {
    setConfrim(false);
  };

  const closemodalSout = () => {
    setConfrimSout(false);
  };

  const handleSwitchUserType = () => {
    const newUserType = usertype === 'Driver' ? 'Rider' : 'Driver';
    dispatch(setUserType(newUserType));
    setMyType(newUserType);
    EditProfileApi();
  };
  const deleteAccount = () => {
    AllGetAPI({url: 'user-delete', Token: user?.api_token})
      .then(res => {
        console.log('response delete account', res);
      })
      .catch(err => {
        console.log('api error', err);
      });
  };
  const EditProfileApi = () => {
    const token = user.api_token;
    const formdata = new FormData();
    formdata.append('type', 'Rider');
    PostAPiwithToken({url: 'edit', Token: token}, formdata)
      .then(res => {
        console.log('response data-------', res);
        if (res.status === 'success') {
          dispatch(setUserType('Rider'));
          dispatch(setUser(res.userdata));
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Switch to Driver side Successfully!',
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
          console.log('mydata', res);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            topOffset: Platform.OS === 'ios' ? 50 : 0,
            visibilityTime: 3000,
            autoHide: true,
          });
        }
        console.log('res of register ', res);
      })
      .catch(err => {
        console.log('api error', err);
      });
  };
  const {top, bottom} = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.white,
        borderBottomRightRadius: wp(10),
        paddingTop: Platform.OS == 'ios' ? top : 0,
      }}>
      {/* Fixed Header with Logo */}
      <View style={{padding: wp(4), alignItems: 'center'}}>
        <Image
          source={images.logopic}
          resizeMode="contain"
          style={{width: wp(35), height: wp(35)}}
        />
      </View>

      {/* Scrollable Drawer Items */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{flexGrow: 1, paddingBottom: wp(20)}}>
        <View style={{marginTop: wp(2)}}>
          <DrawerItemList {...props} />
        </View>
        <TouchableOpacity
          onPress={() => setConfrim(true)}
          style={[
            styles.tabStyleView,
            {
              alignSelf: 'center',
              width: wp(30),
              marginRight: wp(4),
              paddingVertical: wp(2),
            },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={[
                styles.screenname,
                {color: Colors.black, textAlign: 'center'},
              ]}>
              Switch to Rider
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setConfrimDelete(true)}
          style={[
            styles.tabStyleView,
            {
              alignSelf: 'center',
              width: wp(30),
              marginRight: wp(4),
              paddingVertical: wp(2),
            },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={[
                styles.screenname,
                {color: Colors.black, textAlign: 'center'},
              ]}>
              Delete Account
            </Text>
          </View>
        </TouchableOpacity>
      </DrawerContentScrollView>

      {/* Fixed Logout Button at Bottom */}
      <View
        style={{
          padding: wp(4),
          borderTopWidth: 1,
          borderTopColor: Colors.gray,
        }}>
        <TouchableOpacity
          onPress={() => setConfrimSout(true)}
          style={[styles.row]}
          activeOpacity={0.7}>
          <Text style={{color: Colors.white, fontWeight: 'bold', fontSize: 15}}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>

      {/* Switch to Rider Modal */}
      <Modal
        transparent={true}
        visible={confirm}
        onRequestClose={closemodal}
        animationType="none">
        <View style={styles.modalTopView}>
          <View style={styles.modalsecondView}>
            <View>
              <Image
                source={images.switchtoImg}
                resizeMode="contain"
                style={{width: wp(35), height: wp(35), alignSelf: 'center'}}
              />
            </View>
            <View
              style={{
                alignSelf: 'center',
                marginHorizontal: wp(13),
                marginTop: wp(5),
              }}>
              <Text style={styles.modalText}>
                Are you sure you want to switch to Rider?
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: wp(7),
                marginTop: wp(5),
              }}>
              <TouchableOpacity
                onPress={() => EditProfileApi()}
                style={styles.modalbutton1}>
                <Text style={[styles.titleText, {fontSize: 14}]}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => closemodal()}
                style={styles.modalbutton2}>
                <Text
                  style={[styles.titleText, {color: '#D63544', fontSize: 14}]}>
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logout Modal */}
      <Modal
        transparent={true}
        visible={confirmSout}
        onRequestClose={closemodalSout}
        animationType="none">
        <View style={styles.modalTopView}>
          <View style={styles.modalsecondView}>
            <View>
              <Image
                source={images.signoutImg}
                resizeMode="contain"
                style={{width: wp(35), height: wp(35), alignSelf: 'center'}}
              />
            </View>
            <View
              style={{
                alignSelf: 'center',
                marginHorizontal: wp(17),
                marginTop: wp(5),
              }}>
              <Text style={styles.modalText}>
                Are you sure you want to Log Out?
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: wp(7),
                marginTop: wp(5),
              }}>
              <TouchableOpacity
                onPress={() => {
                  dispatch(setUser(null));
                  closemodalSout();
                }}
                style={styles.modalbutton1}>
                <Text style={[styles.titleText, {fontSize: 14}]}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => closemodalSout()}
                style={styles.modalbutton2}>
                <Text
                  style={[styles.titleText, {color: '#D63544', fontSize: 14}]}>
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={confirmdelete}
        onRequestClose={closemodaldelete}
        animationType="none">
        <View style={styles.modalTopView}>
          <View style={styles.modalsecondView}>
            <View style={{alignSelf: 'center'}}>
              {/* <Image
                source={images.signoutImg}
                resizeMode="contain"
                style={{width: wp(35), height: wp(35), alignSelf: 'center'}}
              /> */}
              <DeleteIcon name={'delete-forever'} color={'red'} size={50} />
            </View>
            <View
              style={{
                alignSelf: 'center',
                marginHorizontal: wp(17),
                marginTop: wp(5),
              }}>
              <Text style={styles.modalText}>
                Are you sure you want to delete your account?
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: wp(7),
                marginTop: wp(5),
              }}>
              <TouchableOpacity
                onPress={() => {
                  dispatch(setUser(null)), deleteAccount(), closemodaldelete();
                }}
                style={styles.modalbutton1}>
                <Text style={[styles.titleText, {fontSize: 14}]}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => closemodaldelete()}
                style={styles.modalbutton2}>
                <Text
                  style={[styles.titleText, {color: '#D63544', fontSize: 14}]}>
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Custom_Drawer_R;
