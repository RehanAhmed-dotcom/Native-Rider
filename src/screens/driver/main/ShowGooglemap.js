import { StyleSheet, View } from 'react-native';
import React from 'react';
import MapView from 'react-native-maps';

const ShowGooglemap = () => {
  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: 33.6844, // Example: Rawalpindi coordinates
          longitude: 73.0479,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    </View>
  );
};

export default ShowGooglemap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
