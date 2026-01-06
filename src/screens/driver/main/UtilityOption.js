import { FlatList, Image, ImageBackground, Switch, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useRef } from 'react'
import { images, fonts, Colors, styles } from '../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import MainButton from '../../../components/MainButton'
import Header from '../../../components/Header'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'
const UtilityOption = ({ navigation, route }) => {
    const { formData } = route.params;
    console.log('myhome res', formData);
  
    const [toggleStates, setToggleStates] = useState({
      pets: 0,
      smoke: 0,
      otherItems: 0,
    });
    console.log('toggle statess',toggleStates)
  
    const handleToggle = (key) => {
      setToggleStates((prev) => ({
        ...prev,
        [key]: prev[key] === 0 ? 1 : 0, // Toggle between 0 and 1
      }));
    };
  
    const { top, bottom } = useSafeAreaInsets();
    return (
      <ImageBackground
        source={images.mapBackground}
        resizeMode="cover"
        style={[
          styles.mainContainer,
          { paddingTop: Platform.OS === 'ios' ? top : 0 },
        ]}
      >
        <View
          style={[
            styles.bottomHeaderView,
            { backgroundColor: 'rgba(255,255,255,.6)' },
          ]}
        >
          <Text style={styles.headerText}>Utility Options</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ position: 'absolute', left: wp(4) }}
            activeOpacity={0.7}
          >
            <AntDesign name="left" size={20} color="#2D3D54" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.utitityMainView}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.bold,
                  color: Colors.black,
                }}
              >
                Utilities Options
              </Text>
            </View>
            <View style={styles.utilitysectionView}>
              <View style={{ width: wp(62) }}>
                <Text style={styles.utilityText}>
                  Do you have any pets that you want to bring in with your ride?
                </Text>
              </View>
              <Switch
                value={toggleStates.pets === 1}
                onValueChange={() => handleToggle('pets')}
                trackColor={{ false: Colors.lightgrey, true: Colors.buttoncolor }}
                thumbColor={toggleStates.pets === 1 ? Colors.buttoncolor : Colors.gray}
              />
            </View>
            <View style={styles.utilitysectionView}>
              <View style={{ width: wp(62) }}>
                <Text style={styles.utilityText}>Do you smoke?</Text>
              </View>
              <Switch
                value={toggleStates.smoke === 1}
                onValueChange={() => handleToggle('smoke')}
                trackColor={{ false: Colors.lightgrey, true: Colors.buttoncolor }}
                thumbColor={toggleStates.smoke === 1 ? Colors.buttoncolor : Colors.gray}
              />
            </View>
            <View style={styles.utilitysectionView}>
              <View style={{ width: wp(62) }}>
                <Text style={styles.utilityText}>
                  Do you have any other items that you want to bring in with your
                  ride?
                </Text>
              </View>
              <Switch
                value={toggleStates.otherItems === 1}
                onValueChange={() => handleToggle('otherItems')}
                trackColor={{ false: Colors.lightgrey, true: Colors.buttoncolor }}
                thumbColor={toggleStates.otherItems === 1 ? Colors.buttoncolor : Colors.gray}
              />
            </View>
            <View style={{ marginVertical: wp(5) }}>
              <MainButton
                title="Continue"
                onPress={() => navigation.navigate('SelectMainVehicle',{formData,toggleStates})}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  };
  
  export default UtilityOption;
  