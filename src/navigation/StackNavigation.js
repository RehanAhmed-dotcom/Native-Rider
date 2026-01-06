import { Button, StyleSheet, Text, View } from 'react-native';
import React, { Fragment, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding1 from '../screens/driver/auth/Onboarding1';
import Onboarding2 from '../screens/driver/auth/Onboarding2';
import Onboarding3 from '../screens/driver/auth/Onboarding3';
import GetStarted from '../screens/driver/auth/GetStarted';
import Selection from '../screens/driver/auth/Selection';
// import SelectVehicle from '../screens/driver/auth/SelectVehicle';
import Welcome from '../screens/driver/auth/Welcome';
import Login_D from '../screens/driver/auth/Login_D';
import SignUp_D from '../screens/driver/auth/SignUp_D';
import Forget_D from '../screens/driver/auth/Forget_D';
import ForgetOtp_D from '../screens/driver/auth/ForgetOtp_D';
import UpgradePassword_D from '../screens/driver/auth/UpgradePassword_D';
import AddCredit from '../screens/driver/auth/AddCredit';
import AccountVerification_D from '../screens/driver/auth/AccountVerification_D';
import AccountVerifyOtp_D from '../screens/driver/auth/AccountVerifyOtp_D';
import EditProfile from '../screens/driver/main/EditProfile';
import ChangePassword from '../screens/driver/main/ChangePassword';
import UtilityOption from '../screens/driver/main/UtilityOption';
import SelectMainVehicle from '../screens/driver/main/SelectMainVehicle';
import VehicleStyle from '../screens/driver/main/VehicleStyle';
import RiderDetails from '../screens/driver/main/RiderDetails';
import Drawer from '../drawer/Drawer';
import BookingDetails from '../screens/driver/main/BookingDetails';
import EmergencyContacts from '../screens/driver/main/EmergencyContacts';
import Requesting from '../screens/driver/main/Requesting';
import SelectContactsForRide from '../screens/driver/main/SelectContactsForRide';
import Conversation from '../screens/driver/main/Conversation';
import ReachedMap from '../screens/driver/main/ReachedMap';
import PayNow from '../screens/driver/main/PayNow';
import AddCredit2 from '../screens/driver/main/AddCredit2';
import Feedback from '../screens/driver/main/Feedback';
import Login_R from '../screens/rider/auth/Login_R';
import Welcome_R from '../screens/rider/auth/Welcome_R';
import SignUp_R from '../screens/rider/auth/SignUp_R';
import VehicleRegistration from '../screens/rider/auth/VehicleRegistration';
import AccountVerification_R from '../screens/rider/auth/AccountVerification_R';
import AccountVerifyOtp_R from '../screens/rider/auth/AccountVerifyOtp_R';
import AddCredit_R from '../screens/rider/auth/AddCredit_R';
import Drawer_R from '../drawer/Drawer_R';
import BottomNavigation_R from '../bottomnav/BottomNavigation_R';
import Forget_R from '../screens/rider/auth/Forget_R';
import ForgetOtp_R from '../screens/rider/auth/ForgetOtp_R';
import UpgradePassword_R from '../screens/rider/auth/UpgradePassword_R';
import EditProfile_R from '../screens/rider/main/EditProfile_R';
import Conversation_R from '../screens/rider/main/Conversation_R';
import AvailableDraviers from '../screens/driver/main/AvailableDraviers';
import EmergencyContacts_R from '../screens/rider/main/EmergencyContacts_R';
import BookingDetails_R from '../screens/rider/main/BookingDetails_R';
import OfferPrice_R from '../screens/rider/main/OfferPrice_R';
import Requests_R from '../screens/rider/main/Requests_R';
import DriverDetails_R from '../screens/rider/main/DriverDetails_R';
import Payment_R from '../screens/rider/main/Payment_R';
import PaymentComplete_R from '../screens/rider/main/PaymentComplete_R';
import Splash from '../screens/driver/auth/Splash';
import Terms from '../screens/driver/auth/Terms';
import PrivacyPolicy from '../screens/driver/auth/PrivacyPolicy';
import Onboarding1_R from '../screens/rider/auth/Onboarding1_R';
import Onboarding2_R from '../screens/rider/auth/Onboarding2_R';
import Onboarding3_R from '../screens/rider/auth/Onboarding3_R';
import GetStarted_R from '../screens/rider/auth/GetStarted_R';
import EmergencyaddContacts from '../screens/driver/main/EmergencyaddContacts';
import VehicleInfo_R from '../screens/rider/main/VehicleInfo_R';
import EditVehicelInfo_R from '../screens/rider/main/EditVehicelInfo_R';
import { useDispatch, useSelector } from 'react-redux';
import ShowGooglemap from '../screens/driver/main/ShowGooglemap';
import TrackMap from '../screens/rider/main/TrackMap';
import TrackMap_D from '../screens/driver/main/TrackMap_D';
import MapScreen from '../screens/driver/main/MapScreen';
import UtilityOption_R from '../screens/rider/main/UtilityOption_R';
import { setUserType, switchUserType } from '../redux/Auth';
import Toast from 'react-native-toast-message';
import { PostAPiwithToken } from '../components/ApiRoot';
import SearchDrivers from '../screens/driver/main/SearchDrivers';
import TripDetail from '../screens/driver/main/TripDetail';
import TripCode from '../screens/driver/main/TripCode';
import CreateTrip_R from '../screens/rider/main/CreateTrip_R';
import TripCode_R from '../screens/rider/main/TripCode_R';
import ReservationApply from '../screens/driver/main/ReservationApply';
import ReservationDetails from '../screens/rider/main/ReservationDetails';
import ResAvailableDrivers from '../screens/driver/main/ResAvailableDrivers';
import OfferDriverDetail from '../screens/driver/main/OfferDriverDetail';
import TrackReservationMap_R from '../screens/rider/main/TrackReservationMap_R';
import ResPayment_R from '../screens/rider/main/ResPayment_R';
import ResPaymentComplete_R from '../screens/rider/main/ResPaymentComplete_R';
import ReservationAcpDetails from '../screens/driver/main/ReservationAcpDetails';
import ConnectAccount from '../screens/driver/auth/ConnectAccount';
import ResMapTrack from '../screens/driver/main/ResMapTrack';
import TripDetails from '../screens/rider/main/TripDetails';
import Trips1_R from '../screens/rider/main/drawerscreens/Trips1_R';
import TripTrackMap_R from '../screens/rider/main/TripTrackMap_R';
import BookingReachedMap from '../screens/driver/main/BookingReachedMap';
import TrackTripMap from '../screens/driver/main/TrackTripMap';
import ConnectAccount_R from '../screens/rider/auth/ConnectAccount_R';
import Subscription from '../screens/driver/main/Subscription';
import RefferalCode from '../screens/driver/main/RefferalCode';
import Subscription_R from '../screens/rider/main/Subscription_R';
import RefferalCode_R from '../screens/rider/main/RefferalCode_R';
import Onboarding4_R from '../screens/rider/auth/Onboarding4_R';
import Onboarding4 from '../screens/driver/auth/Onboarding4';
import TripFeedBack from '../screens/driver/main/TripFeedBack';
import ResFeedBack from '../screens/driver/main/ResFeedBack';
import PaymentCompleteRide from '../screens/driver/main/PaymentCompleteRide';
import SharedReservation from '../screens/driver/main/SharedReservation';
import SharedResRequest from '../screens/driver/main/SharedResRequest';
import SharedReservations_R from '../screens/rider/main/SharedReservations_R';
import SharedResDetails_R from '../screens/rider/main/SharedResDetails_R';


const Stack = createNativeStackNavigator();
const StackNavigation = () => {
    const user = useSelector(state => state.user.user);
    const onboarding = useSelector(state => state.onboarding.onBoardingStatus);
    const onboardingR = useSelector(state => state.onboarding.onBoardingStatusR);
    const usertype = useSelector(state => state.user.usertype);
    const [myType,setMyType]=useState(null)
    const dispatch = useDispatch();
  
    const handleSwitchUserType = () => {
      const newUserType = usertype === 'Driver' ? 'Rider' : 'Driver';
      dispatch(setUserType(newUserType));
      setMyType(newUserType)
      EditProfileApi()
    };
    const EditProfileApi = (
    ) => {
      const token = user.api_token;
      const formdata = new FormData();
      formdata.append('type', myType);
      PostAPiwithToken({ url: 'edit', Token: token }, formdata)
        .then(res => {
          console.log('response data-------', res);
          if (res.status == 'success') {
            // dispatch(setUserType('Driver'))
            Toast.show({
              type: 'success',
              text1: 'Success',
              text2: res.message,
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
  
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {usertype === null ? (
            <>
              <Stack.Screen name="Selection" component={Selection} />
            </>
          ) : (
            <>
              {usertype === 'Rider' ? (
                <>
                  {!onboarding ? (
                    <>
                      <Stack.Screen name='Onboarding1' component={Onboarding1} />
                      <Stack.Screen name='Onboarding2' component={Onboarding2} />
                      <Stack.Screen name='Onboarding3' component={Onboarding3} />
                      <Stack.Screen name='Onboarding4' component={Onboarding4} />

                      <Stack.Screen name='GetStarted' component={GetStarted} />
                    </>
                  ) : (
                    <>
                      {user === null ? (
                        <>
                          <Stack.Screen name='Welcome' component={Welcome} />
                          <Stack.Screen name='Login_D' component={Login_D} />
                          <Stack.Screen name='SignUp_D' component={SignUp_D} />
                          <Stack.Screen name='Forget_D' component={Forget_D} />
                          <Stack.Screen name='ForgetOtp_D' component={ForgetOtp_D} />
                          <Stack.Screen name='UpgradePassword_D' component={UpgradePassword_D} />
                          <Stack.Screen name='AddCredit' component={AddCredit} />
                          <Stack.Screen name='AccountVerification_D' component={AccountVerification_D} />
                          <Stack.Screen name='AccountVerifyOtp_D' component={AccountVerifyOtp_D} />
                          <Stack.Screen name='Terms' component={Terms} />
                          <Stack.Screen name='PrivacyPolicy' component={PrivacyPolicy} />
                          <Stack.Screen name='ConnectAccount' component={ConnectAccount} />

                        </>
                      ) : (
                        <>
                          <Stack.Screen name='Drawer' component={Drawer} />
                          <Stack.Screen name='EditProfile' component={EditProfile} />
                          <Stack.Screen name='ChangePassword' component={ChangePassword} />
                          <Stack.Screen name='SearchDrivers' component={SearchDrivers} />
                          <Stack.Screen name='Subscription' component={Subscription} />
                          
                          <Stack.Screen name='UtilityOption' component={UtilityOption} />
                          <Stack.Screen name='SelectMainVehicle' component={SelectMainVehicle} />
                          <Stack.Screen name='VehicleStyle' component={VehicleStyle} />
                          <Stack.Screen name='AvailableDraviers' component={AvailableDraviers} />
                          <Stack.Screen name='RiderDetails' component={RiderDetails} />
                          <Stack.Screen name='BookingDetails' component={BookingDetails} />
                          <Stack.Screen name='EmergencyContacts' component={EmergencyContacts} />
                          <Stack.Screen name='Requesting' component={Requesting} />
                          <Stack.Screen name='SelectContactsForRide' component={SelectContactsForRide} />
                          <Stack.Screen name='Conversation' component={Conversation} />
                          <Stack.Screen name='TripDetail' component={TripDetail} />
                          <Stack.Screen name='TripCode' component={TripCode} />
                          <Stack.Screen name='ReservationApply' component={ReservationApply} />
                          <Stack.Screen name='ResAvailableDrivers' component={ResAvailableDrivers} />
                          <Stack.Screen name='OfferDriverDetail' component={OfferDriverDetail} />
                          <Stack.Screen name='ReservationAcpDetails' component={ReservationAcpDetails} />
                          <Stack.Screen name='ResMapTrack' component={ResMapTrack} />
                          <Stack.Screen name='BookingReachedMap' component={BookingReachedMap} />
                          <Stack.Screen name='TrackTripMap' component={TrackTripMap} />
                          <Stack.Screen name='RefferalCode' component={RefferalCode} />
                          <Stack.Screen name='TripFeedBack' component={TripFeedBack} />
                          <Stack.Screen name='ResFeedBack' component={ResFeedBack} />
                          <Stack.Screen name='PaymentCompleteRide' component={PaymentCompleteRide} />
                          <Stack.Screen name='SharedReservation' component={SharedReservation} />
                          <Stack.Screen name='SharedResRequest' component={SharedResRequest} />

                          <Stack.Screen name='ReachedMap' component={ReachedMap} />
                          <Stack.Screen name='TrackMap_D' component={TrackMap_D} />
                          <Stack.Screen name='PayNow' component={PayNow} />
                          <Stack.Screen name='AddCredit2' component={AddCredit2} />
                          <Stack.Screen name='Feedback' component={Feedback} />
                          <Stack.Screen name='EmergencyaddContacts' component={EmergencyaddContacts} />
                          <Stack.Screen name='ShowGooglemap' component={ShowGooglemap} />
                        </>
                      )}
                    </>
                  )}
                </>
              ) : usertype === 'Driver' ? (
                <>
                  {!onboardingR ? (
                    <>
                      <Stack.Screen name='Onboarding1_R' component={Onboarding1_R} />
                      <Stack.Screen name='Onboarding2_R' component={Onboarding2_R} />
                      <Stack.Screen name='Onboarding3_R' component={Onboarding3_R} />
                      <Stack.Screen name='Onboarding4_R' component={Onboarding4_R} />

                      <Stack.Screen name='GetStarted_R' component={GetStarted_R} />
                    </>
                  ) : (
                    <>
                      {user === null ? (
                        <>
                          <Stack.Screen name='Welcome_R' component={Welcome_R} />
                          <Stack.Screen name='Login_R' component={Login_R} />
                          <Stack.Screen name='SignUp_R' component={SignUp_R} />
                          <Stack.Screen name='VehicleRegistration' component={VehicleRegistration} />
                          <Stack.Screen name='AccountVerification_R' component={AccountVerification_R} />
                          <Stack.Screen name='AccountVerifyOtp_R' component={AccountVerifyOtp_R} />
                          <Stack.Screen name='AddCredit_R' component={AddCredit_R} />
                          <Stack.Screen name='Forget_R' component={Forget_R} />
                          <Stack.Screen name='ForgetOtp_R' component={ForgetOtp_R} />
                          <Stack.Screen name='UpgradePassword_R' component={UpgradePassword_R} />
                          <Stack.Screen name='Terms' component={Terms} />
                          <Stack.Screen name='PrivacyPolicy' component={PrivacyPolicy} />
                        </>
                      ) : (
                        <>
                          <Stack.Screen name='Drawer_R' component={Drawer_R} />
                          <Stack.Screen name='BottomNavigation_R' component={BottomNavigation_R} />
                          <Stack.Screen name='EditProfile_R' component={EditProfile_R} />
                          <Stack.Screen name='ConnectAccount_R' component={ConnectAccount_R} />

                          
                          <Stack.Screen name='Conversation_R' component={Conversation_R} />
                          <Stack.Screen name='EmergencyContacts_R' component={EmergencyContacts_R} />
                          <Stack.Screen name='BookingDetails_R' component={BookingDetails_R} />
                          <Stack.Screen name='OfferPrice_R' component={OfferPrice_R} />
                          <Stack.Screen name='Requests_R' component={Requests_R} />
                          <Stack.Screen name='DriverDetails_R' component={DriverDetails_R} />
                          <Stack.Screen name='CreateTrip_R' component={CreateTrip_R} />
                          <Stack.Screen name='TrackMap' component={TrackMap} />
                          <Stack.Screen name='TripCode_R' component={TripCode_R} />
                          <Stack.Screen name='TripDetails' component={TripDetails} />
                          <Stack.Screen name='Subscription_R' component={Subscription_R} />
                          <Stack.Screen name='RefferalCode_R' component={RefferalCode_R} />
                          <Stack.Screen name='SharedResDetails_R' component={SharedResDetails_R} />

                          <Stack.Screen name='ReservationDetails' component={ReservationDetails} />
                          <Stack.Screen name='TrackReservationMap_R' component={TrackReservationMap_R} />
                          <Stack.Screen name='ResPayment_R' component={ResPayment_R} />
                          <Stack.Screen name='ResPaymentComplete_R' component={ResPaymentComplete_R} />
                          <Stack.Screen name='Trips1_R' component={Trips1_R} />
                          <Stack.Screen name='TripTrackMap_R' component={TripTrackMap_R} />
                          <Stack.Screen name='SharedReservations_R' component={SharedReservations_R} />

                          <Stack.Screen name='MapScreen' component={MapScreen} />
                          <Stack.Screen name='UtilityOption_R' component={UtilityOption_R} />
                          <Stack.Screen name='Payment_R' component={Payment_R} />
                          <Stack.Screen name='PaymentComplete_R' component={PaymentComplete_R} />
                          <Stack.Screen name='VehicleInfo_R' component={VehicleInfo_R} />
                          <Stack.Screen name='EditVehicelInfo_R' component={EditVehicelInfo_R} />
                        </>
                      )}
                    </>
                  )}
                </>
              ) : null}
            </>
          )}
        </Stack.Navigator>
        {/* <Button title="Switch to Rider" onPress={handleSwitchUserType} /> */}
      </NavigationContainer>
    );
  };
export default StackNavigation

const styles = StyleSheet.create({})