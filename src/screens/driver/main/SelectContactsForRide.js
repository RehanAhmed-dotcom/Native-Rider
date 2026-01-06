import { FlatList, Image, ImageBackground, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useRef } from 'react'
import { images, fonts, Colors, styles } from '../../../constant/Index'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import MainButton from '../../../components/MainButton'
import Header from '../../../components/Header'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'

const SelectContactsForRide = ({navigation}) => {
    const [selectedContacts, setSelectedContacts] = useState([]);

    const contacts = [
        { id: '1', name: 'Ron Weasley', phone: '0308 - XXXXXXX' },
        { id: '2', name: 'Hermione Granger', phone: '0308 - XXXXXXX' },
        { id: '3', name: 'Ginny Weasley', phone: '0308 - XXXXXXX' },
        { id: '4', name: 'Draco Malfoy', phone: '0308 - XXXXXXX'},
        { id: '5', name: 'Severus Snape', phone: '0308 - XXXXXXX' },
        { id: '6', name: 'Helena Ravenclaw', phone: '0308 - XXXXXXX' },
        { id: '7', name: 'Garrick Ollivander', phone: '0308 - XXXXXXX'},
    ];

    const toggleContact = (id) => {
        if (selectedContacts.includes(id)) {
            setSelectedContacts(selectedContacts.filter((contactId) => contactId !== id));
        } else if (selectedContacts.length < 3) {
            setSelectedContacts([...selectedContacts, id]);
        }
    };
    const { top, bottom } = useSafeAreaInsets();
    const renderItem = ({ item }) => {
        const isSelected = selectedContacts.includes(item.id);
        return (
            <TouchableOpacity
                style={[styles.contactItem, isSelected && styles.selectedContact]}
                onPress={() => toggleContact(item.id)}
            >
                <View>
                    <Text style={styles.contactName}>{item.name}</Text>
                    <Text style={styles.contactPhone}>{item.phone}</Text>
                </View>
                {isSelected ?
                    <View
                        style={{

                            width: wp(7),
                            height: wp(7),
                            borderRadius: wp(4),
                            backgroundColor: Colors.buttoncolor,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>

                        <FontAwesome6
                            name="check"
                            color={Colors.background}
                            size={18}
                        />
                    </View> :
                    <View
                        style={{
                            width: wp(7),
                            height: wp(7),
                            borderRadius: wp(4),
                            // backgroundColor: Colors.buttoncolor,
                            borderWidth: 1, borderColor: 'black',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>

                        <FontAwesome6
                            name="check"
                            color={Colors.black}
                            size={18}
                        />
                    </View>
                }

            </TouchableOpacity>
        );
    };
    return (
        <View style={[styles.mainContainer,
        { paddingTop: Platform.OS == 'ios' ? top : 0 }]}>
            <Header head="Who will take this ride?" onPress={() => navigation.goBack()} />
            <ScrollView>
                <View style={{ marginTop: wp(2) }}>
                    <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: Colors.black, textAlign: 'center' }}>Select Your Contact</Text>
                </View>
                <View style={{ marginTop: wp(10) }}>
                    <FlatList
                        data={contacts}
            inverted

                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                    />

                </View>
                <View style={{ marginTop: wp(10), marginBottom: wp(5) }}>
                    <MainButton
                        title="Continue"
                        onPress={() => navigation.navigate('Requesting',{typenew:'friend'})}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

export default SelectContactsForRide
