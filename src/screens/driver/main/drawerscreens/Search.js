import { 
  FlatList, Image, ImageBackground, Modal, Platform, 
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, 
  View, Keyboard, TouchableWithoutFeedback 
} from 'react-native';
import React, { useState, useRef } from 'react';
import { images, fonts, Colors, styles } from '../../../../constant/Index';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MainButton from '../../../../components/MainButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const Search = ({ navigation }) => {
  const googlePlacesRef = useRef(null);
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.mainContainer, { paddingTop: Platform.OS === 'ios' ? top : 0 }]}>
      {/* Header */}
      <View style={styles.HeaderView}>
        <Text style={styles.headerText}>Search</Text>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{ position: 'absolute', left: wp(4) }}
          activeOpacity={0.7} >
          <Image source={images.menuIcon} resizeMode='contain' style={{ width: wp(6), height: wp(6) }} />
        </TouchableOpacity>
      </View>

      {/* TouchableWithoutFeedback to Dismiss Keyboard */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={[styles.inputView, { marginTop: wp(4) }]}>
            <View style={{ flex: 1 }}>
              <GooglePlacesAutocomplete
                placeholder="Search for a place"
                ref={googlePlacesRef}
                fetchDetails={true}
                onPress={(data, details = null) => {
                  console.log('Selected Data:', data);
                  if (details) {
                    console.log('Place Name:', details.name);
                    console.log('Address:', details.formatted_address);
                    console.log('Latitude:', details.geometry.location.lat);
                    console.log('Longitude:', details.geometry.location.lng);

                    // Set the selected place in the search input field
                    googlePlacesRef.current?.setAddressText(details.formatted_address);
                  } else {
                    console.log('No details found for this place.');
                  }
                }}
                query={{
                  key: 'AIzaSyDeLHyqt8QAOnRIWUyHY4e26DH2qCyXHak', // Replace with your actual API key
                  language: 'en',
                }}
                enablePoweredByContainer={false} // Hides Google branding to avoid blocking taps
                styles={{
                  textInput: {
                    color: 'black', 
                    fontSize: 16,
                    paddingLeft: 10,
                  },
                  description: {
                    color: 'black',
                  },
                  row: {
                    backgroundColor: 'white',
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                  },
                  listView: {
                    backgroundColor: 'white',
                    marginTop: 5,
                  },
                }}
              />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Search;
